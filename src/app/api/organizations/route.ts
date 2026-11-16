import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizePersian } from "@/lib/persian";

/**
 * Standardized Organization Tree API
 * Prevents plain-text chaotic typing by offering pre-curated official organizations.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const query = searchParams.get("q");

    const where: any = {};
    if (category) {
      where.category = category;
    }
    if (query) {
      where.name = {
        contains: normalizePersian(query).trim(),
        mode: "insensitive",
      };
    }

    const organizations = await prisma.organization.findMany({
      where,
      orderBy: [{ category: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        category: true,
        city: true,
        parentId: true,
      },
    });

    return NextResponse.json({ organizations });
  } catch (err: any) {
    return NextResponse.json(
      { error: "خطا در دریافت لیست سازمان‌ها" },
      { status: 500 }
    );
  }
}
