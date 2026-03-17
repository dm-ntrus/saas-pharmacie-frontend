"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api.service";
import { useOrganization } from "@/context/OrganizationContext";
import { toast } from "react-hot-toast";
import type {
  Employee,
  Shift,
  Attendance,
  Leave,
  PayrollRun,
  Payslip,
  Evaluation,
  CreateEmployeeDto,
  CreateShiftDto,
  CreateLeaveDto,
  CreateEvaluationDto,
  HrDashboardDto,
  LeaveBalanceDto,
  EmployeeStatsDto,
} from "@/types/hr";

function usePharmacyId() {
  const { currentOrganization } = useOrganization();
  return currentOrganization?.id ?? "";
}

function basePath(pharmacyId: string) {
  return `/pharmacies/${pharmacyId}/hr`;
}

function buildQuery(params?: Record<string, string | number | boolean | undefined>) {
  if (!params) return "";
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "" && v !== null) search.set(k, String(v));
  });
  const q = search.toString();
  return q ? `?${q}` : "";
}

// ─── Dashboard ─────────────────────────────────────────────────────────────

export function useHrDashboard() {
  const pid = usePharmacyId();
  return useQuery<HrDashboardDto>({
    queryKey: ["hr-dashboard", pid],
    queryFn: () => apiService.get<HrDashboardDto>(`${basePath(pid)}/dashboard`),
    enabled: !!pid,
    staleTime: 60_000,
  });
}

// ─── Employees ───────────────────────────────────────────────────────────────

export function useEmployees(params?: Record<string, string | number | undefined>) {
  const pid = usePharmacyId();
  return useQuery<Employee[]>({
    queryKey: ["hr-employees", pid, params],
    queryFn: () => apiService.get<Employee[]>(`${basePath(pid)}/employees${buildQuery(params)}`),
    enabled: !!pid,
    staleTime: 30_000,
  });
}

export function useEmployeeSearch(q: string) {
  const pid = usePharmacyId();
  return useQuery<Employee[]>({
    queryKey: ["hr-employees-search", pid, q],
    queryFn: () => apiService.get<Employee[]>(`${basePath(pid)}/employees/search${buildQuery({ q })}`),
    enabled: !!pid && q.length >= 2,
    staleTime: 10_000,
  });
}

export function useEmployeeStats() {
  const pid = usePharmacyId();
  return useQuery<EmployeeStatsDto>({
    queryKey: ["hr-employee-stats", pid],
    queryFn: () => apiService.get<EmployeeStatsDto>(`${basePath(pid)}/employees/stats`),
    enabled: !!pid,
    staleTime: 60_000,
  });
}

export function useMyEmployeeProfile() {
  const pid = usePharmacyId();
  return useQuery<Employee>({
    queryKey: ["hr-employee-me", pid],
    queryFn: () => apiService.get<Employee>(`${basePath(pid)}/employees/me`),
    enabled: !!pid,
  });
}

export function useEmployeeById(id: string | null) {
  const pid = usePharmacyId();
  return useQuery<Employee>({
    queryKey: ["hr-employee", pid, id],
    queryFn: () => apiService.get<Employee>(`${basePath(pid)}/employees/${id}`),
    enabled: !!pid && !!id,
  });
}

export function useCreateEmployee() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateEmployeeDto) =>
      apiService.post<Employee>(`${basePath(pid)}/employees`, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["hr-employees", pid] });
      qc.invalidateQueries({ queryKey: ["hr-dashboard", pid] });
      qc.invalidateQueries({ queryKey: ["hr-employee-stats", pid] });
      toast.success("Employé créé");
    },
    onError: (err: unknown) =>
      toast.error((err as { message?: string })?.message ?? "Erreur"),
  });
}

