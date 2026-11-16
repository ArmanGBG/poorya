"use client";

import React, { useState, useEffect } from "react";
import {
  Users2,
  CheckCircle2,
  XCircle,
  Copy,
  Building,
  Check,
  Shield,
  RefreshCw,
} from "lucide-react";
import { toPersianDigits } from "@/lib/utils";

export default function ConnectorPanelPage() {
  const [data, setData] = useState<{ referralCode: string; profiles: any[] }>({
    referralCode: "",
    profiles: [],
  });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchReferrals();
  }, []);

  async function fetchReferrals() {
    setLoading(true);
    try {
      const res = await fetch("/api/verification/connector-vouch");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(profileId: string, action: "VOUCH" | "DECLINE") {
    try {
      const res = await fetch("/api/verification/connector-vouch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId, action }),
      });
      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.error);

      // Refresh list
      setData((prev) => ({
        ...prev,
        profiles: prev.profiles.filter((p) => p.id !== profileId),
      }));
      alert(resJson.message);
    } catch (err: any) {
      alert(err.message);
    }
  }

  function copyCode() {
    navigator.clipboard.writeText(data.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 text-right font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Institutional Civic Header */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1 rounded-full text-xs font-bold mb-3">
                <Users2 className="w-4 h-4 text-emerald-700" />
                <span>پنل رابطین معتمد و سرشاخه‌های سازمانی</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                تایید اصالت و معرفیت رابطین شبکه شما
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl leading-[1.65]">
                همکارانی که با کد معرف شما ثبت‌نام نموده‌اند؛ با یک کلیک صحت جایگاه شغلی ایشان را تایید فرمایید تا بدون نیاز به بروکراسی اداری به سطح طلایی ارتقا یابند.
              </p>
            </div>

            {/* Referral Code Box */}
            <div className="bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl text-center shrink-0">
              <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
                کد معرف اختصاصی شما:
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-xl sm:text-2xl font-black text-emerald-800 tracking-wider">
                  {data.referralCode || "---"}
                </span>
                <button
                  onClick={copyCode}
                  className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                  title="کپی کد معرف"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profiles awaiting vouch */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              درخواست‌های نیازمند تایید شما ({toPersianDigits(data.profiles?.length || 0)})
            </h2>
            <button
              onClick={fetchReferrals}
              className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-bold cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              به‌روزرسانی
            </button>
          </div>

          {loading ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 font-bold">
              در حال دریافت لیست متقاضیان...
            </div>
          ) : !data.profiles || data.profiles.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                هیچ درخواست جدیدی در انتظار تایید شما نیست
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                به محض ثبت‌نام افراد با کد معرف شما، در این بخش نمایش داده خواهند شد.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 text-base">
                        {profile.user.fullName}
                      </span>
                      <span className="text-xs text-slate-500 dir-ltr font-mono">
                        {profile.user.phone}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold">
                      <Building className="w-4 h-4 text-emerald-700" />
                      <span>{profile.organization.name}</span>
                    </div>

                    <div className="text-xs text-slate-600">
                      <span>{profile.customDepartment}:</span>{" "}
                      <span className="font-bold text-slate-800">{profile.jobTitle}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => handleAction(profile.id, "DECLINE")}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>عدم شناخت</span>
                    </button>

                    <button
                      onClick={() => handleAction(profile.id, "VOUCH")}
                      className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5 active:scale-98 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>تایید صحت سمت شغلی</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
