"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Tag,
  Award,
  MapPin,
  Phone,
  QrCode,
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building,
  Copy,
  Check,
  ChevronLeft,
} from "lucide-react";
import { toPersianDigits } from "@/lib/utils";

export default function DiscountsPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [tierFilter, setTierFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Redemption Modal state
  const [redeeming, setRedeeming] = useState(false);
  const [redemptionResult, setRedemptionResult] = useState<any | null>(null);
  const [errorModal, setErrorModal] = useState<string | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  useEffect(() => {
    fetchOffers();
  }, [tierFilter]);

  async function fetchOffers() {
    setLoading(true);
    try {
      const url = tierFilter ? `/api/discounts?tier=${tierFilter}` : "/api/discounts";
      const res = await fetch(url);
      const data = await res.json();
      setOffers(data.offers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRedeem(offerId: string) {
    setRedeeming(true);
    setErrorModal(null);
    try {
      const res = await fetch("/api/discounts/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offerId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "خطا در صدور کوپن تخفیف");
      }

      setRedemptionResult(data);
    } catch (err: any) {
      setErrorModal(err.message);
    } finally {
      setRedeeming(false);
    }
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 text-right font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Banner - Institutional Civic Style */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1 rounded-full text-xs font-bold mb-3">
                <Tag className="w-4 h-4 text-emerald-700" />
                <span>باشگاه خدمات رفاهی و تخفیف‌های شهری</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                مراکز، کلینیک‌ها و فروشگاه‌های همکار
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl leading-[1.65]">
                از کلینیک‌های دندانپزشکی و بیمارستان‌ها تا هتل‌ها، رستوران‌ها و مراکز ورزشی؛ با صدور و اعلام کد ۶ رقمی در باجه پرداخت، از تخفیفات آنی بهره‌مند شوید.
              </p>
            </div>

            {/* Tier Filters */}
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0">
              <button
                onClick={() => setTierFilter(null)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  tierFilter === null
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                همه تخفیف‌ها
              </button>
              <button
                onClick={() => setTierFilter("STANDARD")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  tierFilter === "STANDARD"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                سطح عمومی
              </button>
              <button
                onClick={() => setTierFilter("VIP")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  tierFilter === "VIP"
                    ? "bg-emerald-800 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>ویژه نخبگان (VIP)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Offers Grid */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center text-slate-400 font-bold">
            در حال بارگذاری تخفیف‌های مراکز...
          </div>
        ) : offers.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center shadow-sm">
            <p className="text-slate-600 text-sm font-bold">هیچ تخفیفی در این دسته یافت نشد.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => {
              const isVipOffer = offer.requiredTier === "VIP";
              return (
                <div
                  key={offer.id}
                  className={`bg-white rounded-3xl border overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between ${
                    isVipOffer ? "border-amber-300 ring-1 ring-amber-200/80" : "border-slate-200/90"
                  }`}
                >
                  <div>
                    {/* Business Image Banner */}
                    <div className="h-44 bg-slate-100 relative overflow-hidden">
                      <img
                        src={
                          offer.business.logoUrl ||
                          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80"
                        }
                        alt={offer.business.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                      {/* Discount badge */}
                      <div className="absolute top-3 left-3 bg-emerald-700 text-white font-black text-xs px-3 py-1 rounded-xl shadow-sm">
                        {toPersianDigits(offer.discountPercent)}٪ تخفیف
                      </div>

                      {/* Tier badge */}
                      <div className="absolute top-3 right-3">
                        {isVipOffer ? (
                          <span className="bg-amber-500 text-slate-950 font-black text-[11px] px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            <span>مخصوص VIP</span>
                          </span>
                        ) : (
                          <span className="bg-slate-900/80 backdrop-blur-xs text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                            سطح عمومی
                          </span>
                        )}
                      </div>

                      {/* Business Name */}
                      <div className="absolute bottom-3 right-3 left-3 text-white">
                        <span className="text-[11px] text-emerald-200 block font-bold mb-0.5">
                          {offer.business.category}
                        </span>
                        <h3 className="font-black text-base leading-tight">
                          {offer.business.name}
                        </h3>
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-5 sm:p-6 space-y-3">
                      <h4 className="font-black text-slate-900 text-sm leading-snug">
                        {offer.title}
                      </h4>

                      {offer.terms && (
                        <p className="text-xs text-slate-500 leading-relaxed font-normal">
                          شرایط استفاده: {offer.terms}
                        </p>
                      )}

                      <div className="space-y-1.5 text-xs text-slate-600 pt-3 border-t border-slate-100 font-medium">
                        <div className="flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span className="leading-tight text-[11px]">{offer.business.address}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="dir-ltr font-mono text-[11px] font-bold">{offer.business.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="p-5 sm:p-6 pt-0">
                    <button
                      onClick={() => handleRedeem(offer.id)}
                      disabled={redeeming}
                      className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3 px-4 rounded-2xl text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
                    >
                      <Tag className="w-4 h-4" />
                      <span>دریافت کوپن تخفیف آنی</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Redemption Modal */}
        {(redemptionResult || errorModal) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-right">
              {errorModal ? (
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center mb-4">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-black text-slate-900 text-center mb-2">
                    عدم امکان صدور کوپن
                  </h3>
                  <p className="text-xs text-slate-600 text-center leading-relaxed mb-6">
                    {errorModal}
                  </p>
                  <button
                    onClick={() => setErrorModal(null)}
                    className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer"
                  >
                    متوجه شدم
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-black text-slate-900">
                        کوپن تخفیف صادر شد
                      </h3>
                    </div>
                    <button
                      onClick={() => setRedemptionResult(null)}
                      className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    این کد ۶ رقمی را هنگام پرداخت صورت‌حساب به صندوق‌دار اعلام فرمایید:
                  </p>

                  {/* Verification Code Box */}
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-center">
                    <span className="text-[11px] text-slate-500 font-bold block mb-1">
                      کد اعتبارسنجی یک‌بارمصرف:
                    </span>
                    <div className="flex items-center justify-center gap-3">
                      <span className="font-mono text-2xl font-black text-emerald-800 tracking-widest dir-ltr">
                        {redemptionResult.redemption?.verificationCode}
                      </span>
                      <button
                        onClick={() => copyCode(redemptionResult.redemption?.verificationCode)}
                        className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                        title="کپی کد"
                      >
                        {codeCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3 text-xs text-emerald-950 font-medium space-y-1">
                    <p className="font-bold">مرکز همکار: {redemptionResult.business?.name}</p>
                    <p>درصد تخفیف: {toPersianDigits(redemptionResult.offer?.discountPercent)}٪</p>
                  </div>

                  <button
                    onClick={() => setRedemptionResult(null)}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-2xl text-xs sm:text-sm shadow-sm transition cursor-pointer"
                  >
                    بستن پنجره
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
