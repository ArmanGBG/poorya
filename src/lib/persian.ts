/**
 * Persian Text & Number Normalization Utility
 * باشگاه متخصصین، نخبگان و حامیان توسعه شهری
 */

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

/**
 * Converts Persian and Arabic digits to English ASCII digits
 */
export function toEnglishDigits(str: string | number): string {
  if (str === null || str === undefined) return "";
  let result = String(str);
  for (let i = 0; i < 10; i++) {
    result = result.replace(new RegExp(PERSIAN_DIGITS[i], "g"), String(i));
    result = result.replace(new RegExp(ARABIC_DIGITS[i], "g"), String(i));
  }
  return result;
}

/**
 * Converts English ASCII digits to Persian digits for display
 */
export function toPersianDigits(str: string | number): string {
  if (str === null || str === undefined) return "";
  let result = String(str);
  for (let i = 0; i < 10; i++) {
    result = result.replace(new RegExp(String(i), "g"), PERSIAN_DIGITS[i]);
  }
  return result;
}

/**
 * Standard Persian text normalizer:
 * 1. Replaces Arabic Yeh (ي / ى) with Persian Yeh (ی)
 * 2. Replaces Arabic Kaf (ك) with Persian Kaf (ک)
 * 3. Normalizes Arabic Heh/Teh Marbuta (ة) to (ه)
 * 4. Normalizes Persian Zero-Width Non-Joiner (ZWNJ / نیم‌فاصله)
 * 5. Removes duplicate spaces and trims
 */
export function normalizePersian(
  text: string,
  options?: { preserveAlefMaddah?: boolean }
): string {
  if (!text) return "";
  let normalized = text;

  // Arabic characters normalization
  normalized = normalized.replace(/[\u064A\u0649]/g, "ی"); // ي, ى -> ی
  normalized = normalized.replace(/[\u0643]/g, "ک");       // ك -> ک
  normalized = normalized.replace(/[\u0629]/g, "ه");       // ة -> ه
  normalized = normalized.replace(/[\u0624]/g, "و");       // ؤ -> و
  normalized = normalized.replace(/[\u0626]/g, "ی");       // ئ -> ی

  if (options?.preserveAlefMaddah) {
    normalized = normalized.replace(/[\u0623\u0625]/g, "ا"); // أ, إ -> ا (حفظ آ)
  } else {
    normalized = normalized.replace(/[\u0622\u0623\u0625]/g, "ا"); // آ, أ, إ -> ا
  }

  // Remove diacritics (اعراب)
  normalized = normalized.replace(/[\u064B-\u065F\u0670]/g, "");

  // Normalize ZWNJ (نیم‌فاصله)
  // Convert standard ZWNJ (\u200C) and related characters
  normalized = normalized.replace(/[\u200B\u200C\u200D\uFEFF]/g, "\u200C");
  // Remove consecutive ZWNJs
  normalized = normalized.replace(/\u200C+/g, "\u200C");
  // Remove ZWNJ at the beginning or end of words if adjacent to spaces
  normalized = normalized.replace(/\s\u200C/g, " ");
  normalized = normalized.replace(/\u200C\s/g, " ");

  // Normalize whitespace
  normalized = normalized.replace(/\s+/g, " ");

  return normalized.trim();
}

/**
 * Returns variations of a search query (preserving 'آ' and normalized 'ا')
 * so PostgreSQL case-insensitive search finds matches regardless of Alef diacritics.
 */
export function getPersianSearchTerms(query: string): string[] {
  if (!query) return [];
  const trimmed = query.trim();
  const withAlef = normalizePersian(trimmed, { preserveAlefMaddah: true });
  const withoutAlef = normalizePersian(trimmed, { preserveAlefMaddah: false });
  const terms = new Set<string>();
  if (trimmed) terms.add(trimmed);
  if (withAlef) terms.add(withAlef);
  if (withoutAlef) terms.add(withoutAlef);
  return Array.from(terms);
}

/**
 * Standardizes Iranian mobile phone numbers:
 * Converts digits to English, strips spaces, hyphens, and +98/0098 prefixes,
 * and ensures standard 11-digit format starting with 09 (e.g., 09123456789).
 */
export function normalizePhoneNumber(rawPhone: string): string {
  if (!rawPhone) return "";
  let digits = toEnglishDigits(rawPhone).replace(/[^\d+]/g, "");

  if (digits.startsWith("+98")) {
    digits = "0" + digits.slice(3);
  } else if (digits.startsWith("0098")) {
    digits = "0" + digits.slice(4);
  } else if (digits.startsWith("98") && digits.length === 12) {
    digits = "0" + digits.slice(2);
  } else if (!digits.startsWith("0") && digits.length === 10 && digits.startsWith("9")) {
    digits = "0" + digits;
  }

  return digits.trim();
}

/**
 * Validates Iranian mobile phone number format (09xxxxxxxxx)
 */
export function isValidIranianMobile(phone: string): boolean {
  const normalized = normalizePhoneNumber(phone);
  return /^09\d{9}$/.test(normalized);
}

/**
 * Formats phone number for display (e.g. 0912 345 6789 with Persian digits)
 */
export function formatPhoneDisplay(phone: string): string {
  const n = normalizePhoneNumber(phone);
  if (n.length === 11) {
    const formatted = `${n.slice(0, 4)} ${n.slice(4, 7)} ${n.slice(7)}`;
    return toPersianDigits(formatted);
  }
  return toPersianDigits(phone);
}
