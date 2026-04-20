"use client";

import { motion } from "framer-motion";
import { useTranslations } from "@/lib/i18n-simple";
import { ShieldCheck } from "lucide-react";
import { PLATFORM } from "@/config/platform";
import { useMarketingLegalPage } from "@/hooks/api/usePublicDynamicModules";

export default function PrivacyPage() {
  const t = useTranslations("pages.privacy");
  const { data } = useMarketingLegalPage("privacy");
  const sections = Array.from({ length: 8 }).map((_, idx) => ({
    title: t(`sections.s${idx + 1}.title`),
    content: t(`sections.s${idx + 1}.content`, { email: PLATFORM.email.privacy }),
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
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                {t("tag")}
              </p>
              <h1 className="text-xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
                {t("title")}
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            {t("lastUpdate")}
          </p>
        </motion.div>

        <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-5 sm:p-6 mb-10">
          <p className="text-xs sm:text-sm text-emerald-800 font-medium leading-relaxed">
            {t("intro")}
          </p>
        </div>

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
              href={`mailto:${data?.legal_contact_email ?? PLATFORM.email.privacy}`}
              className="text-emerald-600 font-bold hover:underline"
            >
              {data?.legal_contact_email ?? PLATFORM.email.privacy}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
