import { NextRequest, NextResponse } from "next/server";
import { JWTPayload } from "./types/types";

const protectedRoutes = [
  /^\/tenant(\/.*)?$/,
  /^\/admin(\/.*)?$/,
  // autres routes protégées...
];

const publicRoutes = [
  "/auth/login",
  "/auth/forgot-password",
  /^\/tenant\/[^/]+\/auth\/login$/,
  /^\/tenant\/[^/]+\/auth\/forgot-password$/,
  "/auth/register",
  "/unauthorized",
  "/favicon.ico",
  "/",
];

const roleProtectedRoutes: { regex: RegExp; allowedRoles: string[] }[] = [
  { regex: /^\/admin(\/.*)?$/, allowedRoles: ["SUPER_ADMIN", "SYSTEM_ADMIN"] },
  {
    regex: /^\/tenant\/[^/]+\/accounting(\/.*)?$/,
    allowedRoles: ["SUPER_ADMIN", "TENANT_ADMIN", "ACCOUNTANT"],
  },
];

// Décodage JWT (sans vérification de signature, juste le payload)
// Support base64url (JWT standard) et base64
function safeDecodeJwt(token?: string): JWTPayload | null {
  if (!token) return null;
  try {
    const payloadB64url = token.split(".")[1];
    if (!payloadB64url) return null;
    const payloadB64 = payloadB64url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = payloadB64 + "=".repeat((4 - (payloadB64.length % 4)) % 4);
    return JSON.parse(Buffer.from(padded, "base64").toString("utf-8"));
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host") || "";
  const pathname = url.pathname;

  if (
    publicRoutes.some((r) =>
      typeof r === "string" ? r === pathname : r.test(pathname)
    )
  ) {
    return NextResponse.next();
  }

  // Subdomain -> rewrite to /tenant/[slug] if not main domain
  const mainDomains = [
    "localhost:3000",
    "127.0.0.1:3000",
    "yourapp.com",
    "www.yourapp.com",
  ];
  const isMain = mainDomains.includes(host);
  const isReplit = host.includes("replit.app") || host.includes("replit.dev");

  if (!isMain && !isReplit && host.includes(".") && !host.startsWith("www.")) {
    const parts = host.split(".");
    const sub = parts[0];
    const systemSubdomains = ["api", "admin", "mail", "cdn"];
    if (!systemSubdomains.includes(sub)) {
      // Avoid rewrite loop
      if (!pathname.startsWith(`/tenant/${sub}`)) {
        url.pathname = `/tenant/${sub}${pathname}`;
        return NextResponse.rewrite(url);
      }
    }
  }

  // Protect routes: ensure token exists and role allowed
  const matchesProtected = protectedRoutes.some((r) => r.test(pathname));
  if (matchesProtected) {
    const authHeader = req.headers.get("authorization") || "";
    const cookieToken = req.cookies.get("access_token")?.value;
    const token = authHeader.replace("Bearer ", "") || cookieToken;

    if (!token) {
      if (pathname.startsWith("/tenant")) {
        // Récupère le tenantSlug depuis le pathname (/tenant/:slug/...)
        const pathParts = pathname.split("/");
        const tenantSlug = pathParts[2] || "default"; // fallback si absent
        url.pathname = `/tenant/${tenantSlug}/auth/login`;
      } else {
        url.pathname = "/auth/login";
        url.searchParams.set("redirect", pathname);
      }

      return NextResponse.redirect(url);
    }

    const payload = safeDecodeJwt(token);

    // Récupère l'admin
    const isAdmin = payload?.realm_access?.roles?.some(
      (r) => r.toLowerCase() === "system_admin"
    );

    // Récupère le tenant slug depuis la première organisation
    const tenantSlug =
      payload?.organizations?.[0]?.attributes?.subdomain?.[0] ||
      payload?.tenant_id ||
      "";

    // Récupère tous les rôles (realm + organization)
    const userRoles: string[] = [
      ...(payload?.realm_access?.roles || []),
      ...(payload?.roles || []),
      ...(payload?.organizations?.[0]?.roles || []),
    ].map((r) => r.toUpperCase());

    // const primaryRole = userRoles[0] || "";

    // (1) Admin ne peut pas accéder à /tenant
    if (pathname.startsWith("/tenant") && isAdmin) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    // (2) Tenant user ne peut pas accéder à /admin
    if (pathname.startsWith("/admin") && !isAdmin) {
      return NextResponse.redirect(new URL(`/tenant/${tenantSlug}`, req.url));
    }

    // const roleRoute = roleProtectedRoutes.find((r) => r.regex.test(pathname));
    // if (
    //   roleRoute &&
    //   !roleRoute.allowedRoles.map((r) => r.toUpperCase()).includes(primaryRole)
    // ) {
    //   url.pathname = "/unauthorized";
    //   return NextResponse.redirect(url);
    // }

    const roleRoute = roleProtectedRoutes.find((r) => r.regex.test(pathname));
    if (roleRoute) {
      const allowed = roleRoute.allowedRoles.map((r) => r.toUpperCase());
      const hasRole = userRoles.some((r) => allowed.includes(r));
      if (!hasRole) {
        url.pathname = "/unauthorized";
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/tenant/:path*",
    "/admin/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
