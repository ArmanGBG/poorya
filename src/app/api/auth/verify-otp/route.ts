import { NextRequest, NextResponse } from "next/server";
import { normalizePhoneNumber, toEnglishDigits, normalizePersian } from "@/lib/persian";
import { otpVerifyLimiter } from "@/lib/rate-limit";
import { verifyStoredOtp, signSession, COOKIE_NAME } from "@/lib/auth";
import { prisma, SAFE_USER_SELECT } from "@/lib/prisma";
import { UserRole, MemberTier } from "@prisma/client";

/**
 * Step 2 of Frictionless Registration: Verify OTP & Issue Session
 * Strictly NO National ID needed.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawPhone = body.phone || "";
    const rawCode = body.code || "";
    const rawFullName = body.fullName || "";

    const phone = normalizePhoneNumber(rawPhone);
    const code = toEnglishDigits(rawCode).trim();
    const fullName = normalizePersian(rawFullName).trim() || "عضو باشگاه شهروندی";

    // Rate limiting
    const clientIp = req.ip || req.headers.get("x-forwarded-for") || phone;
    const rateCheck = otpVerifyLimiter.consume(clientIp);
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: `تلاش‌های ناموفق بیش از حد مجاز است. لطفاً ${rateCheck.retryAfterSeconds} ثانیه دیگر مجدداً تلاش کنید.`,
        },
        { status: 429 }
      );
    }

    // Verify OTP code
    const isValid = verifyStoredOtp(phone, code);
    if (!isValid) {
      return NextResponse.json(
        { error: "کد تایید وارد شده اشتباه است یا منقضی شده است." },
        { status: 400 }
      );
    }

    // Upsert user
    let user = await prisma.user.findUnique({
      where: { phone },
      select: SAFE_USER_SELECT,
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          phone,
          fullName,
          role: UserRole.MEMBER_PUBLIC,
          tier: MemberTier.STANDARD,
          isPhoneVerified: true,
        },
        select: SAFE_USER_SELECT,
      });
    } else if (!user.isPhoneVerified) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { isPhoneVerified: true },
        select: SAFE_USER_SELECT,
      });
    }

    // Generate JWT Session
    const token = await signSession({
      userId: user.id,
      phone: user.phone,
      fullName: user.fullName,
      role: user.role,
      tier: user.tier,
    });

    // Determine appropriate redirect based on role
    let redirectTo = "/dashboard/card";
    if (user.role === UserRole.REPRESENTATIVE_VIP) {
      redirectTo = "/rep-radar";
    } else if (user.role === UserRole.ADMIN_VERIFIER) {
      redirectTo = "/admin/verify";
    } else if (user.role === UserRole.CONNECTOR) {
      redirectTo = "/connector";
    } else if (user.role === UserRole.ADMIN_CLUB) {
      redirectTo = "/admin/club";
    }

    const response = NextResponse.json({
      success: true,
      message: "ورود موفقیت‌آمیز بود.",
      user,
      redirectTo,
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("[Verify OTP Error]", err);
    return NextResponse.json(
      { error: "خطا در تایید کد یکبارمصرف. لطفاً مجدداً امتحان کنید." },
      { status: 500 }
    );
  }
}
