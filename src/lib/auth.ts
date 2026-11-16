import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { UserRole, MemberTier } from "@prisma/client";
import { prisma, SAFE_USER_SELECT } from "./prisma";
import { normalizePhoneNumber } from "./persian";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "civic-network-super-secret-jwt-key-2024-secure-mp-crm"
);

export const COOKIE_NAME = "civic_session_token";

export interface SessionPayload {
  userId: string;
  phone: string;
  fullName: string;
  role: UserRole;
  tier: MemberTier;
  exp?: number;
}

/**
 * Sign JWT session token valid for 7 days
 */
export async function signSession(payload: Omit<SessionPayload, "exp">): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

/**
 * Verify and decode JWT session token
 */
export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch (err) {
    return null;
  }
}

/**
 * Get current authenticated user session from Next.js server context
 */
export async function getCurrentUser(): Promise<SessionPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifySession(token);
  } catch (err) {
    return null;
  }
}

/**
 * Extract session directly from NextRequest (for middleware and edge routes)
 */
export async function getSessionFromRequest(req: NextRequest): Promise<SessionPayload | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifySession(token);
}

/**
 * In-memory OTP Store with 2-minute expiration
 * In development, OTP is always accepted with "12345" or the generated code logged to console.
 */
interface OtpEntry {
  code: string;
  expiresAt: number;
  phone: string;
}

const otpStore = new Map<string, OtpEntry>();

// Periodic TTL sweep to prevent memory leaks from unverified OTP entries
if (typeof setInterval !== "undefined") {
  const otpCleaner = setInterval(() => {
    const now = Date.now();
    otpStore.forEach((entry, phone) => {
      if (now > entry.expiresAt) {
        otpStore.delete(phone);
      }
    });
  }, 60000);
  if (otpCleaner.unref) {
    otpCleaner.unref();
  }
}

export function generateAndStoreOtp(rawPhone: string): { code: string; phone: string } {
  const phone = normalizePhoneNumber(rawPhone);
  // Generate a realistic 5-digit OTP
  const code = process.env.NODE_ENV === "production"
    ? Math.floor(10000 + Math.random() * 90000).toString()
    : "12345"; // Fixed predictable OTP for seamless testing and development

  otpStore.set(phone, {
    code,
    expiresAt: Date.now() + 2 * 60 * 1000, // 2 minutes
    phone,
  });

  console.log(`[SMS Gateway Mock] Sent OTP ${code} to ${phone}`);
  return { code, phone };
}

export function verifyStoredOtp(rawPhone: string, code: string): boolean {
  const phone = normalizePhoneNumber(rawPhone);
  const entry = otpStore.get(phone);

  // In development, master OTP "12345" is always valid for swift testing
  if (process.env.NODE_ENV !== "production" && code.trim() === "12345") {
    return true;
  }

  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(phone);
    return false;
  }

  if (entry.code === code.trim()) {
    otpStore.delete(phone);
    return true;
  }

  return false;
}

/**
 * Role-Based Access Control validator
 */
export function isAuthorized(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole);
}

/**
 * Quick dev role switcher lookup
 */
export async function getMockUserByRole(role: UserRole) {
  return await prisma.user.findFirst({
    where: { role },
    select: SAFE_USER_SELECT,
  });
}
