import { z } from "zod";

const accountTypeEnum = z.enum(["asset", "liability", "equity", "revenue", "expense"]);
const subTypeEnum = z.enum(["current", "non_current"]);
const normalBalanceEnum = z.enum(["debit", "credit"]);
const transactionTypeEnum = z.enum(["debit", "credit"]);
const budgetStatusEnum = z.enum(["active", "inactive", "completed"]);
const recurringFrequencyEnum = z.enum(["monthly", "quarterly", "yearly"]);
const bankAccountTypeEnum = z.enum(["checking", "savings", "credit", "loan"]);

export const createAccountSchema = z.object({
  account_code: z.string().min(1, "Le code comptable est requis"),
  account_name: z.string().min(1, "Le nom du compte est requis"),
  account_type: accountTypeEnum,
  sub_type: subTypeEnum.optional(),
  description: z.string().optional(),
  normal_balance: normalBalanceEnum,
  parent_account_id: z.string().optional(),
  tax_settings: z.record(z.unknown()).optional(),
});

export type CreateAccountFormData = z.infer<typeof createAccountSchema>;

export const createTransactionSchema = z.object({
  account_id: z.string().min(1, "Le compte est requis"),
  amount: z.string().min(1, "Le montant est requis"),
  type: transactionTypeEnum,
  description: z.string().min(1, "La description est requise"),
  reference_number: z.string().optional(),
  transaction_date: z.string().optional(),
});

export type CreateTransactionFormData = z.infer<typeof createTransactionSchema>;

const journalEntryLineSchema = z.object({
  account_id: z.string().min(1, "Le compte est requis"),
  debit: z.string().optional(),
  credit: z.string().optional(),
  description: z.string().min(1, "La description est requise"),
});

export const journalEntrySchema = z.object({
  date: z.string().min(1, "La date est requise"),
  description: z.string().min(1, "La description est requise"),
  reference: z.string().optional(),
  lines: z.array(journalEntryLineSchema).min(2, "Au moins deux lignes d'écriture sont requises"),
});

export type JournalEntryFormData = z.infer<typeof journalEntrySchema>;

export const createInvoiceSchema = z.object({
  description: z.string().min(1, "La description est requise"),
  amount: z.string().min(1, "Le montant est requis"),
  dueDate: z.string().min(1, "La date d'échéance est requise"),
  customerId: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateInvoiceFormData = z.infer<typeof createInvoiceSchema>;

export const createExpenseSchema = z.object({
  expense_date: z.string().min(1, "La date est requise"),
  category: z.string().min(1, "La catégorie est requise"),
  amount: z.string().min(1, "Le montant est requis"),
  description: z.string().min(1, "La description est requise"),
  vendor_name: z.string().optional(),
  receipt_url: z.string().url("URL de reçu invalide").optional().or(z.literal("")),
  is_recurring: z.boolean().optional(),
  recurring_frequency: recurringFrequencyEnum.optional(),
  notes: z.string().optional(),
  account_id: z.string().optional(),
});

export type CreateExpenseFormData = z.infer<typeof createExpenseSchema>;

export const createBudgetSchema = z.object({
  name: z.string().min(1, "Le nom du budget est requis"),
  category: z.string().min(1, "La catégorie est requise"),
  period_start: z.string().min(1, "La date de début est requise"),
  period_end: z.string().min(1, "La date de fin est requise"),
  budget_amount: z.string().min(1, "Le montant budgété est requis"),
  department_id: z.string().optional(),
  manager_id: z.string().optional(),
  notes: z.string().optional(),
  status: budgetStatusEnum.optional(),
});

export type CreateBudgetFormData = z.infer<typeof createBudgetSchema>;

export const createBankAccountSchema = z.object({
  account_name: z.string().min(1, "Le nom du compte est requis"),
  account_number: z.string().min(1, "Le numéro de compte est requis"),
  bank_name: z.string().min(1, "Le nom de la banque est requis"),
  routing_number: z.string().optional(),
  account_type: bankAccountTypeEnum,
  is_primary: z.boolean().optional(),
  notes: z.string().optional(),
});

export type CreateBankAccountFormData = z.infer<typeof createBankAccountSchema>;
