"use client";

import { useState, useMemo, Fragment } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Minus,
  ArrowRight,
  HelpCircle,
  Shield,
  Zap,
  Phone,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { usePublicPlans } from "@/hooks/api/usePublicPlans";
import PlanCard, { PlanCardSkeleton } from "@/components/public/PlanCard";
import type { Plan } from "@/types/billing";

/* ────────────────────────── comparison matrix ────────────────────────── */

const COMPARISON_FEATURES = [
  { key: "max_users", label: "Utilisateurs", category: "Limites" },
  { key: "max_pharmacies", label: "Nombre de sites", category: "Limites" },
  { key: "max_storage_gb", label: "Stockage cloud", category: "Limites" },
  { key: "max_api_calls_per_month", label: "Appels API / mois", category: "Limites" },
  { key: "module.sales", label: "Point de vente (POS)", category: "Modules" },
  { key: "module.inventory", label: "Gestion d'inventaire", category: "Modules" },
  { key: "module.prescriptions", label: "Ordonnances", category: "Modules" },
  { key: "module.supply_chain", label: "Supply chain & achats", category: "Modules" },
  { key: "module.accounting", label: "Comptabilité", category: "Modules" },
  { key: "module.analytics", label: "Analytics & BI", category: "Modules" },
  { key: "module.crm", label: "Fidélité & CRM", category: "Modules" },
  { key: "module.delivery", label: "Gestion des livraisons", category: "Modules" },
  { key: "is_trial_available", label: "Essai gratuit 30 jours", category: "Support" },
];

const TIER_MODULES: Record<string, string[]> = {
  free: ["module.sales", "module.inventory"],
  starter: [
    "module.sales",
    "module.inventory",
    "module.prescriptions",
  ],
  professional: [
    "module.sales",
    "module.inventory",
    "module.prescriptions",
    "module.supply_chain",
    "module.accounting",
    "module.analytics",
    "module.crm",
    "module.delivery",
  ],
  enterprise: [
    "module.sales",
    "module.inventory",
    "module.prescriptions",
    "module.supply_chain",
    "module.accounting",
    "module.analytics",
    "module.crm",
    "module.delivery",
  ],
  custom: [
    "module.sales",
    "module.inventory",
    "module.prescriptions",
    "module.supply_chain",
    "module.accounting",
    "module.analytics",
    "module.crm",
    "module.delivery",
  ],
};

function getComparisonValue(
  plan: Plan,
  key: string,
): boolean | string | number {
  if (key === "max_users") {
    const v = plan.max_users;
    if (!v) return "1";
    return v === -1 ? "Illimité" : String(v);
  }
  if (key === "max_pharmacies") {
    const v = plan.max_pharmacies;
    if (!v) return "1";
    return v === -1 ? "Illimité" : String(v);
  }
  if (key === "max_storage_gb") {
    const raw = typeof plan.max_storage_gb === "string" ? parseFloat(plan.max_storage_gb) : plan.max_storage_gb;
    if (!raw) return "2 GB";
    return raw === -1 ? "Illimité" : `${raw} GB`;
  }
  if (key === "max_api_calls_per_month") {
    const v = plan.max_api_calls_per_month;
    if (!v) return "1 000";
    if (v === -1) return "Illimité";
    return v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v);
  }
  if (key === "is_trial_available") return !!plan.is_trial_available;

  if (key.startsWith("module.")) {
    if (plan.features && typeof plan.features === "object") {
      const entry = (plan.features as Record<string, unknown>)[key];
      if (typeof entry === "object" && entry !== null) {
        const v = entry as Record<string, unknown>;
        if (v.enabled === true || v.included === true) return true;
        if (v.enabled === false || v.included === false) return false;
      }
    }
    if (plan.feature_flags?.length) {
      const ff = plan.feature_flags.find(
        (f) => f.feature_key === key || f.key === key,
      );
      if (ff) return ff.is_included;
    }
    const tier = plan.plan_tier || "";
    const modules = TIER_MODULES[tier] ?? [];
    return modules.includes(key);
  }

  return false;
}

function CellValue({ val }: { val: boolean | string | number }) {
  if (typeof val === "string" || typeof val === "number")
    return (
      <span className="text-sm font-semibold text-slate-800">{String(val)}</span>
    );
  return val ? (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100">
      <Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={3} />
    </span>
  ) : (
    <Minus className="w-4 h-4 text-slate-300 mx-auto" />
  );
}

/* ─────────────────────────── FAQ ─────────────────────────── */

