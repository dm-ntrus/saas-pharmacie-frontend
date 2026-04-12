"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "@/lib/i18n-simple";
import { MARKETING_BRAND } from "@/content/platform-marketing";

const STEP_KEYS = ["s1", "s2", "s3", "s4"] as const;

export default function ClientJourneySection() {
  const t = useTranslations("platformModules");

  return (
    <section
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white"
      aria-labelledby="journey-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">
            {t("clientJourney.sectionTag")}
          </p>
          <h2
            id="journey-heading"
            className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold text-slate-900 tracking-tight leading-[1.05] mb-4"
          >
            {t("clientJourney.titleBeforeBrand")}{" "}
            <span className="text-emerald-600 italic">{MARKETING_BRAND.name}</span>
          </h2>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            {t("clientJourney.subtitle")}
          </p>
        </div>

        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEP_KEYS.map((key, i) => (
            <motion.li
              key={key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="relative rounded-[2rem] border border-slate-100 bg-slate-50/60 p-6 sm:p-8 hover:border-emerald-200/80 hover:bg-white hover:shadow-lg hover:shadow-emerald-600/5 transition-all"
            >
              <span className="text-4xl font-display font-bold text-slate-200 absolute top-4 right-5 sm:top-6 sm:right-6">
                {t(`clientJourneySteps.${key}.step`)}
              </span>
              <h3 className="text-lg font-display font-bold text-slate-900 mb-3 pr-12">
                {t(`clientJourneySteps.${key}.title`)}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t(`clientJourneySteps.${key}.text`)}
              </p>
            </motion.li>
          ))}
        </ol>

        <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Link
            href="/modules"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 text-white text-sm font-bold hover:bg-emerald-600 transition-colors"
          >
            {t("clientJourney.ctaAllModules")}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/auth/register"
            className="text-sm font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-widest"
          >
            {t("clientJourney.ctaCreateSpace")}
          </Link>
        </div>
      </div>
    </section>
  );
}
