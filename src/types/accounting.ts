/**
 * Types Comptabilité — Alignés avec le backend
 * Source: src/business-logic/accounting/entities/ + dto/
 */

export type AccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
export type SubType = 'current' | 'non_current';
export type NormalBalance = 'debit' | 'credit';
export type TransactionType = 'debit' | 'credit';
export type TransactionStatus = 'pending' | 'posted' | 'reversed';
export type BudgetStatus = 'active' | 'inactive' | 'completed';
export type PeriodType = 'monthly' | 'quarterly' | 'yearly';
export type PeriodStatus = 'open' | 'closed' | 'locked';
export type ExpenseStatus = 'pending' | 'approved' | 'paid' | 'rejected';
export type RecurringFrequency = 'monthly' | 'quarterly' | 'yearly';
export type BankAccountType = 'checking' | 'savings' | 'credit' | 'loan';
export type BankTransactionType = 'debit' | 'credit';
export type BankTransactionStatus = 'pending' | 'cleared' | 'reconciled';

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  asset: 'Actif',
  liability: 'Passif',
  equity: 'Capitaux propres',
  revenue: 'Produit',
  expense: 'Charge',
};

export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
  pending: 'En attente',
  posted: 'Comptabilisé',
  reversed: 'Contrepassé',
};

export const BUDGET_STATUS_LABELS: Record<BudgetStatus, string> = {
  active: 'Actif',
  inactive: 'Inactif',
  completed: 'Terminé',
};

export const PERIOD_STATUS_LABELS: Record<PeriodStatus, string> = {
  open: 'Ouvert',
  closed: 'Clôturé',
  locked: 'Verrouillé',
};

export const EXPENSE_STATUS_LABELS: Record<ExpenseStatus, string> = {
  pending: 'En attente',
  approved: 'Approuvé',
  paid: 'Payé',
  rejected: 'Rejeté',
};

// ─── Entities ───

export interface Account {
  id: string;
  created_at: string;
  updated_at: string;
  pharmacy_id: string;
  account_code: string;
  account_name: string;
  account_type: AccountType;
  sub_type?: SubType;
  description?: string;
  balance: string;
  normal_balance: NormalBalance;
  is_active: boolean;
  parent_account_id?: string;
  tax_settings?: Record<string, unknown>;
}

export interface Transaction {
  id: string;
  created_at: string;
  updated_at: string;
  pharmacy_id: string;
  transaction_number: string;
  account_id: string;
  transaction_date: string;
  type: TransactionType;
  amount: string;
  description: string;
  reference_number?: string;
  reference_type?: string;
  reference_id?: string;
  status: TransactionStatus;
  created_by?: string;
  approved_by?: string;
  approved_at?: string;
  metadata?: Record<string, unknown>;
}

export interface Budget {
  id: string;
  created_at: string;
  updated_at: string;
  pharmacy_id: string;
  name: string;
  category: string;
  period_start: string;
  period_end: string;
  budget_amount: string;
  actual_amount: string;
  variance_amount: string;
  variance_percentage: string;
  status: BudgetStatus;
  department_id?: string;
  manager_id?: string;
  notes?: string;
  monthly_breakdown?: Record<string, unknown>;
}

export interface FinancialPeriod {
  id: string;
  created_at: string;
  updated_at: string;
  pharmacy_id: string;
  name: string;
  start_date: string;
  end_date: string;
  period_type: PeriodType;
  status: PeriodStatus;
  is_current: boolean;
  closed_date?: string;
  closed_by?: string;
}

export interface Expense {
  id: string;
  created_at: string;
  updated_at: string;
  pharmacy_id: string;
  expense_number: string;
  category: string;
  description: string;
  amount: string;
  expense_date: string;
  vendor_name?: string;
  receipt_url?: string;
  status: ExpenseStatus;
  submitted_by?: string;
  approved_by?: string;
  approved_at?: string;
  notes?: string;
  is_recurring: boolean;
  recurring_frequency?: RecurringFrequency;
}

export interface BankAccount {
  id: string;
  created_at: string;
  updated_at: string;
  pharmacy_id: string;
  account_name: string;
  account_number: string;
  bank_name: string;
  routing_number?: string;
  account_type: BankAccountType;
  current_balance: string;
  available_balance: string;
  is_active: boolean;
  is_primary: boolean;
  last_reconcile_date?: string;
  notes?: string;
}

