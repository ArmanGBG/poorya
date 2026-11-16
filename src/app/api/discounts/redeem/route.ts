import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MemberTier } from "@prisma/client";

/**
 * Redeem a discount offer and issue a unique 6-digit offline verification code
 */
export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json(
      { error: "جهت دریافت کد تخفیف، ابتدا وارد حساب کاربری خود شوید." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { offerId } = body;

    if (!offerId) {
      return NextResponse.json(
        { error: "شناسه تخفیف الزامی است." },
        { status: 400 }
      );
    }

    const offer = await prisma.discountOffer.findUnique({
      where: { id: offerId },
      include: { business: true },
    });

    if (!offer) {
      return NextResponse.json(
        { error: "تخفیف مورد نظر یافت نشد." },
        { status: 404 }
      );
    }

    // Check if partner business is active
    if (!offer.business || !offer.business.isActive) {
      return NextResponse.json(
        { error: "این کسب‌وکار در حال حاضر غیرفعال است و امکان صدور کوپن وجود ندارد." },
        { status: 400 }
      );
    }

    // Check if offer has expired
    if (offer.expiresAt && offer.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "مهلت استفاده از این پیشنهاد تخفیف به پایان رسیده است." },
        { status: 400 }
      );
    }

    // Check tier eligibility live from DB (so promotions take effect immediately without re-login)
    const userRecord = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { tier: true },
    });
    const currentTier = userRecord?.tier || session.tier;

    if (offer.requiredTier === MemberTier.VIP && currentTier !== MemberTier.VIP) {
      return NextResponse.json(
        {
          error: "این پیشنهاد منحصراً برای اعضای سطح طلایی (VIP) فعال است. با تکمیل اطلاعات شغلی خود، کارت عضویت خود را به VIP ارتقا دهید.",
          requiresVip: true,
        },
        { status: 403 }
      );
    }

    // Check if user already has an active (unverified) coupon for this offer to prevent coupon flooding
    const existingActive = await prisma.discountRedemption.findFirst({
      where: {
        userId: session.userId,
        offerId: offer.id,
        isVerifiedByMerchant: false,
      },
    });

    if (existingActive) {
      return NextResponse.json({
        success: true,
        message: "شما در حال حاضر یک کوپن فعال مصرف‌نشده برای این پیشنهاد دارید.",
        verificationCode: existingActive.verificationCode,
        offer: {
          title: offer.title,
          discountPercent: offer.discountPercent,
          businessName: offer.business.name,
          address: offer.business.address,
        },
        qrPayload: `CIVIC-COUPON:${existingActive.verificationCode}`,
      });
    }

    // Generate unique 6-digit code using cryptographically secure randomInt
    let verificationCode = "";
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 15) {
      attempts++;
      const randNum = require("crypto").randomInt(100000, 1000000);
      verificationCode = randNum.toString();
      const existing = await prisma.discountRedemption.findUnique({
        where: { verificationCode },
      });
      if (!existing) isUnique = true;
    }

    const redemption = await prisma.discountRedemption.create({
      data: {
        userId: session.userId,
        offerId: offer.id,
        verificationCode,
      },
      include: {
        offer: {
          include: {
            business: {
              select: {
                id: true,
                name: true,
                address: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "کوپن تخفیف با موفقیت صادر شد.",
      verificationCode,
      offer: {
        title: offer.title,
        discountPercent: offer.discountPercent,
        businessName: offer.business.name,
        address: offer.business.address,
      },
      qrPayload: `CIVIC-COUPON:${verificationCode}`,
    });
  } catch (err: any) {
    console.error("[Redeem Error]", err);
    return NextResponse.json(
      { error: "خطا در صدور کوپن تخفیف." },
      { status: 500 }
    );
  }
}
