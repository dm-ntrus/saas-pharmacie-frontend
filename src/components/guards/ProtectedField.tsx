"use client";

import React from "react";
import { usePermissions } from "@/hooks/usePermissions";
import { Permission } from "@/types/permissions";

interface ProtectedFieldProps {
  children: React.ReactNode;
  permission: Permission | string;
  /** Valeur affichée si la permission est absente (masque le champ sinon) */
  redactedValue?: React.ReactNode;
}

/**
 * Protège un champ d'information sensible.
 * Masque ou remplace la valeur si la permission est absente.
 */
export function ProtectedField({
  children,
  permission,
  redactedValue,
}: ProtectedFieldProps) {
  const { hasPermission } = usePermissions();

  if (!hasPermission(permission)) {
    if (redactedValue !== undefined) return <>{redactedValue}</>;
    return null;
  }

  return <>{children}</>;
}
