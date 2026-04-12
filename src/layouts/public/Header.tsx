"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "@/lib/i18n-simple";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Link } from "@/i18n/navigation";

const PRIMARY_LINKS = [
  { href: "/modules", key: "platform" },
  { href: "/solutions", key: "solutions" },
  { href: "/features", key: "features" },
  { href: "/pricing", key: "pricing" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

const SECONDARY_LINKS = [
  { href: "/support", key: "helpCenter" },
  { href: "/plan_demo", key: "demo" },
  { href: "/api-docs", key: "api" },
  { href: "/status", key: "statusPage" },
  { href: "/signup", key: "offers" },
] as const;

export default function Header() {
  const pathname = usePathname();
  const t = useTranslations("layout.header");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-slate-100 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-[72px]">
            {/* Logo */}
            <Link href="/" className="shrink-0">
              <span className="font-display font-bold text-xl sm:text-2xl text-emerald-600 tracking-tight">
                Syntix<span className="text-slate-900">Pharma</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {PRIMARY_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[13px] font-bold uppercase tracking-widest transition-colors ${
                    pathname === link.href
                      ? "text-emerald-600"
                      : "text-slate-600 hover:text-emerald-600"
                  }`}
                >
                  {t(link.key)}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-5">
              <LanguageSwitcher variant="compact" />
              <Link
                href="/auth/login"
                className="text-[13px] font-bold text-slate-600 hover:text-slate-900 uppercase tracking-widest transition-colors"
              >
                {t("login")}
              </Link>
              <Link
                href="/auth/register"
                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-slate-900/10"
              >
                {t("freeTrial")}
              </Link>
            </div>

            {/* Mobile */}
            <div className="flex lg:hidden items-center gap-2">
              <LanguageSwitcher variant="compact" />
              <Link
                href="/auth/login"
                className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-emerald-600 hover:bg-emerald-50 transition-all"
              >
                {t("login")}
              </Link>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-600 border border-slate-200 bg-white hover:border-emerald-300 hover:text-emerald-600 transition-all"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {menuOpen ? (
                    <motion.span
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.12 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.12 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-30 lg:hidden"
            />

            <motion.div
              key="drawer"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-[68px] left-3 right-3 bg-white rounded-2xl border border-slate-100 shadow-2xl shadow-slate-900/10 z-40 lg:hidden overflow-hidden max-h-[calc(100dvh-80px)] overflow-y-auto"
            >
              {/* Primary links */}
              <nav className="p-3 space-y-0.5">
                {PRIMARY_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 + 0.04 }}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                        pathname === link.href
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {t(link.key)}
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mx-4 border-t border-slate-100" />

              {/* Secondary links */}
              <nav className="p-3 space-y-0.5">
                {SECONDARY_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay:
                        PRIMARY_LINKS.length * 0.03 +
                        i * 0.03 +
                        0.06,
                    }}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center px-4 py-2.5 rounded-xl text-sm text-slate-500 hover:text-emerald-600 hover:bg-slate-50 transition-all ${
                        pathname === link.href ? "text-emerald-600 font-bold" : ""
                      }`}
                    >
                      {t(link.key)}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mx-4 border-t border-slate-100" />

              {/* CTA */}
              <div className="p-3">
                <Link
                  href="/auth/register"
                  className="block w-full py-3.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all text-center shadow-lg shadow-slate-900/10"
                >
                  {t("freeTrial")}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
