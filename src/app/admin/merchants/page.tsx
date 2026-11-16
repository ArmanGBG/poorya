"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Store,
  PlusCircle,
  KeyRound,
  Percent,
  Phone,
  MapPin,
  Tag,
  Award,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
} from "lucide-react";
import { toPersianDigits } from "@/lib/utils";

const CATEGORIES = [
  "کلینیک، دندانپزشکی و سلامت",
  "رستوران، کافه و تشریفات",
  "مجموعه ورزشی، استخر و تناسب اندام",
  "پوشاک، کیف و کفش",
  "خدمات خودرو و بیمه",
  "آموزشی، فرهنگی و کتاب",
  "خدمات فنی، ساختمانی و دکوراسیون",
];

export default function AdminMerchantsPage() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedPinId, setCopiedPinId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [merchantPin, setMerchantPin] = useState("");
  const [discountPercent, setDiscountPercent] = useState("20");
  const [requiredTier, setRequiredTier] = useState<"STANDARD" | "VIP">("STANDARD");
  const [terms, setTerms] = useState("ارائه کوپن فعال به صندوق‌دار هنگام پرداخت صورت‌حساب الزامی است.");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    fetchMerchants();
  }, []);

  async function fetchMerchants() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/merchants");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا در دریافت لیست فروشگاه‌ها");
      setBusinesses(data.businesses || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError("لطفاً نام مرکز، شماره تماس و نشانی را وارد فرمایید.");
      return;
    }

    setFormSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/merchants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          category,
          phone,
          address,
          merchantPin: merchantPin.trim() || undefined,
          discountPercent: Number(discountPercent) || 20,
          requiredTier,
          terms,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا در ثبت فروشگاه جدید");

      setFormSuccess(true);
      // Reset form
      setName("");
      setPhone("");
      setAddress("");
      setMerchantPin("");
      setDiscountPercent("20");
      fetchMerchants();

      setTimeout(() => setFormSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setFormSubmitting(false);
    }
  }

  function copyPin(id: string, pin: string) {
    navigator.clipboard.writeText(pin);
    setCopiedPinId(id);
    setTimeout(() => setCopiedPinId(null), 2000);
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 text-right font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Banner - Institutional Civic Style */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1 rounded-full text-xs font-bold mb-3">
                <Store className="w-4 h-4 text-emerald-700" />
                <span>پنل راهبردی مدیریت شبکه رفاهی و پذیرندگان همکار</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                ثبت و مدیریت مراکز خدماتی و درمانی همکار
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl leading-[1.65]">
                در این بخش می‌توانید کلینیک‌ها، فروشگاه‌ها، رستوران‌ها و مراکز رفاهی طرف قرارداد باشگاه را ثبت نموده و پین ۴ رقمی صندوق‌دار را تعیین فرمایید.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/verify-coupon"
                target="_blank"
                className="inline-flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-sm transition"
              >
                <span>آزمون ترمینال صندوق‌دار</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchMerchants}
              className="inline-flex items-center gap-1 text-xs text-rose-700 underline cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              تلاش مجدد
            </button>
          </div>
        )}

        {formSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>مرکز با موفقیت در شبکه همکاران ثبت و برای شهروندان فعال شد.</span>
          </div>
        )}

        {/* 2-Column Grid: Form on Right, Existing List on Left */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Add Form (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm">
            <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-slate-100">
              <PlusCircle className="w-5 h-5 text-emerald-700" />
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                افزودن مرکز / کلینیک جدید
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  نام مجموعه یا کلینیک <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: کلینیک تخصصی دندانپزشکی فارابی"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  صنف و دسته‌بندی
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    تلفن تماس <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="۰۲۱-۸۸۸۸..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 dir-ltr text-right"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    پین صندوق‌دار (۴ رقم)
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={merchantPin}
                    onChange={(e) => setMerchantPin(e.target.value)}
                    placeholder="اختیاری (تولید خودکار)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono text-center tracking-widest"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  نشانی دقیق مرکز <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="خیابان، پلاک، طبقه و واحد..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 leading-relaxed"
                />
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                  <Tag className="w-3.5 h-3.5 text-emerald-700" />
                  <span>تنظیم بسته تخفیف اعضا</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      درصد تخفیف
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="5"
                        max="90"
                        value={discountPercent}
                        onChange={(e) => setDiscountPercent(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 text-center font-mono pl-7"
                      />
                      <Percent className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      سطح واجد شرایط
                    </label>
                    <select
                      value={requiredTier}
                      onChange={(e) => setRequiredTier(e.target.value as any)}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white"
                    >
                      <option value="STANDARD">همه اعضا (نقره‌ای)</option>
                      <option value="VIP">صرفاً نخبگان (طلایی VIP)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    شرایط و نکات استفاده
                  </label>
                  <input
                    type="text"
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={formSubmitting}
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3 rounded-2xl text-xs sm:text-sm shadow-sm transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {formSubmitting ? (
                  <span>در حال ثبت اطلاعات...</span>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    <span>ثبت نهایی و انتشار در باشگاه</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Existing Merchants List (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                مراکز و کلینیک‌های فعال طرف قرارداد ({toPersianDigits(businesses.length)})
              </h2>
              <button
                onClick={fetchMerchants}
                className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-bold cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                به‌روزرسانی لیست
              </button>
            </div>

            {loading ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 font-bold text-sm">
                در حال دریافت اطلاعات مراکز...
              </div>
            ) : businesses.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500 font-medium text-sm">
                هنوز هیچ مرکزی ثبت نشده است. اولین فروشگاه یا کلینیک را از فرم روبرو اضافه فرمایید.
              </div>
            ) : (
              <div className="space-y-4">
                {businesses.map((biz) => {
                  const offer = biz.offers?.[0];
                  return (
                    <div
                      key={biz.id}
                      className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-shadow space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-black text-slate-900 text-sm sm:text-base">
                              {biz.name}
                            </h3>
                            <span className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-slate-200">
                              {biz.category}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                            <span className="flex items-center gap-1 font-mono dir-ltr">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              {biz.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[240px]">{biz.address}</span>
                            </span>
                          </div>
                        </div>

                        {/* Merchant Secret PIN Badge */}
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-center shrink-0 flex sm:flex-col items-center justify-between sm:justify-center gap-2">
                          <div className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                            <KeyRound className="w-3 h-3 text-amber-600" />
                            <span>پین صندوق‌دار</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-sm sm:text-base font-black text-slate-900 tracking-wider">
                              {biz.merchantPin}
                            </span>
                            <button
                              onClick={() => copyPin(biz.id, biz.merchantPin)}
                              className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition"
                              title="کپی پین صندوق‌دار"
                            >
                              {copiedPinId === biz.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {offer && (
                        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-lg border border-emerald-200">
                              <Percent className="w-3 h-3" />
                              <span>{toPersianDigits(offer.discountPercent)}٪ تخفیف</span>
                            </span>
                            <span className="text-slate-600 font-medium">
                              {offer.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {offer.requiredTier === "VIP" ? (
                              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded-lg border border-amber-200 text-[11px]">
                                <Award className="w-3 h-3 text-amber-600" />
                                <span>مخصوص VIP</span>
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[11px]">همه اعضا</span>
                            )}
                            <span className="text-slate-400 text-[11px]">
                              مصرف: {toPersianDigits(offer._count?.redemptions || 0)} کوپن
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