const FAQS = [
  {
    q: "Puis-je changer de plan à tout moment ?",
    a: "Oui, montée ou descente en gamme depuis votre tableau de bord. La différence est calculée au prorata.",
  },
  {
    q: "Comment fonctionne l'essai gratuit ?",
    a: "30 jours complets avec toutes les fonctionnalités du plan choisi. Aucune carte bancaire requise pour commencer.",
  },
  {
    q: "Y a-t-il des frais d'installation ?",
    a: "Non. L'inscription et la configuration sont 100 % gratuites. Vous êtes opérationnel en moins de 24h.",
  },
  {
    q: "Quels moyens de paiement acceptez-vous ?",
    a: "Carte bancaire (Visa, Mastercard), virement SEPA, et Mobile Money (M-Pesa, Airtel Money, Orange Money).",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="text-sm font-semibold text-slate-900">{q}</span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 -mt-1">
          <p className="text-sm text-slate-500 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── page ─────────────────────────── */

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const { data: apiPlans, isLoading, isError } = usePublicPlans({ active: true });

  const plans: Plan[] = useMemo(() => {
    if (!apiPlans || apiPlans.length === 0) return [];
    const interval = annual ? "yearly" : "monthly";
    const filtered = apiPlans.filter((p) => p.billing_interval === interval);
    if (filtered.length > 0) return filtered;
    const seen = new Set<string>();
    return apiPlans.filter((p) => {
      const tier = p.plan_tier || p.plan_key;
      if (seen.has(tier)) return false;
      seen.add(tier);
      return true;
    });
  }, [apiPlans, annual]);

  const annualDiscount = useMemo(() => {
    if (!apiPlans || apiPlans.length === 0) return 0;
    const starterM = apiPlans.find(
      (p) => p.plan_tier === "starter" && p.billing_interval === "monthly",
    );
    const starterY = apiPlans.find(
      (p) => p.plan_tier === "starter" && p.billing_interval === "yearly",
    );
    if (starterM && starterY) {
      const mPrice = typeof starterM.price === "string" ? parseFloat(starterM.price) : starterM.price;
      const yPrice = typeof starterY.price === "string" ? parseFloat(starterY.price) : starterY.price;
      if (mPrice > 0)
        return Math.round((1 - yPrice / (mPrice * 12)) * 100);
    }
    return 0;
  }, [apiPlans]);

  const isReady = !isLoading && !isError && plans.length > 0;

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Hero ─── */}
      <section className="pt-28 sm:pt-36 pb-4 text-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-600 mb-4">
            Tarifs simples & transparents
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 leading-[1.15]">
            Le plan parfait pour{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              votre pharmacie
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            Commencez gratuitement, évoluez quand vous le souhaitez.
            <br className="hidden sm:block" />
            Aucun frais caché, aucun engagement.
          </p>
        </motion.div>
      </section>

      {/* ─── Toggle ─── */}
      <section className="flex justify-center px-4 mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-full">
          <button
            onClick={() => setAnnual(false)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              !annual
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Mensuel
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
              annual
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Annuel
            {annualDiscount > 0 && (
              <span className="text-[11px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                -{annualDiscount}%
              </span>
            )}
          </button>
        </div>
      </section>

      {/* ─── Status ─── */}
      {!isLoading && isError && (
        <div className="max-w-lg mx-auto text-center px-4 mb-12">
          <div className="inline-flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-5 py-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Impossible de charger les plans pour le moment.{" "}
            <Link href="/contact" className="font-bold underline">
              Contactez-nous
            </Link>
          </div>
        </div>
      )}

      {/* ─── Plan cards ─── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <PlanCardSkeleton key={i} />
            ))}
          </div>
        ) : isReady ? (
          <div
            className={`grid gap-5 items-start ${
              plans.length <= 2
                ? "sm:grid-cols-2 max-w-2xl mx-auto"
                : plans.length === 3
                  ? "sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto"
                  : "sm:grid-cols-2 lg:grid-cols-4"
            }`}
          >
            {plans.map((plan, i) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                index={i}
                showAnnual={annual}
              />
            ))}
          </div>
        ) : null}
      </section>

      {/* ─── Comparison table ─── */}
      {isReady && plans.length > 1 && (
        <section className="py-16 sm:py-24 bg-slate-50 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Comparatif complet
              </h2>
              <p className="text-slate-500 mt-2 text-sm">
                Tout ce que chaque plan inclut, en un coup d'oeil.
              </p>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left min-w-[640px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-5 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider w-56">
                      Fonctionnalité
                    </th>
                    {plans.map((p) => (
                      <th
                        key={p.id}
                        className={`px-5 py-4 text-xs font-bold uppercase tracking-wider text-center ${
                          p.plan_tier === "professional"
                            ? "text-emerald-600"
                            : "text-slate-500"
                        }`}
                      >
                        {p.name?.replace(/ \(mensuel\)| \(annuel\)/i, "")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_FEATURES.map((row, idx) => {
                    const prevCat = idx > 0 ? COMPARISON_FEATURES[idx - 1].category : null;
                    const showCat = row.category !== prevCat;
                    return (
                      <Fragment key={row.key}>
                        {showCat && (
                          <tr>
                            <td
                              colSpan={plans.length + 1}
                              className="px-5 pt-6 pb-2 text-xs font-bold text-slate-400 uppercase tracking-wider bg-white"
                            >
                              {row.category}
                            </td>
                          </tr>
                        )}
                        <tr className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <td className="px-5 py-3 text-sm font-medium text-slate-700">
                            {row.label}
                          </td>
                          {plans.map((p) => (
                            <td
                              key={p.id}
                              className={`px-5 py-3 text-center ${
                                p.plan_tier === "professional" ? "bg-emerald-50/30" : ""
                              }`}
                            >
                              <CellValue val={getComparisonValue(p, row.key)} />
                            </td>
                          ))}
                        </tr>
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ─── FAQ ─── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Questions fréquentes
            </h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Trust bar ─── */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-100">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-5">
          {[
            {
              icon: Shield,
              title: "Garantie 30 jours",
              desc: "Satisfait ou remboursé, sans condition.",
            },
            {
              icon: Zap,
              title: "Mise en service express",
              desc: "Opérationnel en moins de 24 heures.",
            },
            {
              icon: Phone,
              title: "Support humain",
              desc: "Une vraie équipe vous accompagne.",
            },
          ].map((g) => (
            <div
              key={g.title}
              className="flex items-start gap-4 p-5 bg-white rounded-xl border border-slate-200"
            >
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
                <g.icon className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">{g.title}</h4>
                <p className="text-sm text-slate-500 mt-0.5">{g.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
