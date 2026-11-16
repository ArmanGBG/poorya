"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CreditCard,
  Award,
  QrCode,
  Tag,
  CheckCircle2,
  Shield,
  Share2,
  Stethoscope,
  UtensilsCrossed,
  Dumbbell,
  Landmark,
  Cpu,
} from "lucide-react";
import { toPersianDigits, formatJalaliDate } from "@/lib/utils";

export default function DigitalCardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const isVip = user?.tier === "VIP";
  const membershipNumber = user ? `NGN-${user.phone.slice(-4)}-${user.id.slice(0, 4).toUpperCase()}` : "NGN-9821-2024";

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 text-right font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1 rounded-full text-xs font-bold mb-2">
            <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
            <span>کارت هوشمند هویت شهروندی و خدمات رفاهی</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
            کارت عضویت دیجیتال باشگاه نخبگان
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            جهت برخورداری از تخفیفات نقدی، خدمات درمانی و تسهیلات در تمامی مراکز همکار
          </p>
        </div>

        {/* The Prestige Card Container */}
        <div className="max-w-md mx-auto">
          <div
            className={`relative rounded-3xl p-7 sm:p-8 shadow-2xl transition-all duration-300 overflow-hidden text-white group hover:scale-[1.02] cursor-default ${
              isVip
                ? "bg-gradient-to-tr from-emerald-950 via-slate-900 to-teal-900 border-2 border-amber-400/80 shadow-emerald-950/20"
                : "bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-800 border-2 border-slate-700 shadow-slate-950/20"
            }`}
          >
            {/* Card Decorative Waves */}
            <div className="absolute -left-16 -top-16 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -right-16 -bottom-16 w-56 h-56 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Row: Brand & Chip */}
            <div className="flex items-center justify-between relative z-10 mb-8">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-amber-300 border border-white/20 shadow-inner">
                  <Shield className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <span className="block font-black text-sm tracking-tight drop-shadow-sm">
                    باشگاه نخبگان و حامیان توسعه
                  </span>
                  <span className="block text-[10px] text-white/70">
                    شبکه متخصصین و حامیان توسعه شهری
                  </span>
                </div>
              </div>

            {/* Chip Icon */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-7 rounded-md bg-gradient-to-tr from-yellow-300 to-amber-500 p-0.5 shadow-sm opacity-90 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-amber-950" />
              </div>
            </div>
          </div>

          {/* Center: Member Info & QR */}
          <div className="flex items-center justify-between relative z-10 mb-8">
            <div className="flex-1">
              <span className="text-[11px] text-white/70 block mb-1">نام دارنده کارت:</span>
              <span className="text-xl sm:text-2xl font-black tracking-tight block drop-shadow-sm">
                {user ? user.fullName : "عضو محترم باشگاه"}
              </span>
              <span className="text-xs text-amber-200/90 block mt-1.5 dir-ltr font-mono font-bold tracking-wider">
                {user ? user.phone : "۰۹۱۲ ۰۰۰ ۰۰۰۰"}
              </span>

              <div className="mt-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black shadow-md ${
                    isVip
                      ? "bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-400 text-amber-950"
                      : "bg-slate-200 text-slate-900"
                  }`}
                >
                  {isVip && <Award className="w-3.5 h-3.5 text-amber-950" />}
                  <span>{isVip ? "کارت طلایی نخبگان (VIP)" : "کارت نقره‌ای شهروندی"}</span>
                </span>
              </div>
            </div>

            {/* Simulated Smart QR Code */}
            <div className="bg-white p-2.5 rounded-2xl shadow-xl shrink-0 mr-4 border border-white/30">
              <div className="w-20 h-20 bg-slate-950 rounded-xl p-1 flex flex-col items-center justify-center">
                <QrCode className="w-14 h-14 text-white" />
                <span className="text-[8px] text-slate-300 font-mono mt-0.5">SCAN & VERIFY</span>
              </div>
            </div>
          </div>

          {/* Bottom Card Footer */}
          <div className="flex items-center justify-between relative z-10 pt-4 border-t border-white/20 text-xs">
            <div>
              <span className="text-[10px] text-white/60 block">شناسه اختصاصی:</span>
              <span className="font-mono font-bold tracking-widest text-sm text-white/95">
                {membershipNumber}
              </span>
            </div>

            <div className="text-left">
              <span className="text-[10px] text-white/60 block">تاریخ صدور:</span>
              <span className="font-bold text-xs text-white/90">
                {user ? formatJalaliDate(user.createdAt) : "۱۴۰۳/۰۸/۰۱"}
              </span>
            </div>
          </div>
        </div>

        {/* Upgrade Banner for Standard Members */}
        {!isVip && (
          <div className="mt-6 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-300/80 rounded-3xl p-6 text-amber-950 shadow-sm text-right">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-black text-sm sm:text-base">
                  ارتقا به کارت طلایی نخبگان (VIP) ویژه کارکنان و متخصصین
                </h4>
                <p className="text-xs text-amber-900 mt-1.5 leading-relaxed font-medium">
                  آیا کارمند ادارات، بانک‌ها، کادر درمان یا متخصص هستید؟ با ثبت مشخصات شغلی، کارت خود را طلایی کنید و تا ۵۰٪ تخفیف اختصاصی در مراکز رفاهی دریافت نمایید.
                </p>
                <div className="mt-4">
                  <Link
                    href="/dashboard/upgrade-vip"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <span>تکمیل اطلاعات شغلی و دریافت کارت VIP</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard/discounts"
            className="flex-1 bg-slate-950 hover:bg-slate-800 text-white font-bold text-sm py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <Tag className="w-4 h-4 text-amber-400" />
            <span>مشاهده و دریافت تخفیف‌های مراکز</span>
          </Link>

          <Link
            href="/dashboard"
            className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-sm py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <span>بازگشت به پیشخوان خدمات</span>
          </Link>
        </div>

        {/* Perks Grid */}
        <div className="mt-10 pt-8 border-t border-slate-200">
          <h3 className="text-sm font-black text-slate-900 mb-4 text-center">
            مزایای عضویت در باشگاه شهروندی نگین
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <Stethoscope className="w-6 h-6 text-cyan-600 mx-auto mb-2" />
              <span className="block text-xs font-bold text-slate-800">مراکز درمانی</span>
              <span className="text-[10px] text-slate-400">تا ۴۵٪ تخفیف دندانپزشکی</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <UtensilsCrossed className="w-6 h-6 text-amber-600 mx-auto mb-2" />
              <span className="block text-xs font-bold text-slate-800">رستوران‌ها</span>
              <span className="text-[10px] text-slate-400">تا ۳۵٪ تخفیف فاکتور</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <Dumbbell className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
              <span className="block text-xs font-bold text-slate-800">مجموعه ورزشی</span>
              <span className="text-[10px] text-slate-400">تا ۵۰٪ تخفیف استخر</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <Landmark className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
              <span className="block text-xs font-bold text-slate-800">تسهیلات بانکی</span>
              <span className="text-[10px] text-slate-400">مشاوره اختصاصی وام</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