export interface BankTransaction {
  id: string;
  created_at: string;
  pharmacy_id: string;
  bank_account_id: string;
  transaction_date: string;
  type: BankTransactionType;
  amount: string;
  description: string;
  reference_number?: string;
  payee?: string;
  status: BankTransactionStatus;
  is_reconciled: boolean;
  reconciled_date?: string;
  category?: string;
  metadata?: Record<string, unknown>;
}

// ─── Create / Update DTOs ───

export interface CreateAccountDto {
  account_code: string;
  account_name: string;
  account_type: AccountType;
  sub_type?: SubType;
  description?: string;
  normal_balance: NormalBalance;
  parent_account_id?: string;
  tax_settings?: Record<string, unknown>;
}

export type UpdateAccountDto = Partial<CreateAccountDto> & {
  is_active?: boolean;
};

export interface CreateTransactionDto {
  account_id: string;
  amount: string;
  type: TransactionType;
  description: string;
  reference_number?: string;
  transaction_date?: string;
}

export interface JournalEntryLineDto {
  account_id: string;
  debit?: string;
  credit?: string;
  description: string;
}

export interface CreateBudgetDto {
  name: string;
  category: string;
  period_start: string;
  period_end: string;
  budget_amount: string;
  department_id?: string;
  manager_id?: string;
  notes?: string;
  status?: BudgetStatus;
}

export type UpdateBudgetDto = Partial<CreateBudgetDto>;

export interface CreateExpenseDto {
  expense_date: string;
  category: string;
  amount: string;
  description: string;
  vendor_name?: string;
  receipt_url?: string;
  is_recurring?: boolean;
  recurring_frequency?: RecurringFrequency;
  notes?: string;
  account_id?: string;
}

export type UpdateExpenseDto = Partial<CreateExpenseDto> & {
  status?: ExpenseStatus;
};

export interface CreateBankAccountDto {
  account_name: string;
  account_number: string;
  bank_name: string;
  routing_number?: string;
  account_type: BankAccountType;
  is_primary?: boolean;
  notes?: string;
}

export type UpdateBankAccountDto = Partial<CreateBankAccountDto> & {
  is_active?: boolean;
};

// ─── Financial Reports ───

export interface AccountSummary {
  accountCode: string;
  accountName: string;
  balance: number;
}

export interface BalanceSheet {
  asOfDate: string;
  assets: { accounts: AccountSummary[]; total: number };
  liabilities: { accounts: AccountSummary[]; total: number };
  equity: { accounts: AccountSummary[]; total: number };
  totalLiabilitiesAndEquity: number;
  isBalanced: boolean;
  generatedAt: string;
}

export interface IncomeStatement {
  period: { startDate: string; endDate: string };
  revenue: { accounts: AccountSummary[]; total: number };
  expenses: { accounts: AccountSummary[]; total: number };
  netIncome: number;
  generatedAt: string;
}

export interface TrialBalanceAccount {
  accountCode: string;
  accountName: string;
  accountType: string;
  debitBalance: number;
  creditBalance: number;
}

export interface TrialBalance {
  accounts: TrialBalanceAccount[];
  totalDebits: number;
  totalCredits: number;
  isBalanced: boolean;
  generatedAt: string;
}

// ─── Accounting Invoices (factures comptables) ───

export interface AccountingInvoiceItem {
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate?: number;
  product_id?: string;
}

export interface AccountingInvoice {
  id: string;
  created_at: string;
  updated_at: string;
  pharmacy_id: string;
  customer_id: string;
  customer_name?: string;
  customer_address?: string;
  invoice_date: string;
  due_date: string;
  subtotal?: number;
  tax_amount?: number;
  discount_amount?: number;
  total_amount: number;
  status?: string;
  notes?: string;
  terms?: string;
  items?: AccountingInvoiceItem[];
}

export interface CreateAccountingInvoiceDto {
  customer_id: string;
  customer_name?: string;
  customer_address?: string;
  invoice_date: string;
  due_date: string;
  subtotal?: number;
  tax_amount?: number;
  discount_amount?: number;
  total_amount: number;
  notes?: string;
  terms?: string;
  items: AccountingInvoiceItem[];
}

// ─── Query Params ───

export interface AccountQueryParams {
  account_type?: AccountType;
  is_active?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface TransactionQueryParams {
  account_id?: string;
  status?: TransactionStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface BalanceSheetQueryParams {
  asOfDate?: string;
}

export interface IncomeStatementQueryParams {
  startDate: string;
  endDate: string;
}

export interface TrialBalanceQueryParams {
  asOfDate?: string;
}
