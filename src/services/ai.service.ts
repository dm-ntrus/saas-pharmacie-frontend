import { apiService } from "./api.service";
import {
  AIAdvancedPayload,
  AICopilotQueryPayload,
  AIHealthAdvanced,
  AIMetricsQuery,
  AIPurgeLogsPayload,
  AIReadiness,
  AISreDashboard,
} from "@/types/ai.types";

class AIService {
  private base(pharmacyId: string): string {
    return `/pharmacies/${encodeURIComponent(pharmacyId)}/ai`;
  }

  copilotQuery(pharmacyId: string, payload: AICopilotQueryPayload) {
    return apiService.post(`${this.base(pharmacyId)}/copilot/query`, payload);
  }

  prescriptionOcr(pharmacyId: string, payload: { document_base64: string; mime_type?: string }) {
    return apiService.post(`${this.base(pharmacyId)}/prescriptions/ocr-extract`, payload);
  }

  prescriptionRisk(pharmacyId: string, payload: Record<string, unknown>) {
    return apiService.post(`${this.base(pharmacyId)}/prescriptions/risk-score`, payload);
  }

  metrics(pharmacyId: string, query: AIMetricsQuery = {}) {
    return apiService.get(`${this.base(pharmacyId)}/metrics`, { params: query });
  }

  purgeLogs(pharmacyId: string, payload: AIPurgeLogsPayload = {}) {
    return apiService.post(`${this.base(pharmacyId)}/maintenance/purge-logs`, payload);
  }

  modelEval(pharmacyId: string, payload: AIAdvancedPayload["payload"]) {
    return apiService.post(`${this.base(pharmacyId)}/model-eval`, { payload });
  }

  modelExplain(pharmacyId: string, payload: AIAdvancedPayload["payload"]) {
    return apiService.post(`${this.base(pharmacyId)}/model-explain`, { payload });
  }

  healthAdvanced(pharmacyId: string): Promise<AIHealthAdvanced> {
    return apiService.get(`${this.base(pharmacyId)}/health/advanced`);
  }

  healthReadiness(pharmacyId: string): Promise<AIReadiness> {
    return apiService.get(`${this.base(pharmacyId)}/health/readiness`);
  }

  sreDashboard(pharmacyId: string, query: AIMetricsQuery = {}): Promise<AISreDashboard> {
    return apiService.get(`${this.base(pharmacyId)}/sre/dashboard`, { params: query });
  }

  // Generic helper for all new advanced AI endpoints.
  callAdvanced(pharmacyId: string, route: string, payload: Record<string, unknown>) {
    return apiService.post(`${this.base(pharmacyId)}/${route}`, { payload });
  }
}

export const aiService = new AIService();
