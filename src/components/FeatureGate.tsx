"use client";

import React from "react";
import { useFeatureFlags } from "@/context/FeatureFlagContext";
import { Lock } from "lucide-react";

interface FeatureGateProps {
  feature: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

function DefaultFeatureGateFallback() {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-3">
      <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
        <Lock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-sm">
        Fonctionnalité non disponible dans votre plan actuel.
      </p>
    </div>
  );
}

export const FeatureGate: React.FC<FeatureGateProps> = ({
  feature,
  fallback,
  children,
}) => {
  const { isFeatureEnabled, loading } = useFeatureFlags();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-pulse text-sm text-slate-400">
          Chargement...
        </div>
      </div>
    );
  }

  if (!isFeatureEnabled(feature)) {
    return <>{fallback ?? <DefaultFeatureGateFallback />}</>;
  }

  return <>{children}</>;
};
