"use client";

import React from "react";
import Link from "next/link";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { useBillingInvoices, useConvertProformaToInvoice } from "@/hooks/api/useBilling";
import { Card, Button, Badge, DataTable, type Column, Skeleton, EmptyState, ErrorBanner } from "@/components/ui";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { Plus, ArrowRight } from "lucide-react";
import type { BillingInvoice } from "@/types/billing";

export default function ProformaPage() {
  return (
    <ModuleGuard module="billing" requiredPermissions={[Permission.INVOICES_READ]}>
      <ProformaList />
    </ModuleGuard>
  );
}

function ProformaList() {
  const { buildPath } = useTenantPath();
  const { data: invoices, isLoading, error } = useBillingInvoices({ limit: 100 });
  const convertProforma = useConvertProformaToInvoice();

  const list = ((invoices ?? []) as BillingInvoice[]).filter(
    (inv) => inv.invoice_type === "proforma" || inv.invoice_type === "PROFORMA",
  );

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "invoice_number",
      title: "N° Proforma",
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
    {
      key: "patient_name",
      title: "Client / Patient",
      render: (_, row) => String((row as any).patient_name ?? (row as any).customer_name ?? "—"),
    },
    {
      key: "total_amount",
      title: "Total",
      align: "right",
      render: (_, row) => formatCurrency(Number((row as unknown as BillingInvoice).total_amount ?? 0)),
    },
    {
      key: "actions",
      title: "",
      align: "right",
      render: (_, row) => {
        const inv = row as unknown as BillingInvoice;
        const invId = String((inv as any).id ?? "");
        const id = invId.includes(":") ? invId.split(":")[1] : invId;
        return (
          <Button size="sm" variant="outline" onClick={() => convertProforma.mutate(id)} disabled={convertProforma.isPending}>
            Convertir en facture
          </Button>
        );
      },
    },
  ];

  if (error) return <ErrorBanner title="Erreur" message="Impossible de charger les proformas" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={buildPath("/billing")}><ArrowRight className="w-4 h-4 mr-1 rotate-180" /> Retour</Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Proformas</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Créer une proforma ou convertir en facture</p>
          </div>
        </div>
        <Button asChild>
          <Link href={buildPath("/billing/invoices/new")}><Plus className="w-4 h-4 mr-2" /> Nouvelle proforma</Link>
        </Button>
      </div>
      <Card>
        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : list.length === 0 ? (
          <EmptyState title="Aucune proforma" description="Les proformas créées apparaîtront ici." />
        ) : (
          <DataTable
            columns={columns}
            data={list as unknown as Record<string, unknown>[]}
            loading={false}
            emptyTitle="Aucune proforma"
            rowKey={(row) => String((row as any).id ?? "")}
          />
        )}
      </Card>
    </div>
  );
}
