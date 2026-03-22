"use client";

import React from "react";
import Link from "next/link";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { useBillingPaymentHistory } from "@/hooks/api/useBilling";
import { Card, Button, Badge, DataTable, type Column, Skeleton, EmptyState, ErrorBanner } from "@/components/ui";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { ArrowLeft } from "lucide-react";
import type { BillingPayment } from "@/types/billing";
import { PAYMENT_METHOD_LABELS } from "@/types/billing";

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  completed: "Terminé",
  failed: "Échoué",
  refunded: "Remboursé",
  partial: "Partiel",
};

export default function BillingPaymentsPage() {
  return (
    <ModuleGuard module="billing" requiredPermissions={[Permission.PAYMENTS_READ]}>
      <PaymentsList />
    </ModuleGuard>
  );
}

function PaymentsList() {
  const { buildPath } = useTenantPath();
  const { data: payments, isLoading, error } = useBillingPaymentHistory();
  const list = (payments ?? []) as BillingPayment[];

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "payment_number",
      title: "N° Paiement",
      width: "140px",
      render: (_, row) => {
        const p = row as unknown as BillingPayment;
        return (
          <Link href={buildPath(`/billing/payments/${p.id}`)} className="font-medium text-emerald-600 hover:underline">
            {(p as any).payment_number ?? p.id}
          </Link>
        );
      },
    },
    { key: "payment_date", title: "Date", render: (_, row) => formatDate((row as unknown as BillingPayment).payment_date ?? (row as any).created_at) },
    { key: "amount", title: "Montant", align: "right", render: (_, row) => formatCurrency(Number((row as unknown as BillingPayment).amount ?? 0)) },
    { key: "payment_method", title: "Méthode", render: (_, row) => PAYMENT_METHOD_LABELS[(row as unknown as BillingPayment).payment_method] ?? (row as unknown as BillingPayment).payment_method },
    {
      key: "status",
      title: "Statut",
      render: (_, row) => {
        const s = (row as unknown as BillingPayment).status;
        return <Badge variant={s === "completed" ? "success" : s === "failed" ? "danger" : "default"} size="sm">{PAYMENT_STATUS_LABELS[s] ?? s}</Badge>;
      },
    },
    { key: "is_refund", title: "Type", render: (_, row) => (row as unknown as BillingPayment).is_refund ? <Badge variant="warning" size="sm">Remboursement</Badge> : <span className="text-slate-500">Paiement</span> },
  ];

  if (error) return <ErrorBanner title="Erreur" message="Impossible de charger l'historique des paiements" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm">
          <Link href={buildPath("/billing")}><ArrowLeft className="w-4 h-4 mr-1" /> Retour</Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Historique des paiements</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Liste des paiements enregistrés</p>
        </div>
      </div>
      <Card>
        {isLoading ? <Skeleton className="h-64 w-full" /> : list.length === 0 ? (
          <EmptyState title="Aucun paiement" description="Les paiements enregistrés sur les factures apparaîtront ici" />
        ) : (
          <DataTable columns={columns} data={list as unknown as Record<string, unknown>[]} loading={false} emptyTitle="Aucun paiement" rowKey={(row) => (row as unknown as BillingPayment).id} />
        )}
      </Card>
    </div>
  );
}
