"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useTranslations } from "@/lib/i18n-simple";
import { motion } from "framer-motion";
import { ArrowRight, Check, Sparkles, Gift, Zap, Building2 } from "lucide-react";
import { usePublicPlans } from "@/hooks/api/usePublicPlans";
import { PlanCardSkeleton } from "@/components/public/PlanCard";
import type { Plan } from "@/types/billing";

const TIER_META: Record<string, { icon: typeof Zap; badgeBg: string; badgeText: string }> = {
  free: { icon: Gift, badgeBg: "bg-slate-100", badgeText: "text-slate-700" },
  starter: { icon: Zap, badgeBg: "bg-blue-50", badgeText: "text-blue-700" },
  professional: { icon: Sparkles, badgeBg: "bg-emerald-50", badgeText: "text-emerald-700" },
  enterprise: { icon: Building2, badgeBg: "bg-violet-50", badgeText: "text-violet-700" },
};

const TIER_SHORT_FEATURE_KEYS: Record<string, string[]> = {
  free: ["shortFeat_5users", "shortFeat_basicPos", "shortFeat_stockMgmt", "shortFeat_communitySupport"],
  starter: ["shortFeat_15users", "shortFeat_fullPos", "shortFeat_advancedInventory", "shortFeat_patientsRx", "shortFeat_freeTrial"],
  professional: ["shortFeat_50users", "shortFeat_allModules", "shortFeat_analyticsBI", "shortFeat_crmLoyalty", "shortFeat_support247"],
  enterprise: ["shortFeat_unlimitedUsers", "shortFeat_unlimitedSites", "shortFeat_dedicatedApi", "shortFeat_accountManager", "shortFeat_sla"],
};

function deduplicateByTier(plans: Plan[]): Plan[] {
  const seen = new Set<string>();
  return plans.filter((p) => {
    const tier = p.plan_tier || p.plan_key;
    if (seen.has(tier)) return false;
    seen.add(tier);
    return p.billing_interval === "monthly";
  });
}

export default function HomePricingSection() {
  const t = useTranslations("pages.pricing");
  const { data: apiPlans, isLoading, isError } = usePublicPlans({ active: true, interval: "monthly" });

  const plans: Plan[] = useMemo(() => {
    if (!apiPlans || apiPlans.length === 0) return [];
    return deduplicateByTier(apiPlans).slice(0, 4);
  }, [apiPlans]);

  return (
    <section id="pricing" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-600 mb-3">
            {t("tag")}
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 leading-[1.15]">
            {t("title")}{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              {t("titleHighlight")}
            </span>{" "}
            {t("titleEnd")}
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            {t("desc")}
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {[0, 1, 2, 3].map((i) => (
              <PlanCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error / empty */}
        {!isLoading && (isError || plans.length === 0) && (
          <div className="text-center py-16 mb-10">
            <p className="text-slate-500 mb-3">
              {t("plansComingSoon")}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm hover:underline"
            >
              {t("contactUs")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Plan cards */}
        {!isLoading && !isError && plans.length > 0 && (
          <div
            className={`grid gap-5 items-start mb-12 ${
              plans.length <= 2
                ? "sm:grid-cols-2 max-w-2xl mx-auto"
                : plans.length === 3
                  ? "sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto"
                  : "sm:grid-cols-2 lg:grid-cols-4"
            }`}
          >
            {plans.map((plan, i) => {
              const tier = plan.plan_tier || "starter";
              const isPop = tier === "professional";
              const meta = TIER_META[tier] ?? TIER_META.starter;
              const featureKeys = TIER_SHORT_FEATURE_KEYS[tier] ?? TIER_SHORT_FEATURE_KEYS.starter;
              const price = typeof plan.price === "string" ? parseFloat(plan.price) : plan.price;
              const isFree = !price || price === 0;
              const isEnterprise = tier === "enterprise" || tier === "custom";

              const href = isEnterprise
                ? "/contact"
                : `/auth/register?plan=${encodeURIComponent(plan.plan_key)}`;

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className={`relative flex flex-col rounded-2xl border-2 bg-white transition-shadow ${
                    isPop
                      ? "border-emerald-500 shadow-xl shadow-emerald-500/10 scale-[1.02] z-10"
                      : "border-slate-200 hover:shadow-lg hover:border-slate-300"
                  }`}
                >
                  {isPop && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 text-white rounded-full text-[11px] font-bold uppercase tracking-wider shadow-lg shadow-emerald-600/30">
                        {/* <Sparkles className="w-3.5 h-3.5" /> */}
                        {t("popularShort")}
                      </span>
                    </div>
                  )}

                  <div className={`p-6 ${isPop ? "pt-9" : ""}`}>
                    {/* Badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold mb-4 ${meta.badgeBg} ${meta.badgeText}`}
                    >
                      <meta.icon className="w-3.5 h-3.5" />
                      {t(`tierLabel_${tier}`)}
                    </span>

                    {/* Name */}
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      {plan.name?.replace(/ \(mensuel\)| \(annuel\)/i, "")}
                    </h3>

                    {/* Price */}
                    <div className="mb-5">
                      {isFree ? (
                        <span className="text-3xl font-extrabold text-slate-900">{t("free")}</span>
                      ) : isEnterprise ? (
                        <span className="text-3xl font-extrabold text-slate-900">{t("onQuote")}</span>
                      ) : (
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-extrabold text-slate-900">
                            {price}
                            <span className="text-base font-medium text-slate-400 ml-0.5">$</span>
                          </span>
                          <span className="text-sm text-slate-500">{t("perMonth")}</span>
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <Link
                      href={href}
                      className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                        isPop
                          ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/25"
                          : isFree
                            ? "bg-slate-100 text-slate-900 hover:bg-slate-200"
                            : "bg-slate-900 text-white hover:bg-slate-800"
                      }`}
                    >
                      {isEnterprise ? t("ctaContact") : isFree ? t("ctaStart") : t("ctaTry")}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* Features */}
                  <div className="border-t border-slate-100 mx-6" />
                  <div className="p-6 pt-4 flex-1">
                    <ul className="space-y-2.5">
                      {featureKeys.map((key) => (
                        <li key={key} className="flex items-start gap-2.5">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                              isPop
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            <Check className="w-3 h-3" strokeWidth={3} />
                          </div>
                          <span className="text-sm text-slate-700">{t(key)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            {t("viewComparison")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
