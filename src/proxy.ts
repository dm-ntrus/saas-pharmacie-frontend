import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales, routing } from "@/i18n/routing";

const handleI18nRouting = createMiddleware(routing);

function hasLocalePrefix(pathname: string): boolean {
  return locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));
}

function splitLocalePrefix(pathname: string): { locale: string | null; restPath: string } {
  for (const locale of locales) {
    if (pathname === `/${locale}`) {
      return { locale, restPath: "/" };
    }
    if (pathname.startsWith(`/${locale}/`)) {
      const rest = pathname.slice(locale.length + 1);
      return { locale, restPath: rest.startsWith("/") ? rest : `/${rest}` };
    }
  }
  return { locale: null, restPath: pathname };
}

interface NormalizedOrg {
  id: string;
  name: string;
  roles: string[];
  attributes?: { tenant_id?: string[]; subdomain?: string[] };
}

interface JWTPayload {
  sub: string;
  email: string;
  name: string;
  given_name: string;
  family_name: string;
  realm_access?: { roles: string[] };
  roles?: string[];
  /** Array (enrichToken) or map (KC26 scope `organization`): { slug: { id, roles } } */
  organizations?: NormalizedOrg[] | Record<string, { id?: string; roles?: string[] }>;
  tenant_id?: string;
  exp?: number;
}

/**
 * Normalise les organizations du JWT (array legacy ou map KC26) en tableau uniforme.
 */
function normalizeOrganizations(raw: JWTPayload["organizations"]): NormalizedOrg[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  return Object.entries(raw).map(([slug, val]) => ({
    id: val?.id ?? slug,
    name: slug,
    roles: val?.roles ?? [],
  }));
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
  const main = (process.env.NEXT_PUBLIC_MAIN_DOMAIN || "syntixpharma.com").toLowerCase();
  const extras = (process.env.NEXT_PUBLIC_ROOT_HOSTS || "")
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);
  const list = [
    "localhost",
    "localhost:3000",
    "localhost:3001",
    "127.0.0.1",
    "127.0.0.1:3000",
    "127.0.0.1:3001",
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
 * Le proxy fait un check léger ; le vrai check granulaire se fait côté composant.
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
  loyalty: [
    "super_admin", "platform_admin", "tenant_owner", "tenant_admin",
    "pharmacy_owner", "pharmacy_manager", "pharmacist",
  ],
  notifications: [
    "super_admin", "platform_admin", "tenant_owner", "tenant_admin",
    "pharmacy_owner", "pharmacy_manager",
  ],
};

/**
 * Maps URL module segments to PRODUCT_ENTITLEMENT_KEYS values.
 * Used as a first-pass entitlement check at the Edge layer.
 * The cookie `entitled_modules` (set by the frontend after fetching
 * plan-entitlements) is a comma-separated list of enabled feature keys.
 * When the cookie is absent, the middleware allows the request
 * (the backend PlanEntitlementGuard is the authoritative gate).
 */
const MODULE_ENTITLEMENT_MAP: Record<string, string> = {
  sales: "module.sales",
  inventory: "module.inventory",
  patients: "module.patients",
  prescriptions: "module.prescriptions",
  vaccination: "module.vaccination",
  delivery: "module.delivery",
  billing: "module.billing_operations",
  accounting: "module.accounting",
  suppliers: "module.suppliers",
  "supply-chain": "module.supply_chain",
  quality: "module.quality",
  insurance: "module.insurance",
  "e-invoice": "module.e_invoice",
  hr: "module.hr",
  analytics: "module.analytics",
  reports: "module.reports",
  notifications: "module.notifications",
  loyalty: "module.loyalty",
  "audit-events": "module.compliance_audit",
  compliance: "module.compliance_audit",
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

/**
 * Extract user roles, merging realm roles with the roles from the **active** organization.
 * If `activeSlug` is provided, picks the org whose subdomain matches; otherwise falls back to first org.
 */
function extractUserRoles(payload: JWTPayload, activeSlug?: string): string[] {
  const orgs = normalizeOrganizations(payload.organizations);

  let activeOrg: NormalizedOrg | undefined;
  if (activeSlug) {
    activeOrg = orgs.find(
      (o) =>
        o.name?.toLowerCase() === activeSlug.toLowerCase() ||
        o.attributes?.subdomain?.[0]?.toLowerCase() === activeSlug.toLowerCase(),
    );
  }
  if (!activeOrg && orgs.length > 0) {
    activeOrg = orgs[0];
  }

  return [
    ...(payload.realm_access?.roles ?? []),
    ...(payload.roles ?? []),
    ...(activeOrg?.roles ?? []),
  ].map((r) => r.toLowerCase());
}

function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_ROUTES.includes(pathname)) return true;
  return PUBLIC_ROUTE_PATTERNS.some((p) => p.test(pathname));
}

