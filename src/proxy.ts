import { NextRequest, NextResponse } from "next/server";

/**
 * Route guard (Next.js 16 proxy convention).
 * Reads the `artpet_role` cookie set by AuthContext on login.
 *
 * Rules:
 *   /admin/*        → must be logged-in admin; else → /signin or /
 *   customer-only/* → must NOT be admin; admin → /admin
 *   /signin|/signup → already logged-in users are redirected to their home
 *
 * For admin routes, we also forward `x-is-admin: 1` as a request header so
 * that the AppChrome server component can skip customer chrome entirely.
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const role = req.cookies.get("artpet_role")?.value; // "admin" | "customer" | undefined

  // ── Admin routes ────────────────────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (!role) {
      return redirect(req, `/signin?redirect=${encodeURIComponent(pathname)}`);
    }
    if (role !== "admin") {
      return redirect(req, "/");
    }
    // Pass a header so AppChrome (server component) skips customer chrome
    return nextWithHeaders(req, { "x-is-admin": "1" });
  }

  // ── Customer-only routes (account pages + checkout/cart) ────────────────────
  const customerOnly = [
    "/profile", "/orders", "/wishlist", "/appointments",
    "/payment-methods", "/saved-addresses", "/track-order",
    "/order-detail", "/notifications", "/checkout", "/cart",
  ];

  if (customerOnly.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    if (!role) {
      return redirect(req, `/signin?redirect=${encodeURIComponent(pathname)}`);
    }
    if (role === "admin") {
      return redirect(req, "/admin");
    }
    return NextResponse.next();
  }

  // ── Auth pages: redirect already-logged-in users ────────────────────────────
  if (pathname === "/signin" || pathname === "/signup") {
    if (role === "admin")    return redirect(req, "/admin");
    if (role === "customer") return redirect(req, "/");
  }

  return NextResponse.next();
}

function nextWithHeaders(req: NextRequest, extra: Record<string, string>) {
  const hdrs = new Headers(req.headers);
  for (const [k, v] of Object.entries(extra)) hdrs.set(k, v);
  return NextResponse.next({ request: { headers: hdrs } });
}

function redirect(req: NextRequest, to: string) {
  const url = req.nextUrl.clone();
  url.pathname = to.split("?")[0];
  url.search   = to.includes("?") ? "?" + to.split("?")[1] : "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*", "/profile",
    "/orders/:path*",  "/orders",
    "/wishlist/:path*", "/wishlist",
    "/appointments/:path*", "/appointments",
    "/payment-methods/:path*", "/payment-methods",
    "/saved-addresses/:path*", "/saved-addresses",
    "/track-order/:path*", "/track-order",
    "/order-detail/:path*", "/order-detail",
    "/notifications/:path*", "/notifications",
    "/checkout/:path*", "/checkout",
    "/cart/:path*",    "/cart",
    "/signin", "/signup",
  ],
};
