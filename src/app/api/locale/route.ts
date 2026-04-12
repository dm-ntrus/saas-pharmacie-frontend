import { NextRequest, NextResponse } from "next/server";
import { locales, type Locale } from "@/i18n/routing";

const COOKIE_NAME = "NEXT_LOCALE";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const locale = body.locale as Locale;

  if (!locale || !locales.includes(locale)) {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
  }

  const response = NextResponse.json({ locale });

  response.cookies.set(COOKIE_NAME, locale, {
    path: "/",
    maxAge: 365 * 24 * 60 * 60,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
