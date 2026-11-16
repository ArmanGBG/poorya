import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest, isAuthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "@/lib/audit";
import { VerificationStatus, UserRole, MemberTier, InfluenceLevel, IntimacyLevel } from "@prisma/client";

/**
 * Secretariat Admin Verification API
 * Restricted strictly to ADMIN_VERIFIER & REPRESENTATIVE_VIP.
 */
export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session || !isAuthorized(session.role, ["ADMIN_VERIFIER", "REPRESENTATIVE_VIP"])) {
    return NextResponse.json(
      { error: "دسترسی غیرمجاز. صرفاً دبیرخانه احراز هویت مجاز به مشاهده این صف است." },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(req.url);
  const status = (searchParams.get("status") as VerificationStatus) || VerificationStatus.PENDING;

  const profiles = await prisma.organizationalProfile.findMany({
    where: {
      verificationStatus: status,
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          phone: true,
          neighborhood: true,
          createdAt: true,
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
      vouchedByUser: {
        select: {
          id: true,
          fullName: true,
          phone: true,
          role: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ profiles });
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session || !isAuthorized(session.role, ["ADMIN_VERIFIER", "REPRESENTATIVE_VIP"])) {
    return NextResponse.json(
      { error: "دسترسی غیرمجاز." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const {
      profileId,
      decision,
      influenceLevel,
      intimacyLevel,
      secretAdminNotes,
      rejectionReason,
    } = body;

    if (!profileId || !["APPROVE", "REJECT"].includes(decision)) {
      return NextResponse.json(
        { error: "ارسال شناسه پروفایل و نوع تصمیم الزامی است." },
        { status: 400 }
      );
    }

    const profile = await prisma.organizationalProfile.findUnique({
      where: { id: profileId },
      include: { user: true },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "پروفایل مورد نظر یافت نشد." },
        { status: 404 }
      );
    }

    if (decision === "APPROVE") {
      // 1. Transactionally update profile to VERIFIED and upgrade user to VIP
      const targetRole =
        profile.user.role === UserRole.MEMBER_PUBLIC
          ? UserRole.MEMBER_VIP
          : profile.user.role; // Preserves CONNECTOR, ADMIN_VERIFIER, ADMIN_CLUB, REPRESENTATIVE_VIP

      const [updatedProfile, updatedUser] = await prisma.$transaction([
        prisma.organizationalProfile.update({
          where: { id: profileId },
          data: {
            verificationStatus: VerificationStatus.VERIFIED,
            verifiedByAdminId: session.userId,
            verifiedAt: new Date(),
            influenceLevel: influenceLevel || InfluenceLevel.INFORMED_STAFF,
            intimacyLevel: intimacyLevel || IntimacyLevel.SUPPORTER,
            secretAdminNotes: secretAdminNotes ? secretAdminNotes.trim() : null,
          },
        }),
        prisma.user.update({
          where: { id: profile.userId },
          data: {
            role: targetRole,
            tier: MemberTier.VIP,
          },
        }),
      ]);

      await logAuditEvent({
        userId: session.userId,
        action: "VERIFICATION_APPROVE",
        targetProfileId: profileId,
        query: `APPROVED: User ${updatedUser.fullName} promoted to VIP`,
        ipAddress: req.ip || req.headers.get("x-forwarded-for") || "local",
        userAgent: req.headers.get("user-agent"),
      });

      return NextResponse.json({
        success: true,
        message: `سمت ${updatedUser.fullName} با موفقیت تایید و کارت عضویت وی به سطح طلایی VIP ارتقا یافت.`,
        profile: updatedProfile,
      });
    } else {
      // REJECT
      const otherVerifiedCount = await prisma.organizationalProfile.count({
        where: {
          userId: profile.userId,
          id: { not: profileId },
          verificationStatus: VerificationStatus.VERIFIED,
        },
      });

      const updatedProfile = await prisma.organizationalProfile.update({
        where: { id: profileId },
        data: {
          verificationStatus: VerificationStatus.REJECTED,
          rejectionReason: rejectionReason ? rejectionReason.trim() : "عدم احراز سمت سازمانی توسط دبیرخانه",
        },
      });

      // Downgrade to standard if no other verified profiles exist
      if (otherVerifiedCount === 0) {
        await prisma.user.update({
          where: { id: profile.userId },
          data: {
            tier: MemberTier.STANDARD,
            role: profile.user.role === UserRole.MEMBER_VIP ? UserRole.MEMBER_PUBLIC : profile.user.role,
          },
        });
      }

      await logAuditEvent({
        userId: session.userId,
        action: "VERIFICATION_REJECT",
        targetProfileId: profileId,
        query: `REJECTED: Reason: ${rejectionReason}`,
        ipAddress: req.ip || req.headers.get("x-forwarded-for") || "local",
        userAgent: req.headers.get("user-agent"),
      });

      return NextResponse.json({
        success: true,
        message: "درخواست احراز سمت رد شد.",
        profile: updatedProfile,
      });
    }
  } catch (err: any) {
    console.error("[Admin Verify Error]", err);
    return NextResponse.json(
      { error: "خطا در ثبت تصمیم دبیرخانه." },
      { status: 500 }
    );
  }
}
