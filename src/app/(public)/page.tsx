"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
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
} from "lucide-react";
import TrustedBy from "@/components/public/trusted-by";
import Testimonials from "@/components/public/testimonials";
import FAQ from "@/components/public/faq";
import ValueStrip from "@/components/public/ValueStrip";
import PlatformModulesPreview from "@/components/public/PlatformModulesPreview";
import ClientJourneySection from "@/components/public/ClientJourneySection";
import HomePricingSection from "@/components/public/HomePricingSection";

const STATS = [
  { value: "500+", label: "Pharmacies" },
  { value: "1M+", label: "Transactions" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Support" },
];

const CAPABILITIES = [
  {
    icon: Package,
    title: "Inventaire & réassort",
    desc: "Produits, mouvements, péremptions, suggestions de réapprovisionnement — moins de ruptures.",
    highlight: "Stock sous contrôle",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: Users,
    title: "Patients & prescriptions",
    desc: "Dossiers patients, ordonnances, vaccination pour un service soignant structuré.",
    highlight: "Sécurité de dispensation",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Zap,
    title: "Point de vente",
    desc: "POS moderne, facturation et moyens de paiement adaptés à votre marché.",
    highlight: "Encaissement fluide",
    color: "from-amber-500 to-amber-600",
  },
  {
    icon: BarChart3,
    title: "Pilotage & rapports",
    desc: "Tableaux de bord, rapports et BI pour arbitrer marges, volumes et équipes.",
    highlight: "Décisions éclairées",
    color: "from-rose-500 to-rose-600",
  },
  {
    icon: ShieldCheck,
    title: "Conformité & audit",
    desc: "Qualité, journal métier et traçabilité pour répondre aux contrôles.",
    highlight: "Traçabilité 100%",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: CheckCircle2,
    title: "Supply chain intégrée",
    desc: "Demandes d'achat, commandes, réceptions et suivi fournisseurs dans un même fil.",
    highlight: "Circuit achat complet",
    color: "from-indigo-500 to-indigo-600",
  },
];

const HERO_FEATURES = [
  { icon: Pill, label: "Inventaire", color: "bg-emerald-500" },
  { icon: CreditCard, label: "Point de vente", color: "bg-emerald-500" },
  { icon: TrendingUp, label: "Analytics", color: "bg-purple-500" },
  { icon: Users, label: "Patients", color: "bg-amber-500" },
];

export default function PublicHomePage() {
  return (
    <div className="bg-white">
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left — copy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-[0.25em] mb-5 border border-emerald-100">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Plateforme SaaS pour pharmacies
              </div>

              <h1 className="text-[2.2rem] leading-[1.08] sm:text-5xl lg:text-6xl xl:text-[4.2rem] font-display font-bold text-slate-900 tracking-tight mb-5">
                Votre pharmacie,
                <br />
                plus rentable{" "}
                <span className="text-emerald-600 italic">
                  avec la gestion intelligente.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-500 leading-relaxed font-medium max-w-lg mb-6">
                Automatisation complète, optimisation des ventes et conformité
                garantie — du comptoir au pilotage stratégique.
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-base hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/15 group"
                >
                  Démarrer l&apos;aventure
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/plan_demo"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-base hover:border-emerald-200 hover:text-emerald-700 transition-all"
                >
                  Voir la démo
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
                      className={`w-5 h-5 ${f.color} rounded-md flex items-center justify-center`}
                    >
                      <f.icon className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs font-bold text-slate-600">
                      {f.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-3 sm:gap-6 border-t border-slate-100 pt-5">
                {STATS.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                  >
                    <p className="text-xl sm:text-3xl font-display font-bold text-slate-900">
                      {s.value}
                    </p>
                    <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                      {s.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right — Dashboard mockup */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 1,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative"
            >
              {/* Glow */}
              <div className="absolute -inset-8 bg-gradient-to-br from-emerald-400/10 via-transparent to-emerald-400/10 rounded-[3rem] blur-3xl" />

              {/* Browser frame */}
              <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-200/60 overflow-hidden">
                {/* Title bar */}
                <div className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                  <div className="flex-1 mx-3 h-5 bg-slate-100 rounded-md" />
                </div>

                {/* Dashboard content */}
                <div className="p-3 sm:p-4 bg-slate-50/50">
                  {/* Stat cards */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3">
                    {[
                      {
                        label: "Ventes",
                        value: "$48.2K",
                        change: "+12%",
                        color: "text-emerald-600",
                        bg: "bg-emerald-50",
                      },
                      {
                        label: "Patients",
                        value: "1,234",
                        change: "+5%",
                        color: "text-emerald-600",
                        bg: "bg-emerald-50",
                      },
                      {
                        label: "Produits",
                        value: "2,847",
                        change: "98%",
                        color: "text-purple-600",
                        bg: "bg-purple-50",
                      },
                    ].map((card) => (
                      <div
                        key={card.label}
                        className="bg-white rounded-xl p-2.5 sm:p-3 border border-slate-100"
                      >
                        <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {card.label}
                        </p>
                        <p className="text-sm sm:text-lg font-display font-bold text-slate-900 mt-0.5">
                          {card.value}
                        </p>
                        <span
                          className={`inline-block mt-1 text-[9px] font-bold ${card.color} ${card.bg} px-1.5 py-0.5 rounded`}
                        >
                          {card.change}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Chart placeholder */}
                  <div className="bg-white rounded-xl p-3 sm:p-4 border border-slate-100 mb-3">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[10px] sm:text-xs font-bold text-slate-600">
                        Revenus mensuels
                      </p>
                      <div className="flex gap-1">
                        <span className="w-8 h-4 bg-emerald-50 rounded text-[8px] font-bold text-emerald-600 flex items-center justify-center">
                          7j
                        </span>
                        <span className="w-8 h-4 bg-slate-100 rounded text-[8px] font-bold text-slate-400 flex items-center justify-center">
                          30j
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
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className={`flex-1 rounded-t-sm ${
                              i >= 8
                                ? "bg-emerald-500"
                                : "bg-emerald-200"
                            }`}
                          />
                        ),
                      )}
                    </div>
                  </div>

                  {/* Recent activity */}
                  <div className="bg-white rounded-xl p-3 border border-slate-100">
                    <p className="text-[10px] sm:text-xs font-bold text-slate-600 mb-2">
                      Activité récente
                    </p>
                    <div className="space-y-2">
                      {[
                        {
                          color: "bg-emerald-500",
                          text: "Vente #4821",
                          sub: "3 articles · $42.50",
                        },
                        {
                          color: "bg-emerald-500",
                          text: "Stock mis à jour",
                          sub: "Paracétamol · +200 unités",
                        },
                        {
                          color: "bg-purple-500",
                          text: "Nouveau patient",
                          sub: "Marie K. · Prescription",
                        },
                      ].map((item) => (
                        <div
                          key={item.text}
                          className="flex items-center gap-2.5"
                        >
                          <div
                            className={`w-6 h-6 sm:w-7 sm:h-7 ${item.color} rounded-lg flex items-center justify-center`}
                          >
                            <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] sm:text-xs font-bold text-slate-700 truncate">
                              {item.text}
                            </p>
                            <p className="text-[9px] sm:text-[10px] text-slate-400 truncate">
                              {item.sub}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
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
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-3">
                Capacités
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 tracking-tight leading-[1.08]">
                Tout ce dont votre pharmacie a besoin{" "}
                <span className="text-emerald-600 italic">
                  pour maximiser sa rentabilité.
                </span>
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-500 max-w-md font-medium leading-relaxed">
              Une plateforme complète conçue pour les pharmacies modernes, avec
              des outils pensés pour le terrain.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-100 rounded-3xl overflow-hidden border border-slate-100">
            {CAPABILITIES.map((cap, i) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="p-6 sm:p-8 lg:p-10 bg-white hover:bg-slate-50/80 transition-all group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div
                    className={`w-11 h-11 bg-gradient-to-br ${cap.color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform`}
                  >
                    <cap.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
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
                  className="mt-5 inline-flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Voir le module
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ MODULES PREVIEW ═══════════ */}
      <PlatformModulesPreview />

      {/* ═══════════ CLIENT JOURNEY ═══════════ */}
      <ClientJourneySection />

      {/* ═══════════ BENTO GRID ═══════════ */}
      <section className="py-4 sm:py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-3 sm:gap-4">
            {/* POS */}
            <div className="md:col-span-8 bg-slate-50 rounded-2xl sm:rounded-3xl p-6 sm:p-10 relative overflow-hidden group">
              <div className="relative z-10 max-w-md">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 font-display">
                  Point de vente ultra-rapide
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  Interface intuitive conçue pour la rapidité. Gérez les files
                  d&apos;attente sans effort.
                </p>
                <ul className="space-y-2">
                  {[
                    "Scan code-barres instantané",
                    "Multi-paiement intégré",
                    "Tickets numériques",
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
              </div>
              <div className="absolute top-6 -right-12 w-1/2 h-full bg-slate-200/60 rounded-2xl rotate-12 group-hover:rotate-6 transition-transform duration-700 hidden lg:block overflow-hidden">
                <Image
                  src="/images/hero.svg"
                  className="object-cover opacity-40"
                  alt=""
                  fill
                />
              </div>
            </div>

            {/* Analytics */}
            <div className="md:col-span-4 bg-emerald-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 border border-white/20">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold mb-2 font-display">
                  Analytics avancés
                </h3>
                <p className="text-emerald-50 text-sm leading-relaxed">
                  Prédisez vos besoins en stock et identifiez vos produits les
                  plus rentables.
                </p>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            </div>

            {/* Conformité */}
            <div className="md:col-span-4 bg-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white group">
              <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold mb-2 font-display">
                Conformité totale
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Rapports fiscaux automatisés et traçabilité complète des
                médicaments sensibles.
              </p>
            </div>

            {/* Patients */}
            <div className="md:col-span-8 bg-slate-100 rounded-2xl sm:rounded-3xl p-6 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 group">
              <div className="flex-1">
                <div className="w-10 h-10 bg-slate-700 text-white rounded-xl flex items-center justify-center mb-3">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 font-display">
                  Gestion patients
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Suivez l&apos;historique médical, gérez les prescriptions
                  récurrentes et envoyez des rappels automatiques.
                </p>
              </div>
              <div className="w-full sm:w-40 h-28 sm:h-full bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-200 shrink-0">
                <Users className="w-12 h-12 text-slate-200" />
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
          <div className="bg-slate-900 rounded-2xl sm:rounded-[3rem] p-6 sm:p-10 lg:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-600/10 blur-[80px]" />
            <div className="grid lg:grid-cols-3 gap-8 items-center relative z-10">
              <div className="lg:col-span-2">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white mb-3 tracking-tight">
                  Prêt à{" "}
                  <span className="text-emerald-500">moderniser</span>
                  <br className="hidden sm:block" /> votre pharmacie ?
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
                  Rejoignez plus de 500 pharmacies qui font confiance à
                  SyntixPharma pour optimiser leurs opérations quotidiennes.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Link
                  href="/auth/register"
                  className="px-6 py-3.5 text-center bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20"
                >
                  Essayer gratuitement
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-3.5 text-center bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-all"
                >
                  Contacter l&apos;équipe
                </Link>
                <p className="text-[10px] text-slate-500 text-center font-medium">
                  Installation en 24 h · Formation incluse · Support 7j/7
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
