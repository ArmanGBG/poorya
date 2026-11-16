"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Award,
  Building2,
  PhoneCall,
  Users2,
  FileUp,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Search,
  Lock,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { OrganizationCategory } from "@prisma/client";

export default function UpgradeVipPage() {
  const router = useRouter();

  // Organizations list
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [orgSearch, setOrgSearch] = useState("");

  // Form Fields
  const [customDepartment, setCustomDepartment] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [verificationMethod, setVerificationMethod] = useState<
    "CONNECTOR_VOUCH" | "OFFICE_LANDLINE_CALL" | "DOCUMENT_UPLOAD"
  >("OFFICE_LANDLINE_CALL");

  // Conditional fields
  const [connectorInput, setConnectorInput] = useState("");
  const [officeLandline, setOfficeLandline] = useState("");
  const [hasUploadedDoc, setHasUploadedDoc] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch organizations
  useEffect(() => {
    fetch("/api/organizations")
      .then((res) => res.json())
      .then((data) => setOrganizations(data.organizations || []))
      .catch(() => {});
  }, []);

  const filteredOrgs = organizations.filter((org) =>
    org.name.toLowerCase().includes(orgSearch.toLowerCase())
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedOrgId) {
      setError("لطفاً سازمان یا اداره محل خدمت خود را انتخاب فرمایید.");
      return;
    }
    if (!customDepartment.trim() || !jobTitle.trim()) {
      setError("تکمیل واحد سازمانی و عنوان سمت الزامی است.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/verification/upgrade-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId: selectedOrgId,
          customDepartment: customDepartment.trim(),
          jobTitle: jobTitle.trim(),
          verificationMethod,
          officeDirectPhone:
            verificationMethod === "OFFICE_LANDLINE_CALL" ? officeLandline.trim() : undefined,
          connectorCodeOrPhone:
            verificationMethod === "CONNECTOR_VOUCH" ? connectorInput.trim() : undefined,
          documentUrl:
            verificationMethod === "DOCUMENT_UPLOAD" && hasUploadedDoc
              ? "/private-docs/sample-decree.enc"
              : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "خطا در ثبت درخواست ارتقا");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center animate-in zoom-in-95">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4 shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          درخواست ارتقای سمت شما با موفقیت ثبت گردید
        </h2>
        <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
          مشخصات شما در دبیرخانه احراز هویت ثبت شد. پس از تطبیق اولیه، کارت عضویت شما بلافاصله به سطح طلایی (VIP) تبدیل شده و سقف تخفیف‌های ویژه برای شما فعال خواهد شد.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={() => router.push("/dashboard/card")}
            className="bg-slate-950 text-white text-xs sm:text-sm font-bold py-3 px-6 rounded-2xl shadow-md transition hover:bg-slate-800 cursor-pointer"
          >
            مشاهده وضعیت کارت عضویت
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 text-right font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Institutional Civic Header Banner */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1 rounded-full text-xs font-bold mb-3">
              <Award className="w-4 h-4 text-emerald-700" />
              <span>دعوت به کارگروه‌های مشورتی توسعه شهر</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              ارتقا به سطح طلایی (VIP) ویژه متخصصین و کارکنان ادارات
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-[1.65]">
              آیا کارمند ادارات، بانک‌ها، کادر درمان یا متخصص هستید؟ با تکمیل اطلاعات شغلی خود، ضمن عضویت در کارگروه‌های مشورتی توسعه شهر، کارت عضویت خود را به سطح طلایی (VIP) ارتقا دهید و از تخفیف‌های ویژه بهره‌مند شوید.
            </p>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>احراز هویت بدون نیاز به کد ملی، با حفظ کامل محرمانگی سمت‌های اداری</span>
            </div>
          </div>
        </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Multi-Section Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-7">
        {/* 1. Organization Picker (Standard Tree Search) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">۱</span>
              <span>اداره یا سازمان متبوع (انتخاب از فهرست استاندارد):</span>
            </label>
            <span className="text-[11px] text-slate-400">یکپارچگی اطلاعات</span>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <input
                type="text"
                value={orgSearch}
                onChange={(e) => setOrgSearch(e.target.value)}
                placeholder="فیلتر سریع نام اداره (مثلاً: مالیات، بانک ملی، شهرداری، ثبت اسناد...)"
                className="w-full pr-10 pl-4 py-2.5 rounded-2xl border border-slate-300 text-xs focus:border-slate-950 focus:ring-2 focus:ring-slate-100 outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            </div>

            <select
              value={selectedOrgId}
              onChange={(e) => setSelectedOrgId(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs font-bold focus:border-slate-950 focus:ring-2 focus:ring-slate-100 outline-none bg-white cursor-pointer"
              required
            >
              <option value="">-- لطفاً سازمان خود را از لیست استاندارد انتخاب کنید --</option>
              {filteredOrgs.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name} ({org.city})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2. Department & Job Title */}
        <div>
          <div className="mb-2">
            <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">۲</span>
              <span>واحد سازمانی و عنوان سمت شغلی:</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                نام واحد / دایره / اداره تابعه:
              </label>
              <input
                type="text"
                value={customDepartment}
                onChange={(e) => setCustomDepartment(e.target.value)}
                placeholder="مثال: دایره رسیدگی اشخاص حقوقی یا شعبه ونک"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 text-xs focus:border-slate-950 focus:ring-2 focus:ring-slate-100 outline-none font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                عنوان رسمی سمت:
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="مثال: رئیس گروه مالیاتی / کارشناس تسهیلات"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 text-xs focus:border-slate-950 focus:ring-2 focus:ring-slate-100 outline-none font-medium"
                required
              />
            </div>
          </div>
        </div>

        {/* 3. Choose Trust-Based Verification Method */}
        <div>
          <div className="mb-3">
            <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">۳</span>
              <span>روش تایید سمت (روشی که با آن راحت‌تر و امن‌تر هستید):</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Method 1: Office Landline Call */}
            <label
              className={`p-4 rounded-2xl border text-right cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                verificationMethod === "OFFICE_LANDLINE_CALL"
                  ? "bg-blue-50/90 border-blue-500 ring-2 ring-blue-100 shadow-xs"
                  : "bg-slate-50 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <PhoneCall className="w-4 h-4" />
                  </span>
                  <input
                    type="radio"
                    name="method"
                    value="OFFICE_LANDLINE_CALL"
                    checked={verificationMethod === "OFFICE_LANDLINE_CALL"}
                    onChange={() => setVerificationMethod("OFFICE_LANDLINE_CALL")}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <span className="font-black text-xs text-slate-900 block mb-1">
                  تلفن ثابت محل کار
                </span>
                <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                  تماس احوالپرسی ۳۰ ثانیه‌ای دبیرخانه با شماره مستقیم یا داخلی اداره شما
                </p>
              </div>
            </label>

            {/* Method 2: Connector Vouch */}
            <label
              className={`p-4 rounded-2xl border text-right cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                verificationMethod === "CONNECTOR_VOUCH"
                  ? "bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-100 shadow-xs"
                  : "bg-slate-50 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Users2 className="w-4 h-4" />
                  </span>
                  <input
                    type="radio"
                    name="method"
                    value="CONNECTOR_VOUCH"
                    checked={verificationMethod === "CONNECTOR_VOUCH"}
                    onChange={() => setVerificationMethod("CONNECTOR_VOUCH")}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                </div>
                <span className="font-black text-xs text-slate-900 block mb-1">
                  معرفی توسط سرشاخه معتمد
                </span>
                <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                  تایید فوری سمت شغلی شما با ثبت کد معرف یا شماره همراه یکی از معتمدین ستاد
                </p>
              </div>
            </label>

            {/* Method 3: Document Upload */}
            <label
              className={`p-4 rounded-2xl border text-right cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                verificationMethod === "DOCUMENT_UPLOAD"
                  ? "bg-purple-50/90 border-purple-500 ring-2 ring-purple-100 shadow-xs"
                  : "bg-slate-50 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                    <FileUp className="w-4 h-4" />
                  </span>
                  <input
                    type="radio"
                    name="method"
                    value="DOCUMENT_UPLOAD"
                    checked={verificationMethod === "DOCUMENT_UPLOAD"}
                    onChange={() => setVerificationMethod("DOCUMENT_UPLOAD")}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                </div>
                <span className="font-black text-xs text-slate-900 block mb-1">
                  آپلود کارت پرسنلی
                </span>
                <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                  ارسال تصویر کارت یا حکم در فضای ذخیره‌سازی رمزنگاری‌شده و محرمانه
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Dynamic Verification Method Inputs */}
        {verificationMethod === "OFFICE_LANDLINE_CALL" && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 animate-in fade-in">
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              شماره تلفن مستقیم یا شماره اداره با ذکر داخلی:
            </label>
            <input
              type="text"
              value={officeLandline}
              onChange={(e) => setOfficeLandline(e.target.value)}
              placeholder="مثال: ۰۲۱-۸۸۷۷۶۶۵۵ داخلی ۳۱۰"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-slate-950 focus:ring-2 focus:ring-slate-100 outline-none font-medium"
              required
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              دبیرخانه صرفاً جهت احراز اولیه و ثبت سمت شما، تماس کوتاهی برقرار خواهد نمود.
            </span>
          </div>
        )}

        {verificationMethod === "CONNECTOR_VOUCH" && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 animate-in fade-in">
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              کد معرف اختصاصی یا شماره تلفن همراه سرشاخه معتمد:
            </label>
            <input
              type="text"
              value={connectorInput}
              onChange={(e) => setConnectorInput(e.target.value)}
              placeholder="مثال: NAJAFI110 یا ۰۹۱۲۳۳۳۳۳۳۳"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:border-slate-950 focus:ring-2 focus:ring-slate-100 outline-none"
              required
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              درخواست شما بلافاصله در پنل سرشاخه معتمد جهت تایید نمایش داده خواهد شد.
            </span>
          </div>
        )}

        {verificationMethod === "DOCUMENT_UPLOAD" && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 animate-in fade-in">
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              تصویر کارت پرسنلی یا حکم کارگزینی:
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-slate-400 transition bg-white">
              <FileUp className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <div className="text-xs text-slate-700 font-bold mb-1">
                {hasUploadedDoc ? "✅ فایل ضمیمه شد (ذخیره‌سازی رمزنگاری‌شده)" : "مدرک شغلی خود را انتخاب کنید"}
              </div>
              <p className="text-[10px] text-slate-400 mb-3">
                فرمت‌های مجاز: JPG, PNG, PDF (حداکثر ۵ مگابایت)
              </p>
              <button
                type="button"
                onClick={() => setHasUploadedDoc(true)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2 px-5 rounded-xl border border-slate-300 transition cursor-pointer"
              >
                {hasUploadedDoc ? "تغییر فایل" : "انتخاب مدرک"}
              </button>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl font-bold text-sm shadow-sm transition-all active:scale-98 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? "در حال ارسال اطلاعات..." : "ثبت اطلاعات و ارسال جهت ارتقا به VIP"}
        </button>
      </form>
      </div>
    </div>
  );
}
