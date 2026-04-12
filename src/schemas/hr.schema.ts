import { z } from "zod";

const contractTypeEnum = z.enum(["cdi", "cdd", "interim", "apprenticeship", "internship", "freelance"]);
const employmentStatusEnum = z.enum(["active", "on_leave", "suspended", "terminated", "retired"]);
const salaryFrequencyEnum = z.enum(["hourly", "daily", "weekly", "biweekly", "monthly", "annual"]);
const genderEnum = z.enum(["M", "F", "OTHER"]);
const addressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
});
const bankDetailsSchema = z.object({
  iban: z.string().optional(),
  bic: z.string().optional(),
  bank_name: z.string().optional(),
});
const qualificationSchema = z.object({
  title: z.string().min(1),
  institution: z.string().optional(),
  obtained_at: z.string().optional(),
});

export const createEmployeeSchema = z.object({
  employee_number: z.string().min(1, "Matricule requis"),
  first_name: z.string().min(1, "Prénom requis"),
  last_name: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  date_of_birth: z.string().optional(),
  gender: genderEnum.optional(),
  national_id: z.string().optional(),
  social_security_number: z.string().optional(),
  address: addressSchema.optional(),
  job_title: z.string().min(1, "Poste requis"),
  department: z.string().optional(),
  contract_type: contractTypeEnum,
  contract_start_date: z.string().min(1, "Date de début requise"),
  contract_end_date: z.string().optional(),
  probation_end_date: z.string().optional(),
  weekly_hours: z.number().min(0, "Heures hebdomadaires requises"),
  employment_status: employmentStatusEnum.optional(),
  base_salary: z.number().min(0, "Salaire requis"),
  salary_currency: z.string().optional(),
  salary_frequency: salaryFrequencyEnum.optional(),
  bank_details: bankDetailsSchema.optional(),
  qualifications: z.array(qualificationSchema).optional(),
  certifications: z.array(z.string()).optional(),
  license_number: z.string().optional(),
  license_expiry_date: z.string().optional(),
  annual_leave_balance: z.number().min(0).optional(),
  sick_leave_balance: z.number().min(0).optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  emergency_contact_relationship: z.string().optional(),
  notes: z.string().optional(),
});
export type CreateEmployeeFormData = z.infer<typeof createEmployeeSchema>;

const shiftTypeEnum = z.enum(["regular", "overtime", "night", "weekend", "holiday", "on_call"]);
const shiftStatusEnum = z.enum(["scheduled", "confirmed", "in_progress", "completed", "cancelled", "no_show"]);

export const createShiftSchema = z.object({
  employee_id: z.string().min(1, "Employé requis"),
  shift_date: z.string().min(1, "Date requise"),
  start_time: z.string().regex(/^\d{2}:\d{2}$/, "Format HH:mm"),
  end_time: z.string().regex(/^\d{2}:\d{2}$/, "Format HH:mm"),
  break_duration_minutes: z.number().min(0).optional(),
  shift_type: shiftTypeEnum.optional(),
  status: shiftStatusEnum.optional(),
  notes: z.string().optional(),
});
export type CreateShiftFormData = z.infer<typeof createShiftSchema>;

const leaveTypeEnum = z.enum([
  "annual",
  "sick",
  "maternity",
  "paternity",
  "unpaid",
  "bereavement",
  "training",
  "compensatory",
  "other",
]);

export const createLeaveSchema = z.object({
  employee_id: z.string().min(1, "Employé requis"),
  leave_type: leaveTypeEnum,
  start_date: z.string().min(1, "Date de début requise"),
  end_date: z.string().min(1, "Date de fin requise"),
  total_days: z.number().min(0.5, "Nombre de jours requis"),
  half_day: z.boolean().optional(),
  reason: z.string().optional(),
});
export type CreateLeaveFormData = z.infer<typeof createLeaveSchema>;

const evaluationTypeEnum = z.enum(["annual", "probation", "mid_year", "project", "promotion", "disciplinary"]);
const criterionSchema = z.object({
  name: z.string().min(1),
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().optional(),
  weight: z.number().min(0).optional(),
});
const goalSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  target_date: z.string().optional(),
  status: z.string().optional(),
});

export const createEvaluationSchema = z.object({
  employee_id: z.string().min(1, "Employé requis"),
  evaluator_id: z.string().min(1, "Évaluateur requis"),
  evaluation_period_start: z.string().min(1, "Début de période requis"),
  evaluation_period_end: z.string().min(1, "Fin de période requise"),
  evaluation_type: evaluationTypeEnum.optional(),
  overall_rating: z.number().min(1).max(5).optional(),
  criteria: z.array(criterionSchema).optional(),
  strengths: z.string().optional(),
  areas_for_improvement: z.string().optional(),
  goals: z.array(goalSchema).optional(),
  employee_comments: z.string().optional(),
  manager_comments: z.string().optional(),
});
export type CreateEvaluationFormData = z.infer<typeof createEvaluationSchema>;

export const terminateEmployeeSchema = z.object({
  reason: z.string().min(1, "Motif requis"),
});
export type TerminateEmployeeFormData = z.infer<typeof terminateEmployeeSchema>;

export const createPayrollRunSchema = z
  .object({
    period_start: z.string().min(1, "Début de période requis"),
    period_end: z.string().min(1, "Fin de période requise"),
  })
  .refine((data) => !data.period_start || !data.period_end || data.period_end >= data.period_start, {
    message: "La fin de période doit être après le début",
    path: ["period_end"],
  });
export type CreatePayrollRunFormData = z.infer<typeof createPayrollRunSchema>;
