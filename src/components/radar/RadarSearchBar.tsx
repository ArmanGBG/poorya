"use client";

import React from "react";
import { Search, X, Command } from "lucide-react";

interface RadarSearchBarProps {
  query: string;
  onChange: (val: string) => void;
  onClear: () => void;
  isLoading: boolean;
  totalResults: number;
}

const QUICK_FILTERS = ["مالیات", "بانک ملی", "شهرداری", "ماده ۱۰۰", "علوم پزشکی", "ثبت اسناد"];

export default function RadarSearchBar({
  query,
  onChange,
  onClear,
  isLoading,
  totalResults,
}: RadarSearchBarProps) {
  return (
    <div className="w-full space-y-2.5">
      <div className="relative flex items-center glass-surface rounded-2xl shadow-sm border border-slate-300/80 focus-within:border-red-600 focus-within:ring-4 focus-within:ring-red-500/10 transition-all duration-200">
        <div className="absolute right-4 text-slate-400 pointer-events-none flex items-center">
          <Search className="w-5 h-5 text-slate-600" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder="جستجوی فوری در میان نخبگان: «مالیات»، «بانک ملی»، «شهرداری»، «ماده صد»، «دکتر کاظمی»..."
          className="w-full pr-12 pl-36 py-4 text-sm sm:text-base font-bold bg-transparent text-slate-900 outline-none placeholder:text-slate-400 placeholder:font-normal"
          autoFocus
        />

        <div className="absolute left-3 flex items-center gap-2">
          {query && (
            <button
              onClick={onClear}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              title="پاک کردن جستجو"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="bg-slate-900 text-white text-xs font-black px-3.5 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5">
            {isLoading ? (
              <span className="flex items-center gap-1.5 text-amber-300">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>پایش...</span>
              </span>
            ) : (
              <span>{totalResults} رابط فعال</span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Search Tags */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-slate-500 text-[11px] font-bold ml-1">پیشنهادات جستجو:</span>
        {QUICK_FILTERS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => onChange(tag)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition cursor-pointer border ${
              query === tag
                ? "bg-red-700 text-white border-red-800 shadow-sm"
                : "bg-white/80 hover:bg-white text-slate-700 border-slate-200 hover:border-slate-300 shadow-xs"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
