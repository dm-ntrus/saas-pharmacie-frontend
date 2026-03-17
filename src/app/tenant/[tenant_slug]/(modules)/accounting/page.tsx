"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { Permission } from "@/types/permissions";
import { useOrganization } from "@/context/OrganizationContext";
import {
  useAccounts, useCreateAccount, useUpdateAccount, useDeleteAccount,
  useTransactions, useRecurringTransactions, useExecuteRecurringTransactions,
  useCreateTransaction, usePostTransaction,
  useCreateJournalEntry,
  useAccountingInvoices, useCreateAccountingInvoice,
  useSendAccountingInvoice, useMarkInvoicePaid, useCancelAccountingInvoice,
  useOverdueInvoices,
  useExpenses, useCreateExpense, useApproveExpense, useRejectExpense, usePayExpense,
  useBudgets, useCreateBudget, useUpdateBudgetActuals,
  useBankAccounts, useCreateBankAccount, useBankAccountTransactions,
  useStartBankReconciliation, useReconcileBankTransaction,
  useFinancialPeriods, useCreateFinancialPeriod, useCloseFinancialPeriod,
  useLockFinancialPeriod, useSetCurrentFinancialPeriod,
  useTrialBalance, useBalanceSheet, useIncomeStatement, useCashFlowReport,
  useBudgetVarianceReport, useAccountsReceivableAging, useAccountsPayableAging, useDepartmentReport,
} from "@/hooks/api/useAccounting";
import {
  type Account, type Transaction, type Budget, type Expense,
  type BankAccount, type BankTransaction, type FinancialPeriod,
  ACCOUNT_TYPE_LABELS, TRANSACTION_STATUS_LABELS, BUDGET_STATUS_LABELS,
  EXPENSE_STATUS_LABELS, PERIOD_STATUS_LABELS,
  type AccountType, type TransactionStatus, type ExpenseStatus,
} from "@/types/accounting";
import {
  Card, CardContent, CardHeader, CardTitle, CardFooter,
  Button, Badge, Input, Select, Modal, Skeleton, EmptyState, ErrorBanner,
  DataTable, type Column,
  Tabs, TabsList, TabsTrigger, TabsContent,
  BarChartWidget, LineChartWidget, PieChartWidget,
} from "@/components/ui";
import { formatCurrency, formatDate, formatDateTime, formatNumber, formatPercent } from "@/utils/formatters";
import {
  LayoutDashboard, BookOpen, FileText, Receipt, Wallet,
  PiggyBank, Landmark, BarChart3, Plus, Send, CheckCircle,
  XCircle, DollarSign, TrendingUp, TrendingDown, ArrowUpDown,
  Trash2, Eye, CreditCard, Calendar, Download, RefreshCw,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// ZOD SCHEMAS
// ═══════════════════════════════════════════════════════════════

const accountSchema = z.object({
  account_code: z.string().min(1, "Code requis").max(20),
  account_name: z.string().min(2, "Nom requis").max(200),
  account_type: z.enum(["asset", "liability", "equity", "revenue", "expense"]),
  normal_balance: z.enum(["debit", "credit"]),
  description: z.string().optional(),
  parent_account_id: z.string().optional(),
});

const journalLineSchema = z.object({
  account_id: z.string().min(1, "Compte requis"),
  debit: z.string().optional(),
  credit: z.string().optional(),
  description: z.string().min(1, "Description requise"),
});

const journalEntrySchema = z.object({
  entries: z.array(journalLineSchema).min(2, "Minimum 2 lignes"),
});

const invoiceSchema = z.object({
  customer_name: z.string().min(2, "Client requis"),
  customer_email: z.string().email("Email invalide").optional().or(z.literal("")),
  due_date: z.string().min(1, "Date d'échéance requise"),
  items: z.array(z.object({
    description: z.string().min(1),
    quantity: z.coerce.number().min(1),
    unit_price: z.coerce.number().min(0),
  })).min(1),
  notes: z.string().optional(),
});

const expenseSchema = z.object({
  expense_date: z.string().min(1, "Date requise"),
  category: z.string().min(1, "Catégorie requise"),
  amount: z.string().min(1, "Montant requis"),
  description: z.string().min(2, "Description requise"),
  vendor_name: z.string().optional(),
  notes: z.string().optional(),
});

const budgetSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  category: z.string().min(1, "Catégorie requise"),
  period_start: z.string().min(1, "Début requis"),
  period_end: z.string().min(1, "Fin requise"),
  budget_amount: z.string().min(1, "Montant requis"),
  notes: z.string().optional(),
});

const bankAccountSchema = z.object({
  account_name: z.string().min(2, "Nom requis"),
  account_number: z.string().min(4, "Numéro requis"),
  bank_name: z.string().min(2, "Banque requise"),
  account_type: z.enum(["checking", "savings", "credit", "loan"]),
  is_primary: z.boolean().optional(),
});

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

type BadgeVariant = "success" | "danger" | "warning" | "info" | "default" | "primary";

const TX_STATUS_BADGE: Record<string, BadgeVariant> = {
  pending: "warning", posted: "success", reversed: "danger",
};

const INV_STATUS_BADGE: Record<string, BadgeVariant> = {
  draft: "default", sent: "info", paid: "success", overdue: "danger", cancelled: "default",
};

const EXP_STATUS_BADGE: Record<string, BadgeVariant> = {
  pending: "warning", approved: "info", paid: "success", rejected: "danger",
};

const BUDGET_BADGE: Record<string, BadgeVariant> = {
  active: "success", inactive: "default", completed: "info",
};

const PERIOD_BADGE: Record<string, BadgeVariant> = {
  open: "success", closed: "warning", locked: "danger",
};

const ACCOUNT_TYPE_OPTIONS = Object.entries(ACCOUNT_TYPE_LABELS).map(
  ([value, label]) => ({ value, label }),
);

const EXPENSE_CATEGORIES = [
  { value: "supplies", label: "Fournitures" },
  { value: "utilities", label: "Services publics" },
  { value: "rent", label: "Loyer" },
  { value: "salary", label: "Salaires" },
  { value: "maintenance", label: "Maintenance" },
  { value: "transport", label: "Transport" },
  { value: "other", label: "Autre" },
];

const BANK_TYPE_OPTIONS = [
  { value: "checking", label: "Compte courant" },
  { value: "savings", label: "Compte épargne" },
  { value: "credit", label: "Crédit" },
  { value: "loan", label: "Prêt" },
];

function asRecords<T>(data: T[] | undefined): Record<string, unknown>[] {
  return (data ?? []) as unknown as Record<string, unknown>[];
}

/** Extract id part for API (backend expects id without "accounts:" prefix) */
function accountIdForApi(account: Account): string {
  const id = String(account.id);
  return id.includes(":") ? id.split(":")[1] : id;
}

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════

export default function AccountingPage() {
  return (
    <ModuleGuard module="accounting" requiredPermissions={[Permission.ACCOUNTS_READ]}>
      <AccountingContent />
    </ModuleGuard>
  );
}

