"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOrganization } from "@/context/OrganizationContext";
import { apiService } from "@/services/api.service";
import { toast } from "react-hot-toast";

function usePharmacyId() {
  const { currentOrganization } = useOrganization();
  return currentOrganization?.id ?? "";
}

function basePath(pid: string) {
  return `/pharmacies/${pid}/accounting`;
}

function chartOfAccountsPath(pid: string) {
  return `${basePath(pid)}/chart-of-accounts`;
}

// ═══════════════════════════════════════════════════════════
// CHART OF ACCOUNTS (plan comptable standards / init)
// ═══════════════════════════════════════════════════════════

export function useChartOfAccountsStandards() {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["chart-of-accounts-standards", pid],
    queryFn: () => apiService.get(`${chartOfAccountsPath(pid)}/standards`),
    enabled: !!pid,
  });
}

export function useChartOfAccountsValidate() {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["chart-of-accounts-validate", pid],
    queryFn: () => apiService.get(`${chartOfAccountsPath(pid)}/validate`),
    enabled: !!pid,
  });
}

export function useChartOfAccountsMapping() {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["chart-of-accounts-mapping", pid],
    queryFn: () => apiService.get(`${chartOfAccountsPath(pid)}/mapping`),
    enabled: !!pid,
  });
}

export function useChartOfAccountsLookup(identifier: string) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["chart-of-accounts-lookup", pid, identifier],
    queryFn: () =>
      apiService.get(`${chartOfAccountsPath(pid)}/lookup`, {
        params: { identifier },
      }),
    enabled: !!pid && !!identifier,
  });
}

export function useInitializeChartOfAccounts() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiService.post(`${chartOfAccountsPath(pid)}/initialize`, data),
    onSuccess: () => {
      toast.success("Plan comptable initialisé");
      qc.invalidateQueries({ queryKey: ["accounts", pid] });
      qc.invalidateQueries({ queryKey: ["chart-of-accounts-validate", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useChartOfAccountsRecommendation(countryCode: string) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["chart-of-accounts-recommendation", pid, countryCode],
    queryFn: () =>
      apiService.get(`${chartOfAccountsPath(pid)}/recommendation/${countryCode}`),
    enabled: !!pid && !!countryCode,
  });
}

// ═══════════════════════════════════════════════════════════
// ACCOUNTS (CRUD)
// ═══════════════════════════════════════════════════════════

export function useAccounts() {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["accounts", pid],
    queryFn: () => apiService.get(`${basePath(pid)}/accounts`),
    enabled: !!pid,
  });
}

export function useAccountById(id: string) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["account", pid, id],
    queryFn: () => apiService.get(`${basePath(pid)}/accounts/${id}`),
    enabled: !!pid && !!id,
  });
}

