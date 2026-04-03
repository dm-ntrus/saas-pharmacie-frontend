"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useFeatureFlags } from "@/context/FeatureFlagContext";
import { useTenantPath } from "@/hooks/useTenantPath";
import { AlertTriangle, ArrowRight } from "lucide-react";

/**
 * Shows a dismissible banner when a user is redirected because a module
 * is no longer available in their plan (query param `plan_blocked`).
 */
export function PlanDowngradeBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const { loading } = useFeatureFlags();

  const blockedModule = searchParams?.get("plan_blocked");

  if (!blockedModule || loading) return null;

  const dismiss = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("plan_blocked");
    router.replace(url.pathname + url.search);
  };

  return (
    <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4 flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
          Le module &laquo;&nbsp;{blockedModule}&nbsp;&raquo; n&apos;est pas
          inclus dans votre plan actuel.
        </p>
        <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
          Passez à un plan supérieur pour débloquer cette fonctionnalité.
        </p>
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => router.push(buildPath("/billing/upgrade"))}
            className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 dark:text-amber-200 hover:underline"
          >
            Voir les plans <ArrowRight className="w-3 h-3" />
          </button>
          <button
            onClick={dismiss}
            className="text-xs text-amber-600 dark:text-amber-400 hover:underline"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
