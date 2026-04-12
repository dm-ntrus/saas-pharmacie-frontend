"use client";

import React from "react";
import Link from "next/link";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { useBillingInvoices } from "@/hooks/api/useBilling";
import { Card, Button, Badge, DataTable, type Column, Skeleton, EmptyState, ErrorBanner } from "@/components/ui";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { ArrowLeft, Shield, FileText } from "lucide-react";
import type { BillingInvoice } from "@/types/billing";
import { INVOICE_STATUS_LABELS } from "@/types/billing";

export default function BillingInsurancePage() {
  return (
    <ModuleGuard module="billing" requiredPermissions={[Permission.INVOICES_READ]}>
      <InsuranceInvoicesList />
    </ModuleGuard>
  );
}

function InsuranceInvoicesList() {
  const { buildPath } = useTenantPath();
  const { data: invoices, isLoading, error } = useBillingInvoices({ limit: 100 });

  const list = ((invoices ?? []) as BillingInvoice[]).filter(
    (inv) => inv.invoice_type === "insurance" || inv.insurance_provider_id,
  );

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "invoice_number",
      title: "N° Facture",
      width: "140px",
      render: (_, row) => {
        const inv = row as unknown as BillingInvoice;
        return (
          <Link href={buildPath(`/billing/invoices/${inv.id}`)} className="font-medium text-emerald-600 hover:underline">
            {String((inv as any).invoice_number ?? "—")}
          </Link>
        );
      },
    },
    { key: "invoice_date", title: "Date", render: (_, row) => formatDate((row as any).invoice_date as any) },
    { key: "patient_name", title: "Patient", render: (_, row) => String((row as any).patient_name ?? "—") },
    { key: "insurance_covered_amount", title: "Part assurance", align: "right", render: (_, row) => formatCurrency(Number((row as unknown as BillingInvoice).insurance_covered_amount ?? 0)) },
    { key: "patient_copay_amount", title: "Part patient", align: "right", render: (_, row) => formatCurrency(Number((row as unknown as BillingInvoice).patient_copay_amount ?? 0)) },
    { key: "status", title: "Statut", render: (_, row) => <Badge variant="default" size="sm">{INVOICE_STATUS_LABELS[(row as any).status] ?? String((row as any).status ?? "—")}</Badge> },
  ];

  if (error) return <ErrorBanner title="Erreur" message="Impossible de charger les factures assurance" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={buildPath("/billing")}><ArrowLeft className="w-4 h-4 mr-1" /> Retour</Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Factures assurance</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Factures avec prise en charge assurance</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={buildPath("/billing/insurance/claims")}><FileText className="w-4 h-4 mr-2" /> Réclamations</Link>
        </Button>
      </div>
      <Card>
        {isLoading ? <Skeleton className="h-64 w-full" /> : list.length === 0 ? (
          <EmptyState title="Aucune facture assurance" description="Les factures avec assurance apparaîtront ici" />
        ) : (
          <DataTable
            columns={columns}
            data={list as unknown as Record<string, unknown>[]}
            loading={false}
            emptyTitle="Aucune facture"
            rowKey={(row) => String((row as any).id ?? "")}
          />
        )}
      </Card>
    </div>
  );
}