function AccountingContent() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const tabItems = [
    { value: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
    { value: "accounts", label: "Plan comptable", icon: BookOpen },
    { value: "entries", label: "Écritures", icon: FileText },
    { value: "invoices", label: "Factures", icon: Receipt },
    { value: "expenses", label: "Dépenses", icon: Wallet },
    { value: "budgets", label: "Budgets", icon: PiggyBank },
    { value: "bank", label: "Banque", icon: Landmark },
    { value: "periods", label: "Périodes fiscales", icon: Calendar },
    { value: "reports", label: "Rapports", icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Comptabilité</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Plan comptable, écritures, factures, budgets et rapports financiers
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap">
          {tabItems.map(({ value, label, icon: Icon }) => (
            <TabsTrigger key={value} value={value} className="gap-1.5">
              <Icon className="w-4 h-4" />
              <span className="max-sm:hidden">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="dashboard"><DashboardTab onNavigate={setActiveTab} /></TabsContent>
        <TabsContent value="accounts"><ChartOfAccountsTab /></TabsContent>
        <TabsContent value="entries"><JournalEntriesTab /></TabsContent>
        <TabsContent value="invoices"><InvoicesTab /></TabsContent>
        <TabsContent value="expenses"><ExpensesTab /></TabsContent>
        <TabsContent value="budgets"><BudgetsTab /></TabsContent>
        <TabsContent value="bank"><BankTab /></TabsContent>
        <TabsContent value="periods"><FinancialPeriodsTab /></TabsContent>
        <TabsContent value="reports"><ReportsTab /></TabsContent>
      </Tabs>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 1. DASHBOARD TAB
// ═══════════════════════════════════════════════════════════════

function DashboardTab({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const { data: accounts, isLoading: la } = useAccounts();
  const { data: transactions, isLoading: lt } = useTransactions({ limit: 10 });
  const { data: recurringTx, isLoading: lr } = useRecurringTransactions();
  const { data: overdueInvoices, isLoading: lo } = useOverdueInvoices();
  const { data: arAging } = useAccountsReceivableAging();
  const { data: apAging } = useAccountsPayableAging();
  const { data: periods, isLoading: lp } = useFinancialPeriods();
  const { data: trialBalance, isLoading: ltb } = useTrialBalance();

  const loading = la || lr || lo || lp || ltb;

  const kpis = useMemo(() => {
    const accs = (accounts ?? []) as Account[];
    const revenue = accs.filter(a => a.account_type === "revenue").reduce((s, a) => s + parseFloat(a.balance || "0"), 0);
    const expenses = accs.filter(a => a.account_type === "expense").reduce((s, a) => s + parseFloat(a.balance || "0"), 0);
    const assets = accs.filter(a => a.account_type === "asset").reduce((s, a) => s + parseFloat(a.balance || "0"), 0);
    const liabilities = accs.filter(a => a.account_type === "liability").reduce((s, a) => s + parseFloat(a.balance || "0"), 0);
    const receivables = (arAging as { total?: number })?.total ?? (overdueInvoices as { total_amount?: number }[] | undefined)?.reduce((s, inv) => s + (Number((inv as any).total_amount) || 0), 0) ?? 0;
    const payables = (apAging as { total?: number })?.total ?? 0;
    return {
      revenue, expenses,
      netProfit: revenue - expenses,
      cashFlow: assets - liabilities,
      receivables,
      payables,
    };
  }, [accounts, arAging, apAging, overdueInvoices]);

  const currentPeriod = useMemo(
    () => ((periods ?? []) as FinancialPeriod[]).find(p => p.is_current),
    [periods],
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  const recentRecurring = ((recurringTx ?? []) as Record<string, unknown>[]).slice(0, 8);
  const recentTransactions = ((transactions ?? []) as Transaction[]).slice(0, 10);
  const overdueList = ((overdueInvoices ?? []) as Record<string, unknown>[]).slice(0, 5);
  const kpiCards = [
    { label: "Revenus", value: kpis.revenue, icon: TrendingUp, color: "text-emerald-600" },
    { label: "Dépenses", value: kpis.expenses, icon: TrendingDown, color: "text-red-500" },
    { label: "Résultat net", value: kpis.netProfit, icon: DollarSign, color: kpis.netProfit >= 0 ? "text-emerald-600" : "text-red-500" },
    { label: "Trésorerie", value: kpis.cashFlow, icon: Landmark, color: "text-blue-600" },
    { label: "Créances clients", value: kpis.receivables, icon: FileText, color: "text-amber-600" },
    { label: "Dettes fournisseurs", value: kpis.payables, icon: Receipt, color: "text-orange-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiCards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{label}</p>
                  <p className={`text-xl font-bold mt-1 ${color}`}>{formatCurrency(value)}</p>
                </div>
                <div className="rounded-lg bg-slate-100 dark:bg-slate-800 p-2.5">
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {onNavigate && (
        <div className="flex flex-wrap gap-2">
          <ProtectedAction permission={Permission.TRANSACTIONS_CREATE}>
            <Button variant="outline" size="sm" onClick={() => onNavigate("entries")}>Nouvelle écriture</Button>
          </ProtectedAction>
          <ProtectedAction permission={Permission.INVOICES_CREATE}>
            <Button variant="outline" size="sm" onClick={() => onNavigate("invoices")}>Nouvelle facture</Button>
          </ProtectedAction>
          <ProtectedAction permission={Permission.EXPENSES_CREATE}>
            <Button variant="outline" size="sm" onClick={() => onNavigate("expenses")}>Nouvelle dépense</Button>
          </ProtectedAction>
          <ProtectedAction permission={Permission.BANK_TRANSACTIONS_READ}>
            <Button variant="outline" size="sm" onClick={() => onNavigate("bank")}>Rapprochement</Button>
          </ProtectedAction>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Dernières écritures</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recentTransactions.length === 0 ? (
              <EmptyState title="Aucune écriture récente" description="Les écritures apparaîtront ici" />
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentTransactions.map((tx, i) => (
                  <div key={tx.id ?? i} className="flex items-center justify-between px-4 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{tx.description ?? "—"}</p>
                      <p className="text-xs text-slate-500">{formatDate(tx.transaction_date)} · {(tx as any).transaction_number ?? ""}</p>
                    </div>
                    <span className="text-sm font-semibold">{formatCurrency(Number(tx.amount ?? 0))}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Transactions récurrentes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recentRecurring.length === 0 ? (
              <EmptyState title="Aucune transaction récurrente" description="Créez des écritures récurrentes dans Écritures" />
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentRecurring.map((r: Record<string, unknown>, i: number) => (
                  <div key={(r.id as string) ?? i} className="flex items-center justify-between px-4 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{(r.description as string) ?? "—"}</p>
                      <p className="text-xs text-slate-500">{(r.frequency as string) ?? ""} · {(r.next_run_date as string) ? formatDate(r.next_run_date as string) : ""}</p>
                    </div>
                    <Badge variant="default" size="sm">À exécuter</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Période fiscale</CardTitle>
          </CardHeader>
          <CardContent>
            {currentPeriod ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Nom</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{currentPeriod.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Période</span>
                  <span className="text-xs text-slate-700 dark:text-slate-300">
                    {formatDate(currentPeriod.start_date)} — {formatDate(currentPeriod.end_date)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Statut</span>
                  <Badge variant={PERIOD_BADGE[currentPeriod.status] ?? "default"} size="sm">
                    {PERIOD_STATUS_LABELS[currentPeriod.status] ?? currentPeriod.status}
                  </Badge>
                </div>
                {trialBalance && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Balance</span>
                      <Badge variant={(trialBalance as any).isBalanced ? "success" : "danger"} size="sm">
                        {(trialBalance as any).isBalanced ? "Équilibrée" : "Déséquilibrée"}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <EmptyState title="Aucune période" description="Créez une période fiscale pour commencer" />
            )}
          </CardContent>
        </Card>
      </div>

      {overdueList.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Factures en retard</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {overdueList.map((inv: Record<string, unknown>, i: number) => (
                <li key={(inv.id as string) ?? i} className="flex items-center justify-between px-4 py-2">
                  <span className="text-sm">{(inv.customer_name as string) ?? (inv.invoice_number as string) ?? "—"}</span>
                  <span className="text-sm font-semibold text-red-600">{formatCurrency((inv.total_amount as number) ?? (inv.amount as number) ?? 0)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 2. PLAN COMPTABLE TAB
// ═══════════════════════════════════════════════════════════════

function ChartOfAccountsTab() {
  const { data: accounts, isLoading, error } = useAccounts();
  const createAccount = useCreateAccount();
  const updateAccount = useUpdateAccount();
  const deleteAccount = useDeleteAccount();
  const [showModal, setShowModal] = useState(false);
  const [editAccount, setEditAccount] = useState<Account | null>(null);
  const [typeFilter, setTypeFilter] = useState("");

  const form = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    defaultValues: { account_code: "", account_name: "", account_type: "asset", normal_balance: "debit", description: "" },
  });

  const onSubmit = (data: z.infer<typeof accountSchema>) => {
    createAccount.mutate(data as Record<string, unknown>, {
      onSuccess: () => { setShowModal(false); form.reset(); },
    });
  };

  const filtered = useMemo(() => {
    const accs = (accounts ?? []) as Account[];
    return typeFilter ? accs.filter(a => a.account_type === typeFilter) : accs;
  }, [accounts, typeFilter]);

  const columns: Column<Record<string, unknown>>[] = [
    { key: "account_code", title: "Code", width: "100px", sortable: true,
      render: (_, row) => <span className="font-mono text-sm">{(row as unknown as Account).account_code}</span> },
    { key: "account_name", title: "Nom du compte", sortable: true },
    { key: "account_type", title: "Type", hideOnMobile: true,
      render: (_, row) => {
        const t = (row as unknown as Account).account_type;
        return <Badge variant="default" size="sm">{ACCOUNT_TYPE_LABELS[t] ?? t}</Badge>;
      } },
    { key: "normal_balance", title: "Sens", hideOnMobile: true,
      render: (_, row) => <span className="text-xs uppercase">{(row as unknown as Account).normal_balance}</span> },
    { key: "balance", title: "Solde", align: "right", sortable: true,
      render: (_, row) => {
        const bal = parseFloat((row as unknown as Account).balance || "0");
        return <span className={`font-semibold ${bal >= 0 ? "text-emerald-600" : "text-red-600"}`}>{formatCurrency(bal)}</span>;
      } },
    { key: "is_active", title: "Statut", align: "center", hideOnMobile: true,
      render: (_, row) => (
        <Badge variant={(row as unknown as Account).is_active ? "success" : "default"} size="sm">
          {(row as unknown as Account).is_active ? "Actif" : "Inactif"}
        </Badge>
      ) },
    { key: "actions", title: "", align: "right",
      render: (_, row) => {
        const acc = row as unknown as Account;
        if (!acc.is_active) return null;
        return (
          <div className="flex items-center justify-end gap-1">
            <ProtectedAction permission={Permission.ACCOUNTS_UPDATE}>
              <Button size="sm" variant="ghost" onClick={() => setEditAccount(acc)} aria-label="Modifier">Modifier</Button>
            </ProtectedAction>
            <ProtectedAction permission={Permission.ACCOUNTS_DELETE}>
              <Button size="sm" variant="ghost" className="text-red-600" onClick={() => {
                if (window.confirm("Désactiver ce compte ?")) deleteAccount.mutate(accountIdForApi(acc));
              }} aria-label="Supprimer">Supprimer</Button>
            </ProtectedAction>
          </div>
        );
      } },
  ];

  if (error) return <ErrorBanner title="Erreur" message="Impossible de charger le plan comptable" />;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Select
          options={[{ value: "", label: "Tous les types" }, ...ACCOUNT_TYPE_OPTIONS]}
          value={typeFilter}
          onChange={setTypeFilter}
          placeholder="Filtrer par type"
          className="w-48"
        />
        <ProtectedAction permission={Permission.ACCOUNTS_CREATE}>
          <Button onClick={() => setShowModal(true)} leftIcon={<Plus className="w-4 h-4" />}>
            Nouveau compte
          </Button>
        </ProtectedAction>
      </div>

      <DataTable
        columns={columns}
        data={asRecords(filtered)}
        loading={isLoading}
        emptyTitle="Aucun compte"
        emptyDescription="Commencez par créer votre plan comptable"
        rowKey={r => (r as unknown as Account).id}
      />

      <Modal open={showModal} onOpenChange={setShowModal} title="Créer un compte" size="md">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Code *</label>
              <Input {...form.register("account_code")} placeholder="411000" />
              {form.formState.errors.account_code && <p className="text-xs text-red-500 mt-1">{form.formState.errors.account_code.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nom *</label>
              <Input {...form.register("account_name")} placeholder="Clients" />
              {form.formState.errors.account_name && <p className="text-xs text-red-500 mt-1">{form.formState.errors.account_name.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Type de compte *"
              options={ACCOUNT_TYPE_OPTIONS}
              value={form.watch("account_type")}
              onChange={v => form.setValue("account_type", v as AccountType)}
            />
            <Select
              label="Sens normal *"
              options={[{ value: "debit", label: "Débit" }, { value: "credit", label: "Crédit" }]}
              value={form.watch("normal_balance")}
              onChange={v => form.setValue("normal_balance", v as "debit" | "credit")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <Input {...form.register("description")} placeholder="Description optionnelle" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Annuler</Button>
            <Button type="submit" loading={createAccount.isPending}>Créer le compte</Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!editAccount} onOpenChange={(open) => !open && setEditAccount(null)} title="Modifier le compte" size="md">
        {editAccount && (
          <EditAccountForm
            account={editAccount}
            onSuccess={() => setEditAccount(null)}
            onCancel={() => setEditAccount(null)}
            updateAccount={updateAccount}
          />
        )}
      </Modal>
    </div>
  );
}

function EditAccountForm({
  account,
  onSuccess,
  onCancel,
  updateAccount,
}: {
  account: Account;
  onSuccess: () => void;
  onCancel: () => void;
  updateAccount: ReturnType<typeof useUpdateAccount>;
}) {
  const form = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      account_code: account.account_code,
      account_name: account.account_name,
      account_type: account.account_type,
      normal_balance: account.normal_balance,
      description: account.description ?? "",
      parent_account_id: account.parent_account_id ?? "",
    },
  });

  const onSubmit = (data: z.infer<typeof accountSchema>) => {
    updateAccount.mutate(
      { id: accountIdForApi(account), data: data as Record<string, unknown> },
      { onSuccess: () => { onSuccess(); form.reset(); } },
    );
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Code *</label>
          <Input {...form.register("account_code")} placeholder="411000" />
          {form.formState.errors.account_code && <p className="text-xs text-red-500 mt-1">{form.formState.errors.account_code.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nom *</label>
          <Input {...form.register("account_name")} placeholder="Clients" />
          {form.formState.errors.account_name && <p className="text-xs text-red-500 mt-1">{form.formState.errors.account_name.message}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Type de compte *"
          options={ACCOUNT_TYPE_OPTIONS}
          value={form.watch("account_type")}
          onChange={v => form.setValue("account_type", v as AccountType)}
        />
        <Select
          label="Sens normal *"
          options={[{ value: "debit", label: "Débit" }, { value: "credit", label: "Crédit" }]}
          value={form.watch("normal_balance")}
          onChange={v => form.setValue("normal_balance", v as "debit" | "credit")}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
        <Input {...form.register("description")} placeholder="Description optionnelle" />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit" loading={updateAccount.isPending}>Enregistrer</Button>
      </div>
    </form>
  );
}

// ═══════════════════════════════════════════════════════════════
// 3. ÉCRITURES TAB
// ═══════════════════════════════════════════════════════════════

function JournalEntriesTab() {
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { data: transactions, isLoading, error } = useTransactions({
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });
  const { data: accounts } = useAccounts();
  const createJournalEntry = useCreateJournalEntry();
  const postTransaction = usePostTransaction();
  const [showModal, setShowModal] = useState(false);

  const form = useForm<z.infer<typeof journalEntrySchema>>({
    resolver: zodResolver(journalEntrySchema),
    defaultValues: { entries: [
      { account_id: "", debit: "", credit: "", description: "" },
      { account_id: "", debit: "", credit: "", description: "" },
    ] },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "entries" });

  const accountOptions = useMemo(
    () => ((accounts ?? []) as Account[]).map(a => ({ value: a.id, label: `${a.account_code} — ${a.account_name}` })),
    [accounts],
  );

  const onSubmit = (data: z.infer<typeof journalEntrySchema>) => {
    createJournalEntry.mutate(data.entries, {
      onSuccess: () => { setShowModal(false); form.reset(); },
    });
  };

  const filtered = useMemo(() => {
    const txs = (transactions ?? []) as Transaction[];
    return statusFilter ? txs.filter(t => t.status === statusFilter) : txs;
  }, [transactions, statusFilter]);

  const totalDebit = useMemo(
    () => form.watch("entries").reduce((s, e) => s + parseFloat(e.debit || "0"), 0),
    [form.watch("entries")],
  );
  const totalCredit = useMemo(
    () => form.watch("entries").reduce((s, e) => s + parseFloat(e.credit || "0"), 0),
    [form.watch("entries")],
  );

  const columns: Column<Record<string, unknown>>[] = [
    { key: "transaction_number", title: "N°", width: "120px", sortable: true },
    { key: "description", title: "Description" },
    { key: "transaction_date", title: "Date", sortable: true, hideOnMobile: true,
      render: (_, row) => formatDate((row as unknown as Transaction).transaction_date) },
    { key: "type", title: "Type", hideOnMobile: true,
      render: (_, row) => {
        const t = (row as unknown as Transaction).type;
        return <Badge variant={t === "debit" ? "danger" : "success"} size="sm">{t === "debit" ? "Débit" : "Crédit"}</Badge>;
      } },
    { key: "amount", title: "Montant", align: "right", sortable: true,
      render: (_, row) => <span className="font-semibold">{formatCurrency((row as unknown as Transaction).amount)}</span> },
    { key: "status", title: "Statut",
      render: (_, row) => {
        const s = (row as unknown as Transaction).status;
        return <Badge variant={TX_STATUS_BADGE[s] ?? "default"} size="sm">{TRANSACTION_STATUS_LABELS[s] ?? s}</Badge>;
      } },
    { key: "actions", title: "", align: "right",
      render: (_, row) => {
        const tx = row as unknown as Transaction;
        return tx.status === "pending" ? (
          <ProtectedAction permission={Permission.TRANSACTIONS_UPDATE}>
            <Button size="sm" variant="ghost" onClick={() => postTransaction.mutate(tx.id)}
              leftIcon={<CheckCircle className="w-3.5 h-3.5" />}>Valider</Button>
          </ProtectedAction>
        ) : null;
      } },
  ];

  if (error) return <ErrorBanner title="Erreur" message="Impossible de charger les écritures" />;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end gap-3 flex-wrap">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Du</label>
          <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-40" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Au</label>
          <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-40" />
        </div>
        <Select
          options={[
            { value: "", label: "Tous statuts" },
            ...Object.entries(TRANSACTION_STATUS_LABELS).map(([v, l]) => ({ value: v, label: l })),
          ]}
          value={statusFilter}
          onChange={setStatusFilter}
          className="w-44"
        />
        <div className="sm:ml-auto">
          <ProtectedAction permission={Permission.JOURNAL_ENTRIES_CREATE}>
            <Button onClick={() => setShowModal(true)} leftIcon={<Plus className="w-4 h-4" />}>
              Nouvelle écriture
            </Button>
          </ProtectedAction>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={asRecords(filtered)}
        loading={isLoading}
        emptyTitle="Aucune écriture"
        emptyDescription="Créez votre première écriture comptable"
        rowKey={r => (r as unknown as Transaction).id}
      />

      <Modal open={showModal} onOpenChange={setShowModal} title="Nouvelle écriture comptable" size="xl">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-3">
            {fields.map((field, idx) => (
              <div key={field.id} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-12 sm:col-span-4">
                  {idx === 0 && <label className="block text-xs font-medium text-slate-500 mb-1">Compte</label>}
                  <Select
                    options={accountOptions}
                    value={form.watch(`entries.${idx}.account_id`)}
                    onChange={v => form.setValue(`entries.${idx}.account_id`, v)}
                    searchable
                    placeholder="Compte..."
                  />
                </div>
                <div className="col-span-5 sm:col-span-2">
                  {idx === 0 && <label className="block text-xs font-medium text-slate-500 mb-1">Débit</label>}
                  <Input {...form.register(`entries.${idx}.debit`)} placeholder="0" type="number" step="0.01" />
                </div>
                <div className="col-span-5 sm:col-span-2">
                  {idx === 0 && <label className="block text-xs font-medium text-slate-500 mb-1">Crédit</label>}
                  <Input {...form.register(`entries.${idx}.credit`)} placeholder="0" type="number" step="0.01" />
                </div>
                <div className="col-span-10 sm:col-span-3">
                  {idx === 0 && <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>}
                  <Input {...form.register(`entries.${idx}.description`)} placeholder="Libellé" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  {idx >= 2 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(idx)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
            <Button type="button" variant="outline" size="sm" onClick={() => append({ account_id: "", debit: "", credit: "", description: "" })}
              leftIcon={<Plus className="w-3.5 h-3.5" />}>
              Ajouter une ligne
            </Button>
            <div className="flex gap-4 text-sm">
              <span>Débit: <strong className="text-red-600">{formatCurrency(totalDebit)}</strong></span>
              <span>Crédit: <strong className="text-emerald-600">{formatCurrency(totalCredit)}</strong></span>
              {totalDebit !== totalCredit && <Badge variant="danger" size="sm">Déséquilibré</Badge>}
              {totalDebit === totalCredit && totalDebit > 0 && <Badge variant="success" size="sm">Équilibré</Badge>}
            </div>
          </div>

          {form.formState.errors.entries && (
            <p className="text-xs text-red-500">{form.formState.errors.entries.message || form.formState.errors.entries.root?.message}</p>
          )}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Annuler</Button>
            <Button type="submit" loading={createJournalEntry.isPending} disabled={totalDebit !== totalCredit || totalDebit === 0}>
              Enregistrer
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 4. FACTURES TAB
// ═══════════════════════════════════════════════════════════════

function InvoicesTab() {
  const { data: invoices, isLoading, error } = useAccountingInvoices();
  const createInvoice = useCreateAccountingInvoice();
  const sendInvoice = useSendAccountingInvoice();
  const markPaid = useMarkInvoicePaid();
  const cancelInvoice = useCancelAccountingInvoice();
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");

  const form = useForm<z.infer<typeof invoiceSchema>>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: { customer_name: "", customer_email: "", due_date: "", items: [{ description: "", quantity: 1, unit_price: 0 }], notes: "" },
  });

  const { fields: itemFields, append: addItem, remove: removeItem } = useFieldArray({ control: form.control, name: "items" });

  const onSubmit = (data: z.infer<typeof invoiceSchema>) => {
    createInvoice.mutate(data as unknown as Record<string, unknown>, {
      onSuccess: () => { setShowModal(false); form.reset(); },
    });
  };

  const filtered = useMemo(() => {
    const invs = (invoices ?? []) as any[];
    return statusFilter ? invs.filter(i => i.status === statusFilter) : invs;
  }, [invoices, statusFilter]);

  const columns: Column<Record<string, unknown>>[] = [
    { key: "invoice_number", title: "N° Facture", sortable: true,
      render: (_, row: any) => <span className="font-mono text-sm">{row.invoice_number ?? "—"}</span> },
    { key: "customer_name", title: "Client" },
    { key: "total_amount", title: "Montant", align: "right", sortable: true,
      render: (_, row: any) => <span className="font-semibold">{formatCurrency(row.total_amount ?? row.amount ?? 0)}</span> },
    { key: "due_date", title: "Échéance", hideOnMobile: true,
      render: (_, row: any) => formatDate(row.due_date) },
    { key: "status", title: "Statut",
      render: (_, row: any) => <Badge variant={INV_STATUS_BADGE[row.status] ?? "default"} size="sm">{row.status}</Badge> },
    { key: "actions", title: "", align: "right",
      render: (_, row: any) => (
        <div className="flex items-center gap-1">
          {row.status === "draft" && (
            <ProtectedAction permission={Permission.INVOICES_UPDATE}>
              <Button size="sm" variant="ghost" onClick={() => sendInvoice.mutate(row.id)}
                leftIcon={<Send className="w-3.5 h-3.5" />}>Envoyer</Button>
            </ProtectedAction>
          )}
          {(row.status === "sent" || row.status === "overdue") && (
            <ProtectedAction permission={Permission.PAYMENTS_CREATE}>
              <Button size="sm" variant="ghost" onClick={() => markPaid.mutate({
                invoiceId: row.id,
                data: { paid_amount: String(row.total_amount ?? row.amount ?? 0), paid_date: new Date().toISOString().split("T")[0], payment_method: "cash" },
              })} leftIcon={<CreditCard className="w-3.5 h-3.5" />}>Payer</Button>
            </ProtectedAction>
          )}
          {row.status !== "cancelled" && row.status !== "paid" && (
            <ProtectedAction permission={Permission.INVOICES_UPDATE}>
              <Button size="sm" variant="ghost" onClick={() => cancelInvoice.mutate({ invoiceId: row.id, reason: "Annulation" })}
                leftIcon={<XCircle className="w-3.5 h-3.5 text-red-500" />} />
            </ProtectedAction>
          )}
        </div>
      ) },
  ];

  if (error) return <ErrorBanner title="Erreur" message="Impossible de charger les factures" />;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Select
          options={[
            { value: "", label: "Tous statuts" },
            { value: "draft", label: "Brouillon" }, { value: "sent", label: "Envoyée" },
            { value: "paid", label: "Payée" }, { value: "overdue", label: "En retard" },
            { value: "cancelled", label: "Annulée" },
          ]}
          value={statusFilter}
          onChange={setStatusFilter}
          className="w-44"
        />
        <ProtectedAction permission={Permission.INVOICES_CREATE}>
          <Button onClick={() => setShowModal(true)} leftIcon={<Plus className="w-4 h-4" />}>
            Nouvelle facture
          </Button>
        </ProtectedAction>
      </div>

      <DataTable
        columns={columns}
        data={asRecords(filtered)}
        loading={isLoading}
        emptyTitle="Aucune facture"
        emptyDescription="Créez votre première facture"
        rowKey={r => (r as any).id}
      />

      <Modal open={showModal} onOpenChange={setShowModal} title="Créer une facture" size="lg">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Client *</label>
              <Input {...form.register("customer_name")} placeholder="Nom du client" />
              {form.formState.errors.customer_name && <p className="text-xs text-red-500 mt-1">{form.formState.errors.customer_name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <Input {...form.register("customer_email")} placeholder="client@email.com" type="email" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date d&apos;échéance *</label>
            <Input {...form.register("due_date")} type="date" />
            {form.formState.errors.due_date && <p className="text-xs text-red-500 mt-1">{form.formState.errors.due_date.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Lignes de facturation</label>
            {itemFields.map((f, idx) => (
              <div key={f.id} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-12 sm:col-span-6">
                  <Input {...form.register(`items.${idx}.description`)} placeholder="Description" />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <Input {...form.register(`items.${idx}.quantity`)} type="number" min={1} placeholder="Qté" />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <Input {...form.register(`items.${idx}.unit_price`)} type="number" min={0} step="0.01" placeholder="Prix unit." />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  {idx > 0 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(idx)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => addItem({ description: "", quantity: 1, unit_price: 0 })}
              leftIcon={<Plus className="w-3.5 h-3.5" />}>
              Ajouter une ligne
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes</label>
            <Input {...form.register("notes")} placeholder="Notes internes" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Annuler</Button>
            <Button type="submit" loading={createInvoice.isPending}>Créer la facture</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 5. DÉPENSES TAB
// ═══════════════════════════════════════════════════════════════

function ExpensesTab() {
  const { data: expenses, isLoading, error } = useExpenses();
  const createExpense = useCreateExpense();
  const approveExpense = useApproveExpense();
  const rejectExpense = useRejectExpense();
  const payExpense = usePayExpense();
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const { currentOrganization } = useOrganization();

  const form = useForm<z.infer<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),
    defaultValues: { expense_date: "", category: "", amount: "", description: "", vendor_name: "", notes: "" },
  });

  const onSubmit = (data: z.infer<typeof expenseSchema>) => {
    createExpense.mutate(data as Record<string, unknown>, {
      onSuccess: () => { setShowModal(false); form.reset(); },
    });
  };

  const filtered = useMemo(() => {
    const exps = (expenses ?? []) as Expense[];
    return statusFilter ? exps.filter(e => e.status === statusFilter) : exps;
  }, [expenses, statusFilter]);

  const columns: Column<Record<string, unknown>>[] = [
    { key: "expense_number", title: "N°", width: "120px", sortable: true },
    { key: "description", title: "Description" },
    { key: "category", title: "Catégorie", hideOnMobile: true },
    { key: "vendor_name", title: "Fournisseur", hideOnMobile: true },
    { key: "expense_date", title: "Date", hideOnMobile: true, sortable: true,
      render: (_, row) => formatDate((row as unknown as Expense).expense_date) },
    { key: "amount", title: "Montant", align: "right", sortable: true,
      render: (_, row) => <span className="font-semibold">{formatCurrency((row as unknown as Expense).amount)}</span> },
    { key: "status", title: "Statut",
      render: (_, row) => {
        const s = (row as unknown as Expense).status;
        return <Badge variant={EXP_STATUS_BADGE[s] ?? "default"} size="sm">{EXPENSE_STATUS_LABELS[s] ?? s}</Badge>;
      } },
    { key: "actions", title: "", align: "right",
      render: (_, row) => {
        const exp = row as unknown as Expense;
        const userId = currentOrganization?.id ?? "";
        return (
          <div className="flex items-center gap-1">
            {exp.status === "pending" && (
              <>
                <ProtectedAction permission={Permission.EXPENSES_UPDATE}>
                  <Button size="sm" variant="ghost" onClick={() => approveExpense.mutate({ expenseId: exp.id, approvedBy: userId })}
                    leftIcon={<CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}>Approuver</Button>
                </ProtectedAction>
                <ProtectedAction permission={Permission.EXPENSES_UPDATE}>
                  <Button size="sm" variant="ghost" onClick={() => rejectExpense.mutate({ expenseId: exp.id, rejectedBy: userId, reason: "Rejetée" })}
                    leftIcon={<XCircle className="w-3.5 h-3.5 text-red-500" />} />
                </ProtectedAction>
              </>
            )}
            {exp.status === "approved" && (
              <ProtectedAction permission={Permission.EXPENSES_UPDATE}>
                <Button size="sm" variant="ghost" onClick={() => payExpense.mutate({
                  expenseId: exp.id,
                  data: { paid_by: userId, payment_method: "cash" },
                })} leftIcon={<CreditCard className="w-3.5 h-3.5" />}>Payer</Button>
              </ProtectedAction>
            )}
          </div>
        );
      } },
  ];

  if (error) return <ErrorBanner title="Erreur" message="Impossible de charger les dépenses" />;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Select
          options={[
            { value: "", label: "Tous statuts" },
            ...Object.entries(EXPENSE_STATUS_LABELS).map(([v, l]) => ({ value: v, label: l })),
          ]}
          value={statusFilter}
          onChange={setStatusFilter}
          className="w-44"
        />
        <ProtectedAction permission={Permission.EXPENSES_CREATE}>
          <Button onClick={() => setShowModal(true)} leftIcon={<Plus className="w-4 h-4" />}>
            Nouvelle dépense
          </Button>
        </ProtectedAction>
      </div>

      <DataTable
        columns={columns}
        data={asRecords(filtered)}
        loading={isLoading}
        emptyTitle="Aucune dépense"
        emptyDescription="Enregistrez votre première dépense"
        rowKey={r => (r as unknown as Expense).id}
      />

      <Modal open={showModal} onOpenChange={setShowModal} title="Nouvelle dépense" size="md">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date *</label>
              <Input {...form.register("expense_date")} type="date" />
              {form.formState.errors.expense_date && <p className="text-xs text-red-500 mt-1">{form.formState.errors.expense_date.message}</p>}
            </div>
            <Select
              label="Catégorie *"
              options={EXPENSE_CATEGORIES}
              value={form.watch("category")}
              onChange={v => form.setValue("category", v)}
              error={form.formState.errors.category?.message}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Montant *</label>
              <Input {...form.register("amount")} type="number" step="0.01" placeholder="0" />
              {form.formState.errors.amount && <p className="text-xs text-red-500 mt-1">{form.formState.errors.amount.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Fournisseur</label>
              <Input {...form.register("vendor_name")} placeholder="Nom du fournisseur" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description *</label>
            <Input {...form.register("description")} placeholder="Description de la dépense" />
            {form.formState.errors.description && <p className="text-xs text-red-500 mt-1">{form.formState.errors.description.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes</label>
            <Input {...form.register("notes")} placeholder="Notes additionnelles" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Annuler</Button>
            <Button type="submit" loading={createExpense.isPending}>Enregistrer</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 6. BUDGETS TAB
// ═══════════════════════════════════════════════════════════════

function BudgetsTab() {
  const { data: budgets, isLoading, error } = useBudgets();
  const createBudget = useCreateBudget();
  const [showModal, setShowModal] = useState(false);

  const form = useForm<z.infer<typeof budgetSchema>>({
    resolver: zodResolver(budgetSchema),
    defaultValues: { name: "", category: "", period_start: "", period_end: "", budget_amount: "", notes: "" },
  });

  const onSubmit = (data: z.infer<typeof budgetSchema>) => {
    createBudget.mutate(data as Record<string, unknown>, {
      onSuccess: () => { setShowModal(false); form.reset(); },
    });
  };

  if (error) return <ErrorBanner title="Erreur" message="Impossible de charger les budgets" />;

  const budgetList = (budgets ?? []) as Budget[];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{budgetList.length} budget(s)</p>
        <ProtectedAction permission={Permission.BUDGETS_CREATE}>
          <Button onClick={() => setShowModal(true)} leftIcon={<Plus className="w-4 h-4" />}>
            Nouveau budget
          </Button>
        </ProtectedAction>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-xl" />)}
        </div>
      ) : budgetList.length === 0 ? (
        <EmptyState title="Aucun budget" description="Créez un budget pour suivre vos dépenses" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgetList.map(budget => {
            const budgetAmt = parseFloat(budget.budget_amount || "0");
            const actualAmt = parseFloat(budget.actual_amount || "0");
            const pct = budgetAmt > 0 ? Math.min((actualAmt / budgetAmt) * 100, 100) : 0;
            const over = actualAmt > budgetAmt;

            return (
              <Card key={budget.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{budget.name}</CardTitle>
                      <p className="text-xs text-slate-500 mt-0.5">{budget.category} · {formatDate(budget.period_start)} — {formatDate(budget.period_end)}</p>
                    </div>
                    <Badge variant={BUDGET_BADGE[budget.status] ?? "default"} size="sm">
                      {BUDGET_STATUS_LABELS[budget.status] ?? budget.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Réalisé / Budget</span>
                      <span className="font-semibold">
                        {formatCurrency(actualAmt)} / {formatCurrency(budgetAmt)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all ${over ? "bg-red-500" : pct > 80 ? "bg-amber-500" : "bg-emerald-500"}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className={over ? "text-red-600 font-medium" : "text-slate-500"}>
                        {pct.toFixed(1)}% utilisé
                      </span>
                      <span className="text-slate-500">
                        Variance: {formatCurrency(parseFloat(budget.variance_amount || "0"))}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={showModal} onOpenChange={setShowModal} title="Créer un budget" size="md">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nom *</label>
            <Input {...form.register("name")} placeholder="Budget opérationnel Q1" />
            {form.formState.errors.name && <p className="text-xs text-red-500 mt-1">{form.formState.errors.name.message}</p>}
          </div>
          <Select
            label="Catégorie *"
            options={EXPENSE_CATEGORIES}
            value={form.watch("category")}
            onChange={v => form.setValue("category", v)}
            error={form.formState.errors.category?.message}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Début *</label>
              <Input {...form.register("period_start")} type="date" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Fin *</label>
              <Input {...form.register("period_end")} type="date" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Montant budgétisé *</label>
            <Input {...form.register("budget_amount")} type="number" step="0.01" placeholder="0" />
            {form.formState.errors.budget_amount && <p className="text-xs text-red-500 mt-1">{form.formState.errors.budget_amount.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes</label>
            <Input {...form.register("notes")} placeholder="Notes" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Annuler</Button>
            <Button type="submit" loading={createBudget.isPending}>Créer</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 7. BANQUE TAB
// ═══════════════════════════════════════════════════════════════

function BankTab() {
  const { data: bankAccounts, isLoading, error } = useBankAccounts();
  const createBankAccount = useCreateBankAccount();
  const [showModal, setShowModal] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const { data: bankTxs, isLoading: loadingTxs } = useBankAccountTransactions(selectedAccountId);
  const reconcileTx = useReconcileBankTransaction();
  const startRecon = useStartBankReconciliation();

  const form = useForm<z.infer<typeof bankAccountSchema>>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: { account_name: "", account_number: "", bank_name: "", account_type: "checking", is_primary: false },
  });

  const onSubmit = (data: z.infer<typeof bankAccountSchema>) => {
    createBankAccount.mutate(data as Record<string, unknown>, {
      onSuccess: () => { setShowModal(false); form.reset(); },
    });
  };

  if (error) return <ErrorBanner title="Erreur" message="Impossible de charger les comptes bancaires" />;

  const bankList = (bankAccounts ?? []) as BankAccount[];
  const txList = (bankTxs ?? []) as BankTransaction[];

  const txColumns: Column<Record<string, unknown>>[] = [
    { key: "transaction_date", title: "Date", sortable: true,
      render: (_, row) => formatDate((row as unknown as BankTransaction).transaction_date) },
    { key: "description", title: "Description" },
    { key: "type", title: "Type",
      render: (_, row) => {
        const t = (row as unknown as BankTransaction).type;
        return <Badge variant={t === "debit" ? "danger" : "success"} size="sm">{t === "debit" ? "Débit" : "Crédit"}</Badge>;
      } },
    { key: "amount", title: "Montant", align: "right",
      render: (_, row) => <span className="font-semibold">{formatCurrency((row as unknown as BankTransaction).amount)}</span> },
    { key: "status", title: "Statut",
      render: (_, row) => {
        const s = (row as unknown as BankTransaction).status;
        const badge: BadgeVariant = s === "reconciled" ? "success" : s === "cleared" ? "info" : "warning";
        return <Badge variant={badge} size="sm">{s === "reconciled" ? "Rapproché" : s === "cleared" ? "Compensé" : "En attente"}</Badge>;
      } },
    { key: "actions", title: "", align: "right",
      render: (_, row) => {
        const t = row as unknown as BankTransaction;
        return !t.is_reconciled ? (
          <ProtectedAction permission={Permission.BANK_TRANSACTIONS_UPDATE}>
            <Button size="sm" variant="ghost" onClick={() => reconcileTx.mutate(t.id)}
              leftIcon={<CheckCircle className="w-3.5 h-3.5" />}>Rapprocher</Button>
          </ProtectedAction>
        ) : null;
      } },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{bankList.length} compte(s) bancaire(s)</p>
        <ProtectedAction permission={Permission.BANK_ACCOUNTS_CREATE}>
          <Button onClick={() => setShowModal(true)} leftIcon={<Plus className="w-4 h-4" />}>
            Nouveau compte
          </Button>
        </ProtectedAction>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
      ) : bankList.length === 0 ? (
        <EmptyState title="Aucun compte bancaire" description="Ajoutez un compte bancaire pour le rapprochement" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bankList.map(ba => (
            <Card
              key={ba.id}
              className={`cursor-pointer transition-all ${selectedAccountId === ba.id ? "ring-2 ring-emerald-500" : "hover:border-emerald-300 dark:hover:border-emerald-700"}`}
              onClick={() => setSelectedAccountId(ba.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{ba.account_name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{ba.bank_name} · {ba.account_number}</p>
                  </div>
                  {ba.is_primary && <Badge variant="primary" size="sm">Principal</Badge>}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Solde</span>
                  <span className="text-lg font-bold text-emerald-600">{formatCurrency(ba.current_balance)}</span>
                </div>
                {ba.last_reconcile_date && (
                  <p className="text-[10px] text-slate-400 mt-1">Dernier rapprochement: {formatDate(ba.last_reconcile_date)}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedAccountId && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Transactions</h3>
            <ProtectedAction permission={Permission.BANK_TRANSACTIONS_UPDATE}>
              <Button variant="outline" size="sm" onClick={() => startRecon.mutate({
                accountId: selectedAccountId,
                statementDate: new Date().toISOString().split("T")[0],
                statementBalance: "0",
              })} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
                Démarrer rapprochement
              </Button>
            </ProtectedAction>
          </div>
          <DataTable
            columns={txColumns}
            data={asRecords(txList)}
            loading={loadingTxs}
            emptyTitle="Aucune transaction"
            emptyDescription="Les transactions de ce compte apparaîtront ici"
            rowKey={r => (r as unknown as BankTransaction).id}
          />
        </div>
      )}

      <Modal open={showModal} onOpenChange={setShowModal} title="Nouveau compte bancaire" size="md">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nom du compte *</label>
            <Input {...form.register("account_name")} placeholder="Compte principal" />
            {form.formState.errors.account_name && <p className="text-xs text-red-500 mt-1">{form.formState.errors.account_name.message}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">N° compte *</label>
              <Input {...form.register("account_number")} placeholder="123456789" />
              {form.formState.errors.account_number && <p className="text-xs text-red-500 mt-1">{form.formState.errors.account_number.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Banque *</label>
              <Input {...form.register("bank_name")} placeholder="Nom de la banque" />
              {form.formState.errors.bank_name && <p className="text-xs text-red-500 mt-1">{form.formState.errors.bank_name.message}</p>}
            </div>
          </div>
          <Select
            label="Type de compte"
            options={BANK_TYPE_OPTIONS}
            value={form.watch("account_type")}
            onChange={v => form.setValue("account_type", v as "checking" | "savings" | "credit" | "loan")}
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...form.register("is_primary")}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
            <span className="text-sm text-slate-700 dark:text-slate-300">Compte principal</span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Annuler</Button>
            <Button type="submit" loading={createBankAccount.isPending}>Créer</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 8. PÉRIODES FISCALES TAB
// ═══════════════════════════════════════════════════════════════

function FinancialPeriodsTab() {
  const { data: periods, isLoading, error, refetch } = useFinancialPeriods();
  const createPeriod = useCreateFinancialPeriod();
  const closePeriod = useCloseFinancialPeriod();
  const lockPeriod = useLockFinancialPeriod();
  const setCurrent = useSetCurrentFinancialPeriod();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [periodType, setPeriodType] = useState<"monthly" | "quarterly" | "yearly">("monthly");

  const list = ((periods ?? []) as FinancialPeriod[]);

  const handleCreate = () => {
    if (!name.trim() || !startDate || !endDate) return;
    createPeriod.mutate(
      { name: name.trim(), start_date: startDate, end_date: endDate, period_type: periodType } as Record<string, unknown>,
      { onSuccess: () => { setShowModal(false); setName(""); setStartDate(""); setEndDate(""); refetch(); } },
    );
  };

  if (error) return <ErrorBanner message="Impossible de charger les périodes" onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-slate-500">Créez et gérez les périodes fiscales. Clôturez ou verrouillez les périodes passées.</p>
        <ProtectedAction permission={Permission.FINANCIAL_PERIODS_CREATE}>
          <Button onClick={() => setShowModal(true)} leftIcon={<Plus className="w-4 h-4" />}>
            Nouvelle période
          </Button>
        </ProtectedAction>
      </div>

      {isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : list.length === 0 ? (
        <EmptyState
          title="Aucune période fiscale"
          description="Créez une période pour commencer la comptabilité."
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <th className="text-left p-3 font-medium">Nom</th>
                    <th className="text-left p-3 font-medium">Début</th>
                    <th className="text-left p-3 font-medium">Fin</th>
                    <th className="text-left p-3 font-medium">Statut</th>
                    <th className="text-left p-3 font-medium">Courante</th>
                    <th className="text-right p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((p) => (
                    <tr key={p.id} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="p-3 font-medium">{p.name}</td>
                      <td className="p-3">{formatDate(p.start_date)}</td>
                      <td className="p-3">{formatDate(p.end_date)}</td>
                      <td className="p-3">
                        <Badge variant={PERIOD_BADGE[p.status] ?? "default"} size="sm">
                          {PERIOD_STATUS_LABELS[p.status] ?? p.status}
                        </Badge>
                      </td>
                      <td className="p-3">{p.is_current ? "Oui" : "—"}</td>
                      <td className="p-3 text-right">
                        {!p.is_current && (
                          <ProtectedAction permission={Permission.FINANCIAL_PERIODS_UPDATE}>
                            <Button variant="ghost" size="sm" onClick={() => setCurrent.mutate(p.id)} disabled={setCurrent.isPending}>
                              Définir courante
                            </Button>
                          </ProtectedAction>
                        )}
                        {p.status === "open" && (
                          <>
                            <ProtectedAction permission={Permission.FINANCIAL_PERIODS_UPDATE}>
                              <Button variant="ghost" size="sm" onClick={() => closePeriod.mutate({ periodId: p.id, closedBy: "user" })} disabled={closePeriod.isPending}>
                                Clôturer
                              </Button>
                            </ProtectedAction>
                            <ProtectedAction permission={Permission.FINANCIAL_PERIODS_UPDATE}>
                              <Button variant="ghost" size="sm" onClick={() => lockPeriod.mutate(p.id)} disabled={lockPeriod.isPending}>
                                Verrouiller
                              </Button>
                            </ProtectedAction>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <Modal open={showModal} onOpenChange={setShowModal} title="Nouvelle période fiscale" size="md">
        <div className="space-y-4">
          <Input label="Nom *" value={name} onChange={e => setName(e.target.value)} placeholder="ex: Janvier 2025" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date début *" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            <Input label="Date fin *" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
            <select value={periodType} onChange={e => setPeriodType(e.target.value as any)} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm">
              <option value="monthly">Mensuel</option>
              <option value="quarterly">Trimestriel</option>
              <option value="yearly">Annuel</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>Annuler</Button>
            <Button onClick={handleCreate} disabled={createPeriod.isPending || !name.trim() || !startDate || !endDate}>
              {createPeriod.isPending ? "Création..." : "Créer"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 9. RAPPORTS TAB
// ═══════════════════════════════════════════════════════════════

type ReportType = "trial-balance" | "balance-sheet" | "income" | "cash-flow" | "budget-variance" | "receivable-aging" | "payable-aging" | "department";

function ReportsTab() {
  const [reportType, setReportType] = useState<ReportType>("trial-balance");
  const [startDate, setStartDate] = useState(() => {
    const d = new Date(); d.setMonth(d.getMonth() - 3);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split("T")[0]);

  const { data: trialBalance, isLoading: ltb } = useTrialBalance({
    startDate: reportType === "trial-balance" ? startDate : undefined,
    endDate: reportType === "trial-balance" ? endDate : undefined,
  });
  const { data: balanceSheet, isLoading: lbs } = useBalanceSheet(
    reportType === "balance-sheet" ? { asOfDate: endDate } : undefined,
  );
  const { data: incomeStmt, isLoading: lis } = useIncomeStatement(
    reportType === "income" ? { startDate, endDate } : undefined,
  );
  const { data: cashFlow, isLoading: lcf } = useCashFlowReport(
    reportType === "cash-flow" ? { startDate, endDate } : { startDate: "", endDate: "" },
  );
  const { data: budgetVariance, isLoading: lbv } = useBudgetVarianceReport();
  const { data: receivableAging, isLoading: lra } = useAccountsReceivableAging();
  const { data: payableAging, isLoading: lpa } = useAccountsPayableAging();
  const { data: departmentReport, isLoading: ldr } = useDepartmentReport();

  const reportOptions = [
    { value: "trial-balance" as const, label: "Balance de vérification" },
    { value: "balance-sheet" as const, label: "Bilan" },
    { value: "income" as const, label: "Compte de résultat" },
    { value: "cash-flow" as const, label: "Flux de trésorerie" },
    { value: "budget-variance" as const, label: "Variance budgétaire" },
    { value: "receivable-aging" as const, label: "Ancienneté créances clients" },
    { value: "payable-aging" as const, label: "Ancienneté dettes fournisseurs" },
    { value: "department" as const, label: "Par département" },
  ];

  const loading = (reportType === "trial-balance" && ltb) ||
    (reportType === "balance-sheet" && lbs) ||
    (reportType === "income" && lis) ||
    (reportType === "cash-flow" && lcf) ||
    (reportType === "budget-variance" && lbv) ||
    (reportType === "receivable-aging" && lra) ||
    (reportType === "payable-aging" && lpa) ||
    (reportType === "department" && ldr);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
        <Select
          label="Type de rapport"
          options={reportOptions}
          value={reportType}
          onChange={v => setReportType(v as typeof reportType)}
          className="w-56"
        />
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Du</label>
          <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-40" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Au</label>
          <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-40" />
        </div>
        <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>Exporter</Button>
      </div>

      {loading && <Skeleton className="h-96 w-full rounded-xl" />}

      {!loading && reportType === "trial-balance" && trialBalance && (
        <TrialBalanceReport data={trialBalance as any} />
      )}

      {!loading && reportType === "balance-sheet" && balanceSheet && (
        <BalanceSheetReport data={balanceSheet as any} />
      )}

      {!loading && reportType === "income" && incomeStmt && (
        <IncomeStatementReport data={incomeStmt as any} />
      )}

      {!loading && reportType === "cash-flow" && cashFlow && (
        <CashFlowReport data={cashFlow as any} />
      )}

      {!loading && reportType === "budget-variance" && budgetVariance && (
        <GenericReport title="Variance budgétaire" data={budgetVariance as Record<string, unknown>} />
      )}
      {!loading && reportType === "receivable-aging" && receivableAging && (
        <AgingReport title="Ancienneté créances clients" data={receivableAging as Record<string, unknown>} />
      )}
      {!loading && reportType === "payable-aging" && payableAging && (
        <AgingReport title="Ancienneté dettes fournisseurs" data={payableAging as Record<string, unknown>} />
      )}
      {!loading && reportType === "department" && departmentReport && (
        <GenericReport title="Rapport par département" data={departmentReport as Record<string, unknown>} />
      )}
    </div>
  );
}

function GenericReport({ title, data }: { title: string; data: Record<string, unknown> }) {
  const rows = Array.isArray(data) ? data : (data.items ?? data.rows ?? data.data) as Record<string, unknown>[] ?? [];
  const keys = rows.length ? Object.keys(rows[0] as object) : [];
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="p-0">
        {rows.length === 0 ? (
          <p className="p-4 text-sm text-slate-500">Aucune donnée</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 dark:bg-slate-800/50">
                {keys.map(k => <th key={k} className="text-left p-3 font-medium capitalize">{k.replace(/_/g, " ")}</th>)}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                    {keys.map(k => (
                      <td key={k} className="p-3">
                        {typeof (row as any)[k] === "number" ? formatCurrency((row as any)[k]) : String((row as any)[k] ?? "—")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AgingReport({ title, data }: { title: string; data: Record<string, unknown> }) {
  const buckets = (data.buckets ?? data.aging ?? data) as Array<{ range?: string; total?: number; count?: number }>;
  const total = typeof data.total === "number" ? data.total : (data.totalOutstanding ?? 0) as number;
  const list = Array.isArray(buckets) ? buckets : [];
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {typeof total === "number" && (
          <p className="text-sm text-slate-500 mt-1">Total: {formatCurrency(total)}</p>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {list.length === 0 ? (
          <p className="p-4 text-sm text-slate-500">Aucune donnée</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 dark:bg-slate-800/50">
                  <th className="text-left p-3 font-medium">Période</th>
                  <th className="text-right p-3 font-medium">Montant</th>
                  <th className="text-right p-3 font-medium">Nombre</th>
                </tr>
              </thead>
              <tbody>
                {list.map((row, i) => (
                  <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="p-3">{String(row.range ?? row.period ?? "—")}</td>
                    <td className="p-3 text-right font-medium">{formatCurrency(Number(row.total ?? 0))}</td>
                    <td className="p-3 text-right">{row.count ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TrialBalanceReport({ data }: { data: { accounts?: any[]; totalDebits?: number; totalCredits?: number; isBalanced?: boolean } }) {
  const accounts = data.accounts ?? [];
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Balance de vérification</h3>
        <Badge variant={data.isBalanced ? "success" : "danger"}>{data.isBalanced ? "Équilibrée" : "Déséquilibrée"}</Badge>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Card><CardContent className="p-4 text-center">
          <p className="text-xs text-slate-500 uppercase">Total Débits</p>
          <p className="text-xl font-bold text-red-600 mt-1">{formatCurrency(data.totalDebits ?? 0)}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-xs text-slate-500 uppercase">Total Crédits</p>
          <p className="text-xl font-bold text-emerald-600 mt-1">{formatCurrency(data.totalCredits ?? 0)}</p>
        </CardContent></Card>
      </div>
      {accounts.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Code</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Compte</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">Débit</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">Crédit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {accounts.map((a: any, i: number) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-4 py-2.5 text-sm font-mono">{a.accountCode}</td>
                      <td className="px-4 py-2.5 text-sm">{a.accountName}</td>
                      <td className="px-4 py-2.5 text-sm text-right font-medium text-red-600">{a.debitBalance > 0 ? formatCurrency(a.debitBalance) : "—"}</td>
                      <td className="px-4 py-2.5 text-sm text-right font-medium text-emerald-600">{a.creditBalance > 0 ? formatCurrency(a.creditBalance) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/70 font-semibold">
                    <td colSpan={2} className="px-4 py-3 text-sm">Total</td>
                    <td className="px-4 py-3 text-sm text-right text-red-600">{formatCurrency(data.totalDebits ?? 0)}</td>
                    <td className="px-4 py-3 text-sm text-right text-emerald-600">{formatCurrency(data.totalCredits ?? 0)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
      {accounts.length > 0 && (
        <BarChartWidget
          data={accounts.slice(0, 10).map((a: any) => ({
            name: a.accountCode,
            debit: a.debitBalance ?? 0,
            credit: a.creditBalance ?? 0,
          }))}
          xKey="name"
          yKey={["debit", "credit"]}
          title="Top 10 comptes — Débits vs Crédits"
          height={280}
        />
      )}
    </div>
  );
}

function BalanceSheetReport({ data }: { data: any }) {
  const sections = [
    { title: "Actifs", items: data.assets?.accounts ?? [], total: data.assets?.total ?? 0, color: "text-blue-600" },
    { title: "Passifs", items: data.liabilities?.accounts ?? [], total: data.liabilities?.total ?? 0, color: "text-amber-600" },
    { title: "Capitaux propres", items: data.equity?.accounts ?? [], total: data.equity?.total ?? 0, color: "text-emerald-600" },
  ];

  const pieData = sections.map(s => ({ name: s.title, value: Math.abs(s.total) }));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Bilan</h3>
        <Badge variant={data.isBalanced ? "success" : "danger"}>{data.isBalanced ? "Équilibré" : "Déséquilibré"}</Badge>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {sections.map(s => (
            <Card key={s.title}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-base ${s.color}`}>{s.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {s.items.length > 0 ? (
                  <div className="space-y-1">
                    {s.items.map((a: any, i: number) => (
                      <div key={i} className="flex justify-between text-sm py-1">
                        <span className="text-slate-700 dark:text-slate-300">{a.accountName}</span>
                        <span className="font-medium">{formatCurrency(a.balance)}</span>
                      </div>
                    ))}
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-2 mt-2 flex justify-between font-semibold text-sm">
                      <span>Total</span>
                      <span className={s.color}>{formatCurrency(s.total)}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Aucun élément</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        <PieChartWidget data={pieData} dataKey="value" nameKey="name" title="Répartition du bilan" />
      </div>
    </div>
  );
}

function IncomeStatementReport({ data }: { data: any }) {
  const revenueAccounts = data.revenue?.accounts ?? [];
  const expenseAccounts = data.expenses?.accounts ?? [];
  const netIncome = data.netIncome ?? 0;

  const chartData = [
    ...revenueAccounts.map((a: any) => ({ name: a.accountName, montant: a.balance, type: "Revenu" })),
    ...expenseAccounts.map((a: any) => ({ name: a.accountName, montant: a.balance, type: "Charge" })),
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Compte de résultat</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 text-center">
          <p className="text-xs text-slate-500 uppercase">Revenus</p>
          <p className="text-xl font-bold text-emerald-600 mt-1">{formatCurrency(data.revenue?.total ?? 0)}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-xs text-slate-500 uppercase">Charges</p>
          <p className="text-xl font-bold text-red-600 mt-1">{formatCurrency(data.expenses?.total ?? 0)}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-xs text-slate-500 uppercase">Résultat net</p>
          <p className={`text-xl font-bold mt-1 ${netIncome >= 0 ? "text-emerald-600" : "text-red-600"}`}>{formatCurrency(netIncome)}</p>
        </CardContent></Card>
      </div>
      {chartData.length > 0 && (
        <BarChartWidget
          data={chartData}
          xKey="name"
          yKey="montant"
          title="Revenus et charges par compte"
          height={280}
        />
      )}
    </div>
  );
}

function CashFlowReport({ data }: { data: any }) {
  const sections = [
    { title: "Activités opérationnelles", value: data.operating ?? 0 },
    { title: "Activités d'investissement", value: data.investing ?? 0 },
    { title: "Activités de financement", value: data.financing ?? 0 },
  ];
  const total = sections.reduce((s, sec) => s + sec.value, 0);

  const chartData = sections.map(s => ({ name: s.title, montant: s.value }));

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Flux de trésorerie</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sections.map(s => (
          <Card key={s.title}><CardContent className="p-4 text-center">
            <p className="text-xs text-slate-500">{s.title}</p>
            <p className={`text-lg font-bold mt-1 ${s.value >= 0 ? "text-emerald-600" : "text-red-600"}`}>{formatCurrency(s.value)}</p>
          </CardContent></Card>
        ))}
        <Card><CardContent className="p-4 text-center">
          <p className="text-xs text-slate-500 uppercase font-semibold">Variation nette</p>
          <p className={`text-xl font-bold mt-1 ${total >= 0 ? "text-emerald-600" : "text-red-600"}`}>{formatCurrency(total)}</p>
        </CardContent></Card>
      </div>
      {chartData.length > 0 && (
        <BarChartWidget data={chartData} xKey="name" yKey="montant" title="Flux par catégorie" height={250} />
      )}
    </div>
  );
}
