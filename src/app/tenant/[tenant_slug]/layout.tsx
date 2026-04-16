import { OrganizationProvider } from "@/context/OrganizationContext";
import type { ReactNode } from "react";
import { FeatureFlagProvider } from "@/context/FeatureFlagContext";
import { AccessibilityPanel } from "@/design-system";

type LayoutProps = {
  children: ReactNode;
  params: { tenant_slug: string };
};

export default function Layout({ children, params }: LayoutProps) {
  const { tenant_slug } = params;

  return (
    <>
      <AccessibilityPanel />
      <OrganizationProvider tenantRouteSlug={tenant_slug}>
        <FeatureFlagProvider>{children}</FeatureFlagProvider>
      </OrganizationProvider>
    </>
  );
}
