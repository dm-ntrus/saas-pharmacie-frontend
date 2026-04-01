"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles, Zap, Building } from "lucide-react";
import type { Plan } from "@/types/billing";

const TIER_STYLES: Record<
  string,
  { badge: string; bg: string; border: string; cta: string; icon: typeof Sparkles }
> = {
  free: {
    badge: "bg-slate-100 text-slate-600",
    bg: "bg-slate-50",
    border: "border-slate-100",
    cta: "bg-slate-900 text-white hover:bg-emerald-600",
    icon: Zap,
  },
  starter: {
    badge: "bg-sky-100 text-sky-700",
    bg: "bg-white",
    border: "border-slate-100",
    cta: "bg-slate-900 text-white hover:bg-emerald-600",
    icon: Zap,
  },
  professional: {
    badge: "bg-emerald-100 text-emerald-700",
    bg: "bg-slate-900 text-white",
    border: "border-slate-800",
    cta: "bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/20",
    icon: Sparkles,
  },
  enterprise: {
    badge: "bg-purple-100 text-purple-700",
    bg: "bg-white",
    border: "border-slate-100",
    cta: "bg-slate-900 text-white hover:bg-emerald-600",
    icon: Building,
  },
  custom: {
    badge: "bg-amber-100 text-amber-700",
    bg: "bg-white",
    border: "border-slate-100",
    cta: "bg-slate-900 text-white hover:bg-emerald-600",
    icon: Building,
  },
};

function resolveStyle(tier: string) {
  return TIER_STYLES[tier] ?? TIER_STYLES.starter;
}

interface PlanCardProps {
  plan: Plan;
  index?: number;
  showAnnual?: boolean;
  recommended?: boolean;
}

