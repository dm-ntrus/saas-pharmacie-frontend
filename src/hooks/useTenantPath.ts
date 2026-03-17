"use client";

import { useParams } from "next/navigation";
import { useCallback } from "react";

/**
 * Hook pour construire des URLs tenant correctes.
 * Retourne le basePath `/tenant/{slug}` et un helper pour construire des chemins.
 */
export function useTenantPath() {
  const params = useParams();
  const tenantSlug = params?.tenant_slug as string | undefined;

  const basePath = tenantSlug ? `/tenant/${tenantSlug}` : "";

  const buildPath = useCallback(
    (path: string) => {
      const cleanPath = path.startsWith("/") ? path : `/${path}`;
      return `${basePath}${cleanPath}`;
    },
    [basePath],
  );

  return { tenantSlug, basePath, buildPath };
}
