"use client";
import type { ReactNode } from "react";
import TenantLayout from "@/layouts/tenant/TenantLayout";
import { useTenant } from "@/hooks/useTenant";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const { isTenant } = useTenant();

  if (!isTenant) return null;

  return (
    <div>
      <TenantLayout>{children}</TenantLayout>
    </div>
  );
}
