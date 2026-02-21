"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { I18N_CONFIG } from "@/i18n/i18n.config";
import { setCookie, getCookie } from "@/utils/cookies";

const COOKIE_NAME = "language";

// Cache global des traductions (évite de re-télécharger la même langue)
const translationCache = new Map<string, Record<string, string>>();

interface I18nContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, params?: Record<string, any>) => string;
  formatDate: (date: Date | string | number) => string;
  formatDateTime: (date: Date | string | number) => string;
  formatTime: (date: Date | string | number) => string;
  formatNumber: (num: number | string) => string;
  formatCurrency: (amount: number | string) => string;
  direction: "ltr" | "rtl";
  isLoaded: boolean; // Permet d'éviter le flash de langue par défaut
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<string>(I18N_CONFIG.defaultLanguage);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Récupère la langue sauvegardée (cookie → localStorage)
  const getSavedLanguage = useCallback(() => {
    const fromCookie = getCookie(COOKIE_NAME);
    const fromStorage =
      typeof window !== "undefined" ? localStorage.getItem(COOKIE_NAME) : null;
    return fromCookie || fromStorage;
  }, []);

  // Chargement initial de la langue au montage du composant
  useEffect(() => {
    const saved = getSavedLanguage();
    const validLang =
      saved && I18N_CONFIG.supportedLanguages.includes(saved)
        ? saved
        : I18N_CONFIG.defaultLanguage;

    setLanguageState(validLang);
    applyDirection(validLang);
    setIsLoaded(true);
  }, [getSavedLanguage]);

  // Chargement des fichiers de traduction (avec cache)
  const loadTranslations = useCallback(async (lang: string) => {
    // Si déjà en cache → on l'utilise directement
    if (translationCache.has(lang)) {
      setTranslations(translationCache.get(lang)!);
      return;
    }

    try {
      // ?t= timestamp pour forcer le refresh en dev
      const res = await fetch(`/locales/${lang}.json?t=${Date.now()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Impossible de charger ${lang}`);
      const data = await res.json();
      translationCache.set(lang, data);
      setTranslations(data);
    } catch (err) {
      console.error("Erreur chargement traduction :", err);
      setTranslations({}); // fallback vide
    }
  }, []);

  // Recharge les traductions quand la langue change (après isLoaded)
  useEffect(() => {
    if (isLoaded) loadTranslations(language);
  }, [language, isLoaded, loadTranslations]);

  // Applique la direction (ltr/rtl) et l'attribut lang sur <html>
  const applyDirection = (lang: string) => {
    const dir = I18N_CONFIG.languageSettings[lang]?.direction || "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  };

  // Change la langue + persistance (cookie + localStorage)
  const setLanguage = (lang: string) => {
    if (!I18N_CONFIG.supportedLanguages.includes(lang)) return;

    setLanguageState(lang);
    setCookie(COOKIE_NAME, lang, 365); // 1 an
    localStorage.setItem(COOKIE_NAME, lang);
    applyDirection(lang);
  };

  // Fonction de traduction avec support des clés imbriquées et des paramètres
  const t = (key: string, params?: Record<string, any>): string => {
    // Support des clés comme "errors.validation.required"
    const keys = key.split(".");
    let value: any = translations;
    for (const k of keys) {
      value = value?.[k];
    }
    value = value ?? key; // fallback sur la clé si introuvable

    // Remplacement des paramètres {{variable}}
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        value = value.replace(new RegExp(`{{${k}}}`, "g"), String(v));
      });
    }

    return value;
  };

  // Récupère le locale (ex: "fr-FR") selon la langue actuelle
  const getLocale = () =>
    I18N_CONFIG.languageSettings[language]?.numberFormat || "fr-FR";

  const formatDate = (date: Date | string | number): string => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Date invalide";
    return new Intl.DateTimeFormat(getLocale(), {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);
  };

  const formatDateTime = (date: Date | string | number): string => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Date invalide";
    return new Intl.DateTimeFormat(getLocale(), {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  };

  const formatTime = (date: Date | string | number): string => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "--:--";
    return new Intl.DateTimeFormat(getLocale(), {
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  };

  const formatNumber = (num: number | string): string => {
    return new Intl.NumberFormat(getLocale()).format(Number(num));
  };

  const formatCurrency = (amount: number | string): string => {
    const settings = I18N_CONFIG.languageSettings[language];
    return new Intl.NumberFormat(getLocale(), {
      style: "currency",
      currency: settings.currency,
    }).format(Number(amount));
  };

  const direction = I18N_CONFIG.languageSettings[language]?.direction || "ltr";

  // Évite de rendre avant que la langue soit chargée (évite flash)
  if (!isLoaded) {
    return null;
  }

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t,
        formatDate,
        formatDateTime,
        formatTime,
        formatNumber,
        formatCurrency,
        direction,
        isLoaded,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n doit être utilisé à l'intérieur d'un I18nProvider");
  }
  return context;
};