export function useUpdateEmployee(id: string) {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: Partial<CreateEmployeeDto>) =>
      apiService.put<Employee>(`${basePath(pid)}/employees/${id}`, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["hr-employees", pid] });
      qc.invalidateQueries({ queryKey: ["hr-employee", pid, id] });
      qc.invalidateQueries({ queryKey: ["hr-dashboard", pid] });
      qc.invalidateQueries({ queryKey: ["hr-employee-stats", pid] });
      toast.success("Employé mis à jour");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useTerminateEmployee(id: string) {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (reason: string) =>
      apiService.post<Employee>(`${basePath(pid)}/employees/${id}/terminate`, { reason }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["hr-employees", pid] });
      qc.invalidateQueries({ queryKey: ["hr-employee", pid, id] });
      qc.invalidateQueries({ queryKey: ["hr-dashboard", pid] });
      qc.invalidateQueries({ queryKey: ["hr-employee-stats", pid] });
      toast.success("Contrat terminé");
    },
    onError: () => toast.error("Erreur"),
  });
}

// ─── Shifts ────────────────────────────────────────────────────────────────

export function useShiftSchedule(from: string, to: string, employeeId?: string) {
  const pid = usePharmacyId();
  return useQuery<Shift[]>({
    queryKey: ["hr-shifts-schedule", pid, from, to, employeeId],
    queryFn: () => {
      const url = employeeId
        ? `${basePath(pid)}/shifts/employee/${employeeId}${buildQuery({ from, to })}`
        : `${basePath(pid)}/shifts/schedule${buildQuery({ from, to })}`;
      return apiService.get<Shift[]>(url);
    },
    enabled: !!pid && !!from && !!to,
    staleTime: 30_000,
  });
}

