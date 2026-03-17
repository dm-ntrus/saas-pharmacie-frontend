"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useVaccinationCertificateById } from "@/hooks/api/useVaccination";
import { useOrganization } from "@/context/OrganizationContext";
import { Button, Card, CardContent, ErrorBanner, Skeleton } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import { formatDate } from "@/utils/formatters";

export default function CertificateDetailPage() {
  return (
    <ModuleGuard
      module="vaccination"
      requiredPermissions={[Permission.VACCINATION_READ]}
    >
      <CertificateDetailContent />
    </ModuleGuard>
  );
}

function CertificateDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const { currentOrganization } = useOrganization();
  const id = (params?.id as string) ?? "";
  const { data: certificate, isLoading, error, refetch } = useVaccinationCertificateById(id);

  if (isLoading && !certificate) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <ErrorBanner
        message="Certificat introuvable"
        onRetry={() => refetch()}
      />
    );
  }

  const pdfUrl =
    currentOrganization?.id &&
    `${process.env.NEXT_PUBLIC_API_URL || ""}/pharmacies/${currentOrganization.id}/vaccination/certificates/${certificate.id}/pdf`;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => router.push(buildPath("/vaccination/certificates"))}
        >
          Retour
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Certificat de vaccination
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {certificate.vaccine_name} · Dose {certificate.dose_number}/{certificate.total_doses}
          </p>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Patient</p>
              <p className="font-medium">{certificate.patient_name}</p>
            </div>
            <div>
              <p className="text-slate-500">Date de naissance</p>
              <p className="font-medium">{certificate.patient_date_of_birth}</p>
            </div>
            <div>
              <p className="text-slate-500">Date d’injection</p>
              <p className="font-medium">{formatDate(certificate.injection_date)}</p>
            </div>
            <div>
              <p className="text-slate-500">Format</p>
              <p className="font-medium">{certificate.format}</p>
            </div>
          </div>
          {certificate.qr_code_data && (
            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <p className="text-xs text-slate-500 mb-2">QR Code (données)</p>
              <p className="text-xs font-mono break-all">{certificate.qr_code_data}</p>
            </div>
          )}
          <div className="mt-4 flex gap-2">
            {pdfUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2 text-sm font-medium"
              >
                Télécharger le PDF
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
