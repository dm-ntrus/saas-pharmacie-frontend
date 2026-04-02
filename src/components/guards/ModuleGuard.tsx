"use client";

import React from "react";
import { usePermissions } from "@/hooks/usePermissions";
import { useFeatureFlags } from "@/context/FeatureFlagContext";
import { MODULE_TO_ENTITLEMENT } from "@/constants/module-entitlement-map";
import { Permission } from "@/types/permissions";
import { ShieldAlert, Lock } from "lucide-react";

interface ModuleGuardProps {
  children: React.ReactNode;
  module?: string;
  /** Explicit entitlement key override (takes precedence over module→key mapping). */
  featureKey?: string;
  requiredPermissions?: (Permission | string)[];
  /** Si true, TOUTES les permissions sont requises. Sinon une seule suffit. */
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

function PermissionDeniedFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
        <ShieldAlert className="w-8 h-8 text-red-500" />
      </div>
      <div className="text-center">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Accès refusé
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md">
          Vous n&apos;avez pas les permissions nécessaires pour accéder à cette
          section. Contactez votre administrateur si vous pensez qu&apos;il
          s&apos;agit d&apos;une erreur.
        </p>
      </div>
    </div>
  );
}

function PlanUpgradeFallback({ moduleName }: { moduleName?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
        <Lock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
      </div>
      <div className="text-center">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Module non disponible
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md">
          {moduleName
            ? `Le module « ${moduleName} » n'est pas inclus dans votre plan d'abonnement actuel.`
            : "Cette fonctionnalité n'est pas incluse dans votre plan d'abonnement actuel."}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md">
          Contactez votre administrateur ou passez à un plan supérieur pour
          débloquer cette fonctionnalité.
        </p>
      </div>
    </div>
  );
}

export function ModuleGuard({
  children,
  module,
  featureKey,
  requiredPermissions,
  requireAll = false,
  fallback,
}: ModuleGuardProps) {
  const { canAccessModule, hasAnyPermission, hasAllPermissions } =
    usePermissions();
  const { isFeatureEnabled, loading: entitlementsLoading } = useFeatureFlags();

  // --- Entitlement (subscription plan) check ---
  const resolvedEntitlementKey =
    featureKey ?? (module ? MODULE_TO_ENTITLEMENT[module] : undefined);

  if (resolvedEntitlementKey) {
    if (entitlementsLoading) {
      return (
        <div className="flex items-center justify-center min-h-[30vh]">
          <div className="animate-pulse text-sm text-slate-500 dark:text-slate-400">
            Vérification de l&apos;abonnement...
          </div>
        </div>
      );
    }

    if (!isFeatureEnabled(resolvedEntitlementKey)) {
      return <>{fallback ?? <PlanUpgradeFallback moduleName={module} />}</>;
    }
  }

  // --- RBAC permission check ---
  let hasAccess = true;

  if (module) {
    hasAccess = canAccessModule(module);
  }

  if (hasAccess && requiredPermissions && requiredPermissions.length > 0) {
    hasAccess = requireAll
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);
  }

  if (!hasAccess) {
    return <>{fallback ?? <PermissionDeniedFallback />}</>;
  }

  return <>{children}</>;
}
