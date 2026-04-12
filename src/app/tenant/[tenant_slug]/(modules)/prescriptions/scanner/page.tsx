"use client";

import React, { useState } from "react";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { Permission } from "@/types/permissions";
import { useOrganization } from "@/context/OrganizationContext";
import { usePrescriptionById } from "@/hooks/api/usePrescriptions";
import { PRESCRIPTION_STATUS_LABELS, PrescriptionStatus } from "@/types/prescriptions";
import type { Prescription } from "@/types/prescriptions";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { useTenantPath } from "@/hooks/useTenantPath";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Input,
  EmptyState,
  Skeleton,
} from "@/components/ui";
import {
  ScanBarcode,
  Camera,
  QrCode,
  Search,
  Pill,
  Eye,
  ArrowRight,
  Keyboard,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function ScannerPage() {
  return (
    <ModuleGuard
      module="prescriptions"
      requiredPermissions={[Permission.PRESCRIPTIONS_READ]}
    >
      <ScannerContent />
    </ModuleGuard>
  );
}

function ScannerContent() {
  const { basePath } = useTenantPath();
  const [mode, setMode] = useState<"scan" | "manual">("scan");
  const [scanInput, setScanInput] = useState("");
  const [scannedId, setScannedId] = useState("");

  const handleScan = () => {
    if (scanInput.trim()) {
      setScannedId(scanInput.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleScan();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Scanner ordonnance
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Scannez un QR code ou DataMatrix pour retrouver une ordonnance
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          variant={mode === "scan" ? "default" : "outline"}
          onClick={() => setMode("scan")}
          leftIcon={<Camera className="w-4 h-4" />}
        >
          Scanner
        </Button>
        <Button
          variant={mode === "manual" ? "default" : "outline"}
          onClick={() => setMode("manual")}
          leftIcon={<Keyboard className="w-4 h-4" />}
        >
          Saisie manuelle
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {mode === "scan" ? (
              <>
                <QrCode className="w-5 h-5 text-blue-600" />
                Zone de scan
              </>
            ) : (
              <>
                <Keyboard className="w-5 h-5 text-blue-600" />
                Saisie manuelle
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mode === "scan" ? (
            <div className="space-y-4">
              <div className="aspect-video max-w-lg mx-auto rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50">
                <ScanBarcode className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
                <p className="text-sm text-slate-500 text-center px-4">
                  Placez le QR code ou DataMatrix devant la caméra
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  Ou saisissez le code ci-dessous
                </p>
              </div>
              <div className="flex gap-3 max-w-lg mx-auto">
                <Input
                  className="flex-1"
                  placeholder="Code scanné ou ID ordonnance..."
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  leftIcon={<ScanBarcode className="w-4 h-4" />}
                />
                <Button onClick={handleScan} disabled={!scanInput.trim()}>
                  Rechercher
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-w-lg">
              <Input
                label="N° d'ordonnance ou code DataMatrix"
                placeholder="Entrez le numéro ou le code..."
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                onKeyDown={handleKeyDown}
                leftIcon={<Search className="w-4 h-4" />}
              />
              <Button
                onClick={handleScan}
                disabled={!scanInput.trim()}
                className="w-full"
              >
                Rechercher l'ordonnance
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {scannedId ? (
        <ScannedPrescription
          prescriptionId={scannedId}
          tenantPath={basePath}
        />
      ) : (
        <Card>
          <CardContent className="p-8">
            <EmptyState
              icon={<Pill className="w-8 h-8 text-slate-400" />}
              title="Aucune ordonnance scannée"
              description="Scannez ou saisissez un code pour afficher les détails de l'ordonnance."
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ScannedPrescription({
  prescriptionId,
  tenantPath,
}: {
  prescriptionId: string;
  tenantPath: string;
}) {
  const { data: prescription, isLoading, isError } =
    usePrescriptionById(prescriptionId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    );
  }

  if (isError || !prescription) {
    return (
      <Card className="border-red-200 dark:border-red-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <XCircle className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-300">
                Ordonnance introuvable
              </p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                Vérifiez le code scanné et réessayez. ID: {prescriptionId}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const p = prescription as Prescription;

  const STATUS_BADGE: Record<
    string,
    "success" | "danger" | "warning" | "info" | "default"
  > = {
    pending: "warning",
    verified: "info",
    in_progress: "warning",
    ready: "success",
    dispensed: "success",
    cancelled: "danger",
    returned: "danger",
    on_hold: "default",
  };

  return (
    <div className="space-y-4">
      <Card className="border-emerald-200 dark:border-emerald-800">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {p.prescription_number}
                </h3>
                <Badge
                  variant={STATUS_BADGE[p.status] ?? "default"}
                  size="sm"
                >
                  {PRESCRIPTION_STATUS_LABELS[p.status]}
                </Badge>
                {p.is_emergency && (
                  <Badge variant="danger" size="sm">
                    Urgence
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-xs text-slate-500">Patient</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {p.patient
                      ? `${p.patient.first_name} ${p.patient.last_name}`
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Prescripteur</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    Dr. {p.prescriber_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Date</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {formatDate(p.prescribed_date)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Montant</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {formatCurrency(p.total_amount ?? 0)}
                  </p>
                </div>
              </div>

              {p.items && p.items.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-slate-500 mb-2">
                    Articles ({p.items.length})
                  </p>
                  <div className="space-y-2">
                    {p.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                      >
                        <div>
                          <p className="text-sm text-slate-900 dark:text-slate-100">
                            {item.product_name ?? item.product_id}
                          </p>
                          <p className="text-xs text-slate-500">
                            {item.dosage} • {item.frequency} • Qté:{" "}
                            {item.quantity}
                          </p>
                        </div>
                        <Badge
                          variant={
                            item.status === "dispensed" ? "success" : "default"
                          }
                          size="sm"
                        >
                          {item.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        {p.status === PrescriptionStatus.VERIFIED && (
          <Button
            leftIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() =>
              (window.location.href = `${tenantPath}/prescriptions/dispensation`)
            }
          >
            Dispenser
          </Button>
        )}
        <Button
          variant="outline"
          leftIcon={<Eye className="w-4 h-4" />}
          onClick={() =>
            (window.location.href = `${tenantPath}/prescriptions`)
          }
        >
          Voir les détails
        </Button>
      </div>
    </div>
  );
}
