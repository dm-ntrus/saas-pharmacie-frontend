import { OrganizationProvider } from "@/context/OrganizationContext";
import React from "react";
import type { ReactNode } from "react";
import Head from "next/head";
import { FeatureFlagProvider } from "@/context/FeatureFlagContext";

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ tenant_slug: string }>;
};

export default function Layout({ children, params }: LayoutProps) {
  const { tenant_slug } = React.use(params);

  const title = `MedPharma - ${tenant_slug} | SaaS multi-tenant pour pharmacies`;
  const description = `MedPharma pour ${tenant_slug} adapté à votre activité pharmaceutique.`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <OrganizationProvider>
        <FeatureFlagProvider>{children}</FeatureFlagProvider>
      </OrganizationProvider>
    </>
  );
}
