"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Phone, KeyRound, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Building } from "lucide-react";

export const dynamic = "force-dynamic";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/dashboard";

  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoCode, setDemoCode] = useState<string | null>(null);

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) {
      setError("لطفاً شماره تلفن همراه خود را وارد نمایید.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "خطا در ارسال کد تایید");
      }

      if (data.demoCode) {
        setDemoCode(data.demoCode);
      }
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!otp.trim()) {
      setError("لطفاً کد ۵ رقمی تایید را وارد کنید.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          code: otp,
          fullName: fullName.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "کد تایید نادرست است.");
      }

      const target = data.redirectTo || redirectTarget;
      router.push(target);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12 text-right font-sans">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm max-w-md w-full p-7 sm:p-8">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 mx-auto flex items-center justify-center shadow-xs mb-3">
            <Building className="w-7 h-7" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
            ورود به باشگاه حامیان و نخبگان
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            احراز هویت بدون نیاز به کد ملی و ثبت‌نام سریع در ۲ مرحله
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Phone + Name */}
        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                شماره تلفن همراه (بدون پیش‌شماره یا با صفر):
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                  dir="ltr"
                  className="w-full text-left pl-3.5 pr-10 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700 outline-none"
                  required
                  autoFocus
                />
                <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                نام و نام خانوادگی (اختیاری جهت درج روی کارت):
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="مثلاً: دکتر علی احمدی"
                className="w-full px-3.5 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700 outline-none"
              />
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-600 leading-[1.65] flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>
                <strong>تضمین حریم خصوصی:</strong> این سامانه هیچ‌گونه کدملی یا اطلاعات هویتی حساس از شما دریافت نخواهد کرد.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-sm transition active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "در حال ارسال پیامک..." : "دریافت کد تایید یکبارمصرف"}
            </button>
          </form>
        ) : (
          /* Step 2: OTP Verification */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="text-xs text-slate-600 leading-relaxed">
              کد تایید به شماره <strong className="text-slate-900 dir-ltr inline-block">{phone}</strong> ارسال گردید.
            </div>

            {demoCode && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 flex items-center justify-between font-bold">
                <span>کد آزمایشی (محیط تست):</span>
                <span className="font-mono text-base tracking-widest text-emerald-800">{demoCode}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                کد تایید ۵ رقمی:
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={5}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="۱۲۳۴۵"
                  dir="ltr"
                  className="w-full text-center tracking-[0.5em] text-2xl font-mono font-black py-3 px-4 rounded-xl border border-slate-200 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700 outline-none"
                  required
                  autoFocus
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-4" />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer font-bold"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                ویرایش شماره
              </button>
              <button
                type="button"
                onClick={handleSendOtp}
                className="text-emerald-800 hover:text-emerald-950 underline cursor-pointer font-bold"
              >
                ارسال مجدد کد
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-sm transition active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "در حال احراز هویت..." : "تایید و ورود به پیشخوان"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 py-20 text-center text-slate-400 font-bold">در حال بارگذاری...</div>}>
      <LoginForm />
    </Suspense>
  );
}
