import { NextRequest, NextResponse } from "next/server";

interface JWTPayload {
  sub: string;
  email: string;
  name: string;
  given_name: string;
  family_name: string;
  realm_access?: { roles: string[] };
  roles?: string[];
  organizations?: Array<{
    id: string;
    name: string;
    roles: string[];
    attributes?: { tenant_id?: string[]; subdomain?: string[] };
  }>;
  tenant_id?: string;
  exp?: number;
}

const PUBLIC_ROUTES = [
  "/auth/login",
  "/auth/forgot-password",
  "/auth/register",
  "/unauthorized",
  "/favicon.ico",
  "/",
];

const PUBLIC_ROUTE_PATTERNS = [
  /^\/tenant\/[^/]+\/auth\/login$/,
  /^\/tenant\/[^/]+\/auth\/forgot-password$/,
];

/**
 * Mapping module → rôles backend autorisés.
 * Le middleware fait un check léger ; le vrai check granulaire se fait côté composant.
 */
const MODULE_ROLE_REQUIREMENTS: Record<string, string[]> = {
  sales: [
    "super_admin", "platform_admin", "tenant_owner", "tenant_admin",
    "tenant_manager", "pharmacy_owner", "pharmacy_manager",
    "pharmacist", "pharmacy_assistant", "cashier", "sales_manager",
  ],
  inventory: [
    "super_admin", "platform_admin", "tenant_owner", "tenant_admin",
    "tenant_manager", "pharmacy_owner", "pharmacy_manager",
    "pharmacist", "pharmacy_assistant", "pharmacy_technician",
    "inventory_manager", "supply_chain_manager", "quality_manager",
  ],
  patients: [
    "super_admin", "platform_admin", "tenant_owner", "tenant_admin",
    "tenant_manager", "pharmacy_owner", "pharmacy_manager",
    "pharmacist", "pharmacy_assistant", "doctor", "nurse",
    "sales_manager", "staff_member",
  ],
  prescriptions: [
    "super_admin", "platform_admin", "tenant_owner", "tenant_admin",
    "tenant_manager", "pharmacy_owner", "pharmacy_manager",
    "pharmacist", "pharmacy_assistant", "doctor", "nurse",
  ],
  accounting: [
    "super_admin", "platform_admin", "tenant_owner", "tenant_admin",
    "tenant_manager", "pharmacy_owner", "pharmacy_manager",
    "accountant", "sales_manager",
  ],
  billing: [
    "super_admin", "platform_admin", "tenant_owner", "tenant_admin",
    "pharmacy_owner", "pharmacy_manager", "accountant",
    "pharmacist", "cashier", "sales_manager",
  ],
  hr: [
    "super_admin", "platform_admin", "tenant_owner", "tenant_admin",
    "pharmacy_owner", "hr_manager",
  ],
  suppliers: [
    "super_admin", "platform_admin", "tenant_owner", "tenant_admin",
    "tenant_manager", "pharmacy_owner", "pharmacy_manager",
    "inventory_manager", "supply_chain_manager", "quality_manager",
  ],
  "supply-chain": [
    "super_admin", "platform_admin", "tenant_owner", "tenant_admin",
    "tenant_manager", "pharmacy_owner", "pharmacy_manager",
    "inventory_manager", "supply_chain_manager", "pharmacy_technician",
  ],
  quality: [
    "super_admin", "platform_admin", "tenant_owner", "tenant_admin",
    "pharmacy_owner", "pharmacy_manager", "pharmacist",
    "quality_manager", "inventory_manager",
  ],
  vaccination: [
    "super_admin", "platform_admin", "tenant_owner", "tenant_admin",
    "tenant_manager", "pharmacy_owner", "pharmacy_manager",
    "pharmacist", "pharmacy_assistant", "doctor", "nurse",
  ],
  delivery: [
    "super_admin", "platform_admin", "tenant_owner", "tenant_admin",
    "pharmacy_owner",
  ],
  analytics: [
    "super_admin", "platform_admin", "tenant_owner", "tenant_admin",
    "tenant_manager", "pharmacy_owner", "pharmacy_manager",
  ],
  insurance: [
    "super_admin", "platform_admin", "tenant_owner", "tenant_admin",
    "pharmacy_owner", "pharmacy_manager", "pharmacist",
  ],
  "e-invoice": [
    "super_admin", "platform_admin", "tenant_owner", "tenant_admin",
    "pharmacy_owner", "accountant",
  ],
  settings: [
    "super_admin", "platform_admin", "tenant_owner", "tenant_admin",
    "pharmacy_owner",
  ],
};

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

