import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma =
  global.prismaGlobal ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prismaGlobal = prisma;
}

/**
 * Strict Safe Projections to prevent data leaks (Requirement #5)
 * Explicitly excludes CRM notes, favor balance, and internal records
 * from public, club admin, and store merchant responses.
 */

// Safe User projection for public & club admin views
export const SAFE_USER_SELECT = {
  id: true,
  phone: true,
  fullName: true,
  neighborhood: true,
  role: true,
  tier: true,
  isPhoneVerified: true,
  referralCode: true,
  createdAt: true,
} as const;

// Safe Offer projection (NEVER exposes merchantPin)
export const SAFE_OFFER_SELECT = {
  id: true,
  title: true,
  discountPercent: true,
  requiredTier: true,
  terms: true,
  expiresAt: true,
  business: {
    select: {
      id: true,
      name: true,
      category: true,
      address: true,
      phone: true,
      logoUrl: true,
      isActive: true,
      // merchantPin is STRICTLY OMITTED
    },
  },
} as const;

// Safe Public Business projection
export const SAFE_BUSINESS_SELECT = {
  id: true,
  name: true,
  category: true,
  address: true,
  phone: true,
  logoUrl: true,
  isActive: true,
  // merchantPin is STRICTLY OMITTED
} as const;
