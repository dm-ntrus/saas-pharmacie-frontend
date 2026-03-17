"use client";

import React from "react";
import { usePermissions } from "@/hooks/usePermissions";
import { Permission } from "@/types/permissions";
import { ShieldAlert } from "lucide-react";

interface ModuleGuardProps {
  children: React.ReactNode;
  module?: string;
  requiredPermissions?: (Permission | string)[];
  /** Si true, TOUTES les permissions sont requises. Sinon une seule suffit. */
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

function DefaultFallback() {
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

export function ModuleGuard({
  children,
  module,
  requiredPermissions,
  requireAll = false,
  fallback,
}: ModuleGuardProps) {
  const { canAccessModule, hasAnyPermission, hasAllPermissions } =
    usePermissions();

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
    return <>{fallback ?? <DefaultFallback />}</>;
  }

  return <>{children}</>;
}
