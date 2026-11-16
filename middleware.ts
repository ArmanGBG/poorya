import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const rawSecret = process.env.JWT_SECRET || (process.env.NODE_ENV === "production" ? "" : "civic-network-super-secret-jwt-key-2024-secure-mp-crm");
if (!rawSecret) {
  throw new Error("CRITICAL SECURITY ERROR: JWT_SECRET environment variable is missing in production.");
}
const JWT_SECRET = new TextEncoder().encode(rawSecret);

const COOKIE_NAME = "civic_session_token";

// Define protected route patterns and their allowed roles
const ROUTE_PERMISSIONS = [
  {
    prefix: "/rep-radar",
    allowedRoles: ["REPRESENTATIVE_VIP"],
    api: false,
  },
  {
    prefix: "/api/radar",
    allowedRoles: ["REPRESENTATIVE_VIP"],
    api: true,
  },
  {
    prefix: "/admin/merchants",
    allowedRoles: ["ADMIN_CLUB", "ADMIN_VERIFIER", "REPRESENTATIVE_VIP"],
    api: false,
  },
  {
    prefix: "/api/admin/merchants",
    allowedRoles: ["ADMIN_CLUB", "ADMIN_VERIFIER", "REPRESENTATIVE_VIP"],
    api: true,
  },
  {
    prefix: "/admin/verify",
    allowedRoles: ["ADMIN_VERIFIER", "REPRESENTATIVE_VIP"],
    api: false,
  },
  {
    prefix: "/api/admin/documents",
    allowedRoles: ["ADMIN_VERIFIER", "REPRESENTATIVE_VIP"],
    api: true,
  },
  {
    prefix: "/api/verification/admin",
    allowedRoles: ["ADMIN_VERIFIER", "REPRESENTATIVE_VIP"],
    api: true,
  },
  {
    prefix: "/connector",
    allowedRoles: ["CONNECTOR", "REPRESENTATIVE_VIP"],
    api: false,
  },
  {
    prefix: "/api/verification/connector",
    allowedRoles: ["CONNECTOR", "REPRESENTATIVE_VIP"],
    api: true,
  },
  {
    prefix: "/admin",
    allowedRoles: ["ADMIN_CLUB", "ADMIN_VERIFIER", "REPRESENTATIVE_VIP"],
    api: false,
  },
  {
    prefix: "/dashboard",
    allowedRoles: [
      "MEMBER_PUBLIC",
      "MEMBER_VIP",
      "CONNECTOR",
      "ADMIN_CLUB",
      "ADMIN_VERIFIER",
      "REPRESENTATIVE_VIP",
    ],
    api: false,
  },
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Find matching protected route rule
  const matchedRule = ROUTE_PERMISSIONS.find((rule) =>
    pathname.startsWith(rule.prefix)
  );

  // If public route, allow immediately
  if (!matchedRule) {
    return NextResponse.next();
  }

  // Extract session token
  const token = req.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    if (matchedRule.api) {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز. لطفاً وارد حساب کاربری خود شوید." },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userRole = (payload as { role?: string }).role || "";

    // Check if user's role is permitted
    if (!matchedRule.allowedRoles.includes(userRole)) {
      // CRITICAL SECURITY ENFORCEMENT:
      // ADMIN_CLUB or any unauthorized role attempting to breach CRM/Radar is denied!
      if (matchedRule.api) {
        return NextResponse.json(
          {
            error:
              "خطای عدم دسترسی: شما مجوز دسترسی به این بخش اطلاعاتی را ندارید.",
          },
          { status: 403 }
        );
      }

      // Redirect unauthorized user to their designated dashboard
      const fallbackUrl = new URL("/dashboard/card", req.url);
      fallbackUrl.searchParams.set(
        "error",
        "unauthorized_access_to_political_radar"
      );
      return NextResponse.redirect(fallbackUrl);
    }

    // Role authorized, proceed
    return NextResponse.next();
  } catch (err) {
    // Invalid or expired token
    if (matchedRule.api) {
      return NextResponse.json(
        { error: "نشست کاربری نامعتبر است یا منقضی شده است." },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    "/rep-radar",
    "/rep-radar/:path*",
    "/api/radar/:path*",
    "/admin",
    "/admin/:path*",
    "/api/admin/:path*",
    "/connector",
    "/connector/:path*",
    "/api/verification/:path*",
    "/dashboard",
    "/dashboard/:path*",
  ],
};
