"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "@/lib/i18n-simple";
import { Link } from "@/i18n/navigation";
import {
  buildModuleCategories,
  MARKETING_BRAND,
} from "@/content/platform-marketing";
import { MarketingIcon } from "@/components/public/marketing-icons";

export default function PlatformModulesShowcase() {
  const t = useTranslations("pages.modules");
  const tp = useTranslations("platformModules");
  const categories = useMemo(() => buildModuleCategories((key) => tp(key)), [tp]);
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "");

  const active =
    categories.find((c) => c.id === activeId) ?? categories[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-4">
        {t("tag")}
      </p>
      <h1 className="text-center text-3xl sm:text-5xl lg:text-6xl font-display font-bold text-slate-900 tracking-tight leading-[1.05] max-w-4xl mx-auto mb-4">
        {t("title")}{" "}
        <span className="text-emerald-600 italic">{MARKETING_BRAND.name}</span>,
        {" "}{t("titleEnd")}
      </h1>
      <p className="text-center text-lg text-slate-500 max-w-2xl mx-auto mb-10 sm:mb-14 font-medium leading-relaxed">
        {tp("brand.region")}
      </p>

      {/* Mobile: horizontal chips */}
      <div
        className="flex sm:hidden gap-2 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-thin"
        role="tablist"
        aria-label={t("categories")}
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={activeId === cat.id}
            onClick={() => setActiveId(cat.id)}
            className={`snap-start shrink-0 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              activeId === cat.id
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Desktop: vertical tabs */}
      <div className="hidden sm:flex gap-10 lg:gap-14">
        <nav
          className="w-56 lg:w-64 shrink-0 flex flex-col gap-1"
          role="tablist"
          aria-label={t("categories")}
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={activeId === cat.id}
              onClick={() => setActiveId(cat.id)}
              className={`text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeId === cat.id
                  ? "bg-slate-900 text-white shadow-lg"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </nav>

        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                {active.intro}
              </p>
              <ul className="grid gap-6 lg:grid-cols-2">
                {active.modules.map((m) => (
                  <li key={m.id}>
                    <Link
                      href={`/modules/${m.id}`}
                      className="block rounded-[2rem] border border-slate-100 bg-slate-50/50 p-6 lg:p-8 hover:bg-white hover:border-emerald-100 hover:shadow-lg transition-all"
                    >
                      <div className="flex gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shrink-0">
                          <MarketingIcon
                            name={m.icon}
                            className="w-6 h-6 text-emerald-600"
                          />
                        </div>
                        <div className="min-w-0">
                          <h2 className="text-lg font-display font-bold text-slate-900">
                            {m.title}
                          </h2>
                          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                            {m.tagline}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed mb-4">
                        {m.description}
                      </p>
                      <ul className="space-y-2 mb-3">
                        {m.outcomes.map((o) => (
                          <li
                            key={o}
                            className="text-sm text-slate-700 font-medium flex gap-2"
                          >
                            <span className="text-emerald-500 shrink-0">✓</span>
                            {o}
                          </li>
                        ))}
                      </ul>
                      {m.planNote ? (
                        <p className="text-xs text-slate-400 italic">{m.planNote}</p>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile: panel below chips */}
      <div className="sm:hidden mt-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-slate-500 text-sm font-medium mb-6 leading-relaxed">
              {active.intro}
            </p>
            <ul className="space-y-4">
              {active.modules.map((m) => (
                <li key={m.id}>
                  <Link
                    href={`/modules/${m.id}`}
                    className="block rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                        <MarketingIcon
                          name={m.icon}
                          className="w-5 h-5 text-emerald-600"
                        />
                      </div>
                      <div className="min-w-0">
                        <h2 className="font-display font-bold text-slate-900">
                          {m.title}
                        </h2>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                          {m.tagline}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed mb-3">
                      {m.description}
                    </p>
                    <ul className="text-xs text-slate-600 space-y-1">
                      {m.outcomes.map((o) => (
                        <li key={o}>• {o}</li>
                      ))}
                    </ul>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-16 sm:mt-20 rounded-[2rem] sm:rounded-[3rem] bg-slate-900 text-white p-8 sm:p-12 lg:p-16 text-center">
        <h2 className="text-2xl sm:text-4xl font-display font-bold mb-4">
          {t("readyTitle")}
        </h2>
        <p className="text-slate-400 max-w-lg mx-auto mb-8 text-sm sm:text-base">
          {t("readyDesc")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/register"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-colors"
          >
            {t("readyButton")}
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-white/20 font-bold hover:bg-white/10 transition-colors"
          >
            {t("viewPricing")}
          </Link>
        </div>
      </div>
    </div>
  );
}
