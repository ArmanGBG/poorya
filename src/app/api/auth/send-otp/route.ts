import { NextRequest, NextResponse } from "next/server";
import { normalizePhoneNumber, isValidIranianMobile } from "@/lib/persian";
import { otpRequestLimiter } from "@/lib/rate-limit";
import { generateAndStoreOtp } from "@/lib/auth";

/**
 * Step 1 of Frictionless Registration: Send 5-digit OTP
 * Strictly NO National ID required.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawPhone = body.phone || "";
    const phone = normalizePhoneNumber(rawPhone);

    if (!isValidIranianMobile(phone)) {
      return NextResponse.json(
        { error: "شماره تلفن همراه وارد شده نامعتبر است. لطفاً شماره‌ای مانند ۰۹۱۲۳۴۵۶۷۸۹ وارد کنید." },
        { status: 400 }
      );
    }

    // Rate limiting to prevent SMS flooding
    const clientIp = req.ip || req.headers.get("x-forwarded-for") || phone;
    const rateCheck = otpRequestLimiter.consume(clientIp);
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: `درخواست کد تایید بیش از حد مجاز است. لطفاً ${rateCheck.retryAfterSeconds} ثانیه دیگر مجدداً تلاش کنید.`,
        },
        { status: 429 }
      );
    }

    const { code } = generateAndStoreOtp(phone);

    return NextResponse.json({
      success: true,
      message: "کد تایید ۵ رقمی برای شماره شما ارسال شد.",
      // In development mode, return demo code directly for effortless pairing
      demoCode: process.env.NODE_ENV !== "production" ? code : undefined,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "خطا در پردازش درخواست ورود. لطفاً دوباره امتحان کنید." },
      { status: 500 }
    );
  }
}
