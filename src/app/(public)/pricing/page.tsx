"use client";

import { useState, useMemo } from "react";
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
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { usePublicPlans } from "@/hooks/api/usePublicPlans";
import PlanCard, {
  PlanCardSkeleton,
  FALLBACK_PLANS,
} from "@/components/public/PlanCard";
import type { Plan } from "@/types/billing";

const COMPARISON_FEATURES = [
  { key: "max_users", label: "Utilisateurs" },
  { key: "max_pharmacies", label: "Multi-sites" },
  { key: "max_storage_gb", label: "Stockage" },
  { key: "module.sales", label: "Point de vente POS" },
  { key: "module.inventory", label: "Inventaire" },
  { key: "module.prescriptions", label: "Prescriptions" },
  { key: "module.supply_chain", label: "Supply chain" },
  { key: "module.accounting", label: "Comptabilité" },
  { key: "module.analytics", label: "Analytics & BI" },
  { key: "module.crm", label: "Fidélité & CRM" },
  { key: "module.delivery", label: "Livraisons" },
  { key: "is_trial_available", label: "Essai gratuit" },
];

function getComparisonValue(
  plan: Plan,
  key: string,
): boolean | string | number {
  if (key === "max_users") {
    if (!plan.max_users) return "1";
    return plan.max_users === -1 ? "Illimité" : String(plan.max_users);
  }
  if (key === "max_pharmacies") {
    if (!plan.max_pharmacies) return "1";
    return plan.max_pharmacies === -1
      ? "Illimité"
      : String(plan.max_pharmacies);
  }
  if (key === "max_storage_gb") {
    if (!plan.max_storage_gb) return "2 GB";
    return plan.max_storage_gb === -1
      ? "Illimité"
      : `${plan.max_storage_gb} GB`;
  }
  if (key === "is_trial_available") return !!plan.is_trial_available;

  if (key.startsWith("module.")) {
    const featureKey = key;
    if (plan.features && typeof plan.features === "object") {
      const entry = (plan.features as Record<string, unknown>)[featureKey];
      if (
        typeof entry === "object" &&
        entry !== null &&
        "enabled" in entry
      )
        return (entry as { enabled: boolean }).enabled;
    }
    if (plan.feature_flags?.length) {
      const ff = plan.feature_flags.find(
        (f) =>
          f.feature_key === featureKey ||
          f.key === featureKey,
      );
      if (ff) return ff.is_included;
    }
    const tier = plan.plan_tier || "";
    if (tier === "enterprise" || tier === "custom") return true;
    if (tier === "professional")
      return !["module.crm", "module.delivery"].includes(key) || true;
    return false;
  }

  return false;
}

function CellValue({ val }: { val: boolean | string | number }) {
  if (typeof val === "string" || typeof val === "number")
    return (
      <span className="text-sm font-bold text-slate-700">{String(val)}</span>
    );
  return val ? (
    <Check className="w-5 h-5 text-emerald-600 mx-auto" />
  ) : (
    <Minus className="w-4 h-4 text-slate-300 mx-auto" />
  );
}

const FAQS = [
  {
    q: "Puis-je changer de plan ?",
    a: "Oui, montée ou descente en gamme à tout moment depuis votre tableau de bord.",
  },
  {
    q: "Comment fonctionne l'essai gratuit ?",
    a: "30 jours complets avec toutes les fonctionnalités du plan choisi. Aucune carte bancaire requise.",
  },
  {
    q: "Y a-t-il des frais d'installation ?",
    a: "Non. L'inscription et la configuration sont 100 % gratuites.",
  },
  {
    q: "Quels moyens de paiement acceptez-vous ?",
    a: "Carte bancaire, virement, Mobile Money (M-Pesa, Airtel Money, Orange Money).",
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const { data: apiPlans, isLoading, isError } = usePublicPlans({ active: true });

  const plans: Plan[] = useMemo(() => {
    if (apiPlans && apiPlans.length > 0) return apiPlans;
    return FALLBACK_PLANS;
  }, [apiPlans]);

  const isBackendConnected = !isError && apiPlans && apiPlans.length > 0;

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-0 bg-white">
      {/* Header */}
      <section className="text-center px-4 sm:px-6 lg:px-8 mb-10 sm:mb-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-3">
            Tarifs
          </p>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold text-slate-900 mb-4 tracking-tight">
            Des prix{" "}
            <span className="text-emerald-600">transparents</span>.
          </h1>
          <p className="text-base text-slate-500 max-w-xl mx-auto mb-6 font-medium leading-relaxed">
            Aucun frais caché. Essai gratuit de 30 jours sur tous les plans.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 p-1.5 bg-slate-100 rounded-full text-sm">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-full font-bold transition-all ${
                !annual
                  ? "bg-white shadow-sm text-slate-900"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-full font-bold transition-all ${
                annual
                  ? "bg-white shadow-sm text-slate-900"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Annuel{" "}
              <span className="text-emerald-600 text-xs font-black">
                -20%
              </span>
            </button>
          </div>

          {/* Data source indicator */}
          {!isLoading && (
            <div className="mt-4 flex items-center justify-center gap-2 text-xs">
              {isBackendConnected ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-600">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Plans synchronisés avec le serveur
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-amber-600">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Plans indicatifs — contactez-nous pour les tarifs exacts
                </span>
              )}
            </div>
          )}
        </motion.div>
      </section>

      {/* Plans */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24">
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((i) => (
              <PlanCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div
            className={`grid gap-6 sm:gap-8 ${
              plans.length <= 3
                ? "sm:grid-cols-2 lg:grid-cols-3"
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
        )}
      </section>

      {/* Comparison table */}
      {plans.length > 1 && (
        <section className="py-12 sm:py-16 bg-slate-50 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-slate-900 mb-8 text-center">
              Comparatif détaillé
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-6 py-4 text-sm font-bold text-slate-400 uppercase tracking-wider">
                      Fonctionnalité
                    </th>
                    {plans.map((p) => (
                      <th
                        key={p.id}
                        className={`px-6 py-4 text-sm font-bold uppercase tracking-wider text-center ${
                          p.plan_tier === "professional"
                            ? "text-emerald-600 bg-emerald-50/50"
                            : "text-slate-400"
                        }`}
                      >
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_FEATURES.map((row, i) => (
                    <tr
                      key={row.key}
                      className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
                    >
                      <td className="px-6 py-3.5 text-sm font-medium text-slate-700">
                        {row.label}
                      </td>
                      {plans.map((p) => (
                        <td
                          key={p.id}
                          className={`px-6 py-3.5 text-center ${
                            p.plan_tier === "professional"
                              ? "bg-emerald-50/30"
                              : ""
                          }`}
                        >
                          <CellValue val={getComparisonValue(p, row.key)} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-display font-bold text-slate-900 mb-8 text-center">
            Questions fréquentes
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div
                key={faq.q}
                className="p-6 bg-slate-50 rounded-2xl border border-slate-100"
              >
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">
                      {faq.q}
                    </h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                icon: Shield,
                title: "Garantie 30 jours",
                desc: "Satisfait ou remboursé, sans condition.",
              },
              {
                icon: Zap,
                title: "Mise en service express",
                desc: "Opérationnel en moins de 24 h.",
              },
              {
                icon: Phone,
                title: "Support humain",
                desc: "Une vraie équipe, pas un chatbot.",
              },
            ].map((g) => (
              <div
                key={g.title}
                className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100"
              >
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                  <g.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    {g.title}
                  </h4>
                  <p className="text-sm text-slate-500">{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