const SYSTEM_HOST_PREFIXES = [
  "api", "admin", "mail", "cdn", "app", "www",
  "support", "help", "docs", "status", "blog", "shop",
  "staging", "dev", "test", "demo",
];

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

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host") || "";
  const pathname = url.pathname;
  const { locale: prefixedLocale, restPath } = splitLocalePrefix(pathname);

  // App routes are unprefixed in filesystem. Normalize /en/* and /fr/* to /* and persist locale.
  if (prefixedLocale) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = restPath;
    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set("NEXT_LOCALE", prefixedLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
  }

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
    // BFF sets kc_at (HttpOnly), client OIDC sets access_token — check both
    const cookieToken = req.cookies.get("kc_at")?.value || req.cookies.get("access_token")?.value;
    const token = authHeader.replace("Bearer ", "") || cookieToken;
    const payload = token ? safeDecodeJwt(token) : null;
    if (payload) {
      url.pathname = `/tenant/${tenantSlugHost}/dashboard`;
      return NextResponse.redirect(url);
    }
    url.pathname = `/tenant/${tenantSlugHost}/auth/login`;
    return NextResponse.redirect(url);
  }

  if (isPublicRoute(pathname)) {
    if (hasLocalePrefix(pathname)) {
      return handleI18nRouting(req);
    }
    return NextResponse.next();
  }

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

  if (!isProtected) {
    if (hasLocalePrefix(pathname)) {
      return handleI18nRouting(req);
    }
    return NextResponse.next();
  }

  const authHeader = req.headers.get("authorization") || "";
  const cookieToken = req.cookies.get("kc_at")?.value || req.cookies.get("access_token")?.value;
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

  const orgs = normalizeOrganizations(payload.organizations);

  // Detect the URL-level tenant slug for org-scoped role resolution
  const urlTenantSlug = pathname.startsWith("/tenant/")
    ? pathname.split("/")[2]?.toLowerCase()
    : tenantSlugHost?.toLowerCase();

  const userRoles = extractUserRoles(payload, urlTenantSlug);
  const isAdmin = userRoles.includes("system_admin") || userRoles.includes("super_admin");

  const userOrgSlugs = orgs
    .map((o) => (o.name || o.attributes?.subdomain?.[0] || ""))
    .filter(Boolean)
    .map((s) => s.toLowerCase());

  const tenantSlug =
    orgs[0]?.attributes?.subdomain?.[0] || orgs[0]?.name || payload.tenant_id || "";

  // Admin → /admin only, tenant users → /tenant only
  if (pathname.startsWith("/tenant") && isAdmin) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }
  if (pathname.startsWith("/admin") && !isAdmin) {
    return NextResponse.redirect(new URL(`/tenant/${tenantSlug}`, req.url));
  }

  // Cross-tenant isolation: verify user belongs to the tenant in the URL
  if (pathname.startsWith("/tenant/") && !isAdmin) {
    const urlSlug = pathname.split("/")[2]?.toLowerCase();
    if (urlSlug && userOrgSlugs.length > 0 && !userOrgSlugs.includes(urlSlug)) {
      const actualSlug = userOrgSlugs[0];
      url.pathname = `/tenant/${actualSlug}/dashboard`;
      url.searchParams.set("cross_tenant_blocked", urlSlug);
      return NextResponse.redirect(url);
    }
  }

  // Module-level RBAC + entitlement check for /tenant/:slug/:module/...
  if (pathname.startsWith("/tenant/")) {
    const pathParts = pathname.split("/");
    const moduleName = pathParts[3];

    if (moduleName && moduleName !== "auth" && moduleName !== "dashboard") {
      // RBAC check
      if (MODULE_ROLE_REQUIREMENTS[moduleName]) {
        const allowedRoles = MODULE_ROLE_REQUIREMENTS[moduleName];
        const hasAccess = userRoles.some((r) => allowedRoles.includes(r));
        if (!hasAccess) {
          url.pathname = `/tenant/${pathParts[2]}/dashboard`;
          return NextResponse.redirect(url);
        }
      }

      // Entitlement check (best-effort at the Edge via cookie)
      const entitlementKey = MODULE_ENTITLEMENT_MAP[moduleName];
      if (entitlementKey) {
        const entitledRaw = req.cookies.get("entitled_modules")?.value;
        if (entitledRaw) {
          const entitled = entitledRaw.split(",").map((s) => s.trim());
          if (!entitled.includes(entitlementKey)) {
            url.pathname = `/tenant/${pathParts[2]}/dashboard`;
            url.searchParams.set("plan_blocked", moduleName);
            return NextResponse.redirect(url);
          }
        }
      }
    }
  }

  return hasLocalePrefix(pathname) ? handleI18nRouting(req) : NextResponse.next();
}

export const config = {
  matcher: [
    "/tenant/:path*",
    "/admin/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
