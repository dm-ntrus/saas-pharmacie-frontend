"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useInsuranceProviders } from "@/hooks/api/useInsurance";
import type { InsuranceProvider } from "@/types/insurance";
import { INSURANCE_PROVIDER_STATUS_LABELS, INSURANCE_PROVIDER_TYPE_LABELS } from "@/types/insurance";
import { Button, Card, CardContent, Badge, EmptyState, ErrorBanner, Skeleton } from "@/components/ui";
import { ArrowLeft, Shield, Plus } from "lucide-react";

export default function InsurancePage() {
  return (
    <ModuleGuard module="insurance" requiredPermissions={[Permission.INSURANCE_PROVIDERS_READ]}>
      <InsuranceListContent />
    </ModuleGuard>
  );
}

function InsuranceListContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const { data: providers, isLoading, error, refetch } = useInsuranceProviders();
  const list = Array.isArray(providers) ? providers : [];

  const toId = (p: InsuranceProvider) => (typeof p.id === "string" && p.id.includes(":") ? p.id.split(":")[1] : p.id) || p.id;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/dashboard"))} leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Assureurs</h1>
            <p className="text-sm text-slate-500">Providers d&apos;assurance</p>
          </div>
        </div>
        <ProtectedAction permission={Permission.INSURANCE_PROVIDERS_CREATE}>
          <Button size="sm" onClick={() => router.push(buildPath("/insurance/new"))} leftIcon={<Plus className="h-4 w-4" />}>
            Nouveau
          </Button>
        </ProtectedAction>
      </div>

      {isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : error ? (
        <ErrorBanner message="Impossible de charger les assureurs" onRetry={() => refetch()} />
      ) : list.length === 0 ? (
        <EmptyState icon={<Shield className="w-8 h-8 text-slate-400" />} title="Aucun assureur" description="Ajoutez un provider d&apos;assurance." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((p: InsuranceProvider) => (
            <Card key={p.id} className="cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-700" onClick={() => router.push(buildPath(`/insurance/${toId(p)}`))}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">{p.name}</h3>
                  <Badge variant={p.status === "active" ? "success" : "default"} size="sm">{INSURANCE_PROVIDER_STATUS_LABELS[p.status]}</Badge>
                </div>
                <p className="text-sm text-slate-500 mt-1">Code : {p.code}</p>
                <p className="text-xs text-slate-400 mt-1">{INSURANCE_PROVIDER_TYPE_LABELS[p.type]} · Couverture {p.default_coverage_percent ?? 0}%</p>
                {p.email && <p className="text-xs text-slate-500 mt-1">{p.email}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
