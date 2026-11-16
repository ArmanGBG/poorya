"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Tag,
  Building,
  ArrowLeft,
  Award,
  Users2,
  ShieldCheck,
  FileCheck2,
  CheckCircle2,
  Landmark,
  Compass,
  ScanLine,
  ChevronLeft,
  Lightbulb,
  Clock,
  QrCode,
  LogOut,
} from "lucide-react";

export default function DashboardHubPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        router.push("/auth/login?redirect=/dashboard");
      });
  }, [router]);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch {
      router.push("/");
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Building className="w-6 h-6 text-slate-700" />
        </div>
        <p className="text-slate-600 text-sm font-bold">در حال بارگذاری پیشخوان کاربری...</p>
      </div>
    );
  }

  const isVip = user?.tier === "VIP";
  const isRep = user?.role === "REPRESENTATIVE_VIP";
  const isVerifier = user?.role === "ADMIN_VERIFIER" || isRep;
  const isConnector = user?.role === "CONNECTOR" || isRep;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-right">
      
      {/* 1. Welcome & Status Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-sm mb-8 border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-3.5 py-1 rounded-full text-xs font-bold text-slate-200">
              <Landmark className="w-3.5 h-3.5 text-emerald-400" />
              <span>پیشخوان حامیان و نخبگان توسعه شهری</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white">
              سلام، {user?.fullName || "عضو گرامی باشگاه"}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-normal max-w-xl leading-relaxed">
              به باشگاه متخصصین، نخبگان و حامیان شهری (تحت اشراف دکتر حسین نوری) خوش آمدید. کارت خدمات رفاهی و پنل‌های مشورتی شما در دسترس است.
            </p>
          </div>

          {/* Membership Tier Badge & Fast Action */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="bg-white/10 border border-white/15 rounded-2xl p-4 text-center sm:text-right">
              <span className="text-[11px] text-slate-400 block mb-1">سطح عضویت فعال:</span>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold shadow-xs ${
                    isVip
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-800 text-slate-200"
                  }`}
                >
                  {isVip ? <Award className="w-3.5 h-3.5" /> : <CreditCard className="w-3.5 h-3.5" />}
                  <span>{isVip ? "کارت طلایی نخبگان (VIP)" : "کارت نقره‌ای شهروندی"}</span>
                </span>
                <span className="text-xs text-slate-300 font-mono font-bold dir-ltr">
                  {user?.phone}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="bg-white/10 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-white/10 p-3 rounded-2xl transition cursor-pointer"
              title="خروج از حساب"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Primary Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Card 1: Digital Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-5 group-hover:scale-110 transition border border-teal-200/60">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-950 mb-2">
              کارت هوشمند دیجیتال
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              مشاهده کارت دیجیتال، بارکد اختصاصی و شناسه یکتای عضویت جهت ارائه در باجه پذیرش مراکز همکار.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              href="/dashboard/card"
              className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition flex items-center justify-between"
            >
              <span>مشاهده و نمایش کارت</span>
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Card 2: Discounts & Welfare */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 group-hover:scale-110 transition border border-amber-200/60">
              <Tag className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-950 mb-2">
              تخفیف‌های شهری و رفاهی
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              دریافت کدهای تخفیف کلینیک‌ها، استخرها، رستوران‌ها، هتل‌ها و فروشگاه‌های معتبر شهر.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              href="/dashboard/discounts"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs py-2.5 px-4 rounded-xl transition flex items-center justify-between"
            >
              <span>کاتالوگ مراکز تخفیف‌دار</span>
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Card 3: Elite Committee Upgrade */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 group-hover:scale-110 transition border border-indigo-200/60">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-950 mb-2">
              کارگروه‌های تخصصی نخبگان
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {isVip
                ? "شما عضو کارگروه نخبگان هستید و سقف ۵۰٪ تخفیف و جلسات مشورتی با نماینده برای شما فعال است."
                : "ثبت سمت سازمانی و اداره محل خدمت جهت ارتقا به کارت طلایی VIP و عضویت در کارگروه‌ها."}
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              href="/dashboard/upgrade-vip"
              className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition flex items-center justify-between"
            >
              <span>{isVip ? "مشاهده پرونده سازمانی" : "ارتقا به کارت طلایی (VIP)"}</span>
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>

      {/* 3. Administrative / Staff Desks (Role-based Contextual) */}
      {(isRep || isVerifier || isConnector) && (
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-10 border border-slate-800">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-black text-white">
              میزهای تخصصی و اداری دسترسی شما
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {isRep && (
              <Link
                href="/rep-radar"
                className="bg-red-950/60 hover:bg-red-900/60 border border-red-500/30 rounded-2xl p-4 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600/30 text-red-300 flex items-center justify-center">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">رادار نخبگان (CRM)</h4>
                    <p className="text-[11px] text-red-200/70 mt-0.5">پایش مدیران و ارتباطات</p>
                  </div>
                </div>
              </Link>
            )}

            {isVerifier && (
              <Link
                href="/admin/verify"
                className="bg-blue-950/60 hover:bg-blue-900/60 border border-blue-500/30 rounded-2xl p-4 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-blue-300 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">صف احراز هویت</h4>
                    <p className="text-[11px] text-blue-200/70 mt-0.5">بررسی مدارک و استعلام</p>
                  </div>
                </div>
              </Link>
            )}

            {isConnector && (
              <Link
                href="/connector"
                className="bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 rounded-2xl p-4 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/30 text-emerald-300 flex items-center justify-center">
                    <Users2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">پنل سرشاخه</h4>
                    <p className="text-[11px] text-emerald-200/70 mt-0.5">تایید همکاران امین</p>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* 4. Direct Idea & Problem Box Desk */}
      <div className="bg-gradient-to-br from-white via-slate-50 to-amber-50/30 rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-bold">
              <Lightbulb className="w-3.5 h-3.5 text-amber-700" />
              <span>میز ارتباط مستقیم با دکتر حسین نوری</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-950">
              پیشنهاد، ایده یا گزارش مانع اداری دارید؟
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              پیام‌های اعضای باشگاه مستقیماً در دبیرخانه کارگروه‌های تخصصی ثبت شده و گزارش‌های جمع‌بندی به منظور اقدام قانونی در مجلس شورای اسلامی به رویت نماینده می‌رسد.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 shrink-0 text-center sm:text-right">
            <span className="text-xs font-bold text-slate-700 block">خط مستقیم ارتباطی دبیرخانه:</span>
            <span className="text-base font-black text-amber-600 font-fa-digits dir-ltr block">
              ۰۲۱-۶۴۴۵۱۱۱۱
            </span>
            <span className="text-[11px] text-slate-400 block font-fa-digits">
              شنبه تا چهارشنبه ۸:۳۰ الی ۱۶:۰۰
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
