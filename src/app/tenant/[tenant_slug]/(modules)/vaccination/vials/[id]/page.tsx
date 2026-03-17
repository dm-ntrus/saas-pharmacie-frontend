"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useVaccinationVialById } from "@/hooks/api/useVaccination";
import { Button, Card, CardContent, ErrorBanner, Skeleton, Badge } from "@/components/ui";
import { ArrowLeft, Package } from "lucide-react";
import { VIAL_STATUS_LABELS } from "@/types/vaccination";
import { formatDate } from "@/utils/formatters";

export default function VialDetailPage() {
  return (
    <ModuleGuard
      module="vaccination"
      requiredPermissions={[Permission.VACCINATION_READ]}
    >
      <VialDetailContent />
    </ModuleGuard>
  );
}

function VialDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const id = (params?.id as string) ?? "";
  const { data: vial, isLoading, error, refetch } = useVaccinationVialById(id);

  if (isLoading && !vial) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (error || !vial) {
    return (
      <ErrorBanner
        message="Flacon introuvable"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => router.push(buildPath("/vaccination/vials"))}
        >
          Retour
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {vial.vaccine_name}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                {vial.vaccine_type} · {vial.manufacturer}
              </p>
              <Badge className="mt-2" variant="secondary">
                {VIAL_STATUS_LABELS[vial.status] ?? vial.status}
              </Badge>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-slate-500">N° flacon</p>
              <p className="font-medium">{vial.vial_number}</p>
            </div>
            <div>
              <p className="text-slate-500">Lot</p>
              <p className="font-medium">{vial.lot_number}</p>
            </div>
            <div>
              <p className="text-slate-500">Doses restantes</p>
              <p className="font-medium">
                {vial.doses_remaining} / {vial.total_doses}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Volume dose</p>
              <p className="font-medium">{vial.dose_volume_ml} ml</p>
            </div>
            <div>
              <p className="text-slate-500">Expiration (scellé)</p>
              <p className="font-medium">{formatDate(vial.sealed_expiry_date)}</p>
            </div>
            {vial.opened_at && (
              <>
                <div>
                  <p className="text-slate-500">Ouvert le</p>
                  <p className="font-medium">{formatDate(vial.opened_at)}</p>
                </div>
                <div>
                  <p className="text-slate-500">À utiliser avant</p>
                  <p className="font-medium">
                    {vial.beyond_use_date ? formatDate(vial.beyond_use_date) : "—"}
                  </p>
                </div>
              </>
            )}
            <div>
              <p className="text-slate-500">Stabilité après ouverture</p>
              <p className="font-medium">{vial.stability_hours_after_opening} h</p>
            </div>
            <div>
              <p className="text-slate-500">Coût unitaire</p>
              <p className="font-medium">{vial.unit_cost}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        {(vial.status === "sealed" || vial.status === "opened") && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(buildPath("/vaccination/vials/administer"))}
          >
            {vial.status === "sealed" ? "Ouvrir le flacon" : "Retirer des doses"}
          </Button>
        )}
      </div>
    </div>
  );
}
