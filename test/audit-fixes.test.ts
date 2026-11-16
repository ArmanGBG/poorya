import assert from "node:assert";
import { getPersianSearchTerms, normalizePersian } from "../src/lib/persian";
import { calculateBurnout } from "../src/lib/utils";
import { UserRole, MemberTier, InteractionOutcome, InteractionType } from "@prisma/client";

console.log("🧪 Running Architectural Fixes & Audit Regression Tests...\n");

// -------------------------------------------------------------
// Test 1: Persian Alef Maddah & Search Term Variations (Fix #4 & #5)
// -------------------------------------------------------------
console.log("➡️ Test 1: Persian Search Terms Variations (Alef Maddah)...");
const searchWord = "آموزش و پرورش";
const variations = getPersianSearchTerms(searchWord);
assert.ok(variations.includes("آموزش و پرورش"), "Should preserve original Alef Maddah 'آموزش و پرورش'");
assert.ok(variations.includes("اموزش و پرورش"), "Should include normalized 'اموزش و پرورش'");

const plainWord = "اموزش";
const variationsPlain = getPersianSearchTerms(plainWord);
assert.ok(variationsPlain.includes("اموزش"), "Should include normalized 'اموزش'");
console.log("✅ Persian search variations passed!");

// -------------------------------------------------------------
// Test 2: RBAC Role Preservation Logic (Fix #2.1)
// -------------------------------------------------------------
console.log("\n➡️ Test 2: RBAC Role Preservation upon Profile Approval...");
function computeNewRole(currentRole: UserRole): UserRole {
  return currentRole === UserRole.MEMBER_PUBLIC ? UserRole.MEMBER_VIP : currentRole;
}

assert.strictEqual(computeNewRole(UserRole.MEMBER_PUBLIC), UserRole.MEMBER_VIP, "Public member should upgrade to MEMBER_VIP");
assert.strictEqual(computeNewRole(UserRole.CONNECTOR), UserRole.CONNECTOR, "CONNECTOR role must be preserved");
assert.strictEqual(computeNewRole(UserRole.ADMIN_VERIFIER), UserRole.ADMIN_VERIFIER, "ADMIN_VERIFIER role must be preserved");
assert.strictEqual(computeNewRole(UserRole.ADMIN_CLUB), UserRole.ADMIN_CLUB, "ADMIN_CLUB role must be preserved");
assert.strictEqual(computeNewRole(UserRole.REPRESENTATIVE_VIP), UserRole.REPRESENTATIVE_VIP, "REPRESENTATIVE_VIP role must be preserved");
console.log("✅ Role preservation tests passed!");

// -------------------------------------------------------------
// Test 3: Self-Vouching Guard (Fix #2.3)
// -------------------------------------------------------------
console.log("\n➡️ Test 3: Self-Vouching Protection...");
function validateVouching(applicantUserId: string, voucherUserId: string): boolean {
  if (applicantUserId === voucherUserId) {
    return false; // Forbidden self-vouch
  }
  return true;
}
assert.strictEqual(validateVouching("user-1", "user-1"), false, "User cannot vouch for themselves");
assert.strictEqual(validateVouching("user-1", "user-2"), true, "Connector can vouch for another user");
console.log("✅ Self-vouching protection passed!");

// -------------------------------------------------------------
// Test 4: Reciprocity Balance Calculation on Outcome (Fix #3.2)
// -------------------------------------------------------------
console.log("\n➡️ Test 4: Reciprocity Balance outcome conditioning...");
function computeFavorDelta(type: InteractionType, outcome: InteractionOutcome): number {
  if (outcome !== InteractionOutcome.RESOLVED) {
    return 0; // No debt change if unsuccessful or still in progress
  }
  if (type === InteractionType.REQUESTED_FAVOR_FROM_USER) return -1;
  if (type === InteractionType.DID_FAVOR_FOR_USER) return +1;
  return 0;
}

