const IS_PRODUCTION = process.env.NODE_ENV === "production";

/**
 * In production, cookies must be scoped to the root domain (e.g. `.syntixpharma.com`)
 * so they are shared across all tenant subdomains (pharma1.syntixpharma.com,
 * pharma2.syntixpharma.com, etc.). Without this, organization switching across
 * subdomains would lose session cookies.
 *
 * Set `NEXT_PUBLIC_COOKIE_DOMAIN=.syntixpharma.com` in production .env.
 * On localhost (dev), leave unset — browsers reject Domain on localhost.
 */
function getCookieDomain(): string | undefined {
  return process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const setCookie = (name: string, value: string, days = 365) => {
  if (typeof document === "undefined") return;
  const expires = new Date(
    Date.now() + days * 24 * 60 * 60 * 1000,
  ).toUTCString();
  const parts = [
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
    `expires=${expires}`,
    "path=/",
    "SameSite=Lax",
  ];
  const domain = getCookieDomain();
  if (domain) parts.push(`Domain=${domain}`);
  if (IS_PRODUCTION) parts.push("Secure");
  document.cookie = parts.join("; ");
};

export const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const escaped = escapeRegex(encodeURIComponent(name));
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + escaped + "=([^;]*)"),
  );
  return match ? decodeURIComponent(match[1]) : null;
};

export const removeCookie = (name: string) => {
  if (typeof document === "undefined") return;
  const parts = [
    `${encodeURIComponent(name)}=`,
    "Max-Age=0",
    "path=/",
    "SameSite=Lax",
  ];
  const domain = getCookieDomain();
  if (domain) parts.push(`Domain=${domain}`);
  if (IS_PRODUCTION) parts.push("Secure");
  document.cookie = parts.join("; ");
};
