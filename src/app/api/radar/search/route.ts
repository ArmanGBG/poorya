import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest, isAuthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { normalizePersian, getPersianSearchTerms } from "@/lib/persian";
import { radarSearchLimiter } from "@/lib/rate-limit";
import { logAuditEvent } from "@/lib/audit";
import { calculateBurnout } from "@/lib/utils";
import { OrganizationCategory } from "@prisma/client";

/**
 * Representative's Smart Organizational Search Engine
 * Ultra-fast insider radar strictly protected for the Member of Parliament & Chief of Staff.
 */
export async function GET(req: NextRequest) {
  // 1. Session & Role Verification
  const session = await getSessionFromRequest(req);
  if (!session || !isAuthorized(session.role, ["REPRESENTATIVE_VIP"])) {
    return NextResponse.json(
      { error: "دسترسی غیرمجاز. این پنل منحصراً در اختیار نماینده و رئیس دفتر قرار دارد." },
      { status: 403 }
    );
  }

  // 2. Anti-Scraping Rate Limiting
  const clientIp = req.ip || req.headers.get("x-forwarded-for") || session.userId;
  const rateCheck = radarSearchLimiter.consume(clientIp);
  if (!rateCheck.success) {
    return NextResponse.json(
      {
        error: `تعداد درخواست‌های جستجو بیش از حد مجاز است. لطفاً ${rateCheck.retryAfterSeconds} ثانیه دیگر مجدداً تلاش نمایید.`,
      },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(req.url);
  const rawQuery = searchParams.get("q") || "";
  const category = searchParams.get("category") as OrganizationCategory | null;
  const searchTerms = getPersianSearchTerms(rawQuery);
  const primaryQuery = searchTerms[0] || "";

  // 3. Audit Log Search Query
  await logAuditEvent({
    userId: session.userId,
    action: "RADAR_SEARCH",
    query: primaryQuery || (category ? `CATEGORY:${category}` : "ALL_INSIDERS"),
    ipAddress: req.ip || req.headers.get("x-forwarded-for") || "local",
    userAgent: req.headers.get("user-agent"),
  });

  // 4. Build Search Filter
  // Case-insensitive matching across organizations, departments, job titles, and insider names
  const whereClause: any = {
    verificationStatus: "VERIFIED",
  };

  if (category && Object.values(OrganizationCategory).includes(category)) {
    whereClause.organization = {
      category,
    };
  }

  if (searchTerms.length > 0) {
    whereClause.OR = searchTerms.flatMap((term) => [
      {
        user: {
          fullName: {
            contains: term,
            mode: "insensitive",
          },
        },
      },
      {
        organization: {
          name: {
            contains: term,
            mode: "insensitive",
          },
        },
      },
      {
        customDepartment: {
          contains: term,
          mode: "insensitive",
        },
      },
      {
        jobTitle: {
          contains: term,
          mode: "insensitive",
        },
      },
      {
        user: {
          phone: {
            contains: term,
          },
        },
      },
    ]);
  }

  // 5. Query Insiders with Relations
  const profiles = await prisma.organizationalProfile.findMany({
    where: whereClause,
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          phone: true,
          neighborhood: true,
          tier: true,
          role: true,
        },
      },
      organization: {
        select: {
          id: true,
          name: true,
          category: true,
          city: true,
        },
      },
      interactions: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          loggedByUser: {
            select: {
              fullName: true,
            },
          },
        },
      },
      vouchedByUser: {
        select: {
          fullName: true,
          phone: true,
        },
      },
    },
    orderBy: [
      { isPrimary: "desc" },
      { influenceLevel: "asc" }, // DECISION_MAKER first
      { favorBalance: "desc" },
    ],
  });

  // 6. User-Level Burnout Scoping (Fix Flaw #1):
  // Calculate burnout across the entire human being (all their profiles combined), not just a single role.
  const userIds = Array.from(new Set(profiles.map((p) => p.userId)));

  const allUserInteractions = await prisma.interactionLog.findMany({
    where: {
      orgProfile: {
        userId: { in: userIds },
      },
    },
    select: {
      createdAt: true,
      orgProfile: {
        select: { userId: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const userInteractionsMap = new Map<string, { createdAt: Date }[]>();
  for (const log of allUserInteractions) {
    const uid = log.orgProfile.userId;
    if (!userInteractionsMap.has(uid)) {
      userInteractionsMap.set(uid, []);
    }
    userInteractionsMap.get(uid)!.push({ createdAt: log.createdAt });
  }

  // 7. Augment results with Burnout Prevention & Reciprocity indicators
  const results = profiles.map((p) => {
    const userInteractions = userInteractionsMap.get(p.userId) || p.interactions;
    const burnout = calculateBurnout(userInteractions);

    return {
      id: p.id,
      userId: p.userId,
      fullName: p.user.fullName,
      phone: p.user.phone,
      neighborhood: p.user.neighborhood,
      organizationName: p.organization.name,
      organizationCategory: p.organization.category,
      customDepartment: p.customDepartment,
      jobTitle: p.jobTitle,
      isPrimary: p.isPrimary,
      officeDirectPhone: p.officeDirectPhone,
      hasDocument: Boolean(p.documentUrl),
      influenceLevel: p.influenceLevel,
      intimacyLevel: p.intimacyLevel,
      favorBalance: p.favorBalance,
      secretAdminNotes: p.secretAdminNotes,
      vouchedByName: p.vouchedByUser?.fullName || null,
      burnout,
      interactions: p.interactions,
    };
  });

  return NextResponse.json({
    total: results.length,
    results,
  });
}
