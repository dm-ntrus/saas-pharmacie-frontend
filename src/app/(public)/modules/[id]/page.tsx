"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { MarketingIcon } from "@/components/public/marketing-icons";
import { useTranslations } from "@/lib/i18n-simple";
import {
  PLATFORM_MODULE_META,
} from "@/content/platform-marketing-structure";
import { MARKETING_MODULE_DETAILS } from "@/content/platform-marketing-details";

export default function PublicModuleDetailsPage() {
  const params = useParams<{ id?: string }>();
  const id = typeof params?.id === "string" ? params.id : "";
  const tp = useTranslations("platformModules");

  const meta = PLATFORM_MODULE_META[id];
  if (!meta) {
    return (
      <div className="min-h-screen pt-28 sm:pt-32 pb-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/modules"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux modules
          </Link>
          <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50/50 p-6">
            <p className="text-sm text-slate-700 font-semibold">
              Module introuvable.
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Ce module n’est pas encore référencé dans le catalogue marketing.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const details = MARKETING_MODULE_DETAILS[id];

  const title = tp(`modules.${id}.title`);
  const tagline = tp(`modules.${id}.tagline`);
  const description = tp(`modules.${id}.description`);
  const outcomes = useMemo(
    () => [tp(`modules.${id}.outcome0`), tp(`modules.${id}.outcome1`)],
    [tp, id],
  );
  const planNote = meta.planNote ? tp(`modules.${id}.planNote`) : "";

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/modules"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux modules
          </Link>
        </div>

        <section className="grid lg:grid-cols-12 gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-7"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
                <MarketingIcon name={meta.icon} className="w-7 h-7 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-2">
                  Module
                </p>
                <h1 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 tracking-tight leading-[1.05]">
                  {title}
                </h1>
                <p className="text-sm font-bold uppercase tracking-widest text-emerald-600 mt-2">
                  {tagline}
                </p>
              </div>
            </div>

            <p className="text-base sm:text-lg text-slate-500 leading-relaxed mt-6">
              {description}
            </p>

            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {outcomes.map((o) => (
                <div
                  key={o}
                  className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5"
                >
                  <p className="text-sm font-semibold text-slate-800">{o}</p>
                </div>
              ))}
            </div>

            {planNote ? (
              <p className="mt-4 text-xs text-slate-400 italic">{planNote}</p>
            ) : null}
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="lg:col-span-5"
          >
            <div className="rounded-3xl bg-slate-900 text-white p-7 sm:p-8">
              <h2 className="text-xl font-display font-bold mb-2">
                Demander une démo
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                On te montre ce module dans un parcours réel (rôles, données, rapports) selon ton contexte.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/plan_demo"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 font-bold hover:bg-emerald-500 transition-colors"
                >
                  Planifier une démo
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/20 font-bold hover:bg-white/10 transition-colors"
                >
                  Nous contacter
                </Link>
              </div>
            </div>
          </motion.aside>
        </section>

        {/* Enriched details (from docs) */}
        {details ? (
          <section className="mt-12 sm:mt-16 grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 rounded-2xl border border-slate-100 bg-white p-6">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">
                Bénéfices
              </h2>
              <ul className="space-y-2">
                {details.keyBenefits.map((b) => (
                  <li key={b} className="text-sm text-slate-700 font-medium flex gap-2">
                    <span className="text-emerald-500">✓</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-8 rounded-2xl border border-slate-100 bg-white p-6">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">
                Fonctionnalités
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {details.capabilities.map((c) => (
                  <div
                    key={c}
                    className="rounded-xl bg-slate-50 border border-slate-100 p-4"
                  >
                    <p className="text-sm font-semibold text-slate-800">{c}</p>
                  </div>
                ))}
              </div>

              {details.subCapabilities?.length ? (
                <div className="mt-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                    Sous-fonctionnalités
                  </h3>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {details.subCapabilities.map((s) => (
                      <li key={s} className="text-sm text-slate-600 flex gap-2">
                        <span className="text-emerald-500">•</span>
                        <span className="font-medium">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {details.integrations?.length ? (
                <div className="mt-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                    Intégrations
                  </h3>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {details.integrations.map((s) => (
                      <li key={s} className="text-sm text-slate-600 flex gap-2">
                        <span className="text-emerald-500">•</span>
                        <span className="font-medium">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {details.bestFor?.length ? (
                <div className="mt-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                    Idéal pour
                  </h3>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {details.bestFor.map((s) => (
                      <li key={s} className="text-sm text-slate-600 flex gap-2">
                        <span className="text-emerald-500">•</span>
                        <span className="font-medium">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {details.kpis?.length ? (
                <div className="mt-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                    Indicateurs suivis
                  </h3>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {details.kpis.map((k) => (
                      <li key={k} className="text-sm text-slate-600 flex gap-2">
                        <span className="text-emerald-500">•</span>
                        <span className="font-medium">{k}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {details.useCases?.length ? (
                <div className="mt-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                    Exemples d’usage
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {details.useCases.map((u) => (
                      <div
                        key={u.title}
                        className="rounded-xl bg-slate-50 border border-slate-100 p-4"
                      >
                        <p className="text-sm font-semibold text-slate-800">
                          {u.title}
                        </p>
                        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                          {u.scenario}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        ) : (
          <section className="mt-12 sm:mt-16">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6">
              <p className="text-sm text-slate-600 font-medium">
                Détails à enrichir. Ce module est déjà visible sur le catalogue, et on peut ajouter ses sous-fonctionnalités depuis la documentation.
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

