"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "@/lib/i18n-simple";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight, Shield, Award } from "lucide-react";
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
] as const;

export default function Header() {
  const pathname = usePathname();
  const t = useTranslations("layout.header");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 w-full z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-slate-100/80"
            : "bg-white/70 backdrop-blur-lg"
        }`}
      >
        {/* Compliance micro-bar — hidden on mobile for cleaner UX */}
        <div className="hidden sm:block bg-slate-50/80 border-b border-slate-100/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-5 py-1">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-emerald-600" />
                <span className="text-[11px] font-semibold text-slate-500">
                  {t("gdpCompliant")}
                </span>
              </div>
              <div className="w-px h-3 bg-slate-200" />
              <div className="flex items-center gap-1.5">
                <Award className="w-3 h-3 text-emerald-600" />
                <span className="text-[11px] font-semibold text-slate-500">
                  ISO 27001
                </span>
              </div>
              <div className="w-px h-3 bg-slate-200" />
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse-subtle" />
                <span className="text-[11px] font-medium text-emerald-600">
                  {t("systemsOperational")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link href="/" className="shrink-0 group flex items-center gap-2.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:shadow-emerald-200/50 transition-all">
                <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white">
                  <rect x="9" y="3" width="6" height="18" rx="1" fill="currentColor" opacity="0.9" />
                  <rect x="3" y="9" width="18" height="6" rx="1" fill="currentColor" />
                </svg>
              </div>
              <span className="font-display font-bold text-lg sm:text-xl text-emerald-600 tracking-tight">
                Syntix<span className="text-slate-900">Pharma</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {PRIMARY_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                    pathname === link.href
                      ? "text-emerald-700 bg-emerald-50/80"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {t(link.key)}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <LanguageSwitcher variant="compact" />
              <Link
                href="/auth/login"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                {t("login")}
              </Link>
              <Link
                href="/auth/register"
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-all shadow-sm hover:shadow-md"
              >
                {t("freeTrial")}
              </Link>
            </div>

            {/* Mobile actions */}
            <div className="flex lg:hidden items-center gap-1.5">
              <LanguageSwitcher variant="compact" />
              <Link
                href="/auth/login"
                className="px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/60 transition-all"
              >
                {t("login")}
              </Link>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
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
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 lg:hidden"
            />

            <motion.div
              key="drawer"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-[56px] sm:top-16 left-3 right-3 bg-white rounded-2xl border border-slate-100 shadow-xl z-40 lg:hidden overflow-hidden max-h-[calc(100dvh-72px)] sm:max-h-[calc(100dvh-80px)] overflow-y-auto"
            >
              {/* Primary links */}
              <nav className="p-2 space-y-0.5">
                {PRIMARY_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 + 0.04 }}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
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
              <nav className="p-2 space-y-0.5">
                {SECONDARY_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: PRIMARY_LINKS.length * 0.03 + i * 0.03 + 0.06,
                    }}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center px-4 py-2.5 rounded-xl text-sm text-slate-500 hover:text-emerald-600 hover:bg-slate-50 transition-all ${
                        pathname === link.href ? "text-emerald-600 font-semibold" : ""
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
                  className="block w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-all text-center"
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
