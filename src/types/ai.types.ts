export interface AICopilotQueryPayload {
  question: string;
  context?: Record<string, unknown>;
}

export interface AIAdvancedPayload {
  payload: Record<string, unknown>;
}

export interface AIMetricsQuery {
  window_days?: number;
}

export interface AIPurgeLogsPayload {
  retention_days?: number;
}

export interface AIHealthAdvanced {
  status: "ok" | "degraded";
  checks: Record<string, boolean>;
}

export interface AIReadiness {
  status: "ready" | "not_ready";
  checks: Record<string, boolean>;
  latency_ms: Record<string, number>;
}

export interface AISreDashboard {
  tenant_id: string;
  metrics: Record<string, unknown>;
  health_advanced: AIHealthAdvanced;
  readiness: AIReadiness;
}
