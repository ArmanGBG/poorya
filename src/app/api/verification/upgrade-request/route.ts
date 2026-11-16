import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { normalizePersian, normalizePhoneNumber } from "@/lib/persian";
import { logAuditEvent } from "@/lib/audit";
import { VerificationMethod, VerificationStatus, UserRole } from "@prisma/client";

/**
 * Progressive VIP Upgrade Form Submission (Zero National ID)
 * Users choose one of three trust methods:
 * 1. Connector referral code/phone
 * 2. Office direct landline + extension
 * 3. Encrypted personnel badge upload
 */
export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json(
      { error: "جهت ارتقای عضویت، ابتدا وارد سامانه شوید." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const {
      organizationId,
      customDepartment,
      jobTitle,
      verificationMethod,
      officeDirectPhone,
      connectorCodeOrPhone,
      documentUrl,
    } = body;

    if (!organizationId || !customDepartment || !jobTitle || !verificationMethod) {
      return NextResponse.json(
        { error: "تکمیل نام سازمان، واحد سازمانی، عنوان سمت و روش احراز الزامی است." },
        { status: 400 }
      );
    }

    let vouchedByUserId: string | null = null;

    // Option 1: Connector Vouch
    if (verificationMethod === VerificationMethod.CONNECTOR_VOUCH) {
      if (!connectorCodeOrPhone) {
        return NextResponse.json(
          { error: "لطفاً کد معرف یا شماره تلفن همراه سرشاخه معتمد را وارد فرمایید." },
          { status: 400 }
        );
      }

      const cleanInput = connectorCodeOrPhone.trim();
      const normalizedPhone = normalizePhoneNumber(cleanInput);

      // Search for connector by referralCode or phone
      const connector = await prisma.user.findFirst({
        where: {
          OR: [
            { referralCode: cleanInput.toUpperCase() },
            { phone: normalizedPhone },
          ],
          role: { in: [UserRole.CONNECTOR, UserRole.REPRESENTATIVE_VIP] },
        },
      });

      if (!connector) {
        return NextResponse.json(
          { error: "سرشاخه معتمد با مشخصات وارد شده در سامانه شناسایی نشد." },
          { status: 404 }
        );
      }

      // Prevent Self-Vouching
      if (connector.id === session.userId) {
        return NextResponse.json(
          { error: "امکان ثبت کد یا شماره تماس خود به عنوان سرشاخه معتمد وجود ندارد." },
          { status: 400 }
        );
      }

      vouchedByUserId = connector.id;
    }

    // Option 2: Office Direct Landline Call
    if (verificationMethod === VerificationMethod.OFFICE_LANDLINE_CALL) {
      if (!officeDirectPhone) {
        return NextResponse.json(
          { error: "ارائه شماره تلفن مستقیم یا داخلی محل کار جهت استعلام دبیرخانه الزامی است." },
          { status: 400 }
        );
      }
    }

    // Check if user already has primary profiles, update existing or create new
    // 1-to-Many support: an existing profile might be non-primary
    const existingProfilesCount = await prisma.organizationalProfile.count({
      where: { userId: session.userId },
    });

    const isPrimary = existingProfilesCount === 0;

    const newProfile = await prisma.organizationalProfile.create({
      data: {
        userId: session.userId,
        organizationId,
        customDepartment: normalizePersian(customDepartment).trim(),
        jobTitle: normalizePersian(jobTitle).trim(),
        isPrimary,
        verificationStatus: VerificationStatus.PENDING,
        verificationMethod: verificationMethod as VerificationMethod,
        officeDirectPhone: officeDirectPhone ? normalizePersian(officeDirectPhone).trim() : null,
        documentUrl: documentUrl ? `/private-docs/${session.userId}-${Date.now()}.enc` : null,
        vouchedByUserId,
      },
      include: {
        organization: true,
      },
    });

    // Audit log
    await logAuditEvent({
      userId: session.userId,
      action: "VERIFICATION_SUBMIT",
      targetProfileId: newProfile.id,
      query: `METHOD:${verificationMethod} | ORG:${newProfile.organization.name} | TITLE:${jobTitle}`,
      ipAddress: req.ip || req.headers.get("x-forwarded-for") || "local",
      userAgent: req.headers.get("user-agent"),
    });

    return NextResponse.json({
      success: true,
      message: "درخواست ارتقای سمت شما با موفقیت ثبت شد و در صف بررسی دبیرخانه قرار گرفت.",
      profile: newProfile,
    });
  } catch (err: any) {
    console.error("[Upgrade Request Error]", err);
    return NextResponse.json(
      { error: "خطا در ثبت درخواست ارتقا. لطفاً ورودی‌ها را بررسی فرمایید." },
      { status: 500 }
    );
  }
}
