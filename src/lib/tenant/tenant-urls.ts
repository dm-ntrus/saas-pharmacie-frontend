/**
 * Chemin de connexion tenant (path-based). Le proxy réécrit aussi `https://{slug}.domaine/...`
 * vers `/tenant/{slug}/...` lorsque `NEXT_PUBLIC_MAIN_DOMAIN` / `NEXT_PUBLIC_ROOT_HOSTS` sont configurés.
 */
export function buildTenantLoginPath(subdomain: string | undefined | null): string {
  const s = (subdomain ?? "").trim().toLowerCase();
  if (!s) return "/auth/login";
  return `/tenant/${encodeURIComponent(s)}/auth/login`;
}
