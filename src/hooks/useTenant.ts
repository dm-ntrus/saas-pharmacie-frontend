"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function useTenant() {
  const { user, loading, isAdmin, getCurrentTenant } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Admins never go inside tenant routes
    if (isAdmin) {
      router.replace("/admin");
      return;
    }

    const slug = getCurrentTenant();

    // Redirect to login if no tenant
    if (!slug) {
      router.replace("/auth/login");
      return;
    }
  }, [loading, isAdmin, user, router]);

  const tenantSlug = getCurrentTenant();
  const isTenant = !!tenantSlug && !isAdmin;

  return { tenantSlug, isTenant };
}
