"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import {
  useBillingDailyReport,
  useBillingMonthlyReport,
  useBillingOutstandingInvoices,
  useBillingSalesByProduct,
  useBillingStatistics,
} from "@/hooks/api/useBilling";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Select, Skeleton } from "@/components/ui";
import { formatCurrency } from "@/utils/formatters";
import { ArrowLeft, BarChart3, Download } from "lucide-react";

export default function BillingReportsPage() {
  return (
    <ModuleGuard module="billing" requiredPermissions={[Permission.INVOICES_READ]}>
      <BillingReports />
    </ModuleGuard>
  );
}

function BillingReports() {
  const { buildPath } = useTenantPath();
  const [reportType, setReportType] = useState<"daily" | "monthly" | "outstanding" | "products" | "statistics">("daily");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split("T")[0]);

  const { data: dailyReport, isLoading: ld } = useBillingDailyReport(reportType === "daily" ? date : undefined);
  const { data: monthlyReport, isLoading: lm } = useBillingMonthlyReport(
    reportType === "monthly" ? year : undefined,
    reportType === "monthly" ? month : undefined,
  );
  const { data: outstanding, isLoading: lo } = useBillingOutstandingInvoices(
    reportType === "outstanding" ? {} : undefined,
  );
  const { data: byProduct, isLoading: lp } = useBillingSalesByProduct(
    reportType === "products" ? startDate : undefined,
    reportType === "products" ? endDate : undefined,
    20,
  );
  const { data: statistics, isLoading: ls } = useBillingStatistics(
    reportType === "statistics" ? startDate : undefined,
    reportType === "statistics" ? endDate : undefined,
  );

  const loading = ld || lm || lo || lp || ls;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={buildPath("/billing")}><ArrowLeft className="w-4 h-4 mr-1" /> Retour</Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Rapports de facturation</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Rapports quotidiens, mensuels et statistiques</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Type de rapport</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            options={[
              { value: "daily", label: "Rapport journalier" },
              { value: "monthly", label: "Rapport mensuel" },
              { value: "outstanding", label: "Factures impayées" },
              { value: "products", label: "Ventes par produit" },
              { value: "statistics", label: "Statistiques" },
            ]}
            value={reportType}
            onChange={(v) => setReportType(v as typeof reportType)}
            className="w-56"
          />
          {reportType === "daily" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-40" />
            </div>
          )}
          {reportType === "monthly" && (
            <div className="flex gap-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Année</label>
                <Input type="number" value={year} onChange={(e) => setYear(parseInt(e.target.value, 10))} className="w-24" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mois</label>
                <Input type="number" min={1} max={12} value={month} onChange={(e) => setMonth(parseInt(e.target.value, 10))} className="w-24" />
              </div>
            </div>
          )}
          {(reportType === "products" || reportType === "statistics") && (
            <div className="flex gap-2 flex-wrap">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Du</label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-40" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Au</label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-40" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {loading && <Skeleton className="h-64 w-full" />}

      {!loading && reportType === "daily" && dailyReport && (
        <Card>
          <CardHeader><CardTitle>Rapport journalier</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-slate-500">Chiffre d&apos;affaires: {formatCurrency(Number((dailyReport as any).total_sales_amount ?? 0))}</p>
            <p className="text-sm text-slate-500">Paiements reçus: {formatCurrency(Number((dailyReport as any).total_payments_received ?? 0))}</p>
            <p className="text-sm text-slate-500">Nombre de factures: {(dailyReport as any).total_invoices ?? 0}</p>
          </CardContent>
        </Card>
      )}

      {!loading && reportType === "monthly" && monthlyReport && (
        <Card>
          <CardHeader><CardTitle>Rapport mensuel</CardTitle></CardHeader>
          <CardContent>
            <pre className="text-xs overflow-auto max-h-96">{JSON.stringify(monthlyReport, null, 2)}</pre>
          </CardContent>
        </Card>
      )}

      {!loading && reportType === "outstanding" && outstanding && (
        <Card>
          <CardHeader><CardTitle>Factures impayées</CardTitle></CardHeader>
          <CardContent>
            <pre className="text-xs overflow-auto max-h-96">{JSON.stringify(outstanding, null, 2)}</pre>
          </CardContent>
        </Card>
      )}

      {!loading && reportType === "products" && byProduct && (
        <Card>
          <CardHeader><CardTitle>Ventes par produit</CardTitle></CardHeader>
          <CardContent>
            <pre className="text-xs overflow-auto max-h-96">{JSON.stringify(byProduct, null, 2)}</pre>
          </CardContent>
        </Card>
      )}

      {!loading && reportType === "statistics" && statistics && (
        <Card>
          <CardHeader><CardTitle>Statistiques</CardTitle></CardHeader>
          <CardContent>
            <pre className="text-xs overflow-auto max-h-96">{JSON.stringify(statistics, null, 2)}</pre>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2">
        <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>Exporter</Button>
      </div>
    </div>
  );
}
