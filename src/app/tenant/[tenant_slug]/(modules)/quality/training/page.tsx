"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useTrainingRecords } from "@/hooks/api/useQuality";
import { Button, Card, CardContent, EmptyState, ErrorBanner, Skeleton } from "@/components/ui";
import { Plus, GraduationCap, ChevronRight } from "lucide-react";
import { formatDate } from "@/utils/formatters";

function safeId(id: string) {
  return typeof id === "string" && id.includes(":") ? id.split(":")[1] : id;
}

export default function QualityTrainingPage() {
  return (
    <ModuleGuard module="quality" requiredPermissions={[Permission.QUALITY_TRAINING_READ]}>
      <QualityTrainingContent />
    </ModuleGuard>
  );
}

function QualityTrainingContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const { data: records = [], isLoading, error, refetch } = useTrainingRecords();
  const list = Array.isArray(records) ? records : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Formations qualité</h1>
          <p className="text-sm text-slate-500 mt-1">Enregistrements de formations</p>
        </div>
        <ProtectedAction permission={Permission.QUALITY_TRAINING_CREATE}>
          <Button leftIcon={<Plus />} onClick={() => router.push(buildPath("/quality/training/new"))}>
            Enregistrer une formation
          </Button>
        </ProtectedAction>
      </div>
      {isLoading && <Skeleton className="h-48 w-full rounded-lg" />}
      {error && <ErrorBanner message="Erreur" onRetry={() => refetch()} />}
      {!isLoading && !error && list.length === 0 && (
        <EmptyState title="Aucun enregistrement" description="Aucune formation." onAction={() => router.push(buildPath("/quality/training/new"))} actionLabel="Enregistrer une formation" />
      )}
      {!isLoading && !error && list.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-slate-100">
              {list.map((r: { id: string; trainerName?: string; trainingDate?: string; competencyLevel?: string }) => (
                <li key={r.id}>
                  <button type="button" className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-slate-50" onClick={() => router.push(buildPath("/quality/training/" + safeId(r.id)))}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium">Formation - {r.trainerName ?? r.id}</p>
                        <p className="text-sm text-slate-500">{r.trainingDate ? formatDate(r.trainingDate) : "-"} - {r.competencyLevel ?? "-"}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
