"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "@/lib/i18n-simple";
import {
  buildHomepageModuleHighlights,
  TOTAL_PLATFORM_MODULES,
} from "@/content/platform-marketing";
import { MarketingIcon } from "@/components/public/marketing-icons";

export default function PlatformModulesPreview() {
  const t = useTranslations("pages.home");
  const tp = useTranslations("platformModules");
  const highlights = useMemo(
    () => buildHomepageModuleHighlights((key) => tp(key)),
    [tp],
  );

  return (
    <section
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50"
      aria-labelledby="modules-preview-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-4">
              {t("modulesPreviewTag")}
            </p>
            <h2
              id="modules-preview-heading"
              className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold text-slate-900 tracking-tight leading-[1.05]"
            >
              {t("modulesPreviewTitleStart")}{" "}
              <span className="text-emerald-600 italic">{t("modulesPreviewTitleHighlight")}</span>
            </h2>
          </div>
          <p className="text-lg text-slate-600 max-w-md font-medium leading-relaxed">
            {t("modulesPreviewDesc")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {highlights.map((m, i) => (
            <motion.article
              key={m.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-[2rem] border border-slate-100 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-5">
                <MarketingIcon name={m.icon} className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900 mb-1">
                {m.title}
              </h3>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                {m.tagline}
              </p>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {m.description}
              </p>
              <ul className="space-y-2">
                {m.outcomes.map((o) => (
                  <li
                    key={o}
                    className="text-xs text-slate-500 font-medium flex gap-2 before:content-[''] before:w-1 before:rounded-full before:bg-emerald-500 before:shrink-0 before:mt-1.5"
                  >
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
              {m.planNote ? (
                <p className="mt-4 text-[11px] text-slate-400 italic">{m.planNote}</p>
              ) : null}
            </motion.article>
          ))}
        </div>

        <div className="mt-12 text-center sm:text-left">
          <Link
            href="/modules"
            className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-emerald-600 hover:text-slate-900 transition-colors"
          >
            {t("modulesPreviewCta", { count: TOTAL_PLATFORM_MODULES })}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
