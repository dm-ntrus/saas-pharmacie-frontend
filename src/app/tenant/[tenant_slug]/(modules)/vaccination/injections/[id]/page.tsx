"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useVaccinationInjectionById } from "@/hooks/api/useVaccination";
import { Button, Card, CardContent, ErrorBanner, Skeleton } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import { formatDate } from "@/utils/formatters";

export default function InjectionDetailPage() {
  return (
    <ModuleGuard
      module="vaccination"
      requiredPermissions={[Permission.VACCINATION_READ]}
    >
      <InjectionDetailContent />
    </ModuleGuard>
  );
}

function InjectionDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const id = (params?.id as string) ?? "";
  const { data: injection, isLoading, error, refetch } = useVaccinationInjectionById(id);

  if (isLoading && !injection) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (error || !injection) {
    return (
      <ErrorBanner
        message="Injection introuvable"
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
          onClick={() => router.push(buildPath("/vaccination/injections"))}
        >
          Retour
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Injection — {injection.vaccine_name}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Lot {injection.lot_number} · {formatDate(injection.administered_at)}
          </p>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Patient</p>
              <p className="font-medium">{injection.patient_id}</p>
            </div>
            <div>
              <p className="text-slate-500">Administré par</p>
              <p className="font-medium">{injection.administered_by}</p>
            </div>
            <div>
              <p className="text-slate-500">Site</p>
              <p className="font-medium">{injection.injection_site}</p>
            </div>
            <div>
              <p className="text-slate-500">Volume</p>
              <p className="font-medium">{injection.dose_volume_ml} ml</p>
            </div>
            {injection.certificate_id && (
              <div>
                <p className="text-slate-500">Certificat</p>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() =>
                    router.push(
                      buildPath(`/vaccination/certificates/${injection.certificate_id}`)
                    )
                  }
                >
                  Voir le certificat
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          router.push(buildPath("/vaccination/adverse-events/new?injectionId=" + id))
        }
      >
        Déclarer un effet indésirable
      </Button>
    </div>
  );
}
