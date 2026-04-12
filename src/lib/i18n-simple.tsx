"use client";

import { createContext, useContext, ReactNode } from "react";
import frMessages from "../../messages/fr.json";
import enMessages from "../../messages/en.json";
import frPlatform from "../../messages/platform-fr.json";
import enPlatform from "../../messages/platform-en.json";

const allMessages = {
  fr: { ...frMessages, ...frPlatform },
  en: { ...enMessages, ...enPlatform },
};

type Locale = "fr" | "en";

const I18nContext = createContext<{
  locale: Locale;
  messages: any;
}>({
  locale: "fr",
  messages: allMessages.fr,
});

export function SimpleI18nProvider({
  children,
  locale = "fr",
}: {
  children: ReactNode;
  locale?: Locale;
}) {
  const messages = allMessages[locale] || allMessages.fr;

  return (
    <I18nContext.Provider value={{ locale, messages }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslations(namespace?: string) {
  const { messages } = useContext(I18nContext);

  return (key: string, values?: Record<string, any>) => {
    if (!namespace) {
      let text = messages[key] || key;
      if (values) {
        Object.entries(values).forEach(([k, v]) => {
          text = text.replace(new RegExp(`{${k}}`, 'g'), v);
        });
      }
      return text;
    }
    
    const keys = `${namespace}.${key}`.split(".");
    let value: any = messages;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return key;
    }
    
    let text = value || key;
    if (values) {
      Object.entries(values).forEach(([k, v]) => {
        text = text.replace(new RegExp(`{${k}}`, 'g'), v);
      });
    }
    
    return text;
  };
}

export function useLocale() {
  const { locale } = useContext(I18nContext);
  return locale;
}

export function useMessages() {
  const { messages } = useContext(I18nContext);
  return messages;
}
