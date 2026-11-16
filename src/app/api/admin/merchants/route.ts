import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest, isAuthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MemberTier } from "@prisma/client";

/**
 * Admin Merchants Management API
 * Permitted for ADMIN_CLUB, ADMIN_VERIFIER, and REPRESENTATIVE_VIP.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || !isAuthorized(session.role, ["ADMIN_CLUB", "ADMIN_VERIFIER", "REPRESENTATIVE_VIP"])) {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز. صرفاً مدیریت باشگاه مجاز به مدیریت مراکز همکار است." },
        { status: 403 }
      );
    }

    const businesses = await prisma.partnerBusiness.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        offers: {
          include: {
            _count: {
              select: { redemptions: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ businesses });
  } catch (err: any) {
    return NextResponse.json(
      { error: "خطا در دریافت لیست کسب‌وکارهای همکار" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || !isAuthorized(session.role, ["ADMIN_CLUB", "ADMIN_VERIFIER", "REPRESENTATIVE_VIP"])) {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز. فقط ادمین باشگاه می‌تواند فروشگاه ثبت کند." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      name,
      category,
      address,
      phone,
      merchantPin,
      offerTitle,
      discountPercent,
      requiredTier,
      terms,
    } = body;

    if (!name || !category || !phone || !address) {
      return NextResponse.json(
        { error: "نام مرکز، صنف، تلفن و نشانی الزامی هستند." },
        { status: 400 }
      );
    }

    // Generate random 4-digit PIN if not provided
    const pin = merchantPin && merchantPin.trim().length === 4
      ? merchantPin.trim()
      : Math.floor(1000 + Math.random() * 9000).toString();

    const percent = Number(discountPercent) || 20;
    const tier = requiredTier === "VIP" ? MemberTier.VIP : MemberTier.STANDARD;

    const business = await prisma.partnerBusiness.create({
      data: {
        name: name.trim(),
        category: category.trim(),
        address: address.trim(),
        phone: phone.trim(),
        merchantPin: pin,
        isActive: true,
        offers: {
          create: {
            title: offerTitle?.trim() || `${percent}٪ تخفیف ویژه اعضای باشگاه در ${name.trim()}`,
            discountPercent: percent,
            requiredTier: tier,
            terms: terms?.trim() || "ارائه کوپن فعال به صندوق‌دار هنگام پرداخت صورت‌حساب الزامی است.",
          },
        },
      },
      include: {
        offers: true,
      },
    });

    return NextResponse.json({
      message: "فروشگاه و پیشنهاد تخفیف با موفقیت ثبت شد",
      business,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "خطا در ثبت فروشگاه جدید" },
      { status: 500 }
    );
  }
}
