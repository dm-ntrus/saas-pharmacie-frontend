"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Check,
  ArrowRight,
  Sparkles,
  Zap,
  Building2,
  Gift,
  Crown,
} from "lucide-react";
import type { Plan } from "@/types/billing";

const TIER_META: Record<
  string,
  {
    icon: typeof Zap;
    accent: string;
    badgeBg: string;
    badgeText: string;
    ring: string;
  }
> = {
  free: {
    icon: Gift,
    accent: "text-slate-600",
    badgeBg: "bg-slate-100",
    badgeText: "text-slate-700",
    ring: "ring-slate-200",
  },
  starter: {
    icon: Zap,
    accent: "text-blue-600",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-700",
    ring: "ring-blue-200",
  },
  professional: {
    icon: Sparkles,
    accent: "text-emerald-600",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
    ring: "ring-emerald-400",
  },
  enterprise: {
    icon: Building2,
    accent: "text-violet-600",
    badgeBg: "bg-violet-50",
    badgeText: "text-violet-700",
    ring: "ring-violet-200",
  },
  custom: {
    icon: Crown,
    accent: "text-amber-600",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700",
    ring: "ring-amber-200",
  },
};

const TIER_FEATURE_KEYS: Record<string, string[]> = {
  free: [
    "feat_1pharmacy",
    "feat_5users",
    "feat_basicPos",
    "feat_stockMgmt",
    "feat_communitySupport",
  ],
  starter: [
    "feat_1pharmacy",
    "feat_15users",
    "feat_fullPos",
    "feat_advancedInventory",
    "feat_patientsRx",
    "feat_monthlyReports",
    "feat_emailSupport",
  ],
  professional: [
    "feat_5pharmacies",
    "feat_50users",
    "feat_allModules",
    "feat_analyticsBI",
    "feat_supplyChain",
    "feat_integratedAccounting",
    "feat_crmLoyalty",
    "feat_prioritySupport",
  ],
  enterprise: [
    "feat_unlimitedSites",
    "feat_unlimitedUsers",
    "feat_customModules",
    "feat_dedicatedApi",
    "feat_ssoCompliance",
    "feat_accountManager",
    "feat_sla",
    "feat_onsiteTraining",
  ],
  custom: [
    "feat_dedicatedInfra",
    "feat_customFeatures",
    "feat_customIntegrations",
    "feat_premiumSupport",
  ],
};

function resolveMeta(tier: string) {
  return TIER_META[tier] ?? TIER_META.starter;
}

function resolveApiFeatures(plan: Plan): string[] | null {
  const fromPlan: string[] = [];

  if (plan.feature_flags?.length) {
    for (const ff of plan.feature_flags) {
      if (ff.is_included && ff.feature_name) fromPlan.push(ff.feature_name);
    }
  }

  if (plan.features && typeof plan.features === "object") {
    for (const [key, val] of Object.entries(plan.features)) {
      if (typeof val === "object" && val !== null) {
        const v = val as Record<string, unknown>;
        if (v.enabled === true || v.included === true) {
          fromPlan.push(
            key
              .replace(/^module\./, "")
              .replace(/[._]/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase()),
          );
        }
      }
    }
  }

  if (fromPlan.length >= 4) return fromPlan.slice(0, 8);
  return null;
}

interface PlanCardProps {
  plan: Plan;
  index?: number;
  showAnnual?: boolean;
  recommended?: boolean;
}

