'use client';

import { OrganizationProvider } from "@/context/OrganizationContext";
import React from "react";
import type { ReactNode } from "react";
import { FeatureFlagProvider } from "@/context/FeatureFlagContext";
import { AccessibilityPanel } from "@/design-system";

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ tenant_slug: string }>;
};

export default function Layout({ children, params }: LayoutProps) {
  const { tenant_slug } = React.use(params);

  return (
    <>
      <AccessibilityPanel />
      <OrganizationProvider tenantRouteSlug={tenant_slug}>
        <FeatureFlagProvider>{children}</FeatureFlagProvider>
      </OrganizationProvider>
    </>
  );
}
