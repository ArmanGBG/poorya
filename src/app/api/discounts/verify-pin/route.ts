import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toEnglishDigits } from "@/lib/persian";
import { couponVerifyLimiter } from "@/lib/rate-limit";
import { logAuditEvent } from "@/lib/audit";
import { formatJalaliDateTime } from "@/lib/utils";

/**
 * Merchant Coupon Validation with 4-Digit Merchant PIN (Architectural Fix #6)
 * Validates offline member discounts while safeguarding sensitive user CRM notes.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawCode = body.verificationCode || "";
    const rawPin = body.merchantPin || "";
    const businessId = body.businessId ? String(body.businessId).trim() : null;

    const verificationCode = toEnglishDigits(rawCode).trim().replace(/^CIVIC-COUPON:/, "");
    const merchantPin = toEnglishDigits(rawPin).trim();

    if (!verificationCode || !merchantPin) {
      return NextResponse.json(
        { error: "ارسال کد ۶ رقمی کوپن و پین ۴ رقمی فروشگاه الزامی است." },
        { status: 400 }
      );
    }

    // Rate limiting to prevent brute forcing merchant PINs or coupon codes
    const clientIp = req.ip || req.headers.get("x-forwarded-for") || "merchant";
    const rateCheck = couponVerifyLimiter.consume(clientIp);
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: `تعداد تلاش‌های ناموفق بیش از حد مجاز است. لطفاً ${rateCheck.retryAfterSeconds} ثانیه دیگر مجدداً تلاش کنید.`,
        },
        { status: 429 }
      );
    }

    // Lookup redemption
    const redemption = await prisma.discountRedemption.findUnique({
      where: { verificationCode },
      include: {
        offer: {
          include: {
            business: true,
          },
        },
        user: {
          select: {
            fullName: true,
            tier: true,
            // Strictly excludes CRM notes, influenceLevel, organizational profiles!
          },
        },
      },
    });

    if (!redemption) {
      await logAuditEvent({
        action: "COUPON_VERIFY_ATTEMPT",
        query: `INVALID_CODE:${verificationCode}`,
        ipAddress: req.ip || req.headers.get("x-forwarded-for") || "local",
      });

      return NextResponse.json(
        { error: "کوپن تخفیف با این کد در سامانه یافت نشد." },
        { status: 404 }
      );
    }

    // Strict Cross-Merchant Isolation: if businessId is provided, enforce it matches the offer's business
    if (businessId && redemption.offer.businessId !== businessId) {
      await logAuditEvent({
        action: "COUPON_VERIFY_ATTEMPT",
        query: `CROSS_MERCHANT_MISMATCH: coupon for ${redemption.offer.businessId} presented to ${businessId}`,
        ipAddress: req.ip || req.headers.get("x-forwarded-for") || "local",
      });

      return NextResponse.json(
        { error: `این کوپن تخفیف منحصراً متعلق به «${redemption.offer.business.name}» است و در این فروشگاه قابل استفاده نمی‌باشد.` },
        { status: 400 }
      );
    }

    // Check if partner business is active
    if (!redemption.offer.business.isActive) {
      return NextResponse.json(
        { error: "این کسب‌وکار همکار در حال حاضر غیرفعال است و امکان ابطال کوپن وجود ندارد." },
        { status: 400 }
      );
    }

    // Check if offer itself has expired
    if (redemption.offer.expiresAt && redemption.offer.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "مهلت استفاده از این پیشنهاد تخفیف منقضی شده است." },
        { status: 400 }
      );
    }

    // Verify Merchant PIN
    if (redemption.offer.business.merchantPin !== merchantPin) {
      await logAuditEvent({
        action: "COUPON_VERIFY_ATTEMPT",
        query: `INCORRECT_PIN:${merchantPin} for Business ${redemption.offer.business.name}`,
        ipAddress: req.ip || req.headers.get("x-forwarded-for") || "local",
      });

      return NextResponse.json(
        { error: "پین ۴ رقمی فروشگاه نادرست است. این کوپن متعلق به این کسب‌وکار نیست یا پین اشتباه وارد شده است." },
        { status: 401 }
      );
    }

    // Check if already used
    if (redemption.isVerifiedByMerchant) {
      return NextResponse.json(
        {
          error: `این کد تخفیف قبلاً در تاریخ ${formatJalaliDateTime(redemption.verifiedAt)} مصرف شده است و امکان استفاده مجدد ندارد.`,
          isAlreadyUsed: true,
          verifiedAt: redemption.verifiedAt,
        },
        { status: 400 }
      );
    }

    // Atomic conditional update to prevent race condition / double spending
    const updateResult = await prisma.discountRedemption.updateMany({
      where: {
        id: redemption.id,
        isVerifiedByMerchant: false,
      },
      data: {
        isVerifiedByMerchant: true,
        verifiedAt: new Date(),
      },
    });

    if (updateResult.count === 0) {
      return NextResponse.json(
        {
          error: "این کد تخفیف هم‌اکنون در تراکنش دیگری مصرف گردید و امکان استفاده مجدد ندارد.",
          isAlreadyUsed: true,
        },
        { status: 400 }
      );
    }

    const verificationTimestamp = new Date();

    await logAuditEvent({
      action: "COUPON_REDEEM",
      query: `CONFIRMED:${verificationCode} for ${redemption.offer.business.name} (${redemption.offer.discountPercent}%)`,
      ipAddress: req.ip || req.headers.get("x-forwarded-for") || "local",
    });

    return NextResponse.json({
      success: true,
      message: `تخفیف ${redemption.offer.discountPercent}٪ برای مشتری عزیز «${redemption.user.fullName}» تایید و اعمال گردید.`,
      details: {
        customerName: redemption.user.fullName,
        customerTier: redemption.user.tier === "VIP" ? "طلایی (VIP)" : "نقره‌ای (عادی)",
        offerTitle: redemption.offer.title,
        discountPercent: redemption.offer.discountPercent,
        businessName: redemption.offer.business.name,
        verifiedAt: formatJalaliDateTime(verificationTimestamp),
      },
    });
  } catch (err: any) {
    console.error("[Merchant Coupon Verify Error]", err);
    return NextResponse.json(
      { error: "خطا در اعتبارسنجی کوپن تخفیف." },
      { status: 500 }
    );
  }
}
