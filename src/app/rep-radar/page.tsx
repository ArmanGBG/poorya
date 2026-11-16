"use client";

import React, { useState, useEffect, useCallback } from "react";
import RadarSearchBar from "@/components/radar/RadarSearchBar";
import CategoryTiles from "@/components/radar/CategoryTiles";
import InsiderCard from "@/components/radar/InsiderCard";
import LogInteractionModal from "@/components/radar/LogInteractionModal";
import { OrganizationCategory } from "@prisma/client";
import {
  Compass,
  AlertTriangle,
  Users,
  SearchX,
  PhoneCall,
  ShieldCheck,
  RefreshCw,
  Award,
  Scale,
} from "lucide-react";
import { toPersianDigits } from "@/lib/utils";

export default function RepresentativeRadarPage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<OrganizationCategory | null>(null);
  const [insiders, setInsiders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [activeModalInsider, setActiveModalInsider] = useState<any | null>(null);

  // Fetch insiders from API
  const fetchInsiders = useCallback(async (searchQuery = "", category: string | null = null) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("q", searchQuery.trim());
      if (category) params.set("category", category);

      const res = await fetch(`/api/radar/search?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "خطا در دریافت اطلاعات نخبگان سازمانی");
      }

      setInsiders(data.results || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInsiders(query, selectedCategory);
    }, 200);

    return () => clearTimeout(timer);
  }, [query, selectedCategory, fetchInsiders]);

  // Compute category counts
  const categoryCounts = insiders.reduce((acc: Record<string, number>, curr: any) => {
    const cat = curr.organizationCategory;
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  // Executive KPI calculations
  const burnoutRiskCount = insiders.filter((i) => i.burnout?.isBurnoutRisk).length;
  const decisionMakersCount = insiders.filter((i) => i.influenceLevel === "DECISION_MAKER").length;
  const netReciprocity = insiders.reduce((sum: number, curr: any) => sum + (curr.favorBalance || 0), 0);

  // Handle interaction logged
  function handleInteractionSuccess(newLog: any, newBalance: number) {
    setInsiders((prev) =>
      prev.map((insider) => {
        if (insider.id === newLog.orgProfileId) {
          const updatedInteractions = [newLog, ...(insider.interactions || [])];
          const newCount = (insider.burnout?.countLast30Days || 0) + 1;
          return {
            ...insider,
            favorBalance: newBalance,
            interactions: updatedInteractions,
            burnout: {
              ...insider.burnout,
              countLast30Days: newCount,
              isBurnoutRisk: newCount > 2,
              message: "آخرین تماس: هم‌اکنون (پیگیری ثبت شد)",
            },
          };
        }
        return insider;
      })
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 text-right font-sans">
      <div className="max-w-7xl mx-auto space-y-7">
        {/* 1. Executive Command Center Banner - Institutional Civic Style */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1 rounded-full text-xs font-bold mb-3">
                <Compass className="w-4 h-4 text-emerald-700" />
                <span>مرکز پایش و رادار نخبگان حوزه‌های انتخابیه</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                رادار هوشمند نخبگان سازمانی (Grasstops CRM)
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-2xl leading-[1.65] font-medium">
                سامانه طبقه‌بندی مدیران و کارشناسان کلیدی ادارات و نهادها؛ جهت هدایت هوشمندانه مطالبات مردمی، پایش موازنه تعاملات و پیشگیری خودکار از سوزاندن مهره‌ها.
              </p>
            </div>

            {/* Executive Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-2.5 self-stretch lg:self-center shrink-0">
              <div className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200 text-center">
                <div className="text-xl sm:text-2xl font-black text-slate-900 font-fa-digits">
                  {toPersianDigits(insiders.length)}
                </div>
                <div className="text-[11px] text-slate-500 font-bold mt-0.5">کل رابطین</div>
              </div>

              <div className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200 text-center">
                <div className="text-xl sm:text-2xl font-black text-emerald-800 font-fa-digits">
                  {toPersianDigits(decisionMakersCount)}
                </div>
                <div className="text-[11px] text-slate-500 font-bold mt-0.5">مدیران تصمیم‌گیر</div>
              </div>

              <div className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200 text-center">
                <div className="text-xl sm:text-2xl font-black text-emerald-700 font-fa-digits">
                  {netReciprocity >= 0 ? `+${toPersianDigits(netReciprocity)}` : toPersianDigits(netReciprocity)}
                </div>
                <div className="text-[11px] text-slate-500 font-bold mt-0.5">تراز موازنه دفتر</div>
              </div>

              <div
                className={`px-4 py-3 rounded-2xl border text-center transition-all ${
                  burnoutRiskCount > 0
                    ? "bg-rose-50 border-rose-300 text-rose-800"
                    : "bg-slate-50 border-slate-200 text-slate-900"
                }`}
              >
                <div className="text-xl sm:text-2xl font-black font-fa-digits text-rose-700">
                  {toPersianDigits(burnoutRiskCount)}
                </div>
                <div className="text-[11px] font-bold mt-0.5">هشدار نسوزاندن</div>
              </div>
            </div>
          </div>
        </div>

      {/* 2. Instant Search Bar */}
      <div className="mb-6">
        <RadarSearchBar
          query={query}
          onChange={setQuery}
          onClear={() => setQuery("")}
          isLoading={loading}
          totalResults={insiders.length}
        />
      </div>

      {/* 3. Category Quick-Tiles */}
      <div className="mb-7">
        <CategoryTiles
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          categoryCounts={categoryCounts}
        />
      </div>

      {/* 4. Results Section */}
      <div>
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-bold mb-4 flex items-center justify-between shadow-xs">
            <span>{error}</span>
            <button
              onClick={() => fetchInsiders(query, selectedCategory)}
              className="text-xs bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer font-bold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              تلاش مجدد
            </button>
          </div>
        )}

        {loading && insiders.length === 0 ? (
          <div className="py-20 text-center text-slate-400 flex flex-col items-center justify-center">
            <RefreshCw className="w-9 h-9 animate-spin text-red-600 mb-3" />
            <span className="text-sm font-bold text-slate-700">در حال جستجو و پایش شبکه نخبگان سازمانی...</span>
          </div>
        ) : insiders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
            <SearchX className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-black text-slate-800">
              رابط سازمانی منطبق با عبارت جستجو یافت نشد
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              کلیدواژه دیگری وارد نموده یا فیلتر دسته‌بندی را به «همه حوزه‌ها» تغییر دهید.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {insiders.map((insider) => (
              <InsiderCard
                key={insider.id}
                insider={insider}
                onOpenLogModal={(ins) => setActiveModalInsider(ins)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 5. Quick Log Interaction Modal */}
      {activeModalInsider && (
        <LogInteractionModal
          insider={activeModalInsider}
          isOpen={Boolean(activeModalInsider)}
          onClose={() => setActiveModalInsider(null)}
          onSuccess={handleInteractionSuccess}
        />
      )}
      </div>
    </div>
  );
}
