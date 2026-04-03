"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Globe, Check, ChevronDown } from "lucide-react";
import { I18N_CONFIG } from "@/i18n/i18n.config";
import { locales, type Locale } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";

async function setLocaleCookie(locale: Locale) {
  await fetch("/api/locale", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ locale }),
  });
}

interface LanguageSwitcherProps {
  variant?: "default" | "compact" | "footer";
  className?: string;
}

export default function LanguageSwitcher({
  variant = "default",
  className = "",
}: LanguageSwitcherProps) {
  const currentLocale = useLocale() as Locale;
  const t = useTranslations("languageSwitcher");
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const handleLocaleChange = async (locale: Locale) => {
    if (locale === currentLocale) {
      setOpen(false);
      return;
    }
    setOpen(false);
    await setLocaleCookie(locale);
    startTransition(() => {
      router.replace(pathname, { locale });
    });
  };

  const currentSettings = I18N_CONFIG.languageSettings[currentLocale];

  if (variant === "compact") {
    return (
      <div ref={dropdownRef} className={`relative ${className}`}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          disabled={isPending}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={t("label")}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all disabled:opacity-50"
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="uppercase">{currentLocale}</span>
        </button>
        {open && (
          <div
            className="absolute top-full mt-1 end-0 bg-white rounded-xl border border-slate-200 shadow-xl shadow-slate-200/50 py-1 min-w-[140px] z-50"
            role="listbox"
            aria-label={t("label")}
          >
            {locales.map((locale) => {
              const settings = I18N_CONFIG.languageSettings[locale];
              return (
                <button
                  key={locale}
                  type="button"
                  role="option"
                  aria-selected={locale === currentLocale}
                  onClick={() => handleLocaleChange(locale)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
                    locale === currentLocale
                      ? "bg-emerald-50 text-emerald-700 font-bold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-base">{settings.flag}</span>
                  <span className="flex-1 text-start">{settings.nativeName}</span>
                  {locale === currentLocale && (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Globe className="w-4 h-4 text-slate-400" />
        {locales.map((locale) => {
          const settings = I18N_CONFIG.languageSettings[locale];
          return (
            <button
              key={locale}
              type="button"
              onClick={() => handleLocaleChange(locale)}
              disabled={isPending}
              className={`px-2 py-1 rounded text-xs font-bold transition-colors disabled:opacity-50 ${
                locale === currentLocale
                  ? "text-emerald-400 bg-emerald-400/10"
                  : "text-slate-500 hover:text-white"
              }`}
            >
              {settings.nativeName}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        disabled={isPending}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t("label")}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 hover:border-emerald-300 hover:text-emerald-600 transition-all disabled:opacity-50"
      >
        <Globe className="w-4 h-4" />
        <span>{currentSettings.nativeName}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div
          className="absolute top-full mt-2 end-0 bg-white rounded-xl border border-slate-200 shadow-xl shadow-slate-200/50 py-1.5 min-w-[180px] z-50"
          role="listbox"
          aria-label={t("label")}
        >
          {locales.map((locale) => {
            const settings = I18N_CONFIG.languageSettings[locale];
            return (
              <button
                key={locale}
                type="button"
                role="option"
                aria-selected={locale === currentLocale}
                onClick={() => handleLocaleChange(locale)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  locale === currentLocale
                    ? "bg-emerald-50 text-emerald-700 font-bold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span className="text-lg">{settings.flag}</span>
                <span className="flex-1 text-start">{settings.nativeName}</span>
                {locale === currentLocale && (
                  <Check className="w-4 h-4 text-emerald-600" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