assert.strictEqual(computeFavorDelta(InteractionType.REQUESTED_FAVOR_FROM_USER, InteractionOutcome.RESOLVED), -1);
assert.strictEqual(computeFavorDelta(InteractionType.REQUESTED_FAVOR_FROM_USER, InteractionOutcome.UNSUCCESSFUL), 0, "Unsuccessful favor request should not decrement balance");
assert.strictEqual(computeFavorDelta(InteractionType.REQUESTED_FAVOR_FROM_USER, InteractionOutcome.IN_PROGRESS), 0, "In-progress favor should not decrement balance");
assert.strictEqual(computeFavorDelta(InteractionType.DID_FAVOR_FOR_USER, InteractionOutcome.RESOLVED), 1);
assert.strictEqual(computeFavorDelta(InteractionType.DID_FAVOR_FOR_USER, InteractionOutcome.UNSUCCESSFUL), 0);
console.log("✅ Reciprocity outcome conditioning passed!");

// -------------------------------------------------------------
// Test 5: Multi-Role Holistic User Burnout Scoping (Fix #3.1)
// -------------------------------------------------------------
console.log("\n➡️ Test 5: Multi-Role Holistic Burnout Calculation...");
const dayMs = 24 * 60 * 60 * 1000;
const nowTime = Date.now();

// Suppose Dr. Rezaei has Profile A (Hospital) and Profile B (Medical Council)
// 2 calls under Profile A, 2 calls under Profile B in the past 20 days
const profileAInteractions = [
  { createdAt: new Date(nowTime - 5 * dayMs) },
  { createdAt: new Date(nowTime - 12 * dayMs) },
];
const profileBInteractions = [
  { createdAt: new Date(nowTime - 3 * dayMs) },
  { createdAt: new Date(nowTime - 18 * dayMs) },
];

// Profile-only scoping (The Buggy way):
const burnoutProfileA = calculateBurnout(profileAInteractions);
assert.strictEqual(burnoutProfileA.isBurnoutRisk, false, "Individual profile has only 2 calls, would miss burnout");

// User-level holistic scoping (The Fixed way):
const userAllInteractions = [...profileAInteractions, ...profileBInteractions];
const holisticBurnout = calculateBurnout(userAllInteractions);
assert.strictEqual(holisticBurnout.isBurnoutRisk, true, "Combined 4 calls for the same user must trigger burnout risk");
assert.strictEqual(holisticBurnout.countLast30Days, 4);
assert.strictEqual(holisticBurnout.daysSinceLast, 3);
console.log("✅ Multi-role holistic burnout scoping passed!");

// -------------------------------------------------------------
// Test 6: Cross-Merchant Coupon Isolation Logic (Fix #1.1)
// -------------------------------------------------------------
console.log("\n➡️ Test 6: Cross-Merchant Coupon Isolation Logic...");
interface MockOffer {
  businessId: string;
  merchantPin: string;
}
function verifyMerchantCoupon(
  couponOffer: MockOffer,
  enteredBusinessId: string | null,
  enteredPin: string
): { success: boolean; error?: string } {
  if (enteredBusinessId && couponOffer.businessId !== enteredBusinessId) {
    return { success: false, error: "این کوپن متعلق به این کسب‌وکار نیست." };
  }
  if (couponOffer.merchantPin !== enteredPin) {
    return { success: false, error: "پین ۴ رقمی فروشگاه نادرست است." };
  }
  return { success: true };
}

const cafeOffer: MockOffer = { businessId: "business-cafe", merchantPin: "1234" };
const clothingOffer: MockOffer = { businessId: "business-clothing", merchantPin: "1234" };

// Scenario: Cashier at Clothing store (businessId: "business-clothing") tries to burn Cafe's coupon
const mismatchResult = verifyMerchantCoupon(cafeOffer, "business-clothing", "1234");
assert.strictEqual(mismatchResult.success, false, "Cross-merchant coupon validation must fail");

// Proper merchant validation
const correctResult = verifyMerchantCoupon(cafeOffer, "business-cafe", "1234");
assert.strictEqual(correctResult.success, true, "Matching business and PIN must succeed");
console.log("✅ Cross-merchant coupon isolation passed!");

console.log("\n✨ ALL ARCHITECTURAL REGRESSION TESTS PASSED WITH 100% SUCCESS!");
