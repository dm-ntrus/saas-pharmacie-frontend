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
import { INVOICE_STATUS_LABELS } from "@/types/billing";
import { ArrowLeft, Download } from "lucide-react";

export default function BillingReportsPage() {
  return (
    <ModuleGuard module="billing" requiredPermissions={[Permission.INVOICES_READ]}>
      <BillingReports />
    </ModuleGuard>
  );
}

function BillingReports() {
  const { buildPath } = useTenantPath();
  const [reportType, setReportType] = useState<
    "daily" | "monthly" | "outstanding" | "products" | "statistics"
  >("daily");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]!);
  const [year, setYear] = useState(() => new Date().getUTCFullYear());
  const [month, setMonth] = useState(() => new Date().getUTCMonth() + 1);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setUTCMonth(d.getUTCMonth() - 1);
    return d.toISOString().split("T")[0]!;
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split("T")[0]!);

  const { data: dailyReport, isLoading: ld } = useBillingDailyReport(
    reportType === "daily" ? { date } : undefined,
  );
  const { data: monthlyReport, isLoading: lm } = useBillingMonthlyReport(
    reportType === "monthly" ? { year, month } : undefined,
  );
  const { data: outstanding, isLoading: lo } = useBillingOutstandingInvoices(
    reportType === "outstanding" ? {} : undefined,
  );
  const { data: byProduct, isLoading: lp } = useBillingSalesByProduct(
    reportType === "products" ? { startDate, endDate, limit: 20 } : undefined,
  );
  const { data: statistics, isLoading: ls } = useBillingStatistics(
    reportType === "statistics" ? { startDate, endDate } : undefined,
  );

  const loading = ld || lm || lo || lp || ls;

  const tableWrap = "overflow-x-auto rounded-md border border-slate-200 dark:border-slate-700";
  const th = "text-left p-2 text-xs font-medium text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700";
  const td = "p-2 text-sm text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={buildPath("/billing")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Retour
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Rapports de facturation</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Abonnement plateforme (factures SaaS) — agrégations côté serveur
          </p>
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
              { value: "products", label: "Lignes de facture (top revenus)" },
              { value: "statistics", label: "Statistiques période" },
            ]}
            value={reportType}
            onChange={(v) => setReportType(v as typeof reportType)}
            className="w-72 max-w-full"
          />
          {reportType === "daily" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date (UTC)</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-40" />
            </div>
          )}
          {reportType === "monthly" && (
            <div className="flex gap-2 flex-wrap">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Année (UTC)</label>
                <Input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value, 10) || year)}
                  className="w-24"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mois</label>
                <Input
                  type="number"
                  min={1}
                  max={12}
                  value={month}
                  onChange={(e) => setMonth(parseInt(e.target.value, 10) || month)}
                  className="w-24"
                />
              </div>
            </div>
          )}
          {(reportType === "products" || reportType === "statistics") && (
            <div className="flex gap-2 flex-wrap">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Du (UTC)</label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-40" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Au (UTC)</label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-40" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {loading && <Skeleton className="h-64 w-full" />}

      <div data-report-content>
      {!loading && reportType === "daily" && dailyReport && (
        <Card>
          <CardHeader>
            <CardTitle>Rapport journalier — {dailyReport.date}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3 text-sm">
              <div>
                <p className="text-slate-500">Montant factures créées (jour)</p>
                <p className="text-lg font-semibold">{formatCurrency(dailyReport.total_sales_amount)}</p>
              </div>
              <div>
                <p className="text-slate-500">Paiements reçus (jour)</p>
                <p className="text-lg font-semibold">{formatCurrency(dailyReport.total_payments_received)}</p>
              </div>
              <div>
                <p className="text-slate-500">Nombre de factures créées</p>
                <p className="text-lg font-semibold">{dailyReport.total_invoices}</p>
              </div>
            </div>
            {dailyReport.payments.length > 0 && (
              <div className={tableWrap}>
                <table className="w-full min-w-[480px]">
                  <thead>
                    <tr>
                      <th className={th}>Paiement</th>
                      <th className={th}>Montant</th>
                      <th className={th}>Facture</th>
                      <th className={th}>Traité le</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyReport.payments.map((p) => (
                      <tr key={p.id}>
                        <td className={td}>
                          <Link
                            href={buildPath(`/billing/payments/${encodeURIComponent(p.id)}`)}
                            className="text-emerald-600 hover:underline font-mono text-xs"
                          >
                            {p.id.slice(0, 8)}…
                          </Link>
                        </td>
                        <td className={td}>{formatCurrency(p.amount, p.currency)}</td>
                        <td className={td}>
                          {p.invoice_id ? (
                            <Link
                              href={buildPath(`/billing/invoices/${encodeURIComponent(p.invoice_id)}`)}
                              className="text-emerald-600 hover:underline text-xs"
                            >
                              {p.invoice_id.slice(0, 8)}…
                            </Link>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className={td}>
                          {p.processed_at ? new Date(p.processed_at).toLocaleString("fr-FR") : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!loading && reportType === "monthly" && monthlyReport && (
        <Card>
          <CardHeader>
            <CardTitle>Rapport mensuel — {monthlyReport.month}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 text-sm">
              <div>
                <p className="text-slate-500">Encaissements (paiements réussis)</p>
                <p className="text-lg font-semibold">{formatCurrency(monthlyReport.revenue_from_payments)}</p>
              </div>
              <div>
                <p className="text-slate-500">Total facturé (factures créées sur la période)</p>
                <p className="text-lg font-semibold">{formatCurrency(monthlyReport.invoice_total_amount_created)}</p>
              </div>
              <div>
                <p className="text-slate-500">Nombre de factures créées</p>
                <p className="text-lg font-semibold">{monthlyReport.invoices_created_count}</p>
              </div>
            </div>
            {Object.keys(monthlyReport.invoices_by_status).length > 0 && (
              <div className={tableWrap}>
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className={th}>Statut</th>
                      <th className={th}>Nombre</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(monthlyReport.invoices_by_status).map(([status, count]) => (
                      <tr key={status}>
                        <td className={td}>{INVOICE_STATUS_LABELS[status] ?? status}</td>
                        <td className={td}>{count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!loading && reportType === "outstanding" && outstanding && (
        <Card>
          <CardHeader>
            <CardTitle>Encours total — {formatCurrency(outstanding.totalOutstanding)}</CardTitle>
          </CardHeader>
          <CardContent>
            {outstanding.invoices.length === 0 ? (
              <p className="text-sm text-slate-500">Aucune facture ouverte.</p>
            ) : (
              <div className={tableWrap}>
                <table className="w-full min-w-[640px]">
                  <thead>
                    <tr>
                      <th className={th}>Facture</th>
                      <th className={th}>Échéance</th>
                      <th className={th}>Total</th>
                      <th className={th}>Payé</th>
                      <th className={th}>Solde</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outstanding.invoices.map((inv) => (
                      <tr key={inv.id}>
                        <td className={td}>
                          <Link
                            href={buildPath(`/billing/invoices/${encodeURIComponent(inv.id)}`)}
                            className="text-emerald-600 hover:underline"
                          >
                            {inv.invoice_number}
                          </Link>
                        </td>
                        <td className={td}>
                          {inv.due_date ? new Date(inv.due_date).toLocaleDateString("fr-FR") : "—"}
                        </td>
                        <td className={td}>{formatCurrency(inv.total_amount, inv.currency)}</td>
                        <td className={td}>{formatCurrency(inv.amount_paid, inv.currency)}</td>
                        <td className={td}>{formatCurrency(inv.balance_due, inv.currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!loading && reportType === "products" && byProduct && (
        <Card>
          <CardHeader>
            <CardTitle>Lignes de facture (top revenus)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {byProduct.note && <p className="text-xs text-slate-500">{byProduct.note}</p>}
            {byProduct.items.length === 0 ? (
              <p className="text-sm text-slate-500">Aucune ligne sur la période.</p>
            ) : (
              <div className={tableWrap}>
                <table className="w-full min-w-[480px]">
                  <thead>
                    <tr>
                      <th className={th}>#</th>
                      <th className={th}>Libellé</th>
                      <th className={th}>Qté</th>
                      <th className={th}>Revenu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {byProduct.items.map((row) => (
                      <tr key={`${row.rank}-${row.label}`}>
                        <td className={td}>{row.rank}</td>
                        <td className={td}>{row.label}</td>
                        <td className={td}>{row.quantity}</td>
                        <td className={td}>{formatCurrency(row.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!loading && reportType === "statistics" && statistics && (
        <Card>
          <CardHeader>
            <CardTitle>
              Statistiques
              {statistics.period?.startDate && statistics.period?.endDate && (
                <span className="block text-sm font-normal text-slate-500 mt-1">
                  {statistics.period.startDate} → {statistics.period.endDate}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
              <div>
                <p className="text-slate-500">Factures créées (période)</p>
                <p className="text-lg font-semibold">{statistics.invoiceCount}</p>
              </div>
              <div>
                <p className="text-slate-500">Montant paiements (période, net)</p>
                <p className="text-lg font-semibold">{formatCurrency(statistics.paidTotal)}</p>
              </div>
              <div>
                <p className="text-slate-500">Mouvements de paiement</p>
                <p className="text-lg font-semibold">{statistics.paymentRecordsInPeriod}</p>
              </div>
              <div>
                <p className="text-slate-500">Factures ouvertes (état actuel)</p>
                <p className="text-lg font-semibold">{statistics.openInvoicesCount}</p>
              </div>
              <div>
                <p className="text-slate-500">Encours estimé (factures ouvertes)</p>
                <p className="text-lg font-semibold">{formatCurrency(statistics.estimatedOpenBalance)}</p>
              </div>
            </div>
            {Object.keys(statistics.invoicesByStatus).length > 0 && (
              <div className={tableWrap}>
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className={th}>Statut (créées sur la période)</th>
                      <th className={th}>Nombre</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(statistics.invoicesByStatus).map(([status, count]) => (
                      <tr key={status}>
                        <td className={td}>{INVOICE_STATUS_LABELS[status] ?? status}</td>
                        <td className={td}>{count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          leftIcon={<Download className="w-4 h-4" />}
          onClick={() => {
            const printArea = document.querySelector("[data-report-content]");
            if (printArea) {
              window.print();
            }
          }}
        >
          Exporter PDF
        </Button>
        <Button
          variant="outline"
          leftIcon={<Download className="w-4 h-4" />}
          onClick={() => {
            const tables = document.querySelectorAll("[data-report-content] table");
            if (tables.length === 0) return;
            const rows: string[] = [];
            tables.forEach((table) => {
              table.querySelectorAll("tr").forEach((tr) => {
                const cells = Array.from(tr.querySelectorAll("th, td")).map((c) =>
                  `"${(c.textContent || "").replace(/"/g, '""')}"`,
                );
                rows.push(cells.join(","));
              });
              rows.push("");
            });
            const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `rapport-${reportType}-${new Date().toISOString().split("T")[0]}.csv`;
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Exporter CSV
        </Button>
      </div>
    </div>
  );
}