function extractFeatureList(plan: Plan): string[] {
  const items: string[] = [];

  if (plan.max_users === -1) items.push("Utilisateurs illimités");
  else if (plan.max_users) items.push(`${plan.max_users} utilisateurs`);

  if (plan.max_pharmacies === -1) items.push("Multi-sites illimité");
  else if (plan.max_pharmacies && plan.max_pharmacies > 1)
    items.push(`Jusqu'à ${plan.max_pharmacies} sites`);

  if (plan.max_storage_gb)
    items.push(
      plan.max_storage_gb === -1
        ? "Stockage illimité"
        : `${plan.max_storage_gb} GB stockage`,
    );

  if (plan.is_trial_available) items.push("Essai gratuit inclus");

  if (plan.feature_flags?.length) {
    for (const ff of plan.feature_flags) {
      if (ff.is_included && ff.feature_name) items.push(ff.feature_name);
    }
  }

  if (plan.features && typeof plan.features === "object") {
    for (const [key, val] of Object.entries(plan.features)) {
      if (
        typeof val === "object" &&
        val !== null &&
        "enabled" in val &&
        (val as { enabled: boolean }).enabled
      ) {
        const label = key
          .replace(/^module\./, "")
          .replace(/[._]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        items.push(label);
      }
    }
  }

  if (items.length === 0) {
    if (plan.description) items.push(plan.description);
    items.push("Support inclus");
  }

  return items.slice(0, 8);
}

export default function PlanCard({
  plan,
  index = 0,
  showAnnual = false,
  recommended = false,
}: PlanCardProps) {
  const tier = (plan.plan_tier || "starter") as string;
  const style = resolveStyle(tier);
  const isPop = recommended || tier === "professional";
  const features = extractFeatureList(plan);

  const displayPrice = showAnnual
    ? Math.round(plan.price * 0.8)
    : plan.price;

  const href =
    tier === "enterprise" || tier === "custom"
      ? "/contact"
      : `/auth/register?plan=${encodeURIComponent(plan.plan_key)}`;

  const ctaLabel =
    tier === "enterprise" || tier === "custom"
      ? "Contacter l'équipe"
      : plan.is_trial_available
        ? "Essayer gratuitement"
        : "Choisir ce plan";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className={`relative rounded-3xl border p-8 sm:p-10 flex flex-col ${
        isPop
          ? "bg-slate-900 text-white border-slate-800 shadow-2xl shadow-emerald-600/10 lg:-mt-4 lg:pb-14"
          : `${style.bg} ${style.border}`
      }`}
    >
      {isPop && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
          Recommandé
        </span>
      )}

      <div className="flex items-center gap-2 mb-4">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
            isPop ? "bg-white/10 text-emerald-400" : style.badge
          }`}
        >
          <style.icon className="w-3 h-3" />
          {tier}
        </span>
      </div>

      <h3 className="text-xl font-display font-bold mb-1">{plan.name}</h3>

      {plan.description && (
        <p
          className={`text-sm mb-4 ${
            isPop ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {plan.description}
        </p>
      )}

      <div className="flex items-baseline gap-1.5 mb-1">
        <span className="text-5xl font-display font-bold">${displayPrice}</span>
        <span
          className={`text-sm font-bold uppercase tracking-widest ${
            isPop ? "text-slate-400" : "text-slate-500"
          }`}
        >
          / {plan.billing_interval === "yearly" ? "an" : "mois"}
        </span>
      </div>

      {showAnnual && plan.billing_interval === "monthly" && (
        <p className="text-xs text-emerald-500 font-bold mb-4">
          Économisez 20 % avec le plan annuel
        </p>
      )}

      {plan.currency && plan.currency !== "USD" && (
        <p
          className={`text-xs mb-4 ${isPop ? "text-slate-500" : "text-slate-400"}`}
        >
          Devise : {plan.currency}
        </p>
      )}

      <ul className="space-y-2.5 mb-8 flex-1">
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
        className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
          isPop ? style.cta : "bg-slate-900 text-white hover:bg-emerald-600"
        }`}
      >
        {ctaLabel}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </motion.div>
  );
}

/* ─── Skeleton while loading ─── */

export function PlanCardSkeleton() {
  return (
    <div className="rounded-3xl border border-slate-100 p-8 sm:p-10 animate-pulse bg-slate-50">
      <div className="h-5 w-20 bg-slate-200 rounded-full mb-4" />
      <div className="h-6 w-40 bg-slate-200 rounded mb-2" />
      <div className="h-4 w-56 bg-slate-200 rounded mb-6" />
      <div className="h-12 w-32 bg-slate-200 rounded mb-8" />
      <div className="space-y-3 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-slate-200" />
            <div className="h-4 w-full bg-slate-200 rounded" />
          </div>
        ))}
      </div>
      <div className="h-12 w-full bg-slate-200 rounded-xl" />
    </div>
  );
}

/* ─── Fallback static plans when API is unreachable ─── */

export const FALLBACK_PLANS: Plan[] = [
  {
    id: "fallback-starter",
    plan_key: "starter",
    name: "Starter",
    description: "Petite pharmacie de quartier.",
    active: true,
    currency: "USD",
    billing_interval: "monthly",
    type: "paid",
    plan_tier: "starter",
    pricing_model: "flat",
    price: 29,
    max_users: 3,
    max_storage_gb: 5,
    max_pharmacies: 1,
    is_trial_available: true,
  },
  {
    id: "fallback-professional",
    plan_key: "professional",
    name: "Standard",
    description: "Pharmacie établie, équipe complète.",
    active: true,
    currency: "USD",
    billing_interval: "monthly",
    type: "paid",
    plan_tier: "professional",
    pricing_model: "flat",
    price: 99,
    max_users: -1,
    max_storage_gb: 50,
    max_pharmacies: 3,
    is_trial_available: true,
  },
  {
    id: "fallback-enterprise",
    plan_key: "enterprise",
    name: "Entreprise",
    description: "Distributeurs et chaînes multi-sites.",
    active: true,
    currency: "USD",
    billing_interval: "monthly",
    type: "paid",
    plan_tier: "enterprise",
    pricing_model: "flat",
    price: 199,
    max_users: -1,
    max_storage_gb: -1,
    max_pharmacies: -1,
    is_trial_available: true,
  },
];
