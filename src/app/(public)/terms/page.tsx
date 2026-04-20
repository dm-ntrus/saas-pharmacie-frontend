"use client";

import { motion } from "framer-motion";
import { useTranslations } from "@/lib/i18n-simple";
import { PLATFORM } from "@/config/platform";
import { useMarketingLegalPage } from "@/hooks/api/usePublicDynamicModules";

export default function TermsPage() {
  const t = useTranslations("pages.terms");
  const { data } = useMarketingLegalPage("terms");
  const sections = Array.from({ length: 8 }).map((_, idx) => ({
    title: t(`sections.s${idx + 1}.title`),
    content: t(`sections.s${idx + 1}.content`),
  }));
  const dynamicContent = typeof data?.content === "string" ? data.content : null;

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-14 sm:pb-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3">
            {t("tag")}
          </p>
          <h1 className="text-2xl sm:text-4xl font-display font-bold text-slate-900 mb-2 tracking-tight">
            {t("title")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {t("lastUpdate")}
          </p>
        </motion.div>

        {dynamicContent ? (
          <article className="prose prose-slate max-w-none">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans bg-transparent p-0">
              {dynamicContent}
            </pre>
          </article>
        ) : (
          <div className="space-y-7 sm:space-y-8">
            {sections.map((s) => (
              <div key={s.title}>
                <h2 className="text-base sm:text-lg font-display font-bold text-slate-900 mb-2">
                  {s.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {s.content}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
          <p className="text-sm text-slate-500">
            {t("questions")}{" "}
            <a
              href={`mailto:${PLATFORM.email.legal}`}
              className="text-emerald-600 font-bold hover:underline"
            >
              {PLATFORM.email.legal}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
