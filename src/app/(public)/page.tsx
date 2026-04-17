"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  BarChart3,
  Package,
  Users,
  Zap,
  TrendingUp,
  Pill,
  CreditCard,
  Bot,
  Shield,
  TrendingDown,
  FileText,
  AlertTriangle,
  Clock,
  Activity,
  Microscope,
  TestTube,
} from "lucide-react";
import { useTranslations } from "@/lib/i18n-simple";
import TrustedBy from "@/components/public/trusted-by";
import Testimonials from "@/components/public/testimonials";
import FAQ from "@/components/public/faq";
import ValueStrip from "@/components/public/ValueStrip";
import PlatformModulesPreview from "@/components/public/PlatformModulesPreview";
import ClientJourneySection from "@/components/public/ClientJourneySection";
import HomePricingSection from "@/components/public/HomePricingSection";
import { Link } from "@/i18n/navigation";
import MedicalBackgroundPatterns, { HexagonalPattern } from "@/components/public/MedicalPatterns";
import { FloatingDecoration, FloatingDecorationMobile } from "@/components/public/FloatingDecoration";

const REVEAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function PublicHomePage() {
  const t = useTranslations("pages.home");
  const shouldReduceMotion = useReducedMotion();
  const [isLowPowerMobile, setIsLowPowerMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => {
      const nav = navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      };
      const conn = nav.connection;
      const saveData = Boolean(conn?.saveData);
      const isSlow =
        conn?.effectiveType === "slow-2g" || conn?.effectiveType === "2g";
      setIsLowPowerMobile(mq.matches && (saveData || isSlow));
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const motionSafe = useMemo(
    () => !shouldReduceMotion && !isLowPowerMobile,
    [shouldReduceMotion, isLowPowerMobile],
  );

  const STATS = [
    { value: "500+", label: t("statsPharmacies"), icon: Package },
    { value: "1M+", label: t("statsTransactions"), icon: CreditCard },
    { value: "99.9%", label: t("statsUptime"), icon: ShieldCheck },
    { value: "24/7", label: t("statsSupport"), icon: Activity },
  ];

  const PHARMA_STATS = [
    { value: "2.5M+", label: t("statsMedicines"), icon: Pill, bgClass: "bg-emerald-50", iconClass: "text-emerald-600" },
    { value: "850K+", label: t("statsPrescriptions"), icon: FileText, bgClass: "bg-teal-50", iconClass: "text-teal-600" },
    { value: "12K+", label: t("statsAlerts"), icon: AlertTriangle, bgClass: "bg-amber-50", iconClass: "text-amber-600" },
    { value: "100%", label: t("statsCompliance"), icon: Shield, bgClass: "bg-cyan-50", iconClass: "text-cyan-600" },
  ];

  const CAPABILITIES = [
    {
      icon: Package,
      title: t("capInventory"),
      desc: t("capInventoryDesc"),
      highlight: t("capInventoryHighlight"),
      gradientClass: "from-emerald-500 to-emerald-600",
    },
    {
      icon: Users,
      title: t("capPatients"),
      desc: t("capPatientsDesc"),
      highlight: t("capPatientsHighlight"),
      gradientClass: "from-teal-500 to-teal-600",
    },
    {
      icon: Zap,
      title: t("capPOS"),
      desc: t("capPOSDesc"),
      highlight: t("capPOSHighlight"),
      gradientClass: "from-amber-500 to-amber-600",
    },
    {
      icon: BarChart3,
      title: t("capAnalytics"),
      desc: t("capAnalyticsDesc"),
      highlight: t("capAnalyticsHighlight"),
      gradientClass: "from-rose-500 to-rose-600",
    },
    {
      icon: ShieldCheck,
      title: t("capCompliance"),
      desc: t("capComplianceDesc"),
      highlight: t("capComplianceHighlight"),
      gradientClass: "from-cyan-500 to-cyan-600",
    },
    {
      icon: CheckCircle2,
      title: t("capSupplyChain"),
      desc: t("capSupplyChainDesc"),
      highlight: t("capSupplyChainHighlight"),
      gradientClass: "from-indigo-500 to-indigo-600",
    },
  ];

  const HERO_FEATURES = [
    { icon: Pill, label: t("inventory"), bgClass: "bg-emerald-500" },
    { icon: CreditCard, label: t("pos"), bgClass: "bg-emerald-500" },
    { icon: TrendingUp, label: t("analytics"), bgClass: "bg-teal-500" },
    { icon: Users, label: t("patients"), bgClass: "bg-amber-500" },
  ];

  const HERO_IMAGES = [
    "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&h=600&fit=crop",
  ];

  return (
    <div className="bg-white">
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50/80 to-white">
        {/* Subtle background patterns */}
        <MedicalBackgroundPatterns />

        {/* Floating decorations */}
        <FloatingDecoration />
        <FloatingDecorationMobile />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left — copy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: REVEAL_EASE }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-semibold uppercase tracking-widest mb-5 border border-emerald-100/80">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse-subtle" />
                {t("badge")}
              </div>

              <h1 className="text-3xl leading-tight sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-display font-bold text-slate-900 tracking-tight mb-5">
                {t("heroTitle1")}
                <br />
                {t("heroTitle2")}{" "}
                <span className="text-emerald-600">
                  {t("heroTitle3")}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-lg mb-6">
                {t("heroDesc")}
              </p>

              {/* Pharma quick features */}
              <div className="flex flex-wrap gap-2 mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100/80">
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[11px] font-semibold text-slate-600">{t("badgePrescriptions")}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-full border border-amber-100/80">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-[11px] font-semibold text-slate-600">{t("badgeStockAlerts")}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 rounded-full border border-cyan-100/80">
                  <Shield className="w-3.5 h-3.5 text-cyan-600" />
                  <span className="text-[11px] font-semibold text-slate-600">{t("badgeGdpCompliance")}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold text-base hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/20 group"
                >
                  {t("ctaPrimary")}
                  <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/plan_demo"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold text-base hover:border-emerald-200 hover:text-emerald-700 hover:bg-emerald-50/30 transition-all"
                >
                  {t("ctaDemo")}
                </Link>
              </div>

              {/* Mini features strip — mobile only */}
              <div className="flex flex-wrap gap-2 mb-6 lg:hidden">
                {HERO_FEATURES.map((f) => (
                  <div
                    key={f.label}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100"
                  >
                    <div
                      className={`w-5 h-5 ${f.bgClass} rounded-md flex items-center justify-center`}
                    >
                      <f.icon className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs font-medium text-slate-600">
                      {f.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 border-t border-slate-100 pt-6">
                {STATS.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={motionSafe ? { opacity: 0, y: 10 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={
                      motionSafe
                        ? { delay: 0.2 + i * 0.07, duration: 0.4, ease: REVEAL_EASE }
                        : { duration: 0.01 }
                    }
                    className="group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-emerald-50 rounded-lg flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                        <s.icon className="w-3 h-3 text-emerald-600" />
                      </div>
                      <p className="text-xl sm:text-2xl font-display font-bold text-slate-900">
                        {s.value}
                      </p>
                    </div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {s.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right — Dashboard mockup */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.15,
                ease: REVEAL_EASE,
              }}
              className="relative"
            >
              {/* Glow */}
              <div className="absolute -inset-6 bg-gradient-to-br from-emerald-400/8 via-transparent to-teal-400/8 rounded-3xl blur-2xl" />

              {/* Browser frame */}
              <div className="relative bg-white rounded-2xl shadow-xl shadow-slate-900/8 border border-slate-200/60 overflow-hidden">
                {/* Title bar */}
                <div className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-50/80 border-b border-slate-100">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-300" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
                  <div className="flex-1 mx-3 h-5 bg-slate-100 rounded-md" />
                </div>

                {/* Dashboard content */}
                <div className="p-3 sm:p-4 bg-slate-50/30">
                  {/* Stat cards */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3">
                    {[
                      {
                        label: t("sales"),
                        value: "$48.2K",
                        change: "+12%",
                        changeColor: "text-emerald-600",
                        changeBg: "bg-emerald-50",
                      },
                      {
                        label: t("patients"),
                        value: "1,234",
                        change: "+5%",
                        changeColor: "text-emerald-600",
                        changeBg: "bg-emerald-50",
                      },
                      {
                        label: t("products"),
                        value: "2,847",
                        change: "98%",
                        changeColor: "text-teal-600",
                        changeBg: "bg-teal-50",
                      },
                    ].map((card) => (
                      <div
                        key={card.label}
                        className="bg-white rounded-xl p-2.5 sm:p-3 border border-slate-100/80"
                      >
                        <p className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          {card.label}
                        </p>
                        <p className="text-sm sm:text-lg font-display font-bold text-slate-900 mt-0.5">
                          {card.value}
                        </p>
                        <span
                          className={`inline-block mt-1 text-[10px] font-semibold ${card.changeColor} ${card.changeBg} px-1.5 py-0.5 rounded`}
                        >
                          {card.change}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Chart placeholder */}
                  <div className="bg-white rounded-xl p-3 sm:p-4 border border-slate-100/80 mb-3">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[11px] sm:text-xs font-semibold text-slate-600">
                        {t("monthlyRevenue")}
                      </p>
                      <div className="flex gap-1">
                        <span className="w-8 h-4 bg-emerald-50 rounded text-[9px] font-semibold text-emerald-600 flex items-center justify-center">
                          {t("period7d")}
                        </span>
                        <span className="w-8 h-4 bg-slate-100 rounded text-[9px] font-medium text-slate-400 flex items-center justify-center">
                          {t("period30d")}
                        </span>
                      </div>
                    </div>
                    {/* Bar chart */}
                    <div className="flex items-end gap-1 sm:gap-1.5 h-16 sm:h-24">
                      {[40, 55, 70, 60, 80, 65, 90, 75, 85, 95, 70, 88].map(
                        (h, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{
                              delay: 0.5 + i * 0.05,
                              duration: 0.6,
                              ease: REVEAL_EASE,
                            }}
                            className={`flex-1 rounded-t-sm ${
                              i >= 8
                                ? "bg-emerald-500"
                                : "bg-emerald-200/70"
                            }`}
                          />
                        ),
                      )}
                    </div>
                  </div>

                  {/* Recent activity */}
                  <div className="bg-white rounded-xl p-3 border border-slate-100/80">
                    <p className="text-[11px] sm:text-xs font-semibold text-slate-600 mb-2">
                      {t("recentActivity")}
                    </p>
                    <div className="space-y-2">
                      {[
                        {
                          bgClass: "bg-emerald-500",
                          text: t("saleNumber"),
                          sub: t("saleDetails"),
                        },
                        {
                          bgClass: "bg-teal-500",
                          text: t("stockUpdated"),
                          sub: t("stockUpdateDetails"),
                        },
                        {
                          bgClass: "bg-amber-500",
                          text: t("newPatient"),
                          sub: t("newPatientDetails"),
                        },
                      ].map((item) => (
                        <div
                          key={item.text}
                          className="flex items-center gap-2.5"
                        >
                          <div
                            className={`w-6 h-6 sm:w-7 sm:h-7 ${item.bgClass} rounded-lg flex items-center justify-center`}
                          >
                            <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] sm:text-xs font-semibold text-slate-700 truncate">
                              {item.text}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate">
                              {item.sub}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual gallery restored */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
                {HERO_IMAGES.map((src, idx) => (
                  <motion.div
                    key={src}
                    initial={motionSafe ? { opacity: 0, y: 12 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={
                      motionSafe
                        ? { delay: 0.45 + idx * 0.08, duration: 0.5, ease: REVEAL_EASE }
                        : { duration: 0.01 }
                    }
                    whileHover={motionSafe ? { y: -3, scale: 1.01 } : {}}
                    className="group relative h-24 sm:h-28 rounded-xl overflow-hidden border border-slate-200/70 shadow-sm"
                  >
                    <Image
                      src={src}
                      alt={idx === 0 ? "Pharmacy team collaboration" : idx === 1 ? "Pharmacy customer care" : "Modern pharmacy interior"}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover scale-100 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/25 via-slate-900/5 to-transparent" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/25 pointer-events-none" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ PHARMA-SPECIFIC STATS ═══════════ */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-emerald-50/60 via-teal-50/40 to-cyan-50/60 border-y border-slate-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {PHARMA_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={motionSafe ? { opacity: 0, y: 10 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={
                  motionSafe
                    ? { delay: i * 0.08, duration: 0.4, ease: REVEAL_EASE }
                    : { duration: 0.01 }
                }
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/60 shadow-xs"
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.bgClass} rounded-xl flex items-center justify-center mb-3`}>
                  <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.iconClass}`} />
                </div>
                <p className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-1">
                  {stat.value}
                </p>
                <p className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ VALUE STRIP ═══════════ */}
      <ValueStrip />

      {/* ═══════════ TRUSTED BY ═══════════ */}
      <TrustedBy />

      {/* ═══════════ CAPABILITIES GRID ═══════════ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6 mb-12 sm:mb-16">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-3">
                {t("capabilitiesTag")}
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 tracking-tight leading-tight">
                {t("capabilitiesTitle")}{" "}
                <span className="text-emerald-600">
                  {t("capabilitiesHighlight")}
                </span>
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-500 max-w-md leading-relaxed">
              {t("capabilitiesDesc")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-100 rounded-2xl overflow-hidden border border-slate-100">
            {CAPABILITIES.map((cap, i) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="p-6 sm:p-8 lg:p-10 bg-white hover:bg-slate-50/50 transition-all group"
              >
                <div className="flex justify-between items-start mb-5">
                  <div
                    className={`w-11 h-11 bg-gradient-to-br ${cap.gradientClass} rounded-xl flex items-center justify-center text-white group-hover:scale-105 transition-transform`}
                  >
                    <cap.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {cap.highlight}
                  </span>
                </div>
                <h3 className="text-lg font-display font-bold text-slate-900 mb-2">
                  {cap.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {cap.desc}
                </p>
                <Link
                  href="/modules"
                  className="mt-4 inline-flex items-center gap-1.5 text-emerald-600 font-semibold text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {t("viewModule")}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ MODULES PREVIEW ═══════════ */}
      <PlatformModulesPreview />

      {/* ═══════════ AI SPOTLIGHT ═══════════ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50/50 via-white to-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <HexagonalPattern className="absolute inset-0 w-full h-full" opacity={0.03} />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-200/50">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-violet-600">
                  {t("aiSpotlightTag")}
                </p>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 tracking-tight leading-tight">
                {t("aiSpotlightTitle")}{" "}
                <span className="text-emerald-600">
                  {t("aiSpotlightHighlight")}
                </span>
              </h2>
              <p className="text-base sm:text-lg text-slate-500 leading-relaxed mt-4 max-w-xl">
                {t("aiSpotlightDesc")}
              </p>

              {/* Pharma-specific AI features */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-600">{t("aiFeatureDrugInteractions")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <Activity className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-600">{t("aiFeatureHealthMonitoring")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-cyan-50 rounded-lg flex items-center justify-center">
                    <Microscope className="w-4 h-4 text-cyan-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-600">{t("aiFeatureQualityControl")}</span>
                </div>
              </div>

              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/modules/ai"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg shadow-emerald-200/40"
                >
                  {t("aiSpotlightCtaAi")}
                  <ArrowRight className="w-4.5 h-4.5" />
                </Link>
                <Link
                  href="/modules/inventory"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 hover:border-emerald-200 hover:text-emerald-700 transition-all"
                >
                  {t("aiSpotlightCtaInventory")}
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: TestTube,
                    title: t("aiSpotlightCard1Title"),
                    desc: t("aiSpotlightCard1Desc"),
                    bgClass: "bg-emerald-50",
                    borderClass: "border-emerald-100",
                    iconClass: "text-emerald-600",
                  },
                  {
                    icon: Microscope,
                    title: t("aiSpotlightCard2Title"),
                    desc: t("aiSpotlightCard2Desc"),
                    bgClass: "bg-teal-50",
                    borderClass: "border-teal-100",
                    iconClass: "text-teal-600",
                  },
                  {
                    icon: TrendingDown,
                    title: t("aiSpotlightCard3Title"),
                    desc: t("aiSpotlightCard3Desc"),
                    bgClass: "bg-amber-50",
                    borderClass: "border-amber-100",
                    iconClass: "text-amber-600",
                  },
                  {
                    icon: Shield,
                    title: t("aiSpotlightCard4Title"),
                    desc: t("aiSpotlightCard4Desc"),
                    bgClass: "bg-cyan-50",
                    borderClass: "border-cyan-100",
                    iconClass: "text-cyan-600",
                  },
                ].map((card) => (
                  <motion.div
                    key={card.title}
                    initial={motionSafe ? { opacity: 0, y: 10 } : false}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm p-6 hover:shadow-md hover:border-emerald-200/60 transition-all group"
                  >
                    <div className={`w-11 h-11 rounded-xl ${card.bgClass} border ${card.borderClass} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                      <card.icon className={`w-5 h-5 ${card.iconClass}`} />
                    </div>
                    <h3 className="text-base font-display font-bold text-slate-900 mb-1">
                      {card.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {card.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ CLIENT JOURNEY ═══════════ */}
      <ClientJourneySection />

      {/* ═══════════ BENTO GRID ═══════════ */}
      <section className="py-6 sm:py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-3 sm:gap-4">
            {/* POS */}
            <div className="md:col-span-8 bg-gradient-to-br from-slate-50 to-emerald-50/50 rounded-2xl p-6 sm:p-10 relative overflow-hidden group">
              <div className="relative z-10 max-w-md">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 font-display">
                  {t("bentoPOS")}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  {t("bentoPOSDesc")}
                </p>
                <ul className="space-y-2">
                  {[
                    t("bentoPOSFeature1"),
                    t("bentoPOSFeature2"),
                    t("bentoPOSFeature3"),
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm font-medium text-slate-500"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <motion.div
                  initial={motionSafe ? { opacity: 0, y: 10 } : false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={motionSafe ? { duration: 0.45, ease: REVEAL_EASE } : { duration: 0.01 }}
                  whileHover={motionSafe ? { y: -2 } : {}}
                  className="group relative mt-5 h-28 rounded-xl overflow-hidden border border-white/80 shadow-sm lg:hidden"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1550572017-edd951b55104?w=900&h=500&fit=crop"
                    alt="Pharmacy point of sale"
                    fill
                    sizes="(max-width: 1024px) 100vw, 0vw"
                    className="object-cover scale-100 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-900/35 via-slate-900/10 to-transparent" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/25 pointer-events-none" />
                </motion.div>
              </div>
              <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1550572017-edd951b55104?w=600&h=800&fit=crop"
                  alt="Pharmacy point of sale"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/60 to-transparent" />
              </div>
            </div>

            {/* Analytics */}
            <div className="md:col-span-4 bg-emerald-600 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-10 h-10 bg-white/15 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 border border-white/15">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold mb-2 font-display">
                  {t("bentoAnalytics")}
                </h3>
                <p className="text-emerald-100/90 text-sm leading-relaxed">
                  {t("bentoAnalyticsDesc")}
                </p>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/8 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            </div>

            {/* Conformité */}
            <div className="md:col-span-4 bg-slate-900 rounded-2xl p-6 sm:p-8 text-white group relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold mb-2 font-display">
                  {t("bentoCompliance")}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {t("bentoComplianceDesc")}
                </p>
              </div>
            </div>

            {/* Patients */}
            <div className="md:col-span-8 bg-gradient-to-br from-slate-100/80 to-slate-50 rounded-2xl p-6 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 group relative overflow-hidden">
              <div className="relative z-10 flex-1">
                <div className="w-10 h-10 bg-slate-800 text-white rounded-xl flex items-center justify-center mb-3">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 font-display">
                  {t("bentoPatients")}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {t("bentoPatientsDesc")}
                </p>
              </div>
              <div className="relative w-full sm:w-48 h-32 rounded-xl overflow-hidden shadow-md border-2 border-white shrink-0">
                <Image
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=200&fit=crop"
                  alt="Patient care"
                  fill
                  sizes="(max-width: 640px) 100vw, 192px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ PRICING ═══════════ */}
      <HomePricingSection />

      {/* ═══════════ CTA ═══════════ */}
      <section className="py-8 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-600/8 blur-[80px]" />
            <div className="grid lg:grid-cols-3 gap-8 items-center relative z-10">
              <div className="lg:col-span-2">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white mb-3 tracking-tight">
                  {t("ctaTitle")}{" "}
                  <span className="text-emerald-400">{t("ctaHighlight")}</span>
                  <br className="hidden sm:block" /> {t("ctaTitleEnd")}
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
                  {t("ctaDesc")}
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Link
                  href="/auth/register"
                  className="px-6 py-3.5 text-center bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20"
                >
                  {t("ctaRegister")}
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-3.5 text-center bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-100 transition-all"
                >
                  {t("ctaContact")}
                </Link>
                <p className="text-[11px] text-slate-500 text-center font-medium">
                  {t("ctaFootnote")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <Testimonials />

      {/* ═══════════ FAQ ═══════════ */}
      <FAQ />
    </div>
  );
}
