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
  "/auth/registration-success",
  "/auth/callback",
  "/unauthorized",
  "/favicon.ico",
  "/",
];

function rootHostSet(): Set<string> {
  const main = (process.env.NEXT_PUBLIC_MAIN_DOMAIN || "yourapp.com").toLowerCase();
  const extras = (process.env.NEXT_PUBLIC_ROOT_HOSTS || "")
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);
  const list = [
    "localhost:3000",
    "127.0.0.1:3000",
    main,
    `www.${main}`,
    ...extras,
  ];
  return new Set(list);
}

const PUBLIC_ROUTE_PATTERNS = [
  /^\/tenant\/[^/]+\/auth\/login$/,
  /^\/tenant\/[^/]+\/auth\/forgot-password$/,
  /^\/tenant\/[^/]+\/auth\/callback$/,
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

const SYSTEM_HOST_PREFIXES = ["api", "admin", "mail", "cdn"];

/** Évite de traiter une IPv4 (ex. 192.168.x.x) comme un hôte multi-label → faux tenant `192`. */
function isIpv4Literal(hostname: string): boolean {
  const parts = hostname.split(".");
  if (parts.length !== 4) return false;
  return parts.every((part) => {
    if (!/^\d{1,3}$/.test(part)) return false;
    const n = Number(part);
    return n >= 0 && n <= 255;
  });
}

/** Domaine racine marketing ou accès par IP LAN (évite rewrite / faux tenant). */
function isMarketingRootHost(hostHeader: string, hostLc: string): boolean {
  const roots = rootHostSet();
  if (roots.has(hostLc)) return true;
  const hostNoPort = hostHeader.toLowerCase().split(":")[0];
  return isIpv4Literal(hostNoPort);
}

/**
 * En dev : pas de redirection `/` → `/tenant/<slug>/auth/login` d’après le Host (onglets `/tenant/192/...`, LAN, etc.).
 * Pour tester un sous-domaine tenant en local : NEXT_PUBLIC_TENANT_HOST_REDIRECT_IN_DEV=true
 */
function tenantHostRedirectEnabled(): boolean {
  if (process.env.NODE_ENV !== "development") return true;
  return process.env.NEXT_PUBLIC_TENANT_HOST_REDIRECT_IN_DEV === "true";
}

/**
 * Sous-domaine tenant depuis l’hôte : `pharma.syntixpharma.com` → `pharma`.
 * Retourne `null` sur le domaine racine (marketing), www, sous-domaines système, ou une IP.
 */
function tenantSlugFromHost(hostHeader: string): string | null {
  const hostNoPort = hostHeader.toLowerCase().split(":")[0];
  if (!hostNoPort || isIpv4Literal(hostNoPort)) return null;
  if (!hostNoPort.includes(".")) return null;
  if (hostNoPort.startsWith("www.")) return null;
  const roots = rootHostSet();
  if (roots.has(hostNoPort)) return null;
  if (hostNoPort.includes("replit.app") || hostNoPort.includes("replit.dev")) {
    return null;
  }
  const sub = hostNoPort.split(".")[0];
  if (!sub || SYSTEM_HOST_PREFIXES.includes(sub)) return null;
  return sub;
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host") || "";
  const pathname = url.pathname;

  const hostNoPortForIp = host.toLowerCase().split(":")[0];
  // Corrige l’URL résiduelle /tenant/<1er octet>/auth/... quand le Host est une IPv4 (ex. 192.168.x.x → faux tenant "192").
  if (isIpv4Literal(hostNoPortForIp)) {
    const firstOctet = hostNoPortForIp.split(".")[0];
    const tenantSeg = pathname.match(/^\/tenant\/([^/]+)/)?.[1];
    if (
      tenantSeg === firstOctet &&
      pathname.includes("/auth/")
    ) {
      url.pathname = pathname.replace(/^\/tenant\/[^/]+/, "");
      return NextResponse.redirect(url);
    }
  }

  const hostLc = host.toLowerCase();
  const isMainHost = isMarketingRootHost(host, hostLc);
  const isReplit = host.includes("replit.app") || host.includes("replit.dev");
  const tenantSlugHost = tenantSlugFromHost(host);

  // —— Hôte tenant (ex. pharma.syntixpharma.com) : portail d’entrée ——
  // Sans ça, `/` passait comme route publique globale et ne réécrivait jamais vers /tenant/...
  // En dev, désactivé par défaut (voir tenantHostRedirectEnabled).
  if (
    tenantHostRedirectEnabled() &&
    tenantSlugHost &&
    (pathname === "/" || pathname === "")
  ) {
    const authHeader = req.headers.get("authorization") || "";
    const cookieToken = req.cookies.get("access_token")?.value;
    const token = authHeader.replace("Bearer ", "") || cookieToken;
    const payload = token ? safeDecodeJwt(token) : null;
    if (payload) {
      url.pathname = `/tenant/${tenantSlugHost}/dashboard`;
      return NextResponse.redirect(url);
    }
    url.pathname = `/tenant/${tenantSlugHost}/auth/login`;
    return NextResponse.redirect(url);
  }

  if (isPublicRoute(pathname)) return NextResponse.next();

  // Subdomain rewrite: sub.domain.com/path → /tenant/sub/path (pas pour les IP LAN)
  const hostNoPortLc = host.toLowerCase().split(":")[0];
  if (
    !isMainHost &&
    !isReplit &&
    host.includes(".") &&
    !host.toLowerCase().startsWith("www.") &&
    !isIpv4Literal(hostNoPortLc)
  ) {
    const sub = hostNoPortLc.split(".")[0];
    if (!SYSTEM_HOST_PREFIXES.includes(sub) && !pathname.startsWith(`/tenant/${sub}`)) {
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
      const tenantSlug = pathParts[2] || tenantSlugHost || "default";
      url.pathname = `/tenant/${tenantSlug}/auth/login`;
    } else {
      url.pathname = "/auth/login";
      url.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(url);
  }

  const payload = safeDecodeJwt(token);
  if (!payload) {
    if (tenantSlugHost) {
      url.pathname = `/tenant/${tenantSlugHost}/auth/login`;
    } else {
      url.pathname = "/auth/login";
    }
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
    // /tenant/:slug/:module/...  → moduleName is pathParts[3]
    const moduleName = pathParts[3];

    if (moduleName && moduleName !== "auth" && MODULE_ROLE_REQUIREMENTS[moduleName]) {
      const allowedRoles = MODULE_ROLE_REQUIREMENTS[moduleName];
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
