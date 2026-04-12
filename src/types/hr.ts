/**
 * Types RH — alignés backend business-logic/hr (hr.entities.ts, dto/*.ts)
 * Base path API: pharmacies/:pharmacyId/hr
 */

export type ContractType = "cdi" | "cdd" | "interim" | "apprenticeship" | "internship" | "freelance";
export type EmploymentStatus = "active" | "on_leave" | "suspended" | "terminated" | "retired";
export type SalaryFrequency = "hourly" | "daily" | "weekly" | "biweekly" | "monthly" | "annual";
export type ShiftType = "regular" | "overtime" | "night" | "weekend" | "holiday" | "on_call";
export type ShiftStatus = "scheduled" | "confirmed" | "in_progress" | "completed" | "cancelled" | "no_show";
export type AttendanceStatus = "present" | "absent" | "late" | "half_day" | "remote" | "holiday" | "sick";
export type LeaveType = "annual" | "sick" | "maternity" | "paternity" | "unpaid" | "bereavement" | "training" | "compensatory" | "other";
export type LeaveStatus = "pending" | "approved" | "rejected" | "cancelled" | "revoked";
export type PayrollRunStatus = "draft" | "calculated" | "approved" | "paid" | "cancelled";
export type EvaluationType = "annual" | "probation" | "mid_year" | "project" | "promotion" | "disciplinary";
export type EvaluationStatus = "draft" | "submitted" | "employee_reviewed" | "finalized" | "archived";

export interface AddressDto {
  street?: string;
  city?: string;
  postal_code?: string;
  country?: string;
}

export interface BankDetailsDto {
  iban?: string;
  bic?: string;
  bank_name?: string;
}

export interface QualificationDto {
  title: string;
  institution?: string;
  obtained_at?: string;
}

export interface Employee {
  id: string;
  pharmacy_id?: string;
  user_id?: string;
  employee_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  gender?: "M" | "F" | "OTHER";
  national_id?: string;
  social_security_number?: string;
  address?: AddressDto;
  job_title: string;
  department?: string;
  contract_type: ContractType;
  contract_start_date: string;
  contract_end_date?: string;
  probation_end_date?: string;
  weekly_hours: number;
  employment_status: EmploymentStatus;
  base_salary: number;
  salary_currency?: string;
  salary_frequency?: SalaryFrequency;
  bank_details?: BankDetailsDto;
  qualifications?: QualificationDto[];
  certifications?: string[];
  license_number?: string;
  license_expiry_date?: string;
  annual_leave_balance?: number;
  sick_leave_balance?: number;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  terminated_at?: string;
  termination_reason?: string;
}

export interface CreateEmployeeDto {
  user_id?: string;
  employee_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  gender?: "M" | "F" | "OTHER";
  national_id?: string;
  social_security_number?: string;
  address?: AddressDto;
  job_title: string;
  department?: string;
  contract_type: ContractType;
  contract_start_date: string;
  contract_end_date?: string;
  probation_end_date?: string;
  weekly_hours: number;
  employment_status?: EmploymentStatus;
  base_salary: number;
  salary_currency?: string;
  salary_frequency?: SalaryFrequency;
  bank_details?: BankDetailsDto;
  qualifications?: QualificationDto[];
  certifications?: string[];
  license_number?: string;
  license_expiry_date?: string;
  annual_leave_balance?: number;
  sick_leave_balance?: number;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  notes?: string;
}

