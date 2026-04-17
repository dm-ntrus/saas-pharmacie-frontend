"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "@/lib/i18n-simple";
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
} from "@/components/public/PlanCard";
import type { Plan } from "@/types/billing";
import { Link } from "@/i18n/navigation";

export default function SignupPage() {
  const t = useTranslations("pages.signup");
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

  const isBackendConnected = !isError && apiPlans && apiPlans.length > 0;

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-14 sm:pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-3">
              {t("tag")}
            </p>
            <h1 className="text-2xl sm:text-5xl font-display font-bold text-slate-900 mb-4 tracking-tight">
              {t("title")}{" "}
              <span className="text-emerald-600">{t("titleHighlight")}</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-xl mx-auto">
              {t("desc")}
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-6 text-sm text-slate-500">
            {[
              { icon: CheckCircle2, text: t("badges.freeTrial") },
              { icon: Shield, text: t("badges.noCommitment") },
              { icon: Smartphone, text: t("badges.mobileMoney") },
            ].map((b) => (
              <span key={b.text} className="inline-flex items-center gap-1.5">
                <b.icon className="w-4 h-4 text-emerald-600" />
                {b.text}
              </span>
            ))}
          </div>

          {/* Toggle */}
          <div className="mt-6 inline-flex items-center gap-1 sm:gap-3 p-1 sm:p-1.5 bg-slate-100 rounded-full text-sm max-w-full">
            <button
              onClick={() => setAnnual(false)}
              className={`px-3 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                !annual
                  ? "bg-white shadow-sm text-slate-900"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t("monthly")}
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-3 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                annual
                  ? "bg-white shadow-sm text-slate-900"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t("annual")}{" "}
                <span className="text-emerald-600 text-[10px] sm:text-xs font-black">
                {t("annualDiscount")}
              </span>
            </button>
          </div>

          {/* Data source indicator */}
          {!isLoading && (
            <div className="mt-3 flex items-center justify-center gap-2 text-xs">
              {isBackendConnected ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-600">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  {t("plansSynced")}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-amber-600">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {t("plansLoadError")}
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
        ) : plans.length === 0 ? (
          <div className="text-center py-12 mb-16">
            <p className="text-sm text-slate-500">{t("plansSoon")}</p>
            <Link href="/contact" className="text-emerald-600 font-bold text-sm hover:underline mt-2 inline-block">{t("contactUsArrow")}</Link>
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
            {t("faqTitle")}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
            {[
              {
                q: t("faq.q1"),
                a: t("faq.a1"),
              },
              {
                q: t("faq.q2"),
                a: t("faq.a2"),
              },
              {
                q: t("faq.q3"),
                a: t("faq.a3"),
              },
              {
                q: t("faq.q4"),
                a: t("faq.a4"),
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
            {t("ctaTrust")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/register"
              className="px-8 py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-lg"
            >
              {t("ctaTry")}
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3.5 bg-slate-100 text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-all"
            >
              {t("ctaTalk")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
