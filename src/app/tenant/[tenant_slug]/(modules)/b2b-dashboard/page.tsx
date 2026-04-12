"use client";

import React from "react";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { Permission } from "@/types/permissions";
import { Card } from "@/components/ui";
import { useB2BDashboard } from "@/hooks/api/useB2BDashboard";
import { useTranslations } from "@/lib/i18n-simple";

export default function B2BDashboardPage() {
  return (
    <ModuleGuard module="b2b-dashboard" requiredPermissions={[Permission.B2B_DASHBOARD_READ]}>
      <B2BDashboardContent />
    </ModuleGuard>
  );
}

function B2BDashboardContent() {
  const t = useTranslations("b2b.dashboard");
  const { data, isLoading, error } = useB2BDashboard();
  const k = (data as any)?.kpis ?? {};
  if (error) return <div className="text-sm text-red-600">{t("loadError")}</div>;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t("title")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><div className="p-4">{t("orders", { value: isLoading ? "..." : k.totalOrders ?? 0 })}</div></Card>
        <Card><div className="p-4">{t("dso", { value: isLoading ? "..." : Number(k.dsoEstimateDays ?? 0).toFixed(1) })}</div></Card>
        <Card><div className="p-4">{t("otif", { value: isLoading ? "..." : Math.round((k.otifProxy ?? 0) * 100) })}</div></Card>
      </div>
    </div>
  );
}
