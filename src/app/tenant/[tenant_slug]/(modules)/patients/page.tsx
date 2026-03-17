"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { usePatients } from "@/hooks/api/usePatients";
import { PATIENT_STATUS_LABELS, PatientStatus } from "@/types/patients";
import {
  Button,
  Card,
  CardContent,
  Badge,
  Input,
  EmptyState,
  ErrorBanner,
  Skeleton,
} from "@/components/ui";
import { Search, User, ChevronRight, Plus, AlertTriangle } from "lucide-react";

const STATUS_BADGE: Record<string, "success" | "danger" | "warning" | "default"> = {
  [PatientStatus.ACTIVE]: "success",
  [PatientStatus.INACTIVE]: "default",
  [PatientStatus.DECEASED]: "danger",
  [PatientStatus.TRANSFERRED]: "warning",
};

export default function PatientsPage() {
  return (
    <ModuleGuard
      module="patients"
      requiredPermissions={[Permission.PATIENTS_READ]}
    >
      <PatientsContent />
    </ModuleGuard>
  );
}

function PatientsContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const [search, setSearch] = useState("");

  const { data: patientsList = [], isLoading, error, refetch } = usePatients();

  const filtered = Array.isArray(patientsList)
    ? patientsList.filter((p: any) => {
        if (!search) return true;
        const s = search.toLowerCase();
        const fullName = `${p.first_name ?? ""} ${p.last_name ?? ""}`.toLowerCase();
        return (
          fullName.includes(s) ||
          p.phone?.toLowerCase().includes(s) ||
          p.email?.toLowerCase().includes(s) ||
          (p.insurance_number && String(p.insurance_number).toLowerCase().includes(s))
        );
      })
    : [];

  const safeId = (id: string) =>
    typeof id === "string" && id.includes(":") ? id.split(":")[1] : id;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Patients
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Dossiers patients et liaison utilisateur
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Rechercher par nom, tél, email ou n° assurance..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <ProtectedAction permission={Permission.PATIENTS_WRITE}>
          <Button
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => router.push(buildPath("/patients/new"))}
          >
            Nouveau patient
          </Button>
        </ProtectedAction>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <ErrorBanner
          message="Erreur de chargement des patients"
          onRetry={() => refetch()}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Aucun patient"
          description="Aucun patient trouvé. Créez un premier dossier patient."
          onAction={() => router.push(buildPath("/patients/new"))}
          actionLabel="Nouveau patient"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p: any) => (
            <Card
              key={p.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() =>
                router.push(buildPath(`/patients/${safeId(p.id)}`))
              }
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                        {p.first_name} {p.last_name}
                      </p>
                      <p className="text-sm text-slate-500 truncate">
                        {p.phone ?? p.email ?? "—"}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
                {p.allergies && (
                  <div className="mt-2 flex items-center gap-1 text-amber-600 dark:text-amber-400 text-xs">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Allergies</span>
                  </div>
                )}
                <div className="mt-2">
                  <Badge
                    variant={STATUS_BADGE[p.status] ?? "default"}
                    size="sm"
                  >
                    {PATIENT_STATUS_LABELS[p.status as PatientStatus] ?? p.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
