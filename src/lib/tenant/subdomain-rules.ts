/**
 * Aligné sur `TenantValidationService` (backend) — validation **format** uniquement (pas d’unicité).
 */
export const RESERVED_TENANT_SUBDOMAINS = new Set([
  "admin",
  "api",
  "www",
  "app",
  "mail",
  "ftp",
  "blog",
  "shop",
  "support",
  "help",
  "docs",
  "dev",
  "staging",
  "test",
  "demo",
  "dashboard",
  "portal",
  "billing",
  "account",
  "login",
  "signup",
  "register",
  "auth",
  "oauth",
  "sso",
  "cdn",
  "static",
  "assets",
  "media",
  "files",
  "uploads",
  "downloads",
  "status",
  "health",
  "monitoring",
  "metrics",
  "logs",
  "backup",
  "restore",
  "system",
]);

/** Retourne `null` si OK, sinon message d’erreur court pour l’UI. */
export function validateTenantSubdomainFormat(raw: string): string | null {
  const subdomain = raw.trim().toLowerCase();
  if (!subdomain) return "Le sous-domaine est requis.";
  if (subdomain.length < 3) return "Au moins 3 caractères.";
  if (subdomain.length > 50) return "50 caractères maximum.";
  if (!/^[a-z0-9-]+$/.test(subdomain)) {
    return "Lettres minuscules, chiffres et tirets uniquement.";
  }
  if (subdomain.startsWith("-") || subdomain.endsWith("-")) {
    return "Ne peut pas commencer ou finir par un tiret.";
  }
  if (subdomain.includes("--")) return "Pas de tirets consécutifs.";
  if (RESERVED_TENANT_SUBDOMAINS.has(subdomain)) {
    return "Ce sous-domaine est réservé.";
  }
  return null;
}

export function normalizeTenantSubdomain(raw: string): string {
  return raw.trim().toLowerCase();
}
