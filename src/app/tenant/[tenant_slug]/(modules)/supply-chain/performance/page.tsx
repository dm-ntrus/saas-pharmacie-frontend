"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { useSupplierPerformances } from "@/hooks/api/useSupplyChain";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  DataTable,
  type Column,
  Skeleton,
  EmptyState,
  ErrorBanner,
} from "@/components/ui";
import { ArrowLeft, TrendingUp } from "lucide-react";

export default function SupplyChainPerformancePage() {
  return (
    <ModuleGuard
      module="supply-chain"
      requiredPermissions={[Permission.SUPPLY_CHAIN_READ, Permission.SUPPLIER_PERFORMANCE_READ]}
    >
      <PerformanceContent />
    </ModuleGuard>
  );
}

function PerformanceContent() {
  const { buildPath } = useTenantPath();
  const { data, isLoading, error, refetch } = useSupplierPerformances();

  const raw = data?.data ?? data;
  const list = Array.isArray(raw) ? raw : (raw && typeof raw === "object" && "rankings" in raw ? (raw as { rankings?: unknown[] }).rankings : []) ?? [];

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "supplier_name",
      title: "Fournisseur",
      render: (_, row) =>
        String(
          (row as Record<string, unknown>).supplier_name ??
            (row as Record<string, unknown>).supplierId ??
            (row as Record<string, unknown>).name ??
            "—",
        ),
    },
    {
      key: "rating",
      title: "Note",
      render: (_, row) => {
        const r = (row as Record<string, unknown>).rating ?? (row as Record<string, unknown>).overall_score;
        return r != null ? `${Number(r)}/5` : "—";
      },
    },
    {
      key: "on_time_delivery_rate",
      title: "Délais respectés",
      render: (_, row) => {
        const v = (row as Record<string, unknown>).on_time_delivery_rate ?? (row as Record<string, unknown>).onTimeDeliveryRate;
        return v != null ? `${Number(v)}%` : "—";
      },
    },
    {
      key: "quality_score",
      title: "Qualité",
      render: (_, row) => {
        const v = (row as Record<string, unknown>).quality_score ?? (row as Record<string, unknown>).qualityScore;
        return v != null ? `${Number(v)}%` : "—";
      },
    },
  ];

  if (error) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href={buildPath("/supply-chain")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Retour
          </Link>
        </Button>
        <ErrorBanner title="Erreur" message="Impossible de charger les performances" onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={buildPath("/supply-chain")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Retour
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Performance fournisseurs</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Classement et scores des fournisseurs</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Classement
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : list.length === 0 ? (
            <EmptyState
              title="Aucune donnée"
              description="Les indicateurs de performance fournisseurs apparaîtront ici."
            />
          ) : (
            <DataTable
              columns={columns}
              data={list as unknown as Record<string, unknown>[]}
              loading={false}
              rowKey={(row) => String((row as Record<string, unknown>).supplier_id ?? (row as Record<string, unknown>).id ?? JSON.stringify(row))}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
