"use client";

import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { Permission } from "@/types/permissions";
import { useOrganization } from "@/context/OrganizationContext";
import {
  usePrescriptions,
  usePrescriptionById,
  useUpdatePrescriptionStatus,
} from "@/hooks/api/usePrescriptions";
import {
  PrescriptionStatus,
  PRESCRIPTION_STATUS_LABELS,
} from "@/types/prescriptions";
import type { Prescription, PrescriptionItem } from "@/types/prescriptions";
import { formatDate, formatDateTime, formatCurrency } from "@/utils/formatters";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Input,
  Modal,
  EmptyState,
  ErrorBanner,
  Skeleton,
  Select,
} from "@/components/ui";
import {
  Search,
  ScanBarcode,
  Package,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  Pill,
  ClipboardCheck,
  ShieldCheck,
  ArrowLeft,
  CheckSquare,
} from "lucide-react";

export default function DispensationPage() {
  return (
    <ModuleGuard
      module="prescriptions"
      requiredPermissions={[Permission.PRESCRIPTIONS_WRITE]}
    >
      <DispensationContent />
    </ModuleGuard>
  );
}

function DispensationContent() {
  const { data: prescriptions, isLoading } = usePrescriptions(
    PrescriptionStatus.VERIFIED,
  );
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string>("");

  const allPrescriptions: Prescription[] = Array.isArray(prescriptions)
    ? prescriptions
    : [];

  const filtered = allPrescriptions.filter((p) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      p.prescription_number?.toLowerCase().includes(s) ||
      p.patient?.first_name?.toLowerCase().includes(s) ||
      p.patient?.last_name?.toLowerCase().includes(s) ||
      p.prescriber_name?.toLowerCase().includes(s)
    );
  });

  if (selectedId) {
    return (
      <DispensationDetail
        prescriptionId={selectedId}
        onBack={() => setSelectedId("")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Dispensation
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Dispensation des ordonnances vérifiées
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScanBarcode className="w-5 h-5 text-blue-600" />
            Rechercher / Scanner une ordonnance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="N° ordonnance, nom du patient, ou scannez le code-barres..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Pill className="w-8 h-8 text-slate-400" />}
          title="Aucune ordonnance à dispenser"
          description="Les ordonnances vérifiées prêtes à être dispensées apparaîtront ici."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <Card
              key={p.id}
              className="cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
              onClick={() => setSelectedId(p.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {p.prescription_number}
                      </p>
                      <Badge variant="info" size="sm">
                        {PRESCRIPTION_STATUS_LABELS[p.status]}
                      </Badge>
                      {p.is_emergency && (
                        <Badge variant="danger" size="sm">
                          Urgence
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {p.patient
                        ? `${p.patient.first_name} ${p.patient.last_name}`
                        : "Patient inconnu"}{" "}
                      • Dr. {p.prescriber_name}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Reçue le {formatDate(p.received_date)} •{" "}
                      {p.items?.length ?? 0} article(s) •{" "}
                      {formatCurrency(p.total_amount)}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function DispensationDetail({
  prescriptionId,
  onBack,
}: {
  prescriptionId: string;
  onBack: () => void;
}) {
  const { data: prescription, isLoading } =
    usePrescriptionById(prescriptionId);
  const updateStatusMutation = useUpdatePrescriptionStatus();
  const [dispensedItems, setDispensedItems] = useState<Set<string>>(new Set());
  const [doubleVerified, setDoubleVerified] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [batchSelections, setBatchSelections] = useState<
    Record<string, string>
  >({});

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-32 rounded-lg" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!prescription) {
    return (
      <ErrorBanner
        message="Ordonnance introuvable"
        onRetry={onBack}
      />
    );
  }

  const p = prescription as Prescription;
  const items: PrescriptionItem[] = p.items ?? [];
  const allItemsDispensed =
    items.length > 0 && items.every((item) => dispensedItems.has(item.id));

  const toggleItemDispensed = (itemId: string) => {
    setDispensedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  const handleConfirmDispensation = () => {
    updateStatusMutation.mutate(
      { id: prescriptionId, status: PrescriptionStatus.DISPENSED },
      { onSuccess: onBack },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Retour
        </Button>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Dispensation — {p.prescription_number}
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations ordonnance</CardTitle>
        </CardHeader>
        <CardContent>
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
              <p className="text-xs text-slate-500">Date prescription</p>
              <p className="font-medium text-slate-900 dark:text-slate-100">
                {formatDate(p.prescribed_date)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Montant</p>
              <p className="font-medium text-slate-900 dark:text-slate-100">
                {formatCurrency(p.total_amount)}
              </p>
            </div>
          </div>
          {p.special_instructions && (
            <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800">
              <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
                Instructions spéciales
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                {p.special_instructions}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Articles à dispenser ({items.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-sm text-slate-500">
              Aucun article dans cette ordonnance.
            </p>
          ) : (
            <div className="space-y-3">
              {items.map((item) => {
                const isDispensed = dispensedItems.has(item.id);
                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border transition-colors ${
                      isDispensed
                        ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-900/10"
                        : "border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {item.product_name ?? `Produit #${item.product_id}`}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Qté: {item.quantity} • Dosage: {item.dosage} •
                          Fréquence: {item.frequency}
                        </p>
                        {item.instructions && (
                          <p className="text-xs text-slate-400 mt-1">
                            {item.instructions}
                          </p>
                        )}
                        <div className="mt-2">
                          <Input
                            placeholder="N° lot / FEFO batch..."
                            className="max-w-xs"
                            value={batchSelections[item.id] ?? ""}
                            onChange={(e) =>
                              setBatchSelections((prev) => ({
                                ...prev,
                                [item.id]: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                      <ProtectedAction
                        permission={Permission.PRESCRIPTIONS_WRITE}
                      >
                        <Button
                          size="sm"
                          variant={isDispensed ? "outline" : "default"}
                          onClick={() => toggleItemDispensed(item.id)}
                          leftIcon={
                            isDispensed ? (
                              <CheckCircle className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <CheckSquare className="w-4 h-4" />
                            )
                          }
                        >
                          {isDispensed ? "Dispensé" : "Dispenser"}
                        </Button>
                      </ProtectedAction>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={doubleVerified}
                onChange={(e) => setDoubleVerified(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Double vérification
                </p>
                <p className="text-xs text-slate-500">
                  Je confirme avoir vérifié chaque article, dosage et lot
                </p>
              </div>
            </label>
            <ProtectedAction permission={Permission.PRESCRIPTIONS_WRITE}>
              <Button
                disabled={!allItemsDispensed || !doubleVerified}
                onClick={() => setShowConfirmation(true)}
                leftIcon={<ShieldCheck className="w-4 h-4" />}
              >
                Confirmer la dispensation
              </Button>
            </ProtectedAction>
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        title="Confirmer la dispensation"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Vous êtes sur le point de confirmer la dispensation de l'ordonnance{" "}
            <strong>{p.prescription_number}</strong>. Le stock sera déduit pour
            les articles suivants :
          </p>
          <ul className="space-y-1">
            {items.map((item) => (
              <li
                key={item.id}
                className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2"
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                {item.product_name ?? item.product_id} — Qté: {item.quantity}
                {batchSelections[item.id] &&
                  ` (Lot: ${batchSelections[item.id]})`}
              </li>
            ))}
          </ul>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
            >
              Annuler
            </Button>
            <Button
              onClick={handleConfirmDispensation}
              loading={updateStatusMutation.isPending}
            >
              Confirmer et déduire le stock
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
