"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useVaccinationAppointments } from "@/hooks/api/useVaccination";
import { Button, Card, CardContent, ErrorBanner, Skeleton, Badge, EmptyState } from "@/components/ui";
import { Calendar, Plus, ChevronRight } from "lucide-react";
import { APPOINTMENT_STATUS_LABELS } from "@/types/vaccination";
import { formatDate } from "@/utils/formatters";

function safeId(id: string) {
  return typeof id === "string" && id.includes(":") ? id.split(":")[1] ?? id : id;
}

export default function AppointmentsPage() {
  return (
    <ModuleGuard
      module="vaccination"
      requiredPermissions={[Permission.VACCINATION_READ]}
    >
      <AppointmentsContent />
    </ModuleGuard>
  );
}

function AppointmentsContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const today = new Date().toISOString().slice(0, 10);
  const endOfWeek = new Date();
  endOfWeek.setDate(endOfWeek.getDate() + 7);
  const { data: appointments, isLoading, error, refetch } = useVaccinationAppointments({
    startDate: today,
    endDate: endOfWeek.toISOString().slice(0, 10),
  });

  if (isLoading && !appointments) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorBanner
        message="Erreur de chargement des rendez-vous"
        onRetry={() => refetch()}
      />
    );
  }

  const list = Array.isArray(appointments) ? appointments : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Rendez-vous vaccination
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Calendrier et liste des RDV
          </p>
        </div>
        <Button
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => router.push(buildPath("/vaccination/appointments/new"))}
        >
          Nouveau RDV
        </Button>
      </div>

      {list.length === 0 ? (
        <EmptyState
          title="Aucun rendez-vous"
          description="Aucun RDV sur la période sélectionnée."
          action={
            <Button
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => router.push(buildPath("/vaccination/appointments/new"))}
            >
              Nouveau RDV
            </Button>
          }
        />
      ) : (
        <div className="space-y-2">
          {list.map((apt) => {
            const id = safeId(apt.id);
            return (
              <Card
                key={apt.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(buildPath(`/vaccination/appointments/${id}`))}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {apt.vaccine_name} — Dose {apt.dose_number}/{apt.total_doses_in_series}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDate(apt.scheduled_date)} · {apt.time_slot} · N° {apt.appointment_number}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {APPOINTMENT_STATUS_LABELS[apt.status] ?? apt.status}
                  </Badge>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
