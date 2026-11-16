import assert from "node:assert";
import { normalizePersian, toEnglishDigits, toPersianDigits, normalizePhoneNumber, isValidIranianMobile } from "../src/lib/persian";
import { calculateBurnout } from "../src/lib/utils";
import { radarSearchLimiter } from "../src/lib/rate-limit";

console.log("🧪 Running Comprehensive Unit Tests...");

// 1. Test Persian Normalization
console.log("➡️ Test 1: Persian Text Normalization...");
const arabicText = "بانك ملّي ايران و شركت‌هاي دادگستري";
const normalized = normalizePersian(arabicText);
assert.strictEqual(normalized, "بانک ملی ایران و شرکت‌های دادگستری", "Arabic Yeh and Kaf should be converted to Persian");

// ZWNJ duplicate test
const zwnjText = "می‌\u200C\u200Cشود";
assert.strictEqual(normalizePersian(zwnjText), "می‌شود", "Duplicate ZWNJ should be collapsed to single ZWNJ");

// Digit conversion test
assert.strictEqual(toEnglishDigits("۰۹۱۲۳۴۵۶۷۸۹"), "09123456789", "Persian digits should convert to English");
assert.strictEqual(toEnglishDigits("٠١٢٣٤٥٦٧٨٩"), "09123456789".slice(1) ? "0123456789" : "", "Arabic digits should convert to English");
assert.strictEqual(toPersianDigits("123"), "۱۲۳", "English digits should convert to Persian");

// Mobile phone normalization
assert.strictEqual(normalizePhoneNumber("+989123456789"), "09123456789", "+98 phone should normalize to 09...");
assert.strictEqual(normalizePhoneNumber("00989123456789"), "09123456789", "0098 phone should normalize to 09...");
assert.strictEqual(normalizePhoneNumber("9123456789"), "09123456789", "10-digit mobile should prefix with 0");
assert.strictEqual(isValidIranianMobile("09123456789"), true, "Valid Iranian mobile should pass");
assert.strictEqual(isValidIranianMobile("08123456789"), false, "Non-mobile should fail");
console.log("✅ Persian Normalization tests passed!");

// 2. Test Burnout Warning Calculation (جلوگیری از سوزاندن مهره)
console.log("➡️ Test 2: Burnout Warning Logic...");
const now = Date.now();
const dayMs = 24 * 60 * 60 * 1000;

// Scenario A: 3 calls in last 15 days -> MUST TRIGGER BURNOUT WARNING
const highFreqInteractions = [
  { createdAt: new Date(now - 2 * dayMs) },
  { createdAt: new Date(now - 7 * dayMs) },
  { createdAt: new Date(now - 14 * dayMs) },
];
const burnoutA = calculateBurnout(highFreqInteractions);
assert.strictEqual(burnoutA.isBurnoutRisk, true, "Contacted > 2 times in 30 days must trigger burnout warning");
assert.strictEqual(burnoutA.countLast30Days, 3);
assert.strictEqual(burnoutA.daysSinceLast, 2);

// Scenario B: 1 call 20 days ago -> NORMAL STATUS (No burnout)
const normalInteractions = [
  { createdAt: new Date(now - 20 * dayMs) },
];
const burnoutB = calculateBurnout(normalInteractions);
assert.strictEqual(burnoutB.isBurnoutRisk, false, "Contacted <= 2 times in 30 days must not trigger burnout");
assert.strictEqual(burnoutB.countLast30Days, 1);
assert.strictEqual(burnoutB.daysSinceLast, 20);

// Scenario C: Empty interactions
const burnoutC = calculateBurnout([]);
assert.strictEqual(burnoutC.isBurnoutRisk, false);
assert.strictEqual(burnoutC.countLast30Days, 0);
console.log("✅ Burnout Warning calculation tests passed!");

// 3. Test Token Bucket Rate Limiting
console.log("➡️ Test 3: Token Bucket Rate Limiter...");
const testIp = "192.168.1.100";
// Consume tokens
let allowedCount = 0;
for (let i = 0; i < 35; i++) {
  const res = radarSearchLimiter.consume(testIp);
  if (res.success) allowedCount++;
}
assert.strictEqual(allowedCount, 30, "Rate limiter with max 30 tokens should allow exactly 30 requests");
const blocked = radarSearchLimiter.consume(testIp);
assert.strictEqual(blocked.success, false, "31st request should be blocked");
assert.ok(blocked.retryAfterSeconds > 0, "Retry after seconds should be positive");
console.log("✅ Token Bucket Rate Limiter tests passed!");

console.log("\n🎉 ALL UNIT TESTS PASSED SUCCESSFULLY!");
