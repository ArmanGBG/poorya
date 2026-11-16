"use client";

import React, { useState } from "react";
import {
  ScanLine,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Store,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { toPersianDigits } from "@/lib/utils";

const SAMPLE_MERCHANTS = [
  { name: "باغ بهشت", pin: "4455" },
  { name: "کلینیک دندانپزشکی", pin: "7890" },
  { name: "ورزشی البرز", pin: "2345" },
  { name: "پوشاک عالی‌جناب", pin: "1122" },
];

export default function VerifyCouponPage() {
  const [code, setCode] = useState("");
  const [merchantPin, setMerchantPin] = useState("");
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  React.useEffect(() => {
    fetch("/api/discounts/businesses")
      .then((res) => res.json())
      .then((data) => {
        if (data.businesses) {
          setBusinesses(data.businesses);
        }
      })
      .catch((err) => console.error("Error loading businesses", err));
  }, []);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim() || !merchantPin.trim()) {
      setError("لطفاً کد ۶ رقمی کوپن و پین ۴ رقمی فروشگاه را وارد کنید.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/discounts/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verificationCode: code.trim(),
          merchantPin: merchantPin.trim(),
          businessId: selectedBusinessId || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "خطا در اعتبارسنجی کوپن");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setCode("");
    setError(null);
    setResult(null);
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 text-right font-sans">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 mx-auto flex items-center justify-center shadow-xs mb-3">
            <ScanLine className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
            ترمینال اعتبارسنجی آفلاین کوپن
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            ویژه صندوقداران و پذیرندگان طرف قرارداد باشگاه حامیان توسعه
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs sm:text-sm font-bold flex items-start gap-2.5 leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {result ? (
            <div className="text-center py-4 animate-in zoom-in-95 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 mx-auto flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 mb-1">
                  کوپن تخفیف با موفقیت تایید و ابطال شد
                </h3>
                <p className="text-xs text-slate-500 font-medium">{result.message}</p>
              </div>

              {/* Receipt Card */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 text-right space-y-2.5 text-xs">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">نام مشتری:</span>
                  <span className="font-black text-slate-900">{result.details.customerName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">سطح کارت عضویت:</span>
                  <span className="font-bold text-amber-800">{result.details.customerTier}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">درصد تخفیف مصوب:</span>
                  <span className="font-black text-emerald-800 text-sm">
                    {toPersianDigits(result.details.discountPercent)}٪ تخفیف
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">عنوان بسته تخفیف:</span>
                  <span className="font-bold text-slate-800">{result.details.offerTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">زمان اعتبارسنجی:</span>
                  <span className="font-medium text-slate-700">{result.details.verifiedAt}</span>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>ثبت و بررسی کوپن جدید</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleVerify} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  ۱. کد ۶ رقمی کوپن تخفیف مشتری:
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="مثال: 456789"
                  dir="ltr"
                  className="w-full text-center tracking-widest text-xl font-mono font-black py-3 px-4 rounded-xl border border-slate-200 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700 outline-none"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                  <span>۲. فروشگاه طرف قرارداد:</span>
                  <span className="text-[11px] font-normal text-slate-400">تشخیص خودکار یا انتخاب</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedBusinessId}
                    onChange={(e) => setSelectedBusinessId(e.target.value)}
                    className="w-full text-xs font-bold py-3 px-4 pr-10 rounded-xl border border-slate-200 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700 outline-none bg-white text-slate-800"
                  >
                    <option value="">تشخیص خودکار بر اساس کد کوپن</option>
                    {businesses.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.category})
                      </option>
                    ))}
                  </select>
                  <Store className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  ۳. پین ۴ رقمی اختصاصی فروشگاه شما (Merchant PIN):
                </label>
                <div className="relative">
                  <input
                    type="password"
                    maxLength={4}
                    value={merchantPin}
                    onChange={(e) => setMerchantPin(e.target.value)}
                    placeholder="****"
                    dir="ltr"
                    className="w-full text-center tracking-[0.5em] text-xl font-mono font-black py-3 px-4 rounded-xl border border-slate-200 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700 outline-none"
                    required
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                </div>

                {/* Sample PIN shortcuts in dev */}
                {process.env.NODE_ENV !== "production" && (
                  <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="text-slate-400 font-bold ml-1">پین‌های آزمایشی:</span>
                    {SAMPLE_MERCHANTS.map((m) => (
                      <button
                        key={m.pin}
                        type="button"
                        onClick={() => setMerchantPin(m.pin)}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 transition cursor-pointer font-medium"
                      >
                        {m.name}: <span className="font-mono font-bold text-emerald-800">{m.pin}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-600 leading-[1.65] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  هر کوپن به همراه پین اختصاصی فروشگاه اعتبارسنجی شده و اطلاعات مشتری کاملاً محفوظ می‌ماند.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-sm transition active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {loading ? "در حال استعلام و ابطال کوپن..." : "اعتبارسنجی و اعمال تخفیف در صورت‌حساب"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
