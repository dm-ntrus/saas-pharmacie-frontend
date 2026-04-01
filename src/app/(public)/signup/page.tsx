"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ArrowRight,
  Shield,
  Smartphone,
  AlertCircle,
} from "lucide-react";
import { usePublicPlans } from "@/hooks/api/usePublicPlans";
import PlanCard, {
  PlanCardSkeleton,
  FALLBACK_PLANS,
} from "@/components/public/PlanCard";
import type { Plan } from "@/types/billing";

export default function SignupPage() {
  const [annual, setAnnual] = useState(false);
  const { data: apiPlans, isLoading, isError } = usePublicPlans({ active: true });

  const plans: Plan[] = useMemo(() => {
    if (apiPlans && apiPlans.length > 0) return apiPlans;
    return FALLBACK_PLANS;
  }, [apiPlans]);

  const isBackendConnected = !isError && apiPlans && apiPlans.length > 0;

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-3">
              Offres &amp; packs
            </p>
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 mb-4 tracking-tight">
              Choisissez votre{" "}
              <span className="text-emerald-600">plan</span>
            </h1>
            <p className="text-base text-slate-500 leading-relaxed max-w-xl mx-auto">
              Premier mois gratuit, aucun engagement, annulation en 1 clic.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-6 text-sm text-slate-500">
            {[
              { icon: CheckCircle2, text: "30 jours gratuits" },
              { icon: Shield, text: "Aucun engagement" },
              { icon: Smartphone, text: "Mobile Money accepté" },
            ].map((b) => (
              <span key={b.text} className="inline-flex items-center gap-1.5">
                <b.icon className="w-4 h-4 text-emerald-600" />
                {b.text}
              </span>
            ))}
          </div>

          {/* Toggle */}
          <div className="mt-6 inline-flex items-center gap-3 p-1.5 bg-slate-100 rounded-full text-sm">
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
            <div className="mt-3 flex items-center justify-center gap-2 text-xs">
              {isBackendConnected ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-600">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Plans synchronisés
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-amber-600">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Plans indicatifs
                </span>
              )}
            </div>
          )}
        </div>

        {/* Plans grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-16">
            {[1, 2, 3].map((i) => (
              <PlanCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div
            className={`grid gap-5 sm:gap-6 mb-16 ${
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

        {/* FAQ */}
        <div className="max-w-3xl mx-auto bg-slate-50 rounded-3xl p-8 sm:p-12">
          <h2 className="text-xl font-display font-bold text-slate-900 mb-6 text-center">
            Questions fréquentes
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                q: "Puis-je changer de plan plus tard ?",
                a: "Oui, montée ou descente en gamme à tout moment depuis votre interface.",
              },
              {
                q: "Y a-t-il des frais cachés ?",
                a: "Non. Le prix affiché est tout inclus — pas de frais d'installation ni de support.",
              },
              {
                q: "Comment fonctionne l'essai gratuit ?",
                a: "30 jours complets avec toutes les fonctionnalités. Aucune carte bancaire requise.",
              },
              {
                q: "Support technique inclus ?",
                a: "Oui, tous les plans incluent du support. Les plans supérieurs ont un support prioritaire.",
              },
            ].map((faq) => (
              <div key={faq.q}>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  {faq.q}
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-sm text-slate-500 mb-4">
            Plus de 500 pharmacies nous font confiance en Afrique
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/register"
              className="px-8 py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-lg"
            >
              Essayer gratuitement
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3.5 bg-slate-100 text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-all"
            >
              Parler à un expert
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
