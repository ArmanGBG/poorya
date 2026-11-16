import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toPersianDigits } from "./persian";

export { toPersianDigits } from "./persian";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a Date object or ISO string to Persian Jalali date (e.g. ۱۴۰۳/۰۸/۰۹)
 */
export function formatJalaliDate(dateInput: Date | string | number | null | undefined): string {
  if (!dateInput) return "—";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "—";

  try {
    const formatter = new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      calendar: "persian",
    });
    return formatter.format(date);
  } catch (err) {
    return date.toLocaleDateString();
  }
}

/**
 * Formats a date with time in Persian Jalali format
 */
export function formatJalaliDateTime(dateInput: Date | string | number | null | undefined): string {
  if (!dateInput) return "—";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "—";

  try {
    const formatter = new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      calendar: "persian",
    });
    return formatter.format(date);
  } catch (err) {
    return date.toLocaleString();
  }
}

/**
 * Calculates human-readable relative time in Persian
 */
export function formatRelativePersian(dateInput: Date | string | null | undefined): string {
  if (!dateInput) return "تماسی ثبت نشده";
  const date = new Date(dateInput);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours <= 0) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return diffMinutes <= 1 ? "چند لحظه پیش" : `${toPersianDigits(diffMinutes)} دقیقه پیش`;
    }
    return `${toPersianDigits(diffHours)} ساعت پیش`;
  }
  if (diffDays === 1) return "دیروز";
  if (diffDays === 2) return "پریروز";
  if (diffDays < 30) return `${toPersianDigits(diffDays)} روز پیش`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${toPersianDigits(diffMonths)} ماه پیش`;
  return `${toPersianDigits(Math.floor(diffMonths / 12))} سال پیش`;
}

/**
 * Burnout calculation for political insider CRM:
 * If contacted more than 2 times in the last 30 days, trigger a burnout warning badge
 * to prevent over-burdening or burning key insiders ("جلوگیری از سوزاندن مهره‌ها").
 */
export function calculateBurnout(interactions: { createdAt: Date | string }[] = []): {
  isBurnoutRisk: boolean;
  countLast30Days: number;
  lastInteractionDate: Date | null;
  daysSinceLast: number | null;
  message: string;
} {
  if (!interactions || interactions.length === 0) {
    return {
      isBurnoutRisk: false,
      countLast30Days: 0,
      lastInteractionDate: null,
      daysSinceLast: null,
      message: "بدون سابقه تماس",
    };
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Sort descending by date
  const sorted = [...interactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const lastDate = new Date(sorted[0].createdAt);
  const diffDays = Math.max(0, Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)));

  const countLast30Days = sorted.filter(
    (item) => new Date(item.createdAt).getTime() >= thirtyDaysAgo.getTime()
  ).length;

  const isBurnoutRisk = countLast30Days > 2;

  let message = "";
  if (diffDays === 0) {
    message = `آخرین تماس: امروز (مجموعاً ${toPersianDigits(countLast30Days)} تماس در ۳۰ روز اخیر)`;
  } else {
    message = `آخرین تماس: ${toPersianDigits(diffDays)} روز پیش (مجموعاً ${toPersianDigits(countLast30Days)} تماس در این ماه)`;
  }

  return {
    isBurnoutRisk,
    countLast30Days,
    lastInteractionDate: lastDate,
    daysSinceLast: diffDays,
    message,
  };
}

/**
 * Persian labels and color badge metadata for Enums
 */
export const INFLUENCE_META: Record<
  string,
  { label: string; badgeClass: string; iconColor: string; description: string }
> = {
  DECISION_MAKER: {
    label: "مدیر تصمیم‌گیرنده",
    badgeClass: "bg-red-50 text-red-700 border-red-200",
    iconColor: "text-red-600",
    description: "مدیر کل / معاون سازمان / دارای اختیارات امضا و تصمیم نهایی",
  },
  KEY_EXPERT: {
    label: "کارشناس کلیدی (امضا طلایی)",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    iconColor: "text-amber-500",
    description: "کارشناس ارشد پرونده / تهیه گزارش و کارشناسی پرونده‌های حساس",
  },
  INFORMED_STAFF: {
    label: "کارمند مطلع و باسابقه",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    iconColor: "text-slate-500",
    description: "کارمند پیگیر امور اداری و اطلاع‌رسانی از روند فرآیندها",
  },
};

export const INTIMACY_META: Record<
  string,
  { label: string; badgeClass: string }
> = {
  INNER_CIRCLE: {
    label: "حلقه اول (پای کار)",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  SUPPORTER: {
    label: "حامی معتمد",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
  CLUB_ONLY: {
    label: "صرفاً عضو باشگاه",
    badgeClass: "bg-gray-100 text-gray-600 border-gray-200",
  },
};

export const ORG_CATEGORY_META: Record<
  string,
  { label: string; icon: string; description: string }
> = {
  BANK: {
    label: "بانک‌ها و موسسات مالی",
    icon: "Landmark",
    description: "تسهیلات، ضمانت‌نامه‌ها و امور اعتباری",
  },
  GOVERNMENT_OFFICE: {
    label: "ادارات کل و دستگاه‌های اجرایی",
    icon: "Building2",
    description: "دارایی، ثبت اسناد، تامین اجتماعی، کار و...",
  },
  MUNICIPALITY: {
    label: "شهرداری و مدیریت شهری",
    icon: "Compass",
    description: "شهرداری مناطق، ماده صد، شهرسازی و خدمات شهری",
  },
  HOSPITAL_UNIVERSITY: {
    label: "دانشگاه‌ها و مراکز درمانی",
    icon: "Stethoscope",
    description: "بیمارستان‌ها، اعضای هیئت علمی و دانشگاه علوم پزشکی",
  },
  JUDICIARY_LAW: {
    label: "دادگستری و مراجع قضایی",
    icon: "Scale",
    description: "دادگاه‌ها، شورای حل اختلاف، اجرای احکام و ثبت",
  },
  MILITARY_SECURITY: {
    label: "نهادهای اداری و انتظامی",
    icon: "Shield",
    description: "نظام وظیفه، راهور، اماکن و خدمات اداری",
  },
  PRIVATE_COMPANY: {
    label: "صنایع و شرکت‌های خصوصی",
    icon: "Briefcase",
    description: "شرکت‌های دانش‌بنیان، کارخانجات و شهرک‌های صنعتی",
  },
  GUILD_UNION: {
    label: "اصناف و اتاق بازرگانی",
    icon: "Store",
    description: "اتحادیه‌ها، بازاریان و اصناف منتخب شهر",
  },
};
