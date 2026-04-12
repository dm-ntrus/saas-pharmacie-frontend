"use client";

import { NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";
import frMessages from "../../messages/fr.json";
import enMessages from "../../messages/en.json";
import frPlatform from "../../messages/platform-fr.json";
import enPlatform from "../../messages/platform-en.json";

type Props = {
  children: ReactNode;
  locale?: string;
};

const allMessages = {
  fr: { ...frMessages, ...frPlatform },
  en: { ...enMessages, ...enPlatform },
};

export function I18nProvider({ children, locale = "fr" }: Props) {
  const messages = allMessages[locale as keyof typeof allMessages] || allMessages.fr;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
