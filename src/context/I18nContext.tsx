"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { I18N_CONFIG } from "@/i18n/i18n.config";

const COOKIE_NAME = "language";

const setLanguageCookie = (lang: string) => {
  document.cookie = `${COOKIE_NAME}=${lang};  path=/; SameSite=Lax; ${
    process.env.NODE_ENV === "production" ? "Secure;" : ""
  }`;
  localStorage.setItem(`${COOKIE_NAME}`, lang);
};

const getLanguageCookie = (): string | null => {
  const match = document.cookie.match(
    new RegExp("(^| )" + COOKIE_NAME + "=([^;]+)")
  );
  return match ? decodeURIComponent(match[2]) : null;
};

// Context
interface I18nContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, params?: Record<string, any>) => string;
  formatDate: (date: Date) => string;
  formatNumber: (num: number) => string;
  formatCurrency: (amount: number) => string;
  direction: "ltr" | "rtl";
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<string>(
    I18N_CONFIG.defaultLanguage
  );
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoaded, setIsLoaded] = useState(false); // Évite flash de langue par défaut

  // 1. Charger la langue depuis le cookie au montage
  useEffect(() => {
    const savedLang = getLanguageCookie() || localStorage.getItem(`${COOKIE_NAME}`);
    const lang =
      savedLang && I18N_CONFIG.supportedLanguages.includes(savedLang)
        ? savedLang
        : I18N_CONFIG.defaultLanguage;

    setLanguageState(lang);
    applyLanguageDirection(lang);
    setIsLoaded(true);
  }, []);

  // 2. Charger les traductions quand la langue change
  useEffect(() => {
    if (!isLoaded) return;
    loadTranslations(language);
  }, [language, isLoaded]);

  const loadTranslations = async (lang: string) => {
    try {
      const response = await fetch(`/locales/${lang}.json`, {
        cache: "no-store",
      });
      const data = await response.json();
      setTranslations(data);
    } catch (error) {
      console.error(`Failed to load translations for ${lang}`, error);
      setTranslations({});
    }
  };

  const applyLanguageDirection = (lang: string) => {
    const settings = I18N_CONFIG.languageSettings[lang];
    document.documentElement.dir = settings.direction;
    document.documentElement.lang = lang;
  };

  const setLanguage = (lang: string) => {
    if (!I18N_CONFIG.supportedLanguages.includes(lang)) return;

    setLanguageState(lang);
    setLanguageCookie(lang); // Cookie persistant
    applyLanguageDirection(lang);
  };

  const t = (key: string, params?: Record<string, any>): string => {
    let translation = translations[key] || key;

    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        translation = translation.replace(
          new RegExp(`{{${k}}}`, "g"),
          String(v)
        );
      });
    }

    return translation;
  };

  const formatDate = (date: Date) => {
    const settings = I18N_CONFIG.languageSettings[language];
    return new Intl.DateTimeFormat(settings.numberFormat, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  };

  const formatNumber = (num: number) => {
    const settings = I18N_CONFIG.languageSettings[language];
    return new Intl.NumberFormat(settings.numberFormat).format(num);
  };

  const formatCurrency = (amount: number) => {
    const settings = I18N_CONFIG.languageSettings[language];
    return new Intl.NumberFormat(settings.numberFormat, {
      style: "currency",
      currency: settings.currency,
    }).format(amount);
  };

  const direction = I18N_CONFIG.languageSettings[language]?.direction || "ltr";

  // Évite de rendre avant que la langue soit chargée (évite flash)
  if (!isLoaded) {
    return null; // ou un petit loader
  }

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t,
        formatDate,
        formatNumber,
        formatCurrency,
        direction,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within I18nProvider");
  return context;
};
