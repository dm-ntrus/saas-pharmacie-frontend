/**
 * Mock auth pour développement : génère des JWT valides (décodables) pour admin et tenant
 * afin de tester les sidebars et menus sans backend Keycloak.
 */
import type { JWTPayload } from "@/types/types";

const JWT_HEADER = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"; // { alg: "HS256", typ: "JWT" }
const FAKE_SIG = "mock_signature_do_not_verify";

function base64urlEncode(obj: object): string {
  const json = JSON.stringify(obj);
  const base64 = typeof btoa !== "undefined"
    ? btoa(unescape(encodeURIComponent(json)))
    : Buffer.from(json, "utf8").toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function buildMockJwt(payload: JWTPayload): string {
  const payloadB64 = base64urlEncode(payload);
  return `${JWT_HEADER}.${payloadB64}.${FAKE_SIG}`;
}

const now = Math.floor(Date.now() / 1000);
const exp = now + 86400 * 7; // 7 jours

const adminPayload: JWTPayload = {
  exp,
  iat: now,
  jti: "mock-admin-jti",
  iss: "mock-issuer",
  sub: "mock-admin-user-id",
  typ: "Bearer",
  azp: "mock-client",
  email: "admin@gmail.com",
  email_verified: true,
  name: "Admin SyntixPharma",
  preferred_username: "admin",
  given_name: "Admin",
  family_name: "SyntixPharma",
  realm_access: { roles: ["system_admin"] },
  resource_access: {},
  organizations: [],
};

const tenantPayload: JWTPayload = {
  exp,
  iat: now,
  jti: "mock-tenant-jti",
  iss: "mock-issuer",
  sub: "mock-tenant-user-id",
  typ: "Bearer",
  azp: "mock-client",
  email: "tenant@pharma.cd",
  email_verified: true,
  name: "Responsable Pharmacie Demo",
  preferred_username: "tenant",
  given_name: "Responsable",
  family_name: "Demo",
  realm_access: { roles: ["pharmacist"] },
  resource_access: {},
  organizations: [
    {
      id: "org-demo-keycloak-id",
      name: "Pharmacie Demo",
      roles: ["org_admin", "pharmacist", "cashier", "admin"],
      attributes: {
        tenant_id: ["t1"],
        subdomain: ["demo"],
      },
    },
    {
      id: "org-demo-2-keycloak-id",
      name: "Pharmacie Demo 2",
      roles: ["org_admin", "pharmacist", "cashier", "admin"],
      attributes: {
        tenant_id: ["t2"],
        subdomain: ["demo2"],
      },
    },
  ],
};

export function getMockAdminTokens(): { access: string; refresh: string } {
  return {
    access: buildMockJwt(adminPayload),
    refresh: buildMockJwt({ ...adminPayload, jti: "mock-admin-refresh" }),
  };
}

export function getMockTenantTokens(): { access: string; refresh: string } {
  return {
    access: buildMockJwt(tenantPayload),
    refresh: buildMockJwt({ ...tenantPayload, jti: "mock-tenant-refresh" }),
  };
}

/** Identifiants mock pour la page de login (dev uniquement) */
export const MOCK_CREDENTIALS = {
  admin: { email: "admin@gmail.com", password: "admin" },
  tenant: { email: "tenant@pharma.cd", password: "tenant" },
} as const;

export function isMockAdmin(email: string, password: string): boolean {
  return (
    email === MOCK_CREDENTIALS.admin.email &&
    password === MOCK_CREDENTIALS.admin.password
  );
}

export function isMockTenant(email: string, password: string): boolean {
  return (
    email === MOCK_CREDENTIALS.tenant.email &&
    password === MOCK_CREDENTIALS.tenant.password
  );
}
