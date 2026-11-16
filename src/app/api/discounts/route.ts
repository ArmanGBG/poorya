import { NextRequest, NextResponse } from "next/server";
import { prisma, SAFE_OFFER_SELECT } from "@/lib/prisma";
import { MemberTier } from "@prisma/client";

/**
 * Public & Member Discount Offers Catalog
 * Strict safe projections: merchant PIN and secret fields are physically excluded.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tier = searchParams.get("tier") as MemberTier | null;

    const where: any = {
      business: {
        isActive: true,
      },
    };

    if (tier && Object.values(MemberTier).includes(tier)) {
      where.requiredTier = tier;
    }

    const offers = await prisma.discountOffer.findMany({
      where,
      select: SAFE_OFFER_SELECT,
      orderBy: [{ requiredTier: "desc" }, { discountPercent: "desc" }],
    });

    return NextResponse.json({ offers });
  } catch (err: any) {
    return NextResponse.json(
      { error: "خطا در دریافت لیست تخفیف‌ها" },
      { status: 500 }
    );
  }
}
