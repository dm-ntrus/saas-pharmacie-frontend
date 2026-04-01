'use client';

import { OrganizationProvider } from "@/context/OrganizationContext";
import React from "react";
import type { ReactNode } from "react";
import Head from "next/head";
import { FeatureFlagProvider } from "@/context/FeatureFlagContext";
import { AccessibilityPanel } from "@/design-system";

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ tenant_slug: string }>;
};

export default function Layout({ children, params }: LayoutProps) {
  const { tenant_slug } = React.use(params);

  const title = `SyntixPharma - ${tenant_slug} | Gestion Intelligente de Pharmacie`;
  const description = `SyntixPharma pour ${tenant_slug} adapté à votre activité pharmaceutique.`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <AccessibilityPanel />
      <OrganizationProvider tenantRouteSlug={tenant_slug}>
        <FeatureFlagProvider>{children}</FeatureFlagProvider>
      </OrganizationProvider>
    </>
  );
}
