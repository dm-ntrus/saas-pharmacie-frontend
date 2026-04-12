import createIntlMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";

const intlMiddleware = createIntlMiddleware({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localePrefix: "as-needed",
});

export default function middleware(request: NextRequest) {
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|_vercel|favicon.ico|.*\\..*|sw.js|workbox-.*.js).*)",
  ],
};
