import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest, isAuthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "@/lib/audit";

function escapeHtml(str: string | null | undefined): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Private Document Storage Route (Architectural Fix #4)
 * Strictly restricted to ADMIN_VERIFIER and REPRESENTATIVE_VIP.
 * NEVER serves files from /public to protect confidential personnel decrees.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSessionFromRequest(req);

  if (!session || !isAuthorized(session.role, ["ADMIN_VERIFIER", "REPRESENTATIVE_VIP"])) {
    return NextResponse.json(
      { error: "دسترسی غیرمجاز. تنها دبیرخانه و نماینده امکان مشاهده اسناد محرمانه را دارند." },
      { status: 403 }
    );
  }

  const { id } = params;

  // Find the organizational profile that owns this document (strictly by profile ID)
  const profile = await prisma.organizationalProfile.findFirst({
    where: {
      id,
      documentUrl: { not: null },
    },
    include: {
      user: {
        select: {
          fullName: true,
          phone: true,
        },
      },
      organization: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!profile || !profile.documentUrl) {
    return NextResponse.json(
      { error: "سند مورد نظر یافت نشد یا ضمیمه نشده است." },
      { status: 404 }
    );
  }

  // Audit the confidential document access
  await logAuditEvent({
    userId: session.userId,
    action: "PROFILE_VIEW",
    targetProfileId: profile.id,
    query: `VIEW_CONFIDENTIAL_DOCUMENT:${profile.documentUrl}`,
    ipAddress: req.ip || req.headers.get("x-forwarded-for") || "local",
    userAgent: req.headers.get("user-agent"),
  });

  const safeFullName = escapeHtml(profile.user.fullName);
  const safeOrgName = escapeHtml(profile.organization.name);
  const safeDept = escapeHtml(profile.customDepartment);
  const safeJob = escapeHtml(profile.jobTitle);
  const safeDocUrl = escapeHtml(profile.documentUrl);

  // Return a secure simulated document preview payload
  const securePreviewHtml = `
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
      <head>
        <meta charset="utf-8" />
        <title>سند محرمانه پرسنلی - سامانه دبیرخانه</title>
        <style>
          body { font-family: Tahoma, sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
          .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 2rem; max-width: 500px; width: 100%; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
          .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; background: #ef4444; color: white; font-weight: bold; margin-bottom: 1rem; }
          h2 { margin-top: 0; color: #f1f5f9; }
          .row { margin: 10px 0; border-bottom: 1px solid #334155; padding-bottom: 8px; display: flex; justify-content: space-between; font-size: 0.95rem; }
          .label { color: #94a3b8; }
          .val { font-weight: bold; }
          .watermark { margin-top: 1.5rem; text-align: center; color: #64748b; font-size: 0.75rem; border-top: 1px dashed #475569; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge">سند محرمانه دولتی - مشاهده شده توسط دبیرخانه</div>
          <h2>کارت شناسایی / حکم کارگزینی</h2>
          <div class="row"><span class="label">نام و نام خانوادگی:</span><span class="val">${safeFullName}</span></div>
          <div class="row"><span class="label">سازمان متبوع:</span><span class="val">${safeOrgName}</span></div>
          <div class="row"><span class="label">واحد / دایره:</span><span class="val">${safeDept}</span></div>
          <div class="row"><span class="label">عنوان سمت:</span><span class="val">${safeJob}</span></div>
          <div class="row"><span class="label">شناسه ذخیره‌سازی امن:</span><span class="val">${safeDocUrl}</span></div>
          <div class="watermark">این سند صرفاً جهت احراز هویت شغلی در شبکه نخبگان صادر شده و هرگونه نسخه‌برداری ممنوع است.</div>
        </div>
      </body>
    </html>
  `;

  return new NextResponse(securePreviewHtml, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
