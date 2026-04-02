/**
 * Platform branding constants resolved from environment variables.
 * All public pages should reference these instead of hardcoding domain names.
 */

const DOMAIN = process.env.NEXT_PUBLIC_MAIN_DOMAIN || "syntixpharma.com";

export const PLATFORM = {
  domain: DOMAIN,
  name: "SyntixPharma",
  url: `https://${DOMAIN}`,
  apiDocsUrl: `https://api.${DOMAIN}`,

  email: {
    contact: `contact@${DOMAIN}`,
    support: `support@${DOMAIN}`,
    legal: `legal@${DOMAIN}`,
    privacy: `privacy@${DOMAIN}`,
  },
} as const;
