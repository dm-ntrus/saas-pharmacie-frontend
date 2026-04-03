import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { locales, defaultLocale, type Locale } from "./routing";

const COOKIE_NAME = "NEXT_LOCALE";

function negotiateLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;
  const preferred = acceptLanguage
    .split(",")
    .map((part) => {
      const [lang, q] = part.trim().split(";q=");
      return { lang: lang.split("-")[0].toLowerCase(), q: q ? parseFloat(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { lang } of preferred) {
    const match = locales.find((l) => l === lang);
    if (match) return match;
  }
  return defaultLocale;
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const cookieLocale = cookieStore.get(COOKIE_NAME)?.value as Locale | undefined;
  const acceptLang = headerStore.get("accept-language");

  let locale: Locale = defaultLocale;

  if (cookieLocale && locales.includes(cookieLocale)) {
    locale = cookieLocale;
  } else if (acceptLang) {
    locale = negotiateLocale(acceptLang);
  }

  const base = (await import(`../../messages/${locale}.json`)).default;
  const platformExtra = (await import(`../../messages/platform-${locale}.json`))
    .default;

  return {
    locale,
    messages: { ...base, ...platformExtra },
  };
});
