"use client";

import { AdminProvider } from "@/context/AdminContext";
import { useAdmin } from "@/hooks/useAdmin";
import AdminLayout from "@/layouts/admin/AdminLayout";
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
        <AdminLayout>{children}</AdminLayout>
      </AdminProvider>
    </>
  );
}
