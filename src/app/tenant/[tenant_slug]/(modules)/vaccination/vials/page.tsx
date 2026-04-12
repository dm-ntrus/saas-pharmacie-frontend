"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useVaccinationVials, useVialsNeedingAttention } from "@/hooks/api/useVaccination";
import { Button, Card, CardContent, ErrorBanner, Skeleton, Badge, EmptyState } from "@/components/ui";
import { Package, Plus, ChevronRight, AlertTriangle } from "lucide-react";
import { VIAL_STATUS_LABELS } from "@/types/vaccination";

function safeId(id: string) {
  return typeof id === "string" && id.includes(":") ? id.split(":")[1] ?? id : id;
}

export default function VialsPage() {
  return (
    <ModuleGuard
      module="vaccination"
      requiredPermissions={[Permission.VACCINATION_READ]}
    >
      <VialsContent />
    </ModuleGuard>
  );
}

function VialsContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const { data: vials, isLoading, error, refetch } = useVaccinationVials();
  const { data: attention } = useVialsNeedingAttention();

  if (isLoading && !vials) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorBanner
        message="Erreur de chargement des flacons"
        onRetry={() => refetch()}
      />
    );
  }

  const list = Array.isArray(vials) ? vials : [];
  const attentionList = Array.isArray(attention) ? attention : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Flacons
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Stock de vaccins et flacons multi-doses
          </p>
        </div>
        <Button
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => router.push(buildPath("/vaccination/vials/new"))}
        >
          Enregistrer un flacon
        </Button>
      </div>

      {attentionList.length > 0 && (
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h2 className="font-semibold text-amber-800 dark:text-amber-200">
                Flacons à surveiller ({attentionList.length})
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {attentionList.slice(0, 5).map((v) => (
                <Button
                  key={v.id}
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(buildPath(`/vaccination/vials/${safeId(v.id)}`))}
                >
                  {v.vaccine_name} — {v.doses_remaining} doses
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {list.length === 0 ? (
        <EmptyState
          title="Aucun flacon"
          description="Enregistrez un flacon pour commencer."
          action={
            <Button
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => router.push(buildPath("/vaccination/vials/new"))}
            >
              Enregistrer un flacon
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {list.map((vial) => {
            const id = safeId(vial.id);
            return (
              <Card
                key={vial.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(buildPath(`/vaccination/vials/${id}`))}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                    <Package className="w-5 h-5 text-violet-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                      {vial.vaccine_name}
                    </p>
                    <p className="text-xs text-slate-500">
                      Lot {vial.lot_number} · {vial.doses_remaining}/{vial.total_doses} doses
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {VIAL_STATUS_LABELS[vial.status] ?? vial.status}
                  </Badge>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(buildPath("/vaccination/vials/administer"))}
        >
          Administrer des doses
        </Button>
      </div>
    </div>
  );
}
