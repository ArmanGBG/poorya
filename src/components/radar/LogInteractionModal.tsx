"use client";

import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  Clock,
  XCircle,
  PhoneCall,
  HeartHandshake,
  HelpCircle,
  MessageSquare,
} from "lucide-react";

interface LogInteractionModalProps {
  insider: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedLog: any, newBalance: number) => void;
}

const QUICK_SUBJECTS = [
  "پیگیری تسهیلات ضروری درمان/ازدواج",
  "استعلام پرونده ماده ۱۰۰ شهرسازی",
  "استمهال بدهی و بخشودگی جرایم مالیاتی",
  "حل مشکل تسویه حساب تامین اجتماعی",
  "تبریک مناسبتی و احوالپرسی صمیمانه",
];

export default function LogInteractionModal({
  insider,
  isOpen,
  onClose,
  onSuccess,
}: LogInteractionModalProps) {
  if (!isOpen || !insider) return null;

  const [subject, setSubject] = useState("");
  const [type, setType] = useState<string>("REQUESTED_FAVOR_FROM_USER");
  const [outcome, setOutcome] = useState<string>("RESOLVED");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim()) {
      setError("لطفاً موضوع پیگیری را مشخص کنید.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/radar/interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orgProfileId: insider.id,
          subject: subject.trim(),
          type,
          outcome,
          notes: notes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "خطا در ثبت لاگ تماس");
      }

      onSuccess(data.log, data.newFavorBalance);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-right overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-red-700 font-bold mb-0.5">
              <Clock className="w-3.5 h-3.5" />
              <span>لاگ تماس محرمانه دفتر</span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-950">
              ثبت سریع تعامل و پیگیری
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              رابط: <span className="font-bold text-slate-900">{insider.fullName}</span> (
              {insider.organizationName})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Quick Subjects */}
          <div>
            <label className="block text-xs font-black text-slate-800 mb-1.5">
              موضوع پیگیری یا تماس:
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="مثلاً: پیگیری پرونده تسهیلات یکی از مراجعین..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs sm:text-sm font-medium focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none"
              required
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {QUICK_SUBJECTS.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setSubject(s)}
                  className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2.5 py-1 rounded-xl border border-slate-200 transition cursor-pointer active:scale-95"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Type of interaction (Reciprocity selector) */}
          <div>
            <label className="block text-xs font-black text-slate-800 mb-1.5">
              نوع تعامل (محاسبه خودکار موازنه طلبکاری/بدهکاری):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <label
                className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                  type === "REQUESTED_FAVOR_FROM_USER"
                    ? "bg-amber-50 border-amber-500 text-amber-950 font-black shadow-sm ring-2 ring-amber-200"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value="REQUESTED_FAVOR_FROM_USER"
                  checked={type === "REQUESTED_FAVOR_FROM_USER"}
                  onChange={() => setType("REQUESTED_FAVOR_FROM_USER")}
                  className="sr-only"
                />
                <PhoneCall className="w-5 h-5 mb-1.5 text-amber-600" />
                <span className="leading-tight">پیگیری کار مردم از او</span>
                <span className="text-[10px] text-amber-700 mt-1 font-semibold">(دفتر بدهکار می‌شود)</span>
              </label>

              <label
                className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                  type === "DID_FAVOR_FOR_USER"
                    ? "bg-blue-50 border-blue-500 text-blue-950 font-black shadow-sm ring-2 ring-blue-200"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value="DID_FAVOR_FOR_USER"
                  checked={type === "DID_FAVOR_FOR_USER"}
                  onChange={() => setType("DID_FAVOR_FOR_USER")}
                  className="sr-only"
                />
                <HeartHandshake className="w-5 h-5 mb-1.5 text-blue-600" />
                <span className="leading-tight">گره‌گشایی برای او</span>
                <span className="text-[10px] text-blue-700 mt-1 font-semibold">(او بدهکار می‌شود)</span>
              </label>

              <label
                className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                  type === "GREETING_CALL"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-950 font-black shadow-sm ring-2 ring-emerald-200"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value="GREETING_CALL"
                  checked={type === "GREETING_CALL"}
                  onChange={() => setType("GREETING_CALL")}
                  className="sr-only"
                />
                <CheckCircle2 className="w-5 h-5 mb-1.5 text-emerald-600" />
                <span className="leading-tight">احوالپرسی و تبریک</span>
                <span className="text-[10px] text-emerald-700 mt-1 font-semibold">(موازنه بی‌تغییر)</span>
              </label>
            </div>
          </div>

          {/* Outcome Selector */}
          <div>
            <label className="block text-xs font-black text-slate-800 mb-1.5">نتیجه پیگیری:</label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setOutcome("RESOLVED")}
                className={`py-2.5 rounded-2xl border font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  outcome === "RESOLVED"
                    ? "bg-emerald-600 text-white border-emerald-700 shadow-md scale-101"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>حل شد</span>
              </button>

              <button
                type="button"
                onClick={() => setOutcome("IN_PROGRESS")}
                className={`py-2.5 rounded-2xl border font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  outcome === "IN_PROGRESS"
                    ? "bg-blue-600 text-white border-blue-700 shadow-md scale-101"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>در جریان</span>
              </button>

              <button
                type="button"
                onClick={() => setOutcome("UNSUCCESSFUL")}
                className={`py-2.5 rounded-2xl border font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  outcome === "UNSUCCESSFUL"
                    ? "bg-red-600 text-white border-red-700 shadow-md scale-101"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <XCircle className="w-4 h-4" />
                <span>ناموفق</span>
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-black text-slate-800 mb-1">
              یادداشت و نکات گفتگو:
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="نکات گفتگو، شماره نامه یا قول‌هایی که داده شد..."
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 text-xs focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none resize-none font-medium"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition cursor-pointer"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-black shadow-md hover:shadow-lg transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "در حال ثبت..." : "ذخیره لاگ و بروزرسانی موازنه"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
