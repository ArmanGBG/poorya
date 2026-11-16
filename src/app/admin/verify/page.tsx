"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Phone,
  Building,
  UserCheck,
  FileText,
  AlertCircle,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import {
  toPersianDigits,
} from "@/lib/utils";

export default function SecretariatVerifyPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Approval modal state
  const [activeProfile, setActiveProfile] = useState<any | null>(null);
  const [influenceLevel, setInfluenceLevel] = useState("KEY_EXPERT");
  const [intimacyLevel, setIntimacyLevel] = useState("SUPPORTER");
  const [secretNotes, setSecretNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchQueue();
  }, []);

  async function fetchQueue() {
    setLoading(true);
    try {
      const res = await fetch("/api/verification/admin-verify");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا در دریافت صف احراز هویت");
      setProfiles(data.profiles || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function openApproveModal(profile: any) {
    setActiveProfile(profile);
    setInfluenceLevel("KEY_EXPERT");
    setIntimacyLevel("SUPPORTER");
    setSecretNotes("");
  }

  function closeApproveModal() {
    setActiveProfile(null);
    setSecretNotes("");
  }

  async function handleApprove() {
    if (!activeProfile) return;
    setActionLoading(true);

    try {
      const res = await fetch("/api/verification/admin-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: activeProfile.id,
          decision: "APPROVE",
          influenceLevel,
          intimacyLevel,
          secretAdminNotes: secretNotes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا در تایید سمت");

      // Remove approved item from queue
      setProfiles((prev) => prev.filter((p) => p.id !== activeProfile.id));
      closeApproveModal();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReject(profileId: string) {
    const reason = prompt("لطفاً علت رد درخواست احراز را وارد کنید:");
    if (!reason) return;

    try {
      const res = await fetch("/api/verification/admin-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId,
          decision: "REJECT",
          rejectionReason: reason,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا در رد درخواست");

      setProfiles((prev) => prev.filter((p) => p.id !== profileId));
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 text-right font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Institutional Civic Header */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1 rounded-full text-xs font-bold mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>دبیرخانه احراز صلاحیت و تطبیق سمت سازمانی</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                صف بررسی استعلامات شغلی متقاضیان VIP
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl leading-[1.65]">
                استعلام تلفنی از شماره مستقیم ادارات، بررسی مدارک پرسنلی محرمانه و تایید ارتقای کارت‌های شهروندی به سطح طلایی نخبگان.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 px-6 py-4 rounded-2xl text-center shrink-0">
              <span className="text-2xl sm:text-3xl font-black text-emerald-800 block font-mono">
                {toPersianDigits(profiles.length)}
              </span>
              <span className="text-[11px] font-bold text-slate-500">درخواست در انتظار</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between">
            <span>{error}</span>
            <button onClick={fetchQueue} className="text-xs flex items-center gap-1 underline cursor-pointer">
              <RefreshCw className="w-3.5 h-3.5" /> تلاش مجدد
            </button>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center text-slate-400 font-bold">
            در حال دریافت صف بررسی...
          </div>
        ) : profiles.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              صف بررسی خالی است
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              تمامی درخواست‌های احراز سمت شغلی بررسی و تعیین تکلیف شده‌اند.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-black text-slate-900 text-base">
                        {profile.user.fullName}
                      </span>
                      <span className="text-xs text-slate-500 dir-ltr font-mono">
                        {profile.user.phone}
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200 font-bold">
                        روش: {profile.verificationMethod === "OFFICE_LANDLINE_CALL" ? "تماس تلفنی مستقیم" : profile.verificationMethod === "CONNECTOR_VOUCH" ? "سرشاخه معتمد" : "سند کارگزینی"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                      <Building className="w-4 h-4 text-emerald-800" />
                      <span>{profile.organization.name}</span>
                    </div>

                    <div className="text-xs text-slate-600 leading-[1.65]">
                      <span className="font-bold text-slate-700">{profile.customDepartment}:</span>{" "}
                      <span>{profile.jobTitle}</span>
                    </div>

                    {/* Verification specifics */}
                    <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                      {profile.officeDirectPhone && (
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Phone className="w-3.5 h-3.5 text-emerald-800" />
                          <span>تلفن استعلام اداره:</span>
                          <a href={`tel:${profile.officeDirectPhone}`} className="font-bold text-emerald-900 underline dir-ltr">
                            {profile.officeDirectPhone}
                          </a>
                        </div>
                      )}

                      {profile.vouchedByUser && (
                        <div className="flex items-center gap-1 text-slate-700">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                          <span>معرف: {profile.vouchedByUser.fullName} ({profile.vouchedByUser.phone})</span>
                        </div>
                      )}

                      {profile.documentUrl && (
                        <a
                          href={`/api/admin/documents/${profile.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-bold underline"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>مشاهده مدرک پرسنلی محرمانه</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Decision Actions */}
                  <div className="flex items-center gap-2.5 self-end lg:self-center shrink-0">
                    <button
                      onClick={() => handleReject(profile.id)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-rose-700 border border-slate-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>رد درخواست</span>
                    </button>

                    <button
                      onClick={() => openApproveModal(profile)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer active:scale-98"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>تایید سمت و صدور VIP</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Approve Modal */}
        {activeProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-right">
              <h3 className="text-base sm:text-lg font-black text-slate-900 mb-1">
                تایید سمت شغلی و ثبت در رادار نخبگان
              </h3>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                متقاضی: <strong className="text-slate-900">{activeProfile.user.fullName}</strong> - {activeProfile.organization.name}
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    سطح نفوذ سازمانی (فیلد محرمانه CRM):
                  </label>
                  <select
                    value={influenceLevel}
                    onChange={(e) => setInfluenceLevel(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none bg-white focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="DECISION_MAKER">مدیر تصمیم‌گیرنده / معاون کل (اختیار امضا و حل مشکل)</option>
                    <option value="KEY_EXPERT">کارشناس کلیدی / امضا طلایی (کارشناسی پرونده‌های حساس)</option>
                    <option value="INFORMED_STAFF">کارمند مطلع و باسابقه (پیگیری امور اداری)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    سطح همراهی و صمیمیت با دفتر نماینده:
                  </label>
                  <select
                    value={intimacyLevel}
                    onChange={(e) => setIntimacyLevel(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none bg-white focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="INNER_CIRCLE">حلقه اول / پای کار و معتمد</option>
                    <option value="SUPPORTER">حامی معتمد</option>
                    <option value="CLUB_ONLY">صرفاً عضو باشگاه تخفیفات</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    یادداشت‌های محرمانه دبیرخانه جهت اطلاع نماینده (اختیاری):
                  </label>
                  <textarea
                    value={secretNotes}
                    onChange={(e) => setSecretNotes(e.target.value)}
                    placeholder="نکات حاصل از استعلام تلفنی، نحوه رفتار و همراهی در اداره..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-emerald-700 resize-none leading-relaxed"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={closeApproveModal}
                    disabled={actionLoading}
                    className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    انصراف
                  </button>
                  <button
                    type="button"
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
                  >
                    {actionLoading ? "در حال ثبت..." : "تایید نهایی و صدور کارت طلایی"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
