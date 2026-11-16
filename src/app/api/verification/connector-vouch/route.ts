import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest, isAuthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "@/lib/audit";
import { VerificationStatus, UserRole, MemberTier } from "@prisma/client";

/**
 * Connector Vouching API
 * Trusted campaign connectors vouch for claimed positions in their network with one tap.
 */
export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session || !isAuthorized(session.role, ["CONNECTOR", "REPRESENTATIVE_VIP"])) {
    return NextResponse.json(
      { error: "دسترسی غیرمجاز. تنها سرشاخه‌های معتمد به این بخش دسترسی دارند." },
      { status: 403 }
    );
  }

  // Get current connector's referral code
  const currentUser = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { referralCode: true },
  });

  // Profiles where user listed this connector as voucher, or user was referred by this connector
  const profiles = await prisma.organizationalProfile.findMany({
    where: {
      OR: [
        { vouchedByUserId: session.userId },
        { user: { referredById: session.userId } },
      ],
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
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    referralCode: currentUser?.referralCode || "ندارد",
    profiles,
  });
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session || !isAuthorized(session.role, ["CONNECTOR", "REPRESENTATIVE_VIP"])) {
    return NextResponse.json(
      { error: "دسترسی غیرمجاز." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { profileId, action } = body; // action: 'VOUCH' | 'DECLINE'

    if (!profileId || !["VOUCH", "DECLINE"].includes(action)) {
      return NextResponse.json(
        { error: "پارامترهای درخواست نامعتبر است." },
        { status: 400 }
      );
    }

    const profile = await prisma.organizationalProfile.findFirst({
      where: {
        id: profileId,
        OR: [
          { vouchedByUserId: session.userId },
          { user: { referredById: session.userId } },
        ],
      },
      include: { user: true },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "پروفایل معتبر متصل به شبکه شما یافت نشد." },
        { status: 404 }
      );
    }

    // Prevent Self-Vouching
    if (profile.userId === session.userId) {
      return NextResponse.json(
        { error: "امکان تایید سمت شغلی خود توسط خودتان وجود ندارد." },
        { status: 400 }
      );
    }

    if (action === "VOUCH") {
      // Confirmed by connector: promote user tier to VIP, preserve existing administrative/connector roles
      const targetRole =
        profile.user.role === UserRole.MEMBER_PUBLIC
          ? UserRole.MEMBER_VIP
          : profile.user.role;

      await prisma.$transaction([
        prisma.organizationalProfile.update({
          where: { id: profileId },
          data: {
            verificationStatus: VerificationStatus.VERIFIED,
            vouchedByUserId: session.userId,
            verifiedAt: new Date(),
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
        action: "CONNECTOR_VOUCH",
        targetProfileId: profileId,
        query: `VOUCHED: Connector confirmed job position for ${profile.user.fullName}`,
        ipAddress: req.ip || req.headers.get("x-forwarded-for") || "local",
        userAgent: req.headers.get("user-agent"),
      });

      return NextResponse.json({
        success: true,
        message: `صحت سمت شغلی ${profile.user.fullName} با موفقیت توسط شما تایید شد.`,
      });
    } else {
      // DECLINE
      const otherVerifiedCount = await prisma.organizationalProfile.count({
        where: {
          userId: profile.userId,
          id: { not: profileId },
          verificationStatus: VerificationStatus.VERIFIED,
        },
      });

      await prisma.organizationalProfile.update({
        where: { id: profileId },
        data: {
          verificationStatus: VerificationStatus.REJECTED,
          rejectionReason: "عدم تایید یا عدم شناخت توسط سرشاخه معتمد",
        },
      });

      // Downgrade to standard if no other verified positions exist
      if (otherVerifiedCount === 0) {
        await prisma.user.update({
          where: { id: profile.userId },
          data: {
            tier: MemberTier.STANDARD,
            role: profile.user.role === UserRole.MEMBER_VIP ? UserRole.MEMBER_PUBLIC : profile.user.role,
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: "درخواست معرفیت رد شد.",
      });
    }
  } catch (err: any) {
    console.error("[Connector Vouch Error]", err);
    return NextResponse.json(
      { error: "خطا در تایید سمت توسط سرشاخه." },
      { status: 500 }
    );
  }
}
