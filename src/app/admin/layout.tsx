import { AdminProvider } from "@/context/AdminContext";
import { useAdmin } from "@/hooks/useAdmin";
import AdminLayout from "@/layouts/admin/AdminLayout";
import Head from "next/head";
import type { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const { isAdmin } = useAdmin();

  if (!isAdmin) return null;

  return (
    <>
      <AdminProvider>
        <Head>
          <title>MedPharma Admin - Gestion multi-tenant des pharmacies</title>
          <meta
            name="description"
            content="Plateforme SaaS MedPharma pour la gestion complète des pharmacies."
          />
        </Head>
        <AdminLayout>{children}</AdminLayout>
      </AdminProvider>
    </>
  );
}
