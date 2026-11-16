"use client";

import React, { useState, useEffect } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  CreditCard,
  Tag,
  ShieldCheck,
  Users2,
  ScanLine,
  Award,
  LogIn,
  Menu,
  X,
  Building,
  ChevronLeft,
  LayoutDashboard,
  Store,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => {});
  }, [pathname]);

  const isRep = user?.role === "REPRESENTATIVE_VIP";
  const isVerifier = user?.role === "ADMIN_VERIFIER" || isRep;
  const isConnector = user?.role === "CONNECTOR" || isRep;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-17">
          {/* Logo & Civic Crest */}
          <div className="flex items-center gap-3">
            <NextLink href="/" className="flex items-center gap-3 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs group-hover:bg-slate-800 transition">
                <Building className="w-5 h-5 text-slate-100" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-slate-950 text-sm sm:text-base leading-tight tracking-tight flex items-center gap-1.5">
                  <span>باشگاه نخبگان و حامیان توسعه</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 hidden sm:inline-block" />
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  شبکه پیگیری مطالبات شهری و باشگاه خدمات رفاهی
                </span>
              </div>
            </NextLink>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 text-xs sm:text-sm font-bold">
            {/* MP's Radar (Exclusive) */}
            {isRep && (
              <NextLink
                href="/rep-radar"
                className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 cursor-pointer ${
                  pathname === "/rep-radar"
                    ? "bg-red-700 text-white shadow-md shadow-red-900/20"
                    : "bg-red-50 text-red-800 hover:bg-red-100/80 border border-red-200"
                }`}
              >
                <Compass className="w-4 h-4 animate-spin-slow text-red-200" />
                <span>رادار نخبگان سازمانی</span>
              </NextLink>
            )}

            {/* Secretariat Verifier */}
            {isVerifier && (
              <NextLink
                href="/admin/verify"
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                  pathname === "/admin/verify"
                    ? "bg-blue-700 text-white shadow-md shadow-blue-900/20"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>صف احراز هویت</span>
              </NextLink>
            )}

            {/* Connector */}
            {isConnector && (
              <NextLink
                href="/connector"
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                  pathname === "/connector"
                    ? "bg-emerald-700 text-white shadow-md shadow-emerald-900/20"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <Users2 className="w-4 h-4 text-emerald-600" />
                <span>پنل سرشاخه</span>
              </NextLink>
            )}

            {/* Admin Merchants Manager */}
            {(isVerifier || user?.role === "ADMIN_CLUB") && (
              <NextLink
                href="/admin/merchants"
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                  pathname === "/admin/merchants"
                    ? "bg-emerald-800 text-white shadow-md"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <Store className="w-4 h-4 text-emerald-700" />
                <span>مدیریت فروشگاه‌ها</span>
              </NextLink>
            )}

            {/* Common Member Links */}
            {user && (
              <NextLink
                href="/dashboard"
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                  pathname === "/dashboard"
                    ? "bg-slate-950 text-white shadow-md"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                <span>پیشخوان</span>
              </NextLink>
            )}

            <NextLink
              href="/dashboard/discounts"
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                pathname === "/dashboard/discounts"
                  ? "bg-slate-950 text-white shadow-md"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              <Tag className="w-4 h-4 text-amber-500" />
              <span>تخفیف‌های شهری</span>
            </NextLink>

            <NextLink
              href="/dashboard/card"
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                pathname === "/dashboard/card"
                  ? "bg-slate-950 text-white shadow-md"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              <CreditCard className="w-4 h-4 text-teal-600" />
              <span>کارت دیجیتال</span>
            </NextLink>

            <NextLink
              href="/verify-coupon"
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all duration-200 cursor-pointer text-xs ${
                pathname === "/verify-coupon"
                  ? "bg-indigo-700 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              <ScanLine className="w-3.5 h-3.5 text-indigo-500" />
              <span>پذیرندگان (بررسی کوپن)</span>
            </NextLink>
          </nav>

          {/* User Status / CTA */}
          <div className="flex items-center gap-2.5">
            {user ? (
              <div className="flex items-center gap-2">
                <NextLink
                  href="/dashboard"
                  className="flex items-center gap-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 py-1.5 px-3 rounded-xl transition cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {user.fullName ? user.fullName[0] : "ع"}
                  </div>
                  <div className="hidden sm:flex flex-col text-right">
                    <span className="text-xs font-bold text-slate-900 leading-none">
                      {user.fullName}
                    </span>
                    <span
                      className={`text-[10px] font-semibold mt-1 flex items-center gap-1 ${
                        user.tier === "VIP" ? "text-emerald-700" : "text-slate-500"
                      }`}
                    >
                      {user.tier === "VIP" ? (
                        <>
                          <Award className="w-3 h-3 text-emerald-600" />
                          <span>سطح نخبگان (VIP)</span>
                        </>
                      ) : (
                        <span>عضو شهروندی</span>
                      )}
                    </span>
                  </div>
                </NextLink>

                {user.tier !== "VIP" && (
                  <NextLink
                    href="/dashboard/upgrade-vip"
                    className="hidden sm:flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2 px-3.5 rounded-xl transition shadow-xs cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>ارتقا به کارگروه نخبگان</span>
                  </NextLink>
                )}
              </div>
            ) : (
              <NextLink
                href="/auth/login"
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold py-2.5 px-5 rounded-xl shadow-sm transition active:scale-98 cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-slate-200" />
                <span>ورود به سامانه</span>
              </NextLink>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-xl cursor-pointer"
              aria-label="منوی موبایل"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 text-sm font-bold animate-in slide-in-from-top-2">
          {isRep && (
            <NextLink
              href="/rep-radar"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-2xl bg-red-50 text-red-800 border border-red-200"
            >
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-red-600" />
                <span>رادار نخبگان سازمانی (داشبورد نماینده)</span>
              </div>
              <ChevronLeft className="w-4 h-4" />
            </NextLink>
          )}

          {isVerifier && (
            <NextLink
              href="/admin/verify"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 text-slate-800 border border-slate-100"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>صف احراز هویت دبیرخانه</span>
              </div>
              <ChevronLeft className="w-4 h-4 text-slate-400" />
            </NextLink>
          )}

          {isConnector && (
            <NextLink
              href="/connector"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 text-slate-800 border border-slate-100"
            >
              <div className="flex items-center gap-2">
                <Users2 className="w-4 h-4 text-emerald-600" />
                <span>پنل سرشاخه معتمد</span>
              </div>
              <ChevronLeft className="w-4 h-4 text-slate-400" />
            </NextLink>
          )}

          {(isVerifier || user?.role === "ADMIN_CLUB") && (
            <NextLink
              href="/admin/merchants"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 text-slate-800 border border-slate-100"
            >
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-emerald-700" />
                <span>مدیریت فروشگاه‌ها و مراکز همکار</span>
              </div>
              <ChevronLeft className="w-4 h-4 text-slate-400" />
            </NextLink>
          )}

          {user && (
            <NextLink
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/80 text-emerald-950 border border-emerald-200"
            >
              <div className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4 text-emerald-700" />
                <span>پیشخوان کاربری من</span>
              </div>
              <ChevronLeft className="w-4 h-4 text-emerald-600" />
            </NextLink>
          )}

          <NextLink
            href="/dashboard/discounts"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 text-slate-800 border border-slate-100"
          >
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-500" />
              <span>تخفیف‌های رفاهی باشگاه</span>
            </div>
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          </NextLink>

          <NextLink
            href="/dashboard/card"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 text-slate-800 border border-slate-100"
          >
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-teal-600" />
              <span>کارت دیجیتال عضویت</span>
            </div>
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          </NextLink>

          <NextLink
            href="/dashboard/upgrade-vip"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 text-emerald-950 border border-emerald-200"
          >
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-700" />
              <span>ارتقا به کارگروه نخبگان (VIP)</span>
            </div>
            <ChevronLeft className="w-4 h-4 text-emerald-700" />
          </NextLink>

          <NextLink
            href="/verify-coupon"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 text-slate-600 text-xs border border-slate-100"
          >
            <div className="flex items-center gap-2">
              <ScanLine className="w-4 h-4 text-indigo-500" />
              <span>اعتبارسنجی آفلاین کوپن در فروشگاه</span>
            </div>
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          </NextLink>
        </div>
      )}
    </header>
  );
}
