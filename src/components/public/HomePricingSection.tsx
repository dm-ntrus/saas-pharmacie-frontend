"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { usePublicPlans } from "@/hooks/api/usePublicPlans";
import { FALLBACK_PLANS } from "@/components/public/PlanCard";
import type { Plan } from "@/types/billing";

function extractShortFeatures(plan: Plan): string[] {
  const items: string[] = [];

  if (plan.max_users === -1) items.push("Utilisateurs illimités");
  else if (plan.max_users) items.push(`${plan.max_users} utilisateurs`);

  if (plan.max_pharmacies === -1) items.push("Multi-sites");
  else if (plan.max_pharmacies && plan.max_pharmacies > 1)
    items.push(`${plan.max_pharmacies} sites`);

  if (plan.is_trial_available) items.push("Essai gratuit");

  if (plan.feature_flags?.length) {
    for (const ff of plan.feature_flags.slice(0, 3)) {
      if (ff.is_included && ff.feature_name) items.push(ff.feature_name);
    }
  }

  if (items.length < 3) items.push("Support inclus");
  return items.slice(0, 6);
}

export default function HomePricingSection() {
  const { data: apiPlans } = usePublicPlans({ active: true });

  const plans: Plan[] = useMemo(() => {
    if (apiPlans && apiPlans.length > 0) return apiPlans.slice(0, 3);
    return FALLBACK_PLANS;
  }, [apiPlans]);

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-600 mb-3">
            Tarification
          </p>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold text-slate-900 tracking-tight mb-4">
            Choisissez{" "}
            <span className="text-emerald-600">le plan</span> qui correspond
            à votre pharmacie.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-10">
          {plans.map((plan, i) => {
            const isPop = plan.plan_tier === "professional";
            const features = extractShortFeatures(plan);
            const href =
              plan.plan_tier === "enterprise" || plan.plan_tier === "custom"
                ? "/contact"
                : `/auth/register?plan=${encodeURIComponent(plan.plan_key)}`;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`relative p-8 sm:p-10 rounded-3xl border ${
                  isPop
                    ? "bg-slate-900 text-white border-slate-800 shadow-2xl shadow-emerald-600/15"
                    : "bg-slate-50 border-slate-100 text-slate-900"
                }`}
              >
                {isPop && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                    Recommandé
                  </div>
                )}
                <h3 className="text-xl font-display font-bold mb-3">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-5xl font-display font-bold">
                    ${plan.price}
                  </span>
                  <span
                    className={`text-sm font-bold uppercase tracking-widest ${
                      isPop ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    / mois
                  </span>
                </div>
                {plan.description && (
                  <p
                    className={`text-sm leading-relaxed mb-8 ${
                      isPop ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {plan.description}
                  </p>
                )}

                <ul className="space-y-2.5 mb-8">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          isPop
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-emerald-100 text-emerald-600"
                        }`}
                      >
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-sm font-medium">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={href}
                  className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    isPop
                      ? "bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/20"
                      : "bg-slate-900 text-white hover:bg-emerald-600"
                  }`}
                >
                  {plan.plan_tier === "enterprise"
                    ? "Contacter l'équipe"
                    : "Choisir ce plan"}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            );
          })}
        </div>

        <p className="text-center text-sm text-slate-400">
          Tous les plans incluent un essai gratuit.{" "}
          <Link
            href="/pricing"
            className="text-emerald-600 font-bold hover:underline"
          >
            Comparatif détaillé →
          </Link>
        </p>
      </div>
    </section>
  );
}
