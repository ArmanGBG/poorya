import { NextResponse } from "next/server";
import { prisma, SAFE_BUSINESS_SELECT } from "@/lib/prisma";

/**
 * Public active partner businesses list for terminal selection
 */
export async function GET() {
  try {
    const businesses = await prisma.partnerBusiness.findMany({
      where: { isActive: true },
      select: SAFE_BUSINESS_SELECT,
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ businesses });
  } catch (err: any) {
    return NextResponse.json(
      { error: "خطا در دریافت لیست کسب‌وکارهای همکار" },
      { status: 500 }
    );
  }
}
