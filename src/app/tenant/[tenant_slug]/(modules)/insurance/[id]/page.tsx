"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useInsuranceProviderById, useUpdateInsuranceProvider, useDeleteInsuranceProvider } from "@/hooks/api/useInsurance";
import type { InsuranceProvider } from "@/types/insurance";
import { INSURANCE_PROVIDER_STATUS_LABELS, INSURANCE_PROVIDER_TYPE_LABELS } from "@/types/insurance";
import { Button, Card, CardContent, Badge, ErrorBanner, Skeleton } from "@/components/ui";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

export default function InsuranceDetailPage() {
  return (
    <ModuleGuard module="insurance" requiredPermissions={[Permission.INSURANCE_PROVIDERS_READ]}>
      <InsuranceDetailContent />
    </ModuleGuard>
  );
}

function InsuranceDetailContent() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { buildPath } = useTenantPath();
  const { data: provider, isLoading, error, refetch } = useInsuranceProviderById(id);
  const updateMutation = useUpdateInsuranceProvider();
  const deleteMutation = useDeleteInsuranceProvider();

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (error || !provider) return <ErrorBanner message="Assureur introuvable" onRetry={() => refetch()} />;

  const p = provider as InsuranceProvider;

  const handleDelete = () => {
    if (!confirm("Supprimer cet assureur ?")) return;
    const shortId = typeof p.id === "string" && p.id.includes(":") ? p.id.split(":")[1] : p.id;
    deleteMutation.mutate(shortId, { onSuccess: () => router.push(buildPath("/insurance")) });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/insurance"))} leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{p.name}</h1>
            <p className="text-sm text-slate-500">{p.code} · {INSURANCE_PROVIDER_TYPE_LABELS[p.type]}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <ProtectedAction permission={Permission.INSURANCE_PROVIDERS_UPDATE}>
            <Button variant="outline" size="sm" onClick={() => router.push(buildPath(`/insurance/${id}/edit`))} leftIcon={<Pencil className="h-4 w-4" />}>
              Modifier
            </Button>
          </ProtectedAction>
          <ProtectedAction permission={Permission.INSURANCE_PROVIDERS_DELETE}>
            <Button variant="outline" size="sm" onClick={handleDelete} disabled={deleteMutation.isPending} leftIcon={<Trash2 className="h-4 w-4" />}>
              Supprimer
            </Button>
          </ProtectedAction>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between"><span className="text-slate-500">Statut</span><Badge variant={p.status === "active" ? "success" : "default"}>{INSURANCE_PROVIDER_STATUS_LABELS[p.status]}</Badge></div>
            <div className="flex justify-between"><span className="text-slate-500">Code</span><span>{p.code}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Type</span><span>{INSURANCE_PROVIDER_TYPE_LABELS[p.type]}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Couverture par défaut</span><span>{p.default_coverage_percent ?? 0}%</span></div>
            {p.contact_person && <div className="flex justify-between"><span className="text-slate-500">Contact</span><span>{p.contact_person}</span></div>}
            {p.phone_number && <div className="flex justify-between"><span className="text-slate-500">Téléphone</span><span>{p.phone_number}</span></div>}
            {p.email && <div className="flex justify-between"><span className="text-slate-500">Email</span><span>{p.email}</span></div>}
            {p.address && <div className="flex justify-between"><span className="text-slate-500">Adresse</span><span>{p.address}</span></div>}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Types de couverture</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{(p.coverage_types ?? []).join(", ") || "—"}</p>
            {p.notes && (
              <>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mt-4 mb-2">Notes</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{p.notes}</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
