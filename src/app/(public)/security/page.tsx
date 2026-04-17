"use client";

import { motion } from "framer-motion";
import { ArrowRight, Lock, ShieldCheck, ScrollText, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "@/lib/i18n-simple";

const PILLARS = [
  { id: "multiTenant", icon: Lock },
  { id: "roles", icon: Users },
  { id: "audit", icon: ScrollText },
  { id: "compliance", icon: ShieldCheck },
] as const;

export default function SecurityPage() {
  const t = useTranslations("pages.security");

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-16 bg-white">
      <section className="px-4 sm:px-6 lg:px-8 text-center mb-12">
        <div className="max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-3"
          >
            {t("tag")}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold text-slate-900 mb-4 tracking-tight"
          >
            {t("title")} <span className="text-emerald-600">{t("titleHighlight")}</span>{" "}
            {t("titleEnd")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto"
          >
            {t("desc")}
          </motion.p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all"
            >
              {t("ctaTalk")}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/modules"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:border-emerald-200 hover:text-emerald-700 transition-all"
            >
              {t("ctaExplore")}
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 gap-5">
          {PILLARS.map((it, idx) => (
            <motion.div
              key={it.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.04 }}
              className="rounded-2xl border border-slate-100 bg-slate-50/50 p-7 hover:bg-white hover:shadow-xl hover:shadow-emerald-600/5 transition-all"
            >
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-5 border border-slate-100">
                <it.icon className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-lg font-display font-bold text-slate-900 mb-2">
                {t(`items.${it.id}.title`)}
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                {t(`items.${it.id}.desc`)}
              </p>
              <ul className="space-y-2 text-sm text-slate-700">
                {[t(`items.${it.id}.b1`), t(`items.${it.id}.b2`), t(`items.${it.id}.b3`)].map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="text-emerald-500">✓</span>
                    <span className="font-medium">{b}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 mt-14">
        <div className="max-w-6xl mx-auto rounded-3xl bg-slate-900 text-white p-8 sm:p-12">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <h2 className="text-2xl sm:text-3xl font-display font-bold mb-2">
                {t("bottomTitle")}
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                {t("bottomDesc")}
              </p>
            </div>
            <div className="flex gap-3 lg:justify-end">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 font-bold hover:bg-emerald-500 transition-colors w-full sm:w-auto"
              >
                {t("bottomCta")}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

