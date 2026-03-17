"use client";

import React from "react";
import { usePermissions } from "@/hooks/usePermissions";
import { Permission } from "@/types/permissions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";

interface ProtectedActionProps {
  children: React.ReactNode;
  permission: Permission | string;
  /** Si la permission est absente, masquer l'élément au lieu de le désactiver */
  hideIfDenied?: boolean;
  tooltipMessage?: string;
}

/**
 * Protège un bouton/lien par une permission.
 * Par défaut, désactive l'élément et montre un tooltip si la permission est absente.
 */
export function ProtectedAction({
  children,
  permission,
  hideIfDenied = false,
  tooltipMessage = "Vous n'avez pas la permission d'effectuer cette action",
}: ProtectedActionProps) {
  const { hasPermission } = usePermissions();

  if (!hasPermission(permission)) {
    if (hideIfDenied) return null;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-block cursor-not-allowed">
              <span className="pointer-events-none opacity-50">
                {children}
              </span>
            </span>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            className="bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg z-50"
          >
            {tooltipMessage}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return <>{children}</>;
}