export function useCreateAccount() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiService.post(`${basePath(pid)}/accounts`, data),
    onSuccess: () => {
      toast.success("Compte créé");
      qc.invalidateQueries({ queryKey: ["accounts", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateAccount() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      apiService.patch(`${basePath(pid)}/accounts/${id}`, data),
    onSuccess: (_, { id }) => {
      toast.success("Compte mis à jour");
      qc.invalidateQueries({ queryKey: ["accounts", pid] });
      qc.invalidateQueries({ queryKey: ["account", pid, id] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteAccount() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiService.delete(`${basePath(pid)}/accounts/${id}`),
    onSuccess: () => {
      toast.success("Compte désactivé");
      qc.invalidateQueries({ queryKey: ["accounts", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// ═══════════════════════════════════════════════════════════
// TRANSACTIONS
// ═══════════════════════════════════════════════════════════

export function useTransactions(params?: {
  account_id?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  limit?: number;
  offset?: number;
}) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["transactions", pid, params],
    queryFn: () =>
      apiService.get(`${basePath(pid)}/transactions`, { params }),
    enabled: !!pid,
  });
}

export function useCreateTransaction() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiService.post(`${basePath(pid)}/transactions`, data),
    onSuccess: () => {
      toast.success("Écriture enregistrée");
      qc.invalidateQueries({ queryKey: ["transactions", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function usePostTransaction() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (transactionId: string) =>
      apiService.patch(
        `${basePath(pid)}/transactions/${transactionId}/post`,
        {},
      ),
    onSuccess: () => {
      toast.success("Transaction validée");
      qc.invalidateQueries({ queryKey: ["transactions", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// ═══════════════════════════════════════════════════════════
// JOURNAL ENTRIES
// ═══════════════════════════════════════════════════════════

export function useCreateJournalEntry() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (
      entries: Array<{
        account_id: string;
        debit?: string;
        credit?: string;
        description: string;
      }>,
    ) =>
      apiService.post(`${basePath(pid)}/journal-entries`, { entries }),
    onSuccess: () => {
      toast.success("Écriture comptable enregistrée");
      qc.invalidateQueries({ queryKey: ["transactions", pid] });
      qc.invalidateQueries({ queryKey: ["accounts", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// ═══════════════════════════════════════════════════════════
// INVOICES (Accounting)
// ═══════════════════════════════════════════════════════════

export function useAccountingInvoices() {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["accounting-invoices", pid],
    queryFn: () => apiService.get(`${basePath(pid)}/invoices`),
    enabled: !!pid,
  });
}

export function useAccountingInvoiceById(id: string) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["accounting-invoice", pid, id],
    queryFn: () => apiService.get(`${basePath(pid)}/invoices/${id}`),
    enabled: !!pid && !!id,
  });
}

export function useOverdueInvoices() {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["accounting-invoices-overdue", pid],
    queryFn: () => apiService.get(`${basePath(pid)}/invoices/overdue`),
    enabled: !!pid,
  });
}

export function useCreateAccountingInvoice() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiService.post(`${basePath(pid)}/invoices`, data),
    onSuccess: () => {
      toast.success("Facture créée");
      qc.invalidateQueries({ queryKey: ["accounting-invoices", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateAccountingInvoice() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Record<string, unknown>;
    }) => apiService.patch(`${basePath(pid)}/invoices/${id}`, data),
    onSuccess: () => {
      toast.success("Facture mise à jour");
      qc.invalidateQueries({ queryKey: ["accounting-invoices", pid] });
      qc.invalidateQueries({ queryKey: ["accounting-invoice", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useSendAccountingInvoice() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (invoiceId: string) =>
      apiService.patch(`${basePath(pid)}/invoices/${invoiceId}/send`, {}),
    onSuccess: () => {
      toast.success("Facture envoyée");
      qc.invalidateQueries({ queryKey: ["accounting-invoices", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useMarkInvoicePaid() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      invoiceId,
      data,
    }: {
      invoiceId: string;
      data: {
        paid_amount: string;
        paid_date: string;
        payment_method: string;
        reference_number?: string;
      };
    }) =>
      apiService.patch(
        `${basePath(pid)}/invoices/${invoiceId}/payment`,
        data,
      ),
    onSuccess: () => {
      toast.success("Paiement enregistré");
      qc.invalidateQueries({ queryKey: ["accounting-invoices", pid] });
      qc.invalidateQueries({ queryKey: ["accounting-invoice", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useCancelAccountingInvoice() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ invoiceId, reason }: { invoiceId: string; reason: string }) =>
      apiService.patch(`${basePath(pid)}/invoices/${invoiceId}/cancel`, {
        reason,
      }),
    onSuccess: () => {
      toast.success("Facture annulée");
      qc.invalidateQueries({ queryKey: ["accounting-invoices", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteAccountingInvoice() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (invoiceId: string) =>
      apiService.delete(`${basePath(pid)}/invoices/${invoiceId}`),
    onSuccess: () => {
      toast.success("Facture supprimée");
      qc.invalidateQueries({ queryKey: ["accounting-invoices", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// ═══════════════════════════════════════════════════════════
// EXPENSES
// ═══════════════════════════════════════════════════════════

export function useExpenses() {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["expenses", pid],
    queryFn: () => apiService.get(`${basePath(pid)}/expenses`),
    enabled: !!pid,
  });
}

export function useExpenseById(id: string) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["expense", pid, id],
    queryFn: () => apiService.get(`${basePath(pid)}/expenses/${id}`),
    enabled: !!pid && !!id,
  });
}

export function useCreateExpense() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiService.post(`${basePath(pid)}/expenses`, data),
    onSuccess: () => {
      toast.success("Dépense créée");
      qc.invalidateQueries({ queryKey: ["expenses", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateExpense() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Record<string, unknown>;
    }) => apiService.patch(`${basePath(pid)}/expenses/${id}`, data),
    onSuccess: () => {
      toast.success("Dépense mise à jour");
      qc.invalidateQueries({ queryKey: ["expenses", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useApproveExpense() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      expenseId,
      approvedBy,
    }: {
      expenseId: string;
      approvedBy: string;
    }) =>
      apiService.patch(`${basePath(pid)}/expenses/${expenseId}/approve`, {
        approvedBy,
      }),
    onSuccess: () => {
      toast.success("Dépense approuvée");
      qc.invalidateQueries({ queryKey: ["expenses", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function usePayExpense() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      expenseId,
      data,
    }: {
      expenseId: string;
      data: {
        paid_by: string;
        payment_method: string;
        reference_number?: string;
      };
    }) =>
      apiService.patch(`${basePath(pid)}/expenses/${expenseId}/pay`, data),
    onSuccess: () => {
      toast.success("Dépense payée");
      qc.invalidateQueries({ queryKey: ["expenses", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useRejectExpense() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      expenseId,
      rejectedBy,
      reason,
    }: {
      expenseId: string;
      rejectedBy: string;
      reason: string;
    }) =>
      apiService.patch(`${basePath(pid)}/expenses/${expenseId}/reject`, {
        rejected_by: rejectedBy,
        reason,
      }),
    onSuccess: () => {
      toast.success("Dépense rejetée");
      qc.invalidateQueries({ queryKey: ["expenses", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteExpense() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (expenseId: string) =>
      apiService.delete(`${basePath(pid)}/expenses/${expenseId}`),
    onSuccess: () => {
      toast.success("Dépense supprimée");
      qc.invalidateQueries({ queryKey: ["expenses", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// ═══════════════════════════════════════════════════════════
// BUDGETS
// ═══════════════════════════════════════════════════════════

export function useBudgets() {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["budgets", pid],
    queryFn: () => apiService.get(`${basePath(pid)}/budgets`),
    enabled: !!pid,
  });
}

export function useBudgetById(id: string) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["budget", pid, id],
    queryFn: () => apiService.get(`${basePath(pid)}/budgets/${id}`),
    enabled: !!pid && !!id,
  });
}

export function useCreateBudget() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiService.post(`${basePath(pid)}/budgets`, data),
    onSuccess: () => {
      toast.success("Budget créé");
      qc.invalidateQueries({ queryKey: ["budgets", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateBudget() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Record<string, unknown>;
    }) => apiService.patch(`${basePath(pid)}/budgets/${id}`, data),
    onSuccess: () => {
      toast.success("Budget mis à jour");
      qc.invalidateQueries({ queryKey: ["budgets", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateBudgetActuals() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      budgetId,
      actualAmount,
    }: {
      budgetId: string;
      actualAmount: string;
    }) =>
      apiService.patch(`${basePath(pid)}/budgets/${budgetId}/actuals`, {
        actual_amount: actualAmount,
      }),
    onSuccess: () => {
      toast.success("Réalisé mis à jour");
      qc.invalidateQueries({ queryKey: ["budgets", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteBudget() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (budgetId: string) =>
      apiService.delete(`${basePath(pid)}/budgets/${budgetId}`),
    onSuccess: () => {
      toast.success("Budget supprimé");
      qc.invalidateQueries({ queryKey: ["budgets", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// ═══════════════════════════════════════════════════════════
// BANK ACCOUNTS
// ═══════════════════════════════════════════════════════════

export function useBankAccounts() {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["bank-accounts", pid],
    queryFn: () => apiService.get(`${basePath(pid)}/bank-accounts`),
    enabled: !!pid,
  });
}

export function useBankAccountById(id: string) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["bank-account", pid, id],
    queryFn: () => apiService.get(`${basePath(pid)}/bank-accounts/${id}`),
    enabled: !!pid && !!id,
  });
}

export function useBankAccountTransactions(accountId: string) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["bank-account-transactions", pid, accountId],
    queryFn: () =>
      apiService.get(
        `${basePath(pid)}/bank-accounts/${accountId}/transactions`,
      ),
    enabled: !!pid && !!accountId,
  });
}

export function useCreateBankAccount() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiService.post(`${basePath(pid)}/bank-accounts`, data),
    onSuccess: () => {
      toast.success("Compte bancaire créé");
      qc.invalidateQueries({ queryKey: ["bank-accounts", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateBankAccount() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Record<string, unknown>;
    }) => apiService.patch(`${basePath(pid)}/bank-accounts/${id}`, data),
    onSuccess: () => {
      toast.success("Compte bancaire mis à jour");
      qc.invalidateQueries({ queryKey: ["bank-accounts", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteBankAccount() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (accountId: string) =>
      apiService.delete(`${basePath(pid)}/bank-accounts/${accountId}`),
    onSuccess: () => {
      toast.success("Compte bancaire supprimé");
      qc.invalidateQueries({ queryKey: ["bank-accounts", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// ─── Bank Transactions ───────────────────────────────────

export function useRecordBankTransaction() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiService.post(`${basePath(pid)}/bank-transactions`, data),
    onSuccess: () => {
      toast.success("Transaction bancaire enregistrée");
      qc.invalidateQueries({ queryKey: ["bank-account-transactions", pid] });
      qc.invalidateQueries({ queryKey: ["bank-accounts", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useReconcileBankTransaction() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (transactionId: string) =>
      apiService.patch(
        `${basePath(pid)}/bank-transactions/${transactionId}/reconcile`,
        {},
      ),
    onSuccess: () => {
      toast.success("Transaction rapprochée");
      qc.invalidateQueries({ queryKey: ["bank-account-transactions", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useStartBankReconciliation() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      accountId,
      statementDate,
      statementBalance,
    }: {
      accountId: string;
      statementDate: string;
      statementBalance: string;
    }) =>
      apiService.post(
        `${basePath(pid)}/bank-accounts/${accountId}/reconciliation/start`,
        {
          statement_date: statementDate,
          statement_balance: statementBalance,
        },
      ),
    onSuccess: () => {
      toast.success("Rapprochement bancaire démarré");
      qc.invalidateQueries({ queryKey: ["bank-account-transactions", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useReconcileTransactions() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (transactionIds: string[]) =>
      apiService.post(`${basePath(pid)}/bank-reconciliation/reconcile`, {
        transaction_ids: transactionIds,
      }),
    onSuccess: () => {
      toast.success("Transactions rapprochées");
      qc.invalidateQueries({ queryKey: ["bank-account-transactions", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// ═══════════════════════════════════════════════════════════
// FINANCIAL PERIODS
// ═══════════════════════════════════════════════════════════

export function useFinancialPeriods() {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["financial-periods", pid],
    queryFn: () => apiService.get(`${basePath(pid)}/financial-periods`),
    enabled: !!pid,
  });
}

export function useFinancialPeriodById(id: string) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["financial-period", pid, id],
    queryFn: () =>
      apiService.get(`${basePath(pid)}/financial-periods/${id}`),
    enabled: !!pid && !!id,
  });
}

export function useCreateFinancialPeriod() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiService.post(`${basePath(pid)}/financial-periods`, data),
    onSuccess: () => {
      toast.success("Période fiscale créée");
      qc.invalidateQueries({ queryKey: ["financial-periods", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useCloseFinancialPeriod() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      periodId,
      closedBy,
    }: {
      periodId: string;
      closedBy: string;
    }) =>
      apiService.patch(
        `${basePath(pid)}/financial-periods/${periodId}/close`,
        { closed_by: closedBy },
      ),
    onSuccess: () => {
      toast.success("Période fiscale clôturée");
      qc.invalidateQueries({ queryKey: ["financial-periods", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useLockFinancialPeriod() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (periodId: string) =>
      apiService.patch(
        `${basePath(pid)}/financial-periods/${periodId}/lock`,
        {},
      ),
    onSuccess: () => {
      toast.success("Période fiscale verrouillée");
      qc.invalidateQueries({ queryKey: ["financial-periods", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useSetCurrentFinancialPeriod() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (periodId: string) =>
      apiService.patch(
        `${basePath(pid)}/financial-periods/${periodId}/set-current`,
        {},
      ),
    onSuccess: () => {
      toast.success("Période courante définie");
      qc.invalidateQueries({ queryKey: ["financial-periods", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// ═══════════════════════════════════════════════════════════
// TAX RATES
// ═══════════════════════════════════════════════════════════

export function useTaxRates() {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["tax-rates", pid],
    queryFn: () => apiService.get(`${basePath(pid)}/tax-rates`),
    enabled: !!pid,
  });
}

export function useTaxRateById(id: string) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["tax-rate", pid, id],
    queryFn: () => apiService.get(`${basePath(pid)}/tax-rates/${id}`),
    enabled: !!pid && !!id,
  });
}

export function useCreateTaxRate() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiService.post(`${basePath(pid)}/tax-rates`, data),
    onSuccess: () => {
      toast.success("Taux de taxe créé");
      qc.invalidateQueries({ queryKey: ["tax-rates", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateTaxRate() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Record<string, unknown>;
    }) => apiService.patch(`${basePath(pid)}/tax-rates/${id}`, data),
    onSuccess: () => {
      toast.success("Taux de taxe mis à jour");
      qc.invalidateQueries({ queryKey: ["tax-rates", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeactivateTaxRate() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (taxId: string) =>
      apiService.delete(`${basePath(pid)}/tax-rates/${taxId}`),
    onSuccess: () => {
      toast.success("Taux de taxe désactivé");
      qc.invalidateQueries({ queryKey: ["tax-rates", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useCalculateTax() {
  const pid = usePharmacyId();
  return useMutation({
    mutationFn: (data: { tax_rate_id: string; amount: string }) =>
      apiService.post(`${basePath(pid)}/tax-calculate`, data),
    onError: (err: Error) => toast.error(err.message),
  });
}

// ═══════════════════════════════════════════════════════════
// SUPPLIERS (Accounting context)
// ═══════════════════════════════════════════════════════════

export function useAccountingSuppliers() {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["accounting-suppliers", pid],
    queryFn: () => apiService.get(`${basePath(pid)}/suppliers`),
    enabled: !!pid,
  });
}

export function useAccountingSupplierById(id: string) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["accounting-supplier", pid, id],
    queryFn: () => apiService.get(`${basePath(pid)}/suppliers/${id}`),
    enabled: !!pid && !!id,
  });
}

export function useCreateAccountingSupplier() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiService.post(`${basePath(pid)}/suppliers`, data),
    onSuccess: () => {
      toast.success("Fournisseur créé");
      qc.invalidateQueries({ queryKey: ["accounting-suppliers", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateAccountingSupplier() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Record<string, unknown>;
    }) => apiService.patch(`${basePath(pid)}/suppliers/${id}`, data),
    onSuccess: () => {
      toast.success("Fournisseur mis à jour");
      qc.invalidateQueries({ queryKey: ["accounting-suppliers", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteAccountingSupplier() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (supplierId: string) =>
      apiService.delete(`${basePath(pid)}/suppliers/${supplierId}`),
    onSuccess: () => {
      toast.success("Fournisseur supprimé");
      qc.invalidateQueries({ queryKey: ["accounting-suppliers", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// ═══════════════════════════════════════════════════════════
// RECURRING TRANSACTIONS
// ═══════════════════════════════════════════════════════════

export function useRecurringTransactions() {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["recurring-transactions", pid],
    queryFn: () =>
      apiService.get(`${basePath(pid)}/recurring-transactions`),
    enabled: !!pid,
  });
}

export function useCreateRecurringTransaction() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiService.post(`${basePath(pid)}/recurring-transactions`, data),
    onSuccess: () => {
      toast.success("Transaction récurrente créée");
      qc.invalidateQueries({ queryKey: ["recurring-transactions", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useExecuteRecurringTransactions() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiService.post(
        `${basePath(pid)}/recurring-transactions/execute`,
        {},
      ),
    onSuccess: () => {
      toast.success("Transactions récurrentes exécutées");
      qc.invalidateQueries({ queryKey: ["recurring-transactions", pid] });
      qc.invalidateQueries({ queryKey: ["transactions", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// ═══════════════════════════════════════════════════════════
// ADJUSTMENT ENTRIES
// ═══════════════════════════════════════════════════════════

export function usePostAdjustmentEntry() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      entries: Array<{
        accountCode: string;
        amount: string;
        type: "debit" | "credit";
        description: string;
        reason: string;
      }>;
      reason: string;
    }) => apiService.post(`${basePath(pid)}/adjustment-entries`, body),
    onSuccess: () => {
      toast.success("Écritures d'ajustement enregistrées");
      qc.invalidateQueries({ queryKey: ["transactions", pid] });
      qc.invalidateQueries({ queryKey: ["accounts", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// ═══════════════════════════════════════════════════════════
// FINANCIAL REPORTS
// ═══════════════════════════════════════════════════════════

export function useTrialBalance(params?: {
  periodId?: string;
  startDate?: string;
  endDate?: string;
}) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["trial-balance", pid, params],
    queryFn: () =>
      apiService.get(`${basePath(pid)}/reports/trial-balance`, { params }),
    enabled: !!pid,
  });
}

export function useBalanceSheet(params?: { asOfDate?: string }) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["balance-sheet", pid, params],
    queryFn: () =>
      apiService.get(`${basePath(pid)}/reports/balance-sheet`, { params }),
    enabled: !!pid,
  });
}

export function useIncomeStatement(params?: {
  startDate?: string;
  endDate?: string;
}) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["income-statement", pid, params],
    queryFn: () =>
      apiService.get(`${basePath(pid)}/reports/income-statement`, { params }),
    enabled: !!pid,
  });
}

export function useCashFlowReport(params: {
  startDate: string;
  endDate: string;
}) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["cash-flow", pid, params],
    queryFn: () =>
      apiService.get(`${basePath(pid)}/reports/cash-flow`, { params }),
    enabled: !!pid && !!params.startDate && !!params.endDate,
  });
}

export function useBudgetVarianceReport() {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["budget-variance", pid],
    queryFn: () =>
      apiService.get(`${basePath(pid)}/reports/budget-variance`),
    enabled: !!pid,
  });
}

export function useAccountsPayableAging() {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["accounts-payable-aging", pid],
    queryFn: () =>
      apiService.get(`${basePath(pid)}/reports/accounts-payable-aging`),
    enabled: !!pid,
  });
}

export function useAccountsReceivableAging() {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["accounts-receivable-aging", pid],
    queryFn: () =>
      apiService.get(
        `${basePath(pid)}/reports/accounts-receivable-aging`,
      ),
    enabled: !!pid,
  });
}

export function useDepartmentReport() {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["department-report", pid],
    queryFn: () =>
      apiService.get(`${basePath(pid)}/reports/department`),
    enabled: !!pid,
  });
}

// ═══════════════════════════════════════════════════════════
// RECONCILIATION
// ═══════════════════════════════════════════════════════════

export function useStockValuationReconciliation() {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["reconciliation-stock-valuation", pid],
    queryFn: () =>
      apiService.get(`${basePath(pid)}/reconciliation/stock-valuation`),
    enabled: !!pid,
  });
}

export function useReconcileStock() {
  const pid = usePharmacyId();
  return useMutation({
    mutationFn: (physicalStockValue: string) =>
      apiService.post(`${basePath(pid)}/reconciliation/stock`, {
        physicalStockValue,
      }),
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useReceivablesReconciliation() {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["reconciliation-receivables", pid],
    queryFn: () =>
      apiService.get(`${basePath(pid)}/reconciliation/receivables`),
    enabled: !!pid,
  });
}

export function useSalesToInvoicesReconciliation() {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["reconciliation-sales-invoices", pid],
    queryFn: () =>
      apiService.get(`${basePath(pid)}/reconciliation/sales-to-invoices`),
    enabled: !!pid,
  });
}