export interface Shift {
  id: string;
  pharmacy_id?: string;
  employee_id: string;
  shift_date: string;
  start_time: string;
  end_time: string;
  break_duration_minutes?: number;
  shift_type?: ShiftType;
  status?: ShiftStatus;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateShiftDto {
  employee_id: string;
  shift_date: string;
  start_time: string;
  end_time: string;
  break_duration_minutes?: number;
  shift_type?: ShiftType;
  status?: ShiftStatus;
  notes?: string;
}

export interface Attendance {
  id: string;
  pharmacy_id?: string;
  employee_id: string;
  shift_id?: string;
  attendance_date: string;
  clock_in?: string;
  clock_out?: string;
  actual_hours?: number;
  overtime_hours?: number;
  status: AttendanceStatus;
  late_minutes?: number;
  early_departure_minutes?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Leave {
  id: string;
  pharmacy_id?: string;
  employee_id: string;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  total_days: number;
  half_day?: boolean;
  reason?: string;
  status: LeaveStatus;
  requested_at?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  review_comment?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateLeaveDto {
  employee_id: string;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  total_days: number;
  half_day?: boolean;
  reason?: string;
}

export interface PayrollRun {
  id: string;
  pharmacy_id?: string;
  period_start: string;
  period_end: string;
  run_date?: string;
  status: PayrollRunStatus;
  total_gross?: number;
  total_deductions?: number;
  total_net?: number;
  total_employer_charges?: number;
  employee_count?: number;
  currency?: string;
  notes?: string;
  approved_by?: string;
  approved_at?: string;
  paid_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Payslip {
  id: string;
  pharmacy_id?: string;
  payroll_run_id: string;
  employee_id: string;
  period_start: string;
  period_end: string;
  base_salary: number;
  gross_salary: number;
  net_salary: number;
  currency?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Evaluation {
  id: string;
  pharmacy_id?: string;
  employee_id: string;
  evaluator_id: string;
  evaluation_period_start: string;
  evaluation_period_end: string;
  evaluation_type?: EvaluationType;
  overall_rating?: number;
  criteria?: Record<string, unknown>[];
  strengths?: string;
  areas_for_improvement?: string;
  goals?: Record<string, unknown>[];
  employee_comments?: string;
  manager_comments?: string;
  status: EvaluationStatus;
  created_at?: string;
  updated_at?: string;
}

export interface CreateEvaluationDto {
  employee_id: string;
  evaluator_id: string;
  evaluation_period_start: string;
  evaluation_period_end: string;
  evaluation_type?: EvaluationType;
  overall_rating?: number;
  criteria?: { name: string; rating?: number; comment?: string; weight?: number }[];
  strengths?: string;
  areas_for_improvement?: string;
  goals?: { title: string; description?: string; target_date?: string; status?: string }[];
  employee_comments?: string;
  manager_comments?: string;
}

export interface HrDashboardDto {
  employees: { total: number; active: number; on_leave: number };
  attendance_this_month?: { present: number; absent: number; late: number; sick: number; remote: number };
  pending_leave_requests?: number;
}

export interface LeaveBalanceDto {
  annual: { total: number; used: number; remaining: number };
  sick: { total: number; used: number; remaining: number };
  total_used: number;
}

export interface EmployeeStatsDto {
  total: number;
  active: number;
  on_leave: number;
}

export const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  cdi: "CDI",
  cdd: "CDD",
  interim: "Intérim",
  apprenticeship: "Apprentissage",
  internship: "Stage",
  freelance: "Freelance",
};

export const EMPLOYMENT_STATUS_LABELS: Record<EmploymentStatus, string> = {
  active: "Actif",
  on_leave: "En congé",
  suspended: "Suspendu",
  terminated: "Terminé",
  retired: "Retraité",
};

export const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  annual: "Congés annuels",
  sick: "Maladie",
  maternity: "Maternité",
  paternity: "Paternité",
  unpaid: "Sans solde",
  bereavement: "Décès",
  training: "Formation",
  compensatory: "Récupération",
  other: "Autre",
};

export const LEAVE_STATUS_LABELS: Record<LeaveStatus, string> = {
  pending: "En attente",
  approved: "Approuvé",
  rejected: "Refusé",
  cancelled: "Annulé",
  revoked: "Révoqué",
};

export const PAYROLL_RUN_STATUS_LABELS: Record<PayrollRunStatus, string> = {
  draft: "Brouillon",
  calculated: "Calculé",
  approved: "Approuvé",
  paid: "Payé",
  cancelled: "Annulé",
};

export const EVALUATION_STATUS_LABELS: Record<EvaluationStatus, string> = {
  draft: "Brouillon",
  submitted: "Soumis",
  employee_reviewed: "Vu par l'employé",
  finalized: "Finalisé",
  archived: "Archivé",
};
