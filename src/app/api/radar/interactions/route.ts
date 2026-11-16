import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest, isAuthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "@/lib/audit";
import { InteractionType, InteractionOutcome } from "@prisma/client";

/**
 * Log MP Interactions & Reciprocity Tracking
 * Prevents insider burnout and maintains accurate relationship reciprocity logs.
 */
export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session || !isAuthorized(session.role, ["REPRESENTATIVE_VIP"])) {
    return NextResponse.json(
      { error: "دسترسی غیرمجاز. تنها نماینده یا رئیس دفتر امکان ثبت لاگ تماس را دارند." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { orgProfileId, subject, type, outcome, notes } = body;

    if (!orgProfileId || !subject || !type) {
      return NextResponse.json(
        { error: "ارسال شناسه پروفایل سازمانی، موضوع و نوع تماس الزامی است." },
        { status: 400 }
      );
    }

    // Check profile existence
    const profile = await prisma.organizationalProfile.findUnique({
      where: { id: orgProfileId },
      include: { user: true },
    });

    if (!profile) {
      return NextResponse.json({ error: "پروفایل سازمانی یافت نشد." }, { status: 404 });
    }

    // Determine favor balance adjustment: Only modify favor balance if interaction is successfully RESOLVED
    let favorDelta = 0;
    const finalOutcome = (outcome as InteractionOutcome) || InteractionOutcome.RESOLVED;

    if (finalOutcome === InteractionOutcome.RESOLVED) {
      if (type === InteractionType.REQUESTED_FAVOR_FROM_USER) {
        // User solved a citizen problem: Representative owes them, favor balance decreases
        favorDelta = -1;
      } else if (type === InteractionType.DID_FAVOR_FOR_USER) {
        // MP solved user's issue: User is indebted to Representative, favor balance increases
        favorDelta = +1;
      }
    }

    // Create interaction log and optionally update favor balance transactionally
    const [interactionLog, updatedProfile] = await prisma.$transaction([
      prisma.interactionLog.create({
        data: {
          orgProfileId,
          loggedByUserId: session.userId,
          subject: subject.trim(),
          type: type as InteractionType,
          outcome: (outcome as InteractionOutcome) || InteractionOutcome.RESOLVED,
          notes: notes ? notes.trim() : null,
        },
      }),
      prisma.organizationalProfile.update({
        where: { id: orgProfileId },
        data: {
          favorBalance: {
            increment: favorDelta,
          },
        },
      }),
    ]);

    // Audit the interaction logging
    await logAuditEvent({
      userId: session.userId,
      action: "INTERACTION_LOG_CREATE",
      targetProfileId: orgProfileId,
      query: `SUBJECT:${subject} | TYPE:${type} | OUTCOME:${outcome}`,
      ipAddress: req.ip || req.headers.get("x-forwarded-for") || "local",
      userAgent: req.headers.get("user-agent"),
    });

    return NextResponse.json({
      success: true,
      message: "تماس و پیگیری جدید با موفقیت ثبت شد.",
      log: interactionLog,
      newFavorBalance: updatedProfile.favorBalance,
    });
  } catch (err: any) {
    console.error("[InteractionLog Error]", err);
    return NextResponse.json(
      { error: "خطا در ثبت لاگ تعامل. لطفاً اطلاعات را بررسی کنید." },
      { status: 500 }
    );
  }
}
