export default function ApiDocsPage() {
  // Server redirect: keep marketing surface non-technical.
  // (Next.js treats this page as a server component without "use client".)
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { redirect } = require("next/navigation") as typeof import("next/navigation");
  redirect("/integrations");
}
