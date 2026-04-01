"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import {
  usePrescriptionById,
  usePrescriptionItems,
  usePrescriptionInteractions,
  useUpdatePrescriptionStatus,
  useVerifyPrescription,
  useCancelPrescription,
  useRefillPrescription,
  useDispensePrescriptionItem,
  useGetPrescriptionLabel,
} from "@/hooks/api/usePrescriptions";
import {
  PRESCRIPTION_STATUS_LABELS,
  PrescriptionStatus,
  PrescriptionItemStatus,
} from "@/types/prescriptions";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  ErrorBanner,
  Skeleton,
  Modal,
} from "@/components/ui";
import {
  ArrowLeft,
  FileText,
  User,
  Pill,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Printer,
} from "lucide-react";
import { Input } from "@/components/ui";
import { formatDate } from "@/utils/formatters";
import { useState } from "react";

export default function PrescriptionDetailPage() {
  return (
    <ModuleGuard
      module="prescriptions"
      requiredPermissions={[Permission.PRESCRIPTIONS_READ]}
    >
      <PrescriptionDetailContent />
    </ModuleGuard>
  );
}

function PrescriptionDetailContent() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string) ?? "";
  const { buildPath } = useTenantPath();
  const { data: prescription, isLoading, error, refetch } = usePrescriptionById(id);
  const { data: items = [] } = usePrescriptionItems(id);
  const { data: interactions = [] } = usePrescriptionInteractions(id);
  const updateStatus = useUpdatePrescriptionStatus();
  const verifyPrescription = useVerifyPrescription();
  const cancelPrescription = useCancelPrescription();
  const refillPrescription = useRefillPrescription();
  const dispenseItem = useDispensePrescriptionItem();
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [dispenseModal, setDispenseModal] = useState<{ itemId: string; item: any } | null>(null);
  const [dispenseQty, setDispenseQty] = useState("");
  const [dispenseBatchId, setDispenseBatchId] = useState("");

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (error || !prescription) {
    return (
      <ErrorBanner message="Ordonnance introuvable" onRetry={() => refetch()} />
    );
  }

  const p = prescription as any;
  const canVerify = p.status === PrescriptionStatus.PENDING;
  const canCancel =
    p.status !== PrescriptionStatus.CANCELLED &&
    p.status !== PrescriptionStatus.DISPENSED;
  const canRefill =
    p.status === PrescriptionStatus.DISPENSED &&
    (p.refills_remaining ?? 0) > 0;

  const handleCancel = () => {
    if (!cancelReason.trim()) return;
    cancelPrescription.mutate(
      { id, reason: cancelReason },
      {
        onSuccess: () => {
          setCancelModal(false);
          setCancelReason("");
          refetch();
        },
      }
    );
  };

  const openDispense = (item: any) => {
    const segment = typeof item.id === "string" && item.id.includes(":") ? item.id.split(":")[1] : item.id;
    setDispenseModal({ itemId: segment, item });
    setDispenseQty(String(item.quantity_prescribed ?? "1"));
    setDispenseBatchId("");
  };

  const handleDispense = () => {
    if (!dispenseModal || !dispenseQty.trim()) return;
    dispenseItem.mutate(
      {
        prescriptionId: id,
        itemId: dispenseModal.itemId,
        quantityDispensed: dispenseQty.trim(),
        batchId: dispenseBatchId.trim() || undefined,
      },
      {
        onSuccess: () => {
          setDispenseModal(null);
          setDispenseQty("");
          setDispenseBatchId("");
          refetch();
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(buildPath("/prescriptions"))}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-6 h-6 text-emerald-600" />
              {p.prescription_number ?? id}
            </h1>
            <p className="text-sm text-slate-500">
              {p.prescribed_date
                ? formatDate(p.prescribed_date)
                : formatDate(p.created_at)}
              {" · "}
              {PRESCRIPTION_STATUS_LABELS[p.status as PrescriptionStatus] ?? p.status}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={
              p.status === PrescriptionStatus.DISPENSED
                ? "success"
                : p.status === PrescriptionStatus.CANCELLED
                ? "danger"
                : "info"
            }
            size="md"
          >
            {PRESCRIPTION_STATUS_LABELS[p.status as PrescriptionStatus] ?? p.status}
          </Badge>
          {canVerify && (
            <ProtectedAction permission={Permission.PRESCRIPTIONS_WRITE}>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<CheckCircle className="h-4 w-4" />}
                onClick={() =>
                  verifyPrescription.mutate(
                    { id, notes: undefined },
                    { onSuccess: () => refetch() }
                  )
                }
                disabled={verifyPrescription.isPending}
              >
                Vérifier
              </Button>
            </ProtectedAction>
          )}
          {canRefill && (
            <ProtectedAction permission={Permission.PRESCRIPTIONS_WRITE}>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<RefreshCw className="h-4 w-4" />}
                onClick={() =>
                  refillPrescription.mutate(id, { onSuccess: () => refetch() })
                }
                disabled={refillPrescription.isPending}
              >
                Renouveler
              </Button>
            </ProtectedAction>
          )}
          {canCancel && (
            <ProtectedAction permission={Permission.PRESCRIPTIONS_WRITE}>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
                leftIcon={<XCircle className="h-4 w-4" />}
                onClick={() => setCancelModal(true)}
              >
                Annuler
              </Button>
            </ProtectedAction>
          )}
          <ProtectedAction permission={Permission.PRESCRIPTIONS_READ}>
            <PrintLabelButton prescriptionId={id} />
          </ProtectedAction>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              Prescripteur
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="font-medium">{p.prescriber_name ?? "—"}</p>
            {p.prescriber_npi && (
              <p className="text-slate-500">NPI: {p.prescriber_npi}</p>
            )}
            {p.special_instructions && (
              <p className="text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700">
                Instructions: {p.special_instructions}
              </p>
            )}
            {p.pharmacy_notes && (
              <p className="text-slate-500 italic">Note: {p.pharmacy_notes}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Résumé</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Patient</span>
              <span className="font-medium">{String(p.patient_id ?? "").replace(/^patients:/, "")}</span>
            </div>
            {p.refills_remaining != null && (
              <div className="flex justify-between">
                <span className="text-slate-500">Renouvellements restants</span>
                <span>{p.refills_remaining}</span>
              </div>
            )}
            {p.verified_date && (
              <div className="flex justify-between">
                <span className="text-slate-500">Vérifiée le</span>
                <span>{formatDate(p.verified_date)}</span>
              </div>
            )}
            {p.dispensed_date && (
              <div className="flex justify-between">
                <span className="text-slate-500">Délivrée le</span>
                <span>{formatDate(p.dispensed_date)}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Pill className="w-4 h-4 text-emerald-600" />
            Lignes ({items.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-sm text-slate-500">Aucune ligne</p>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800 space-y-3">
              {(items as any[]).map((item: any) => {
                const canDispense = item.status !== PrescriptionItemStatus.DISPENSED && p.status !== PrescriptionStatus.CANCELLED;
                return (
                  <li key={item.id} className="pt-3 first:pt-0 flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {item.drug_name} {item.strength}
                      </p>
                      <p className="text-sm text-slate-500">
                        {item.directions_for_use} · {item.dosage_frequency}
                      </p>
                      <p className="text-xs text-slate-400">
                        Prescrit: {item.quantity_prescribed} {item.unit_of_measure} · Délivré:{" "}
                        {item.quantity_dispensed ?? "0"} · {item.status}
                      </p>
                    </div>
                    {canDispense && (
                      <ProtectedAction permission={Permission.PRESCRIPTIONS_WRITE}>
                        <Button variant="outline" size="sm" onClick={() => openDispense(item)}>
                          Dispenser
                        </Button>
                      </ProtectedAction>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      {Array.isArray(interactions) && interactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Interactions médicamenteuses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {(interactions as any[]).map((int: any, i: number) => (
                <li
                  key={i}
                  className={`p-3 rounded-lg text-sm ${
                    int.severity === "critical"
                      ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                      : "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
                  }`}
                >
                  <span className="font-medium capitalize">{int.severity}</span>
                  {int.drug1 && int.drug2 && (
                    <span> · {int.drug1} + {int.drug2}</span>
                  )}
                  {int.description && <p className="mt-1 text-slate-600 dark:text-slate-400">{int.description}</p>}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Modal
        open={!!dispenseModal}
        onOpenChange={(open) => !open && setDispenseModal(null)}
        title="Dispenser la ligne"
        description={dispenseModal ? `${dispenseModal.item.drug_name} ${dispenseModal.item.strength}` : ""}
      >
        <div className="space-y-4">
          {dispenseModal && (
            <>
              <Input
                label="Quantité à dispenser"
                value={dispenseQty}
                onChange={(e) => setDispenseQty(e.target.value)}
                placeholder={String(dispenseModal.item.quantity_prescribed ?? "1")}
              />
              <Input
                label="N° lot (optionnel)"
                value={dispenseBatchId}
                onChange={(e) => setDispenseBatchId(e.target.value)}
                placeholder="Batch ID"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDispenseModal(null)}>Annuler</Button>
                <Button onClick={handleDispense} disabled={!dispenseQty.trim() || dispenseItem.isPending}>
                  {dispenseItem.isPending ? "Dispensation..." : "Dispenser"}
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>

      <Modal
        open={cancelModal}
        onOpenChange={setCancelModal}
        title="Annuler l'ordonnance"
        description="Indiquez la raison de l'annulation"
      >
        <div className="space-y-4">
          <textarea
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm min-h-[80px]"
            placeholder="Raison..."
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCancelModal(false)}>
              Retour
            </Button>
            <Button
              variant="danger"
              onClick={handleCancel}
              disabled={!cancelReason.trim() || cancelPrescription.isPending}
            >
              {cancelPrescription.isPending ? "Annulation..." : "Annuler l'ordonnance"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function PrintLabelButton({ prescriptionId }: { prescriptionId: string }) {
  const { data, refetch, isFetching } = useGetPrescriptionLabel(prescriptionId);
  const handlePrint = async () => {
    const result = data ?? (await refetch()).data;
    if (result?.labelHtml) {
      const w = window.open("", "_blank");
      if (w) {
        w.document.write(result.labelHtml);
        w.document.close();
        w.focus();
        setTimeout(() => { w.print(); w.close(); }, 250);
      }
    }
  };
  return (
    <Button
      variant="outline"
      size="sm"
      leftIcon={<Printer className="w-4 h-4" />}
      onClick={handlePrint}
      disabled={isFetching}
    >
      Étiquette
    </Button>
  );
}
