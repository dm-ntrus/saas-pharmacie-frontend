"use client";

import { motion } from "framer-motion";
import { useTranslations } from "@/lib/i18n-simple";
import {
  Stethoscope,
  Truck,
  Building,
  ShieldPlus,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

const solutionsMeta = [
  { id: "officine", icon: Stethoscope },
  { id: "grossiste", icon: Truck },
  { id: "hopital", icon: Building },
] as const;

const storiesMeta = [{ id: "pax" }, { id: "horizon" }] as const;

export default function SolutionsPage() {
  const t = useTranslations("pages.solutions");

  const solutions = solutionsMeta.map((sol) => ({
    ...sol,
    title: t(`solutions.${sol.id}.title`),
    desc: t(`solutions.${sol.id}.desc`),
    features: [
      t(`solutions.${sol.id}.features.f1`),
      t(`solutions.${sol.id}.features.f2`),
      t(`solutions.${sol.id}.features.f3`),
      t(`solutions.${sol.id}.features.f4`),
    ],
  }));

  const stories = storiesMeta.map((s) => ({
    id: s.id,
    title: t(`stories.${s.id}.title`),
    location: t(`stories.${s.id}.location`),
    impact: t(`stories.${s.id}.impact`),
    quote: t(`stories.${s.id}.quote`),
  }));

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-0 bg-white">
      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 mb-14 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-3">
              {t("tag")}
            </p>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold text-slate-900 mb-5 tracking-tight leading-[1.05]">
              {t("title")}{" "}
              <span className="text-emerald-600">{t("titleHighlight")}</span> {t("titleEnd")}
            </h1>
            <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto font-medium">
              {t("desc")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Solutions */}
      <section className="px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24 pb-16 sm:pb-24">
        {solutions.map((sol, i) => (
          <div key={sol.id} className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className={`lg:col-span-6 ${i % 2 === 1 ? "lg:order-2" : ""}`}
              >
                <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-5 shadow-xl shadow-slate-900/20">
                  <sol.icon className="w-8 h-8" />
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-3 tracking-tight">
                  {sol.title}
                </h2>
                <p className="text-base text-slate-500 mb-8 leading-relaxed font-medium">
                  {sol.desc}
                </p>
                <div className="grid grid-cols-2 gap-5 mb-8">
                  {sol.features.map((f) => (
                    <div key={f} className="flex items-center gap-3 text-slate-700">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <span className="text-sm font-bold">{f}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all group shadow-lg shadow-slate-900/20"
                >
                  {t("startCta")}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className={`lg:col-span-6 relative aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden shadow-xl ${
                  i % 2 === 1 ? "lg:order-1" : ""
                }`}
              >
                <Image
                  src="/images/hero.svg"
                  alt={sol.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
              </motion.div>
            </div>
          </div>
        ))}
      </section>

      {/* Success stories */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-3">
              {t("impactTag")}
            </p>
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 mb-4 tracking-tight">
              {t("storiesTitle")}{" "}
              <span className="text-emerald-600">{t("storiesTitleHighlight")}</span>
            </h2>
            <p className="text-base text-slate-500 max-w-2xl mx-auto font-medium">
              {t("storiesDesc")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            {stories.map((story) => (
              <motion.div
                key={story.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="aspect-[16/9] relative overflow-hidden bg-slate-100">
                  <Image
                    src="/images/hero.svg"
                    alt={story.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest mb-3">
                      {story.impact}
                    </span>
                    <h3 className="text-2xl font-display font-bold text-white">
                      {story.title}
                    </h3>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-widest">
                      {story.location}
                    </p>
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-lg font-display font-bold text-slate-900 italic leading-relaxed">
                    &quot;{story.quote}&quot;
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[100px] rounded-full" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-8 mx-auto">
                <ShieldPlus className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
                {t("ctaTitle")}
              </h2>
              <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed">
                {t("ctaDesc")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20"
                >
                  {t("ctaContact")}
                </Link>
                <Link
                  href="/pricing"
                  className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-xl font-bold hover:bg-white/20 transition-all"
                >
                  {t("ctaPricing")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
