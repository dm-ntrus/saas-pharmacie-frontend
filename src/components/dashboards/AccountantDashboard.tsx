"use client";

import React from "react";
import Link from "next/link";
import { useTenantPath } from "@/hooks/useTenantPath";
import { useAccounts, useTransactions, useTrialBalance } from "@/hooks/api/useAccounting";
import { formatCurrency, formatDate } from "@/utils/formatters";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  SkeletonCard,
  BarChartWidget,
  PieChartWidget,
} from "@/components/ui";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  Receipt,
  BarChart3,
  CalendarCheck,
  ArrowRight,
  Banknote,
} from "lucide-react";

export function AccountantDashboard() {
  const { buildPath } = useTenantPath();
  const { data: accountsData, isLoading: loadingAccounts } = useAccounts();
  const { data: transactionsData, isLoading: loadingTransactions } = useTransactions({ limit: 5 });
  const { data: trialBalanceData, isLoading: loadingTrialBalance } = useTrialBalance();

  const isLoading = loadingAccounts || loadingTransactions || loadingTrialBalance;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  const accounts = (accountsData as any)?.data ?? accountsData ?? [];
  const transactions = (transactionsData as any)?.data ?? transactionsData ?? [];
  const trialBalance = (trialBalanceData as any)?.data ?? trialBalanceData;

  const totalRevenue = trialBalance?.totalCredit ?? 0;
  const totalExpenses = trialBalance?.totalDebit ?? 0;
  const cashFlow = totalRevenue - totalExpenses;
  const outstandingInvoices = Array.isArray(accounts) ? accounts.length : 0;

  const kpis = [
    {
      title: "Chiffre d'affaires",
      value: formatCurrency(totalRevenue),
      icon: TrendingUp,
      color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    },
    {
      title: "Dépenses",
      value: formatCurrency(totalExpenses),
      icon: TrendingDown,
      color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    },
    {
      title: "Factures en attente",
      value: outstandingInvoices.toString(),
      icon: FileText,
      color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    },
    {
      title: "Trésorerie nette",
      value: `${cashFlow.toLocaleString("fr-FR")} FC`,
      icon: DollarSign,
      color: cashFlow >= 0
        ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    },
  ];

  const quickActions = [
    {
      title: "Nouvelle écriture",
      description: "Enregistrer une transaction comptable",
      icon: Receipt,
      href: buildPath("/accounting/transactions/new"),
    },
    {
      title: "Rapports financiers",
      description: "Bilan, compte de résultat, balance",
      icon: BarChart3,
      href: buildPath("/accounting/reports"),
    },
    {
      title: "Période fiscale",
      description: "Statut de la clôture en cours",
      icon: CalendarCheck,
      href: buildPath("/accounting/fiscal-periods"),
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-slate-500 dark:text-slate-400">{kpi.title}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{kpi.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.color}`}>
                  <kpi.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions rapides */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
          Actions rapides
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Card className="hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800 transition-all cursor-pointer group">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50 transition-colors">
                    <action.icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{action.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{action.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Charts — Revenus vs Dépenses + Répartition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              Revenus vs Dépenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarChartWidget
              data={[
                { name: "Jan", revenus: 0, depenses: 0 },
                { name: "Fév", revenus: 0, depenses: 0 },
                { name: "Mar", revenus: 0, depenses: 0 },
                { name: "Avr", revenus: 0, depenses: 0 },
                { name: "Mai", revenus: 0, depenses: 0 },
                { name: "Jun", revenus: 0, depenses: 0 },
              ]}
              xKey="name"
              yKey={["revenus", "depenses"]}
              colors={["#10b981", "#ef4444"]}
              height={260}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              Répartition des dépenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PieChartWidget
              data={[
                { name: "Fournitures", value: totalExpenses > 0 ? totalExpenses : 0 },
                { name: "Salaires", value: 0 },
                { name: "Loyer", value: 0 },
                { name: "Autres", value: 0 },
              ]}
              dataKey="value"
              nameKey="name"
              height={260}
            />
          </CardContent>
        </Card>
      </div>

      {/* Transactions récentes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Banknote className="w-5 h-5 text-emerald-600" />
              Dernières écritures
            </CardTitle>
            <Link
              href={buildPath("/accounting/transactions")}
              className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              Tout voir <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {Array.isArray(transactions) && transactions.length > 0 ? (
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {transactions.slice(0, 5).map((tx: any, idx: number) => (
                <div key={tx.id ?? idx} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {tx.description || tx.reference || `Écriture #${idx + 1}`}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(tx.date)}
                    </p>
                  </div>
                  <span className={`text-sm font-semibold ${
                    (tx.type === "credit" || tx.amount > 0)
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }`}>
                    {tx.amount != null ? formatCurrency(tx.amount) : "—"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Banknote className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Aucune écriture récente
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
