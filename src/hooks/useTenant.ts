"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getCookie } from "@/utils/cookies";

export function useTenant() {
  const { user, loading, isAdmin, getCurrentTenant } = useAuth();
  const router = useRouter();
  const params = useParams();

  const routeTenantSlug =
    typeof params?.tenant_slug === "string" ? params.tenant_slug : null;
  const cookieTenantSlug = getCookie("slug_organization");
  const resolvedTenantSlug =
    getCurrentTenant() || routeTenantSlug || cookieTenantSlug || null;

  useEffect(() => {
    if (loading) return;

    // Admins never go inside tenant routes
    if (isAdmin) {
      router.replace("/admin");
      return;
    }

    const slug = resolvedTenantSlug;

    // Redirect to login if no tenant
    if (!slug) {
      router.replace("/auth/login");
      return;
    }
  }, [loading, isAdmin, user, router, resolvedTenantSlug]);

  const tenantSlug = resolvedTenantSlug;
  const isTenant = !!tenantSlug && !isAdmin;

  return { tenantSlug, isTenant };
}
