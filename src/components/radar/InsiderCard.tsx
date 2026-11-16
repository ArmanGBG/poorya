"use client";

import React, { useState } from "react";
import {
  Phone,
  Building,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  FileText,
  PhoneCall,
  Scale,
  Shield,
  History,
  Lock,
} from "lucide-react";
import {
  formatJalaliDate,
  formatRelativePersian,
  INFLUENCE_META,
  INTIMACY_META,
  toPersianDigits,
} from "@/lib/utils";

interface InsiderCardProps {
  insider: any;
  onOpenLogModal: (insider: any) => void;
}

export default function InsiderCard({ insider, onOpenLogModal }: InsiderCardProps) {
  const [showNotes, setShowNotes] = useState(false);
  const [showInteractions, setShowInteractions] = useState(false);

  const influence = INFLUENCE_META[insider.influenceLevel] || INFLUENCE_META.INFORMED_STAFF;
  const intimacy = INTIMACY_META[insider.intimacyLevel] || INTIMACY_META.SUPPORTER;
  const burnout = insider.burnout;

  // Reciprocity status
  const favor = insider.favorBalance || 0;
  let favorBadge = {
    text: "بی‌حساب (موازنه متعادل)",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  };
  if (favor > 0) {
    favorBadge = {
      text: `دفتر برایش کار کرده (+${toPersianDigits(favor)}) / بدهکار به دفتر`,
      className: "bg-blue-50 text-blue-800 border-blue-200 font-bold",
    };
  } else if (favor < 0) {
    favorBadge = {
      text: `برای دفتر کار راه انداخته (${toPersianDigits(favor)}) / دفتر به او مدیون است`,
      className: "bg-amber-50 text-amber-900 border-amber-300 font-bold",
    };
  }

  return (
    <div
      className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 ${
        burnout.isBurnoutRisk
          ? "border-red-500 ring-2 ring-red-100 burnout-alert-glow"
          : "border-slate-200/90 hover:border-slate-300"
      }`}
    >
      {/* 1. Burnout Alert Bar (هشدار نسوزاندن مهره) */}
      {burnout.isBurnoutRisk ? (
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white px-5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold shadow-inner">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-amber-200 animate-bounce" />
            </span>
            <div>
              <span className="text-amber-200 font-black">هشدار نسوزاندن مهره: </span>
              <span>بیش از ۲ تماس در ۳۰ روز اخیر ({toPersianDigits(burnout.countLast30Days)} تماس ثبت شده)</span>
            </div>
          </div>
          <span className="text-[11px] bg-red-950/70 text-red-100 px-3 py-1 rounded-full border border-red-400/30 self-start sm:self-auto">
            برای امور غیرضروری تماس گرفته نشود!
          </span>
        </div>
      ) : (
        <div className="bg-slate-50 border-b border-slate-100 px-5 py-2 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{burnout.message}</span>
          </div>
          <span className="text-emerald-700 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>آماده پیگیری مطالبات</span>
          </span>
        </div>
      )}

      {/* 2. Main Profile Header */}
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            {/* Identity & Department */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                {insider.fullName}
              </h3>
              {!insider.isPrimary && (
                <span className="text-[10px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-bold border border-slate-200">
                  سمت تکمیلی
                </span>
              )}
              {insider.neighborhood && (
                <span className="text-xs text-slate-400 font-normal">
                  (ساکن {insider.neighborhood})
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-slate-800 font-black text-sm mb-1.5">
              <span className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700 shrink-0">
                <Building className="w-4 h-4" />
              </span>
              <span>{insider.organizationName}</span>
            </div>

            <div className="text-xs text-slate-600 pr-8 space-y-0.5">
              <div>
                <span className="font-bold text-slate-700">{insider.customDepartment}:</span>{" "}
                <span className="font-medium">{insider.jobTitle}</span>
              </div>
              {insider.officeDirectPhone && (
                <div className="text-[11px] text-slate-500 pt-0.5 flex items-center gap-1">
                  <span>تلفن مستقیم یا داخلی اداره:</span>
                  <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                    {insider.officeDirectPhone}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Badges Column */}
          <div className="flex flex-wrap sm:flex-col items-end gap-1.5 shrink-0">
            <span
              className={`text-xs px-3 py-1 rounded-xl border font-bold flex items-center gap-1.5 shadow-2xs ${influence.badgeClass}`}
            >
              <span className={`w-2 h-2 rounded-full ${influence.iconColor.replace("text-", "bg-")}`} />
              {influence.label}
            </span>

            <span
              className={`text-xs px-3 py-1 rounded-xl border font-medium ${intimacy.badgeClass}`}
            >
              {intimacy.label}
            </span>

            <span
              className={`text-[11px] px-2.5 py-1 rounded-xl border ${favorBadge.className}`}
              title="موازنه خدمات متقابل نماینده و رابط"
            >
              {favorBadge.text}
            </span>
          </div>
        </div>

        {/* 3. Action Toolbar */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Direct Mobile Call */}
            <a
              href={`tel:${insider.phone}`}
              className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-emerald-200" />
              <span>تماس مستقیم: {insider.phone}</span>
            </a>

            {/* Quick Log Modal Button */}
            <button
              onClick={() => onOpenLogModal(insider)}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>ثبت لاگ تماس جدید</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {insider.secretAdminNotes && (
              <button
                onClick={() => setShowNotes(!showNotes)}
                className="text-xs text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 py-1.5 px-3 rounded-xl flex items-center gap-1.5 transition cursor-pointer font-bold"
              >
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>نکات محرمانه</span>
                {showNotes ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            )}

            <button
              onClick={() => setShowInteractions(!showInteractions)}
              className="text-xs text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 py-1.5 px-3 rounded-xl flex items-center gap-1.5 transition cursor-pointer font-bold"
            >
              <History className="w-3.5 h-3.5 text-slate-500" />
              <span>سابقه پیگیری ({toPersianDigits(insider.interactions?.length || 0)})</span>
              {showInteractions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* 4. Secret CRM Notes Accordion */}
        {showNotes && insider.secretAdminNotes && (
          <div className="mt-4 p-4 bg-amber-50/90 border border-amber-200/90 rounded-2xl text-xs text-amber-950 leading-relaxed shadow-inner">
            <div className="font-black mb-1.5 flex items-center gap-1.5 text-amber-900">
              <FileText className="w-4 h-4 text-amber-700" />
              <span>نکات روحیات و نحوه ارتباط (محرمانه دفتر نماینده):</span>
            </div>
            <p className="text-slate-800 leading-relaxed font-medium">{insider.secretAdminNotes}</p>
          </div>
        )}

        {/* 5. Interactions History Accordion */}
        {showInteractions && (
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
            <span className="text-xs font-black text-slate-800 block">
              تاریخچه تماس‌ها و تعاملات اخیر:
            </span>
            {insider.interactions && insider.interactions.length > 0 ? (
              insider.interactions.map((log: any) => (
                <div
                  key={log.id}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900">{log.subject}</span>
                    <span className="text-slate-400 text-[11px] font-medium">
                      {formatRelativePersian(log.createdAt)} ({formatJalaliDate(log.createdAt)})
                    </span>
                  </div>
                  {log.notes && <p className="text-slate-600 font-normal">{log.notes}</p>}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-200/60">
                    <span>ثبت‌کننده: {log.loggedByUser?.fullName || "نماینده / دفتر"}</span>
                    <span
                      className={`font-black px-2 py-0.5 rounded-md ${
                        log.outcome === "RESOLVED"
                          ? "bg-emerald-100 text-emerald-800"
                          : log.outcome === "IN_PROGRESS"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {log.outcome === "RESOLVED"
                        ? "حل شد"
                        : log.outcome === "IN_PROGRESS"
                        ? "در جریان پیگیری"
                        : "ناموفق"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <span className="text-xs text-slate-400 block py-2">هنوز تماسی ثبت نشده است.</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
