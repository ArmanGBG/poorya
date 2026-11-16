"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  KeyRound,
  CheckCircle2,
  LogOut,
  Landmark,
  ShieldCheck,
  Users2,
  Tag,
  Award,
  User,
  ChevronLeft,
} from "lucide-react";

interface RoleOption {
  role: string;
  label: string;
  title: string;
  phone: string;
  icon: any;
  colorClass: string;
}

const ROLES: RoleOption[] = [
  {
    role: "REPRESENTATIVE_VIP",
    label: "نماینده مجلس / رئیس دفتر",
    title: "دکتر حسین نوری",
    phone: "۰۹۱۲۱۱۱۱۱۱۱",
    icon: Landmark,
    colorClass: "from-red-600 to-rose-700 text-white shadow-red-900/30",
  },
  {
    role: "ADMIN_VERIFIER",
    label: "دبیرخانه و احراز هویت",
    title: "فاطمه معتمدی",
    phone: "۰۹۱۲۴۴۴۴۴۴۴",
    icon: ShieldCheck,
    colorClass: "from-blue-600 to-indigo-700 text-white shadow-blue-900/30",
  },
  {
    role: "CONNECTOR",
    label: "سرشاخه معتمد",
    title: "حاج قاسم نجفی",
    phone: "۰۹۱۲۳۳۳۳۳۳۳",
    icon: Users2,
    colorClass: "from-emerald-600 to-teal-700 text-white shadow-emerald-900/30",
  },
  {
    role: "ADMIN_CLUB",
    label: "ادمین باشگاه تخفیفات",
    title: "کامران فرهمند",
    phone: "۰۹۱۲۵۵۵۵۵۵۵",
    icon: Tag,
    colorClass: "from-amber-600 to-yellow-700 text-white shadow-amber-900/30",
  },
  {
    role: "MEMBER_VIP",
    label: "عضو ویژه (رابط سازمانی)",
    title: "دکتر جواد کاظمی",
    phone: "۰۹۱۲۶۶۶۶۶۶۶",
    icon: Award,
    colorClass: "from-purple-600 to-violet-700 text-white shadow-purple-900/30",
  },
  {
    role: "MEMBER_PUBLIC",
    label: "عضو عادی باشگاه",
    title: "علی اکبری",
    phone: "۰۹۱۲۰۰۰۰۰۰۱",
    icon: User,
    colorClass: "from-slate-700 to-slate-800 text-white shadow-slate-900/30",
  },
];

export default function DevRoleSwitcher() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(true); // Default to collapsed so preview is clean

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // Do not render in production deployment
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  async function fetchCurrentUser() {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.user) {
        setCurrentUser(data.user);
        setActiveRole(data.user.role);
      } else {
        setCurrentUser(null);
        setActiveRole(null);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function switchRole(roleKey: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/switch-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: roleKey }),
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
        setActiveRole(data.user.role);
        if (data.redirectTo) {
          router.push(data.redirectTo);
          router.refresh();
        } else {
          router.refresh();
        }
      } else {
        alert(data.error || "خطا در تغییر نقش");
      }
    } catch (err) {
      alert("خطا در برقراری ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setCurrentUser(null);
      setActiveRole(null);
      router.push("/auth/login");
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  }

  if (isCollapsed) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={() => setIsCollapsed(false)}
          className="bg-slate-950/90 hover:bg-slate-900 text-amber-400 border border-amber-500/30 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-2xl backdrop-blur-md flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
          title="باز کردن داک تست نقش‌های امنیتی"
        >
          <KeyRound className="w-3.5 h-3.5 animate-pulse" />
          <span>تغییر نقش تستی ({currentUser ? currentUser.role : "مهمان"})</span>
          <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded-full">▲</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 text-slate-100 text-xs py-2 px-4 shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Active User Pill */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20 shadow-inner">
            <KeyRound className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="hidden sm:inline">داک نقش‌های امنیتی</span>
          </div>

          {currentUser ? (
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1 rounded-xl text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold text-white text-[11px] sm:text-xs">
                {currentUser.fullName}
              </span>
              <span className="text-[10px] text-slate-400 hidden md:inline">
                ({currentUser.phone})
              </span>
              <span className="bg-slate-800 text-amber-300 px-2 py-0.5 rounded-lg text-[10px] font-mono border border-slate-700">
                {currentUser.role}
              </span>
            </div>
          ) : (
            <span className="text-slate-500 text-xs mr-2">بدون نشست کاربری</span>
          )}
        </div>

        {/* Right: Interactive Role Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-400 text-[11px] ml-1 hidden lg:inline">سوئیچ آنی:</span>
          {ROLES.map((r) => {
            const isCurrent = activeRole === r.role;
            const Icon = r.icon;
            return (
              <button
                key={r.role}
                onClick={() => switchRole(r.role)}
                disabled={loading}
                title={`${r.title} (${r.phone})`}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer border ${
                  isCurrent
                    ? `bg-gradient-to-r ${r.colorClass} border-white/30 shadow-lg scale-102 ring-2 ring-white/20`
                    : "bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isCurrent ? "text-white" : "text-slate-400"}`} />
                <span>{r.label}</span>
                {isCurrent && <CheckCircle2 className="w-3 h-3 text-white mr-0.5" />}
              </button>
            );
          })}

          {currentUser && (
            <button
              onClick={handleLogout}
              className="mr-2 px-2.5 py-1.5 bg-red-950/80 hover:bg-red-900 border border-red-800/80 text-red-200 rounded-xl text-[11px] font-bold flex items-center gap-1 transition cursor-pointer active:scale-95"
              title="خروج از حساب"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج</span>
            </button>
          )}

          <button
            onClick={() => setIsCollapsed(true)}
            className="mr-2 px-2 py-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-[10px] font-bold cursor-pointer"
            title="بستن داک تستی"
          >
            ✕ بستن
          </button>
        </div>
      </div>
    </div>
  );
}
