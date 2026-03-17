"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { usePrescriptionsByPatient } from "@/hooks/api/usePrescriptions";
import { usePatientById } from "@/hooks/api/usePatients";
import { GENDER_LABELS, PATIENT_STATUS_LABELS } from "@/types/patients";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  ErrorBanner,
  Skeleton,
} from "@/components/ui";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { formatDate } from "@/utils/formatters";
import { PRESCRIPTION_STATUS_LABELS } from "@/types/prescriptions";

export default function PatientDetailPage() {
  return (
    <ModuleGuard
      module="patients"
      requiredPermissions={[Permission.PATIENTS_READ]}
    >
      <PatientDetailContent />
    </ModuleGuard>
  );
}

function PatientDetailContent() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string) ?? "";
  const { buildPath } = useTenantPath();
  const [tab, setTab] = useState<"overview" | "prescriptions">("overview");

  const { data: patient, isLoading, error, refetch } = usePatientById(id);
  const { data: prescriptions = [] } = usePrescriptionsByPatient(id);

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (error || !patient) {
    return (
      <ErrorBanner message="Patient introuvable" onRetry={() => refetch()} />
    );
  }

  const p = patient as any;
  const age = p.date_of_birth
    ? Math.floor(
        (Date.now() - new Date(p.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
      )
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(buildPath("/patients"))}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Retour
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <User className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {p.first_name} {p.last_name}
              </h1>
              <p className="text-sm text-slate-500">
                {age != null ? `${age} ans` : ""}
                {p.date_of_birth ? ` · Né(e) le ${formatDate(p.date_of_birth)}` : ""}
                {" · "}
                {GENDER_LABELS[p.gender as keyof typeof GENDER_LABELS] ?? p.gender}
              </p>
            </div>
          </div>
        </div>
        <ProtectedAction permission={Permission.PATIENTS_WRITE}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(buildPath(`/patients/${id}/edit`))}
          >
            Modifier
          </Button>
        </ProtectedAction>
      </div>

      {p.allergies && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          <p className="text-sm font-medium text-red-800 dark:text-red-200">
            Allergies : {p.allergies}
          </p>
        </div>
      )}

      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
        {(["overview", "prescriptions"] as const).map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              tab === key
                ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            {key === "overview" ? "Vue d'ensemble" : "Ordonnances"}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {p.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <a
                    href={`tel:${p.phone}`}
                    className="text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    {p.phone}
                  </a>
                </div>
              )}
              {p.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <a
                    href={`mailto:${p.email}`}
                    className="text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    {p.email}
                  </a>
                </div>
              )}
              {p.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{p.address}</span>
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informations médicales & assurance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Statut</span>
                <Badge variant="default" size="sm">
                  {PATIENT_STATUS_LABELS[p.status as keyof typeof PATIENT_STATUS_LABELS] ?? p.status}
                </Badge>
              </div>
              {p.insurance_provider && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Assurance</span>
                  <span>{p.insurance_provider}</span>
                </div>
              )}
              {p.insurance_number && (
                <div className="flex justify-between">
                  <span className="text-slate-500">N° assurance</span>
                  <span>{p.insurance_number}</span>
                </div>
              )}
              {p.medical_conditions && (
                <p className="text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700">
                  Affections : {p.medical_conditions}
                </p>
              )}
              {p.emergency_contact && (
                <p className="text-slate-600 dark:text-slate-400">
                  Contact d'urgence : {p.emergency_contact}
                  {p.emergency_phone && ` · ${p.emergency_phone}`}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {tab === "prescriptions" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              Ordonnances ({prescriptions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {prescriptions.length === 0 ? (
              <p className="text-sm text-slate-500">Aucune ordonnance pour ce patient.</p>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {(prescriptions as any[]).map((rx: any) => {
                  const rxId =
                    typeof rx.id === "string" && rx.id.includes(":")
                      ? rx.id.split(":")[1]
                      : rx.id;
                  return (
                    <li key={rx.id} className="py-3 first:pt-0">
                      <button
                        className="text-left w-full flex items-center justify-between gap-2"
                        onClick={() =>
                          router.push(buildPath(`/prescriptions/${rxId}`))
                        }
                      >
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {rx.prescription_number ?? rx.id}
                        </span>
                        <Badge variant="default" size="sm">
                          {PRESCRIPTION_STATUS_LABELS[rx.status] ?? rx.status}
                        </Badge>
                      </button>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {rx.prescriber_name ?? "—"} ·{" "}
                        {rx.prescribed_date
                          ? formatDate(rx.prescribed_date)
                          : formatDate(rx.created_at)}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
