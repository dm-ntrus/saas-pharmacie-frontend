"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import {
  useVaccinationAppointmentById,
  useSubmitPreVaccinationQuestionnaire,
  useCheckInAppointment,
  useCancelAppointment,
} from "@/hooks/api/useVaccination";
import { Button, Card, CardContent, ErrorBanner, Skeleton, Badge } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import { APPOINTMENT_STATUS_LABELS } from "@/types/vaccination";
import { formatDate } from "@/utils/formatters";

export default function AppointmentDetailPage() {
  return (
    <ModuleGuard
      module="vaccination"
      requiredPermissions={[Permission.VACCINATION_READ]}
    >
      <AppointmentDetailContent />
    </ModuleGuard>
  );
}

function AppointmentDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const id = (params?.id as string) ?? "";
  const { data: appointment, isLoading, error, refetch } = useVaccinationAppointmentById(id);
  const submitQuestionnaire = useSubmitPreVaccinationQuestionnaire();
  const checkIn = useCheckInAppointment();
  const cancel = useCancelAppointment();

  if (isLoading && !appointment) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <ErrorBanner
        message="Rendez-vous introuvable"
        onRetry={() => refetch()}
      />
    );
  }

  const canCheckIn =
    appointment.status === "scheduled" || appointment.status === "confirmed";
  const canCancel =
    appointment.status === "scheduled" ||
    appointment.status === "confirmed" ||
    appointment.status === "checked_in";
  const hasInjection = !!appointment.injection_id;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => router.push(buildPath("/vaccination/appointments"))}
        >
          Retour
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                RDV {appointment.appointment_number}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                {appointment.vaccine_name} — Dose {appointment.dose_number}/
                {appointment.total_doses_in_series}
                {appointment.is_booster ? " (rappel)" : ""}
              </p>
              <Badge className="mt-2" variant="secondary">
                {APPOINTMENT_STATUS_LABELS[appointment.status] ?? appointment.status}
              </Badge>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Date</p>
              <p className="font-medium">{formatDate(appointment.scheduled_date)}</p>
            </div>
            <div>
              <p className="text-slate-500">Créneau</p>
              <p className="font-medium">{appointment.time_slot}</p>
            </div>
            <div>
              <p className="text-slate-500">Patient</p>
              <p className="font-medium">{appointment.patient_id}</p>
            </div>
            {appointment.checked_in_at && (
              <div>
                <p className="text-slate-500">Enregistré le</p>
                <p className="font-medium">
                  {formatDate(appointment.checked_in_at)}
                </p>
              </div>
            )}
            {appointment.injection_id && (
              <div>
                <p className="text-slate-500">Injection</p>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => {
                    const sid =
                      typeof appointment.injection_id === "string" &&
                      appointment.injection_id.includes(":")
                        ? appointment.injection_id.split(":")[1]
                        : appointment.injection_id;
                    router.push(buildPath(`/vaccination/injections/${sid}`));
                  }}
                >
                  Voir l’injection
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        {canCheckIn && (
          <Button
            onClick={() =>
              checkIn.mutate(id, {
                onSuccess: () => refetch(),
              })
            }
            disabled={checkIn.isPending}
          >
            Enregistrer l’arrivée (check-in)
          </Button>
        )}
        {canCheckIn && !hasInjection && (
          <Button
            variant="outline"
            onClick={() =>
              router.push(buildPath("/vaccination/injections/record?appointmentId=" + id))
            }
          >
            Enregistrer l’injection
          </Button>
        )}
        {canCancel && (
          <Button
            variant="outline"
            className="text-red-600"
            onClick={() => {
              const reason = window.prompt("Raison de l’annulation ?");
              if (reason != null)
                cancel.mutate(
                  { appointmentId: id, reason },
                  { onSuccess: () => refetch() }
                );
            }}
            disabled={cancel.isPending}
          >
            Annuler le RDV
          </Button>
        )}
      </div>
    </div>
  );
}
