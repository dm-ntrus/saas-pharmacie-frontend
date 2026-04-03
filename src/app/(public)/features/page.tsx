"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Package,
  BarChart3,
  Users,
  ShieldCheck,
  Cloud,
  Layers,
  CheckCircle2,
  ArrowRight,
  Zap,
  Truck,
  Gift,
  FileText,
} from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

const featureMeta = [
  { id: "inventorySmart", icon: Package },
  { id: "posBilling", icon: BarChart3 },
  { id: "patientsCrm", icon: Users },
  { id: "complianceSecurity", icon: ShieldCheck },
  { id: "cloudMobility", icon: Cloud },
  { id: "reportsAnalytics", icon: Layers },
  { id: "deliveryLogistics", icon: Truck },
  { id: "loyaltyCrm", icon: Gift },
  { id: "supplyChainPurchases", icon: FileText },
] as const;

const integrationsMeta = [
  { id: "mobileMoney" },
  { id: "accounting" },
  { id: "wholesalers" },
  { id: "insurances" },
] as const;

const deployStepsMeta = [{ step: "01" }, { step: "02" }, { step: "03" }] as const;

export default function FeaturesPage() {
  const t = useTranslations("pages.features");

  const features = featureMeta.map((f) => ({
    ...f,
    title: t(`features.${f.id}.title`),
    desc: t(`features.${f.id}.desc`),
    details: [
      t(`features.${f.id}.details.d1`),
      t(`features.${f.id}.details.d2`),
      t(`features.${f.id}.details.d3`),
      t(`features.${f.id}.details.d4`),
    ],
  }));

  const integrations = integrationsMeta.map((it) => ({
    id: it.id,
    title: t(`integrations.${it.id}.title`),
    desc: t(`integrations.${it.id}.desc`),
  }));

  const deploySteps = deployStepsMeta.map((s) => ({
    step: s.step,
    title: t(`deploySteps.${s.step}.title`),
    desc: t(`deploySteps.${s.step}.desc`),
  }));

  const deepDiveItems = [
    t("deepDive.items.i1"),
    t("deepDive.items.i2"),
    t("deepDive.items.i3"),
    t("deepDive.items.i4"),
  ];

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-0 bg-white">
      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-3">
              {t("tag")}
            </p>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold text-slate-900 mb-4 tracking-tight">
              {t("title")}{" "}
              <span className="text-emerald-600">{t("titleHighlight")}</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto mb-6">
              {t("desc")}
            </p>
            <Link
              href="/modules"
              className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-emerald-600 hover:text-slate-900 transition-colors"
            >
              {t("modulesCatalogCta")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="p-7 sm:p-8 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-emerald-600/5 transition-all group"
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-5 shadow-sm group-hover:bg-emerald-600 transition-colors">
                  <f.icon className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-display font-bold text-slate-900 mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-500 mb-5 leading-relaxed">
                  {f.desc}
                </p>
                <ul className="space-y-2">
                  {f.details.map((d) => (
                    <li
                      key={d}
                      className="flex items-center gap-2 text-sm text-slate-600 font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-3">
                {t("ecosystemTag")}
              </p>
              <h2 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 mb-4 tracking-tight">
                {t("ecosystemTitle")}{" "}
                <span className="text-emerald-600">{t("ecosystemTitleHighlight")}</span>
              </h2>
              <p className="text-base text-slate-500 leading-relaxed font-medium mb-10">
                {t("ecosystemDesc")}
              </p>
              <div className="grid grid-cols-2 gap-6">
                {integrations.map((item) => (
                  <div key={item.title} className="space-y-1">
                    <h4 className="text-base font-bold text-slate-900">
                      {item.title}
                    </h4>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.08, rotate: 3 }}
                    className="aspect-square bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center p-4"
                  >
                    <div className="w-full h-full bg-slate-50 rounded-lg" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deploy */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3">
              {t("deployTag")}
            </p>
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 mb-3 tracking-tight">
              {t("deployTitle")}{" "}
              <span className="text-emerald-600">{t("deployTitleHighlight")}</span>
            </h2>
            <p className="text-base text-slate-500 max-w-2xl mx-auto font-medium">
              {t("deployDesc")}
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 sm:gap-6 relative">
            <div className="hidden sm:block absolute top-1/2 left-0 w-full h-px bg-slate-100 -translate-y-1/2 z-0" />
            {deploySteps.map((item) => (
              <div
                key={item.step}
                className="relative z-10 bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="text-5xl font-display font-bold text-emerald-100 mb-4 group-hover:text-emerald-600 transition-colors">
                  {item.step}
                </div>
                <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deep Dive */}
      <section className="py-16 sm:py-24 bg-slate-900 text-white px-4 sm:px-6 lg:px-8 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-3xl sm:text-5xl font-display font-bold mb-4 leading-tight">
                {t("deepDive.title")}{" "}
                <span className="text-emerald-400">{t("deepDive.titleHighlight")}</span> {t("deepDive.titleEnd")}
              </h2>
              <p className="text-base text-slate-400 mb-8 leading-relaxed">
                {t("deepDive.desc")}
              </p>
              <div className="space-y-3 mb-8">
                {deepDiveItems.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
                      <Zap className="w-3 h-3 text-emerald-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-200">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20"
              >
                {t("tryFreeCta")}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="relative">
              <div className="absolute -inset-8 bg-emerald-500/20 blur-[80px] rounded-full" />
              <div className="relative bg-slate-800 rounded-2xl border border-slate-700 p-3 shadow-2xl">
                <div className="bg-slate-900 rounded-xl aspect-video flex items-center justify-center overflow-hidden relative">
                  <Image
                    src="/images/tenant.svg"
                    alt="Dashboard"
                    fill
                    className="object-cover opacity-80"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