export function useCreateShift() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateShiftDto) =>
      apiService.post<Shift>(`${basePath(pid)}/shifts`, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["hr-shifts-schedule", pid] });
      toast.success("Shift créé");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useUpdateShift(shiftId: string) {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: Partial<CreateShiftDto>) =>
      apiService.put<Shift>(`${basePath(pid)}/shifts/${shiftId}`, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["hr-shifts-schedule", pid] });
      toast.success("Shift mis à jour");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useDeleteShift() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (shiftId: string) =>
      apiService.delete(`${basePath(pid)}/shifts/${shiftId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["hr-shifts-schedule", pid] });
      toast.success("Shift supprimé");
    },
    onError: () => toast.error("Erreur"),
  });
}

// ─── Attendance ────────────────────────────────────────────────────────────

export function useClockIn() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: { employeeId: string; shiftId?: string }) =>
      apiService.post<Attendance>(`${basePath(pid)}/attendance/clock-in`, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["hr-attendance-daily", pid] });
      qc.invalidateQueries({ queryKey: ["hr-attendance-summary", pid] });
      qc.invalidateQueries({ queryKey: ["hr-dashboard", pid] });
      toast.success("Pointage enregistré");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useClockOut(attendanceId: string) {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiService.post<Attendance>(`${basePath(pid)}/attendance/${attendanceId}/clock-out`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["hr-attendance-daily", pid] });
      qc.invalidateQueries({ queryKey: ["hr-attendance-summary", pid] });
      qc.invalidateQueries({ queryKey: ["hr-dashboard", pid] });
      toast.success("Sortie enregistrée");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useDailyAttendance(date?: string) {
  const pid = usePharmacyId();
  const d = date ?? new Date().toISOString().slice(0, 10);
  return useQuery<Attendance[]>({
    queryKey: ["hr-attendance-daily", pid, d],
    queryFn: () =>
      apiService.get<Attendance[]>(`${basePath(pid)}/attendance/daily${buildQuery({ date: d })}`),
    enabled: !!pid,
    staleTime: 10_000,
  });
}

export function useAttendanceSummary(from: string, to: string) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["hr-attendance-summary", pid, from, to],
    queryFn: () =>
      apiService.get<{ present: number; absent: number; late: number; sick: number; remote: number }>(
        `${basePath(pid)}/attendance/summary${buildQuery({ from, to })}`
      ),
    enabled: !!pid && !!from && !!to,
    staleTime: 60_000,
  });
}

export function useEmployeeAttendance(employeeId: string | null, from: string, to: string) {
  const pid = usePharmacyId();
  return useQuery<Attendance[]>({
    queryKey: ["hr-attendance-employee", pid, employeeId, from, to],
    queryFn: () =>
      apiService.get<Attendance[]>(
        `${basePath(pid)}/attendance/employee/${employeeId}${buildQuery({ from, to })}`
      ),
    enabled: !!pid && !!employeeId && !!from && !!to,
  });
}

export function useUpdateAttendance(attendanceId: string) {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: Record<string, unknown>) =>
      apiService.put<Attendance>(`${basePath(pid)}/attendance/${attendanceId}`, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["hr-attendance-daily", pid] });
      qc.invalidateQueries({ queryKey: ["hr-attendance-summary", pid] });
      toast.success("Pointage modifié");
    },
    onError: () => toast.error("Erreur"),
  });
}

// ─── Leaves ─────────────────────────────────────────────────────────────────

export function useRequestLeave() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateLeaveDto) =>
      apiService.post<Leave>(`${basePath(pid)}/leaves`, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["hr-leaves-pending", pid] });
      qc.invalidateQueries({ queryKey: ["hr-leaves-employee", pid] });
      qc.invalidateQueries({ queryKey: ["hr-dashboard", pid] });
      toast.success("Demande de congé envoyée");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function usePendingLeaves() {
  const pid = usePharmacyId();
  return useQuery<Leave[]>({
    queryKey: ["hr-leaves-pending", pid],
    queryFn: () => apiService.get<Leave[]>(`${basePath(pid)}/leaves/pending`),
    enabled: !!pid,
    staleTime: 30_000,
  });
}

export function useEmployeeLeaves(employeeId: string | null, params?: Record<string, string>) {
  const pid = usePharmacyId();
  return useQuery<Leave[]>({
    queryKey: ["hr-leaves-employee", pid, employeeId, params],
    queryFn: () =>
      apiService.get<Leave[]>(
        `${basePath(pid)}/leaves/employee/${employeeId}${buildQuery(params)}`
      ),
    enabled: !!pid && !!employeeId,
  });
}

export function useLeaveBalance(employeeId: string | null, year?: string) {
  const pid = usePharmacyId();
  const y = year ?? String(new Date().getFullYear());
  return useQuery<LeaveBalanceDto>({
    queryKey: ["hr-leave-balance", pid, employeeId, y],
    queryFn: () =>
      apiService.get<LeaveBalanceDto>(
        `${basePath(pid)}/leaves/balance/${employeeId}${buildQuery({ year: y })}`
      ),
    enabled: !!pid && !!employeeId,
  });
}

export function useApproveLeave() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ leaveId, comment }: { leaveId: string; comment?: string }) =>
      apiService.post<Leave>(`${basePath(pid)}/leaves/${leaveId}/approve`, { comment }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["hr-leaves-pending", pid] });
      qc.invalidateQueries({ queryKey: ["hr-leaves-employee", pid] });
      qc.invalidateQueries({ queryKey: ["hr-dashboard", pid] });
      toast.success("Congé approuvé");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useRejectLeave() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ leaveId, comment }: { leaveId: string; comment?: string }) =>
      apiService.post<Leave>(`${basePath(pid)}/leaves/${leaveId}/reject`, { comment }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["hr-leaves-pending", pid] });
      qc.invalidateQueries({ queryKey: ["hr-leaves-employee", pid] });
      qc.invalidateQueries({ queryKey: ["hr-dashboard", pid] });
      toast.success("Congé refusé");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useCancelLeave(leaveId: string) {
  const qc = useQueryClient();
  const pid = usePharmacyId();
  return useMutation({
    mutationFn: () => apiService.post<Leave>(`${basePath(pid)}/leaves/${leaveId}/cancel`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["hr-leaves-pending", pid] });
      qc.invalidateQueries({ queryKey: ["hr-leaves-employee", pid] });
      qc.invalidateQueries({ queryKey: ["hr-dashboard", pid] });
      toast.success("Demande annulée");
    },
    onError: () => toast.error("Erreur"),
  });
}

// ─── Payroll ────────────────────────────────────────────────────────────────

export function usePayrollRuns(params?: Record<string, string>) {
  const pid = usePharmacyId();
  return useQuery<PayrollRun[]>({
    queryKey: ["hr-payroll-runs", pid, params],
    queryFn: () =>
      apiService.get<PayrollRun[]>(`${basePath(pid)}/payroll/runs${buildQuery(params)}`),
    enabled: !!pid,
    staleTime: 60_000,
  });
}

export function useCreatePayrollRun() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: { period_start: string; period_end: string }) =>
      apiService.post<PayrollRun>(`${basePath(pid)}/payroll/runs`, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["hr-payroll-runs", pid] });
      qc.invalidateQueries({ queryKey: ["hr-dashboard", pid] });
      toast.success("Cycle de paie créé");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useCalculatePayroll(runId: string) {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiService.post<PayrollRun>(`${basePath(pid)}/payroll/runs/${runId}/calculate`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["hr-payroll-runs", pid] });
      qc.invalidateQueries({ queryKey: ["hr-payroll-run", pid, runId] });
      toast.success("Paie calculée");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useApprovePayrollRun(runId: string) {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiService.post<PayrollRun>(`${basePath(pid)}/payroll/runs/${runId}/approve`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["hr-payroll-runs", pid] });
      qc.invalidateQueries({ queryKey: ["hr-payroll-run", pid, runId] });
      qc.invalidateQueries({ queryKey: ["hr-dashboard", pid] });
      toast.success("Cycle approuvé");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function usePayslipsByRun(runId: string | null) {
  const pid = usePharmacyId();
  return useQuery<Payslip[]>({
    queryKey: ["hr-payslips-run", pid, runId],
    queryFn: () => apiService.get<Payslip[]>(`${basePath(pid)}/payroll/runs/${runId}/payslips`),
    enabled: !!pid && !!runId,
  });
}

export function useEmployeePayslips(employeeId: string | null) {
  const pid = usePharmacyId();
  return useQuery<Payslip[]>({
    queryKey: ["hr-payslips-employee", pid, employeeId],
    queryFn: () =>
      apiService.get<Payslip[]>(`${basePath(pid)}/payroll/employee/${employeeId}/payslips`),
    enabled: !!pid && !!employeeId,
  });
}

// ─── Evaluations ────────────────────────────────────────────────────────────

export function useEvaluations() {
  const pid = usePharmacyId();
  return useQuery<Evaluation[]>({
    queryKey: ["hr-evaluations", pid],
    queryFn: () => apiService.get<Evaluation[]>(`${basePath(pid)}/evaluations`),
    enabled: !!pid,
  });
}

export function useEvaluationById(id: string | null) {
  const pid = usePharmacyId();
  return useQuery<Evaluation>({
    queryKey: ["hr-evaluation", pid, id],
    queryFn: () => apiService.get<Evaluation>(`${basePath(pid)}/evaluations/${id}`),
    enabled: !!pid && !!id,
  });
}

export function useEmployeeEvaluations(employeeId: string | null) {
  const pid = usePharmacyId();
  return useQuery<Evaluation[]>({
    queryKey: ["hr-evaluations-employee", pid, employeeId],
    queryFn: () =>
      apiService.get<Evaluation[]>(`${basePath(pid)}/evaluations/employee/${employeeId}`),
    enabled: !!pid && !!employeeId,
  });
}

export function useCreateEvaluation() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateEvaluationDto) =>
      apiService.post<Evaluation>(`${basePath(pid)}/evaluations`, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["hr-evaluations", pid] });
      qc.invalidateQueries({ queryKey: ["hr-evaluations-employee", pid] });
      qc.invalidateQueries({ queryKey: ["hr-dashboard", pid] });
      toast.success("Évaluation créée");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useUpdateEvaluation(evalId: string) {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: Partial<CreateEvaluationDto>) =>
      apiService.put<Evaluation>(`${basePath(pid)}/evaluations/${evalId}`, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["hr-evaluation", evalId] });
      qc.invalidateQueries({ queryKey: ["hr-evaluations", pid] });
      toast.success("Évaluation mise à jour");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useSubmitEvaluation(evalId: string) {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiService.post<Evaluation>(`${basePath(pid)}/evaluations/${evalId}/submit`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["hr-evaluation", evalId] });
      qc.invalidateQueries({ queryKey: ["hr-evaluations", pid] });
      toast.success("Évaluation soumise");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useFinalizeEvaluation(evalId: string) {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiService.post<Evaluation>(`${basePath(pid)}/evaluations/${evalId}/finalize`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["hr-evaluation", evalId] });
      qc.invalidateQueries({ queryKey: ["hr-evaluations", pid] });
      toast.success("Évaluation finalisée");
    },
    onError: () => toast.error("Erreur"),
  });
}
