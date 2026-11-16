import { NextRequest, NextResponse } from "next/server";
import { prisma, SAFE_USER_SELECT } from "@/lib/prisma";
import { signSession, COOKIE_NAME } from "@/lib/auth";
import { UserRole } from "@prisma/client";

/**
 * Dev Role Switcher Route (Architectural Fix #7)
 * Enabled strictly in development / testing environments.
 * Allows switching between Representative, Secretariat, Connector, Club Admin, and Members in one click.
 */
export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "سوئیچ مستقیم نقش صرفاً در محیط توسعه فعال است." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const targetRole = body.role as UserRole;

    if (!targetRole || !Object.values(UserRole).includes(targetRole)) {
      return NextResponse.json(
        { error: "نقش درخواستی نامعتبر است." },
        { status: 400 }
      );
    }

    // Find the primary seeded user representing this role
    let user = await prisma.user.findFirst({
      where: { role: targetRole },
      select: SAFE_USER_SELECT,
    });

    if (!user) {
      return NextResponse.json(
        { error: `کاربری با نقش ${targetRole} در پایگاه داده یافت نشد. لطفاً دستور بذرگذاری داده (seed) را اجرا فرمایید.` },
        { status: 404 }
      );
    }

    // Issue new session token
    const token = await signSession({
      userId: user.id,
      phone: user.phone,
      fullName: user.fullName,
      role: user.role,
      tier: user.tier,
    });

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
      message: `نقش با موفقیت به ${user.fullName} (${user.role}) تغییر یافت.`,
      user,
      redirectTo,
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("[Switch Role Error]", err);
    return NextResponse.json(
      { error: "خطا در تغییر نقش کاربری." },
      { status: 500 }
    );
  }
}
