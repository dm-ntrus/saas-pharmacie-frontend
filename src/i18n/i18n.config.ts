import type { Locale } from "./routing";

export type LanguageSettings = {
  name: string;
  nativeName: string;
  currency: string;
  timezone: string;
  dateFormat: string;
  timeFormat: "12h" | "24h";
  direction: "ltr" | "rtl";
  numberFormat: string;
  flag: string;
};

export const I18N_CONFIG: {
  defaultLanguage: Locale;
  supportedLanguages: Locale[];
  languageSettings: Record<Locale, LanguageSettings>;
} = {
  defaultLanguage: "fr",
  supportedLanguages: ["fr", "en"],

  languageSettings: {
    fr: {
      name: "Français",
      nativeName: "Français",
      currency: "XOF",
      timezone: "Africa/Abidjan",
      dateFormat: "DD/MM/YYYY",
      timeFormat: "24h",
      direction: "ltr",
      numberFormat: "fr-FR",
      flag: "🇫🇷",
    },
    en: {
      name: "English",
      nativeName: "English",
      currency: "USD",
      timezone: "UTC",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12h",
      direction: "ltr",
      numberFormat: "en-US",
      flag: "🇬🇧",
    },
  },
};
