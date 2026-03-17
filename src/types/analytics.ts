/** Types BI & Analytics — backend business-logic/bi, analytics */

export interface KPIMetric {
  id?: string;
  name: string;
  value: number;
  unit?: string;
  trend?: "up" | "down" | "stable";
  previousValue?: number;
  frequency?: string;
  calculatedAt?: string;
}

export interface BIDashboardOverview {
  kpis?: KPIMetric[];
  widgets?: unknown[];
  period?: { start: string; end: string };
}

export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  layout?: unknown;
  widgets?: unknown[];
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

export interface AnalyticsReport {
  id: string;
  type: string;
  title: string;
  generatedAt: string;
  generatedBy?: string;
  startDate: string;
  endDate: string;
  data?: unknown;
  summary?: Record<string, number>;
}

export type KPIFrequency = "daily" | "weekly" | "monthly" | "quarterly";

export interface CalculateKPIsDto {
  startDate: string;
  endDate: string;
  frequency?: KPIFrequency;
}

export interface CreateDashboardDto {
  name: string;
  description?: string;
  layout?: unknown;
  widgets?: unknown[];
}

export interface UpdateDashboardDto {
  name?: string;
  description?: string;
  layout?: unknown;
  widgets?: unknown[];
}

export interface GenerateReportDto {
  startDate: string;
  endDate: string;
  generatedBy?: string;
}
