"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { useBillingInvoices } from "@/hooks/api/useBilling";
import {
  Card,
  Button,
  Badge,
  Input,
  Select,
  DataTable,
  type Column,
  Skeleton,
  EmptyState,
  ErrorBanner,
} from "@/components/ui";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { Plus, Search, FileText } from "lucide-react";
import type { BillingInvoice } from "@/types/billing";
import { INVOICE_STATUS_LABELS } from "@/types/billing";

export default function BillingInvoicesPage() {
  return (
    <ModuleGuard module="billing" requiredPermissions={[Permission.INVOICES_READ]}>
      <InvoicesList />
    </ModuleGuard>
  );
}

function InvoicesList() {
  const { buildPath } = useTenantPath();
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");

  const { data: invoices, isLoading, error } = useBillingInvoices({
    status: status || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    limit: 100,
  });

  const list = (invoices ?? []) as BillingInvoice[];
  const filtered = useMemo(() => {
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (inv) =>
        inv.invoice_number?.toLowerCase().includes(q) ||
        (inv.patient_name ?? inv.customer_name ?? "").toLowerCase().includes(q),
    );
  }, [list, search]);

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "invoice_number",
      title: "N° Facture",
      width: "140px",
      sortable: true,
      render: (_, row) => {
        const inv = row as unknown as BillingInvoice;
        return (
          <Link
            href={buildPath(`/billing/invoices/${inv.id}`)}
            className="font-medium text-emerald-600 hover:underline"
          >
            {inv.invoice_number}
          </Link>
        );
      },
    },
    {
      key: "invoice_date",
      title: "Date",
      sortable: true,
      render: (_, row) => formatDate((row as unknown as BillingInvoice).invoice_date),
    },
    {
      key: "patient_name",
      title: "Client / Patient",
      render: (_, row) =>
        (row as unknown as BillingInvoice).patient_name ??
        (row as unknown as BillingInvoice).customer_name ??
        "—",
    },
    {
      key: "status",
      title: "Statut",
      render: (_, row) => {
        const s = (row as unknown as BillingInvoice).status;
        const variant =
          s === "paid"
            ? "success"
            : s === "overdue" || s === "cancelled"
              ? "danger"
              : s === "partially_paid"
                ? "warning"
                : "default";
        return (
          <Badge variant={variant} size="sm">
            {INVOICE_STATUS_LABELS[s] ?? s}
          </Badge>
        );
      },
    },
    {
      key: "total_amount",
      title: "Total",
      align: "right",
      sortable: true,
      render: (_, row) =>
        formatCurrency(Number((row as unknown as BillingInvoice).total_amount ?? 0)),
    },
    {
      key: "balance_due",
      title: "Reste dû",
      align: "right",
      render: (_, row) => {
        const bal = Number((row as unknown as BillingInvoice).balance_due ?? 0);
        return (
          <span className={bal > 0 ? "font-medium text-amber-600" : ""}>
            {formatCurrency(bal)}
          </span>
        );
      },
    },
  ];

  if (error) {
    return (
      <ErrorBanner
        title="Erreur"
        message="Impossible de charger les factures"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Factures
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Liste des factures avec filtres
          </p>
        </div>
        <ProtectedAction permission={Permission.INVOICES_CREATE}>
          <Button asChild>
            <Link href={buildPath("/billing/invoices/new")}>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle facture
            </Link>
          </Button>
        </ProtectedAction>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Rechercher (n° ou client)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              options={[
                { value: "", label: "Tous les statuts" },
                ...Object.entries(INVOICE_STATUS_LABELS).map(([value, label]) => ({
                  value,
                  label,
                })),
              ]}
              value={status}
              onChange={setStatus}
              placeholder="Statut"
              className="w-40"
            />
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-40"
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-40"
            />
          </div>
        </div>
        <DataTable
          columns={columns}
          data={filtered as unknown as Record<string, unknown>[]}
          loading={isLoading}
          emptyTitle="Aucune facture"
          emptyDescription="Créez une facture ou importez des données"
          rowKey={(row) => (row as unknown as BillingInvoice).id}
        />
      </Card>
    </div>
  );
}