function extractUserRoles(payload: JWTPayload): string[] {
  return [
    ...(payload.realm_access?.roles ?? []),
    ...(payload.roles ?? []),
    ...(payload.organizations?.[0]?.roles ?? []),
  ].map((r) => r.toLowerCase());
}

function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_ROUTES.includes(pathname)) return true;
  return PUBLIC_ROUTE_PATTERNS.some((p) => p.test(pathname));
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host") || "";
  const pathname = url.pathname;

  if (isPublicRoute(pathname)) return NextResponse.next();

  // Subdomain rewrite: sub.domain.com → /tenant/sub/...
  const mainDomains = [
    "localhost:3000", "127.0.0.1:3000",
    process.env.NEXT_PUBLIC_MAIN_DOMAIN || "yourapp.com",
    `www.${process.env.NEXT_PUBLIC_MAIN_DOMAIN || "yourapp.com"}`,
  ];
  const isMain = mainDomains.includes(host);
  const isReplit = host.includes("replit.app") || host.includes("replit.dev");

  if (!isMain && !isReplit && host.includes(".") && !host.startsWith("www.")) {
    const sub = host.split(".")[0];
    const systemSubdomains = ["api", "admin", "mail", "cdn"];
    if (!systemSubdomains.includes(sub) && !pathname.startsWith(`/tenant/${sub}`)) {
      url.pathname = `/tenant/${sub}${pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  const isProtected =
    /^\/tenant(\/.*)?$/.test(pathname) || /^\/admin(\/.*)?$/.test(pathname);

  if (!isProtected) return NextResponse.next();

  const authHeader = req.headers.get("authorization") || "";
  const cookieToken = req.cookies.get("access_token")?.value;
  const token = authHeader.replace("Bearer ", "") || cookieToken;

  if (!token) {
    if (pathname.startsWith("/tenant")) {
      const pathParts = pathname.split("/");
      const tenantSlug = pathParts[2] || "default";
      url.pathname = `/tenant/${tenantSlug}/auth/login`;
    } else {
      url.pathname = "/auth/login";
      url.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(url);
  }

  const payload = safeDecodeJwt(token);
  if (!payload) {
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  const userRoles = extractUserRoles(payload);
  const isAdmin = userRoles.includes("system_admin") || userRoles.includes("super_admin");

  const tenantSlug =
    payload.organizations?.[0]?.attributes?.subdomain?.[0] ||
    payload.tenant_id ||
    "";

  // Admin → /admin only, tenant users → /tenant only
  if (pathname.startsWith("/tenant") && isAdmin) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }
  if (pathname.startsWith("/admin") && !isAdmin) {
    return NextResponse.redirect(new URL(`/tenant/${tenantSlug}`, req.url));
  }

  // Module-level RBAC for /tenant/:slug/:module/...
  if (pathname.startsWith("/tenant/")) {
    const pathParts = pathname.split("/");
    // /tenant/:slug/:module/...  → module is pathParts[3]
    const module = pathParts[3];

    if (module && module !== "auth" && MODULE_ROLE_REQUIREMENTS[module]) {
      const allowedRoles = MODULE_ROLE_REQUIREMENTS[module];
      const hasAccess = userRoles.some((r) => allowedRoles.includes(r));
      if (!hasAccess) {
        url.pathname = `/tenant/${pathParts[2]}/dashboard`;
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
