"use client";

import { useTenant } from "@/hooks/useTenant";

export default function TenantHomePage() {
  const { tenantSlug } = useTenant();

  return (
    <div>
      <h1>Welcome to tenant: {tenantSlug}</h1>
    </div>
  );
}
