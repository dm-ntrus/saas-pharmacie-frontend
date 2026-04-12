import createMiddleware from "next-intl/middleware";

const middleware = createMiddleware({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localePrefix: "as-needed",
});

export default middleware;

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|_vercel|favicon.ico|.*\\..*|sw.js|workbox-.*.js).*)",
  ],
};
