"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useLocale, useTranslations } from "@/lib/i18n-simple";
import { Users, Target, Heart, Shield, Globe, Award } from "lucide-react";
import { Link } from "@/i18n/navigation";

const valueIcons = [Heart, Shield, Award, Users] as const;
const valueKeys = ["Empathy", "Integrity", "Excellence", "Collaboration"] as const;
const timelineYears = ["2021", "2022", "2023", "2024"] as const;

export default function AboutPage() {
  const t = useTranslations("pages.about");
  const locale = useLocale();

  const timeline = timelineYears.map((year) => ({
    year,
    title: t(`timeline${year}`),
    desc: t(`timeline${year}Desc`),
  }));

  const values = valueKeys.map((key, i) => ({
    icon: valueIcons[i],
    title: t(`value${key}`),
    desc: t(`value${key}Desc`),
  }));

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-0 bg-white">
      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-7"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-3">
                {t("tag")}
              </p>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold text-slate-900 mb-4 tracking-tight leading-[1.05]">
                {t("title")}{" "}
                <span className="text-emerald-600">{t("titleHighlight")}</span> {t("titleEnd")}
              </h1>
              <p className="text-base sm:text-lg text-slate-500 leading-relaxed mb-8 font-medium max-w-2xl">
                {t("desc")}
              </p>
              <div className="flex flex-wrap gap-8 sm:gap-14">
                {[
                  { val: "2021", label: t("statFoundation") },
                  { val: "500+", label: t("statClients") },
                  { val: "4", label: t("statCountries") },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-4xl sm:text-5xl font-display font-bold text-slate-900 mb-1">
                      {s.val}
                    </p>
                    <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="lg:col-span-5 relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl"
            >
              <Image
                src={
                  locale === "en"
                    ? "/images/Gemini_history_en.webp"
                    : "/images/Gemini_history_fr.webp"
                }
                alt={locale === "en" ? "SyntixPharma story" : "Histoire de SyntixPharma"}
                fill
                className="object-contain object-center bg-slate-950"
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
              <div className="absolute bottom-8 sm:bottom-12 left-6 sm:left-10 right-6 sm:right-10">
                <p className="text-white text-xl sm:text-2xl font-display font-bold italic leading-tight">
                  &quot;{t("quote")}&quot;
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 sm:py-16 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
            <div className="p-8 sm:p-10 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-5">
                <Target className="w-7 h-7 text-emerald-600" />
              </div>
              <h2 className="text-xl font-display font-bold text-slate-900 mb-3">
                {t("missionLabel")}
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                {t("missionText")}
              </p>
            </div>
            <div className="p-8 sm:p-10 bg-slate-900 text-white rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 blur-3xl rounded-full" />
              <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-5">
                <Globe className="w-7 h-7 text-emerald-400" />
              </div>
              <h2 className="text-xl font-display font-bold mb-3">
                {t("visionLabel")}
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                {t("visionText")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3">
              {t("timelineTag")}
            </p>
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 tracking-tight">
              {t("timelineTitle")}
            </h2>
          </div>
          <div className="relative">
            <div className="hidden sm:block absolute top-1/2 left-0 w-full h-px bg-slate-100 -translate-y-1/2" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 relative z-10">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
                >
                  <div className="text-4xl font-display font-bold text-emerald-100 mb-4 group-hover:text-emerald-600 transition-colors">
                    {item.year}
                  </div>
                  <h3 className="text-xl font-display font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-3">
              {t("valuesTag")}
            </h2>
            <p className="text-base text-slate-500 max-w-xl mx-auto">
              {t("valuesTitle")}
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="p-6 sm:p-8 rounded-2xl border border-slate-100 bg-white hover:shadow-lg transition-shadow text-center group"
              >
                <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:bg-emerald-50 transition-colors">
                  <v.icon className="w-7 h-7 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {v.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team CTA */}
      <section className="py-12 sm:py-16 bg-slate-900 text-white px-4 sm:px-6 lg:px-8 mx-4 sm:mx-6 rounded-3xl sm:rounded-[3rem] mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 leading-tight">
                {t("teamCta")}
              </h2>
              <p className="text-base text-slate-400 leading-relaxed mb-8">
                {t("teamCtaDesc")}
              </p>
              <Link
                href="/contact"
                className="inline-flex px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20"
              >
                {t("teamCtaButton")}
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                "https://images.unsplash.com/photo-1560250097-712b2b821181?w=400&h=500&fit=crop",
                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop",
                "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop",
                "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=400&h=500&fit=crop",
              ].map((src, n) => (
                <div
                  key={n}
                  className="aspect-[4/5] bg-slate-800 rounded-2xl overflow-hidden relative group"
                >
                  <Image
                    src={src}
                    alt={`${t("teamCtaContact")} ${n + 1}`}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-4 left-4">
                    <p className="font-bold text-sm">{t("teamCtaContact")} {n + 1}</p>
                    <p className="text-emerald-400 text-xs">Expert SyntixPharma</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
