"use client";

import { motion } from "framer-motion";
import { useTranslations } from "@/lib/i18n-simple";
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
    <div className="min-h-screen pt-24 sm:pt-32 pb-0 bg-white">
      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 mb-10 sm:mb-12 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-3">
              {t("tag")}
            </p>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold text-slate-900 mb-4 tracking-tight leading-tight">
              {t("title")}{" "}
              <span className="text-emerald-600">{t("titleHighlight")}</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto mb-6">
              {t("desc")}
            </p>
            <Link
              href="/modules"
              className="inline-flex items-center justify-center gap-2 text-sm font-black uppercase tracking-widest text-emerald-600 hover:text-slate-900 transition-colors w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 rounded-lg"
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
                className="p-5 min-[390px]:p-6 sm:p-8 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-emerald-600/5 transition-all group h-full"
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-5 shadow-sm group-hover:bg-emerald-600 transition-colors">
                  <f.icon className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-display font-bold text-slate-900 mb-2 line-clamp-2 min-h-[3.5rem]">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-500 mb-5 leading-relaxed line-clamp-3 min-h-[4rem]">
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
              <div className="grid grid-cols-1 min-[390px]:grid-cols-2 gap-4 sm:gap-6">
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
              <div className="grid grid-cols-3 gap-2 min-[390px]:gap-3 sm:gap-4">
                {[
                  "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=200&h=200&fit=crop",
                  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200&fit=crop",
                  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=200&fit=crop",
                  "https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&h=200&fit=crop",
                  "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=200&h=200&fit=crop",
                  "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=200&h=200&fit=crop",
                  "https://images.unsplash.com/photo-1532109137118-79ecd55e2b13?w=200&h=200&fit=crop",
                  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=200&h=200&fit=crop",
                  "https://images.unsplash.com/photo-1553028826-02f6e3a7d0e3?w=200&h=200&fit=crop",
                ].map((src, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.08, rotate: 3 }}
                    className="aspect-square bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden relative"
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 390px) 28vw, 128px"
                    />
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

          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 relative">
            <div className="hidden sm:block absolute top-1/2 left-0 w-full h-px bg-slate-100 -translate-y-1/2 z-0" />
            {deploySteps.map((item) => (
              <div
                key={item.step}
                className="relative z-10 bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
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
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20 w-full sm:w-auto"
              >
                {t("tryFreeCta")}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="relative">
              <div className="absolute -inset-8 bg-emerald-500/20 blur-[80px] rounded-full" />
              <div className="relative bg-slate-800 rounded-2xl border border-slate-700 p-3 shadow-2xl overflow-hidden">
                <div className="relative aspect-video overflow-hidden rounded-xl">
                  <Image
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop"
                    alt="Dashboard Pharma"
                    fill
                    className="object-cover"
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
