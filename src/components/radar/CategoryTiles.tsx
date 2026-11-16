"use client";

import React from "react";
import {
  Landmark,
  Building2,
  Compass,
  Stethoscope,
  Scale,
  Store,
  Briefcase,
  Layers,
} from "lucide-react";
import { OrganizationCategory } from "@prisma/client";

interface CategoryTilesProps {
  selectedCategory: OrganizationCategory | null;
  onSelectCategory: (cat: OrganizationCategory | null) => void;
  categoryCounts: Record<string, number>;
}

const CATEGORIES = [
  {
    key: null,
    label: "همه حوزه‌ها",
    icon: Layers,
    color: "from-slate-800 to-slate-950 text-white shadow-slate-950/20",
  },
  {
    key: "GOVERNMENT_OFFICE" as OrganizationCategory,
    label: "ادارات دولتی (دارایی/ثبت)",
    icon: Building2,
    color: "from-blue-700 to-indigo-950 text-white shadow-blue-950/20",
  },
  {
    key: "BANK" as OrganizationCategory,
    label: "بانک‌ها و تسهیلات",
    icon: Landmark,
    color: "from-emerald-700 to-teal-950 text-white shadow-emerald-950/20",
  },
  {
    key: "MUNICIPALITY" as OrganizationCategory,
    label: "شهرداری و ماده ۱۰۰",
    icon: Compass,
    color: "from-amber-600 to-orange-950 text-white shadow-orange-950/20",
  },
  {
    key: "HOSPITAL_UNIVERSITY" as OrganizationCategory,
    label: "دانشگاه و کادر درمان",
    icon: Stethoscope,
    color: "from-cyan-700 to-sky-950 text-white shadow-sky-950/20",
  },
  {
    key: "JUDICIARY_LAW" as OrganizationCategory,
    label: "قضایی و حل اختلاف",
    icon: Scale,
    color: "from-purple-700 to-violet-950 text-white shadow-purple-950/20",
  },
  {
    key: "GUILD_UNION" as OrganizationCategory,
    label: "اصناف و بازار",
    icon: Store,
    color: "from-rose-700 to-pink-950 text-white shadow-rose-950/20",
  },
  {
    key: "PRIVATE_COMPANY" as OrganizationCategory,
    label: "صنایع و دانش‌بنیان",
    icon: Briefcase,
    color: "from-slate-700 to-zinc-950 text-white shadow-zinc-950/20",
  },
];

export default function CategoryTiles({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}: CategoryTilesProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 w-full">
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.key;
        const Icon = cat.icon;
        const count = cat.key ? categoryCounts[cat.key] || 0 : Object.values(categoryCounts).reduce((a, b) => a + b, 0);

        return (
          <button
            key={cat.key || "all"}
            onClick={() => onSelectCategory(cat.key)}
            className={`p-3 rounded-2xl flex flex-col items-center justify-between gap-2.5 text-center transition-all duration-200 cursor-pointer ${
              isSelected
                ? `bg-gradient-to-b ${cat.color} ring-4 ring-slate-900/10 shadow-lg scale-102 font-bold`
                : "bg-white/90 hover:bg-white text-slate-700 border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md hover:-translate-y-0.5"
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span
                className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                  isSelected ? "bg-white/20 text-white shadow-inner" : "bg-slate-100 text-slate-700"
                }`}
              >
                <Icon className="w-4 h-4" />
              </span>

              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-black ${
                  isSelected
                    ? "bg-white text-slate-950 shadow-sm"
                    : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                {count}
              </span>
            </div>

            <span
              className={`text-[11px] sm:text-xs leading-tight line-clamp-1 ${
                isSelected ? "text-white" : "text-slate-800 font-bold"
              }`}
            >
              {cat.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