export default function PlanCard({
  plan,
  index = 0,
  showAnnual = false,
}: PlanCardProps) {
  const t = useTranslations("pages.pricing");
  const tier = (plan.plan_tier || "starter") as string;
  const meta = resolveMeta(tier);
  const isPop = tier === "professional";

  const features = useMemo(() => {
    const api = resolveApiFeatures(plan);
    if (api) return api;
    const keys = TIER_FEATURE_KEYS[tier] ?? TIER_FEATURE_KEYS.starter;
    return keys.map((k) => t(k));
  }, [plan, tier, t]);

  const price = typeof plan.price === "string" ? parseFloat(plan.price) : plan.price;
  const displayPrice =
    plan.billing_interval === "yearly" ? Math.round(price / 12) : price;
  const isFree = !price || price === 0;

  const storage = typeof plan.max_storage_gb === "string"
    ? parseFloat(plan.max_storage_gb)
    : plan.max_storage_gb;

  const href =
    tier === "enterprise" || tier === "custom"
      ? "/contact"
      : `/auth/register?plan=${encodeURIComponent(plan.plan_key)}`;

  const ctaLabel =
    tier === "enterprise" || tier === "custom"
      ? t("contactTeam")
      : isFree
        ? t("startFree")
        : plan.is_trial_available
          ? t("freeTrial")
          : t("choosePlan");

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className={`relative h-full flex flex-col rounded-2xl border-2 transition-shadow duration-300 ${
        isPop
          ? "border-emerald-500 bg-white shadow-xl shadow-emerald-500/10 scale-[1.02] z-10"
          : "border-slate-200 bg-white hover:shadow-lg hover:border-slate-300"
      }`}
    >
      {isPop && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 text-white rounded-full text-[11px] font-bold uppercase tracking-wider shadow-lg shadow-emerald-600/30">
            {/* <Sparkles className="w-3.5 h-3.5" /> */}
            {t("popular")}
          </span>
        </div>
      )}

      <div className={`p-6 sm:p-8 ${isPop ? "pt-10" : ""}`}>
        {/* Tier badge */}
        <div className="flex items-center gap-2 mb-5">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${meta.badgeBg} ${meta.badgeText}`}
          >
            <meta.icon className="w-3.5 h-3.5" />
            {t(`tierLabel_${tier}`)}
          </span>
        </div>

        {/* Name */}
        <h3 className="text-lg font-bold text-slate-900 mb-1">{plan.name}</h3>

        {plan.description && (
          <p className="text-[13px] text-slate-500 leading-relaxed mb-5 line-clamp-2">
            {plan.description}
          </p>
        )}

        {/* Price */}
        <div className="mb-6">
          {isFree ? (
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900">
                {t("free")}
              </span>
            </div>
          ) : tier === "enterprise" || tier === "custom" ? (
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900">
                {t("onQuote")}
              </span>
            </div>
          ) : (
            <>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900">
                  {displayPrice}
                  <span className="text-lg font-medium text-slate-400 ml-0.5">$</span>
                </span>
                <span className="text-sm text-slate-500 font-medium">
                  {t("perMonth")}
                </span>
              </div>
              {plan.billing_interval === "yearly" && (
                <p className="text-xs text-emerald-600 font-semibold mt-1">
                  {price}$ {t("billedAnnually")}
                </p>
              )}
              {showAnnual && plan.billing_interval === "monthly" && (
                <p className="text-xs text-slate-400 mt-1">
                  {t("saveAnnual")}
                </p>
              )}
            </>
          )}
        </div>

        {/* CTA */}
        <Link
          href={href}
          className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
            isPop
              ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/25"
              : isFree
                ? "bg-slate-100 text-slate-900 hover:bg-slate-200"
                : "bg-slate-900 text-white hover:bg-slate-800"
          }`}
        >
          {ctaLabel}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-100 mx-6 sm:mx-8" />

      {/* Features */}
      <div className="p-6 sm:p-8 pt-5 flex-1">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          {t("whatsIncluded")}
        </p>
        <ul className="space-y-3">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2.5">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  isPop
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <Check className="w-3 h-3" strokeWidth={3} />
              </div>
              <span className="text-sm text-slate-700 leading-snug">{f}</span>
            </li>
          ))}
          {storage && storage > 0 && (
            <li className="flex items-start gap-2.5">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  isPop
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <Check className="w-3 h-3" strokeWidth={3} />
              </div>
              <span className="text-sm text-slate-700 leading-snug">
                {storage === -1
                  ? t("unlimitedStorage")
                  : t("storageGb", { amount: storage })}
              </span>
            </li>
          )}
        </ul>
      </div>
    </motion.div>
  );
}

/* ─── Skeleton ─── */

export function PlanCardSkeleton() {
  return (
    <div className="rounded-2xl border-2 border-slate-100 bg-white animate-pulse">
      <div className="p-6 sm:p-8">
        <div className="h-6 w-20 bg-slate-100 rounded-lg mb-5" />
        <div className="h-5 w-36 bg-slate-100 rounded mb-2" />
        <div className="h-4 w-52 bg-slate-100 rounded mb-5" />
        <div className="h-10 w-28 bg-slate-100 rounded mb-6" />
        <div className="h-11 w-full bg-slate-100 rounded-xl" />
      </div>
      <div className="border-t border-slate-100 mx-6 sm:mx-8" />
      <div className="p-6 sm:p-8 pt-5 space-y-3">
        <div className="h-3 w-24 bg-slate-100 rounded mb-4" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full bg-slate-100 shrink-0" />
            <div className="h-4 bg-slate-100 rounded flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
}
