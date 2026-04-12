"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useTenantApiContext } from "@/hooks/useTenantApiContext";
import { aiService } from "@/services/ai.service";
import { AICopilotQueryPayload, AIMetricsQuery } from "@/types/ai.types";
import { toast } from "react-hot-toast";

function usePharmacyId() {
  return useTenantApiContext().pharmacyId;
}

export function useAICopilot() {
  const pharmacyId = usePharmacyId();

  return useMutation({
    mutationFn: (payload: AICopilotQueryPayload) => aiService.copilotQuery(pharmacyId, payload),
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useAIModelEval() {
  const pharmacyId = usePharmacyId();

  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => aiService.modelEval(pharmacyId, payload),
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useAIModelExplain() {
  const pharmacyId = usePharmacyId();

  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => aiService.modelExplain(pharmacyId, payload),
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useAIAdvanced(route: string) {
  const pharmacyId = usePharmacyId();

  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => aiService.callAdvanced(pharmacyId, route, payload),
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useAIMetrics(query: AIMetricsQuery = {}) {
  const pharmacyId = usePharmacyId();

  return useQuery({
    queryKey: ["ai", "metrics", pharmacyId, query],
    queryFn: () => aiService.metrics(pharmacyId, query),
    enabled: !!pharmacyId,
    staleTime: 30_000,
  });
}

export function useAIHealthAdvanced() {
  const pharmacyId = usePharmacyId();

  return useQuery({
    queryKey: ["ai", "health", "advanced", pharmacyId],
    queryFn: () => aiService.healthAdvanced(pharmacyId),
    enabled: !!pharmacyId,
    staleTime: 30_000,
  });
}

export function useAIHealthReadiness() {
  const pharmacyId = usePharmacyId();

  return useQuery({
    queryKey: ["ai", "health", "readiness", pharmacyId],
    queryFn: () => aiService.healthReadiness(pharmacyId),
    enabled: !!pharmacyId,
    refetchInterval: 30_000,
  });
}

export function useAISreDashboard(query: AIMetricsQuery = {}) {
  const pharmacyId = usePharmacyId();

  return useQuery({
    queryKey: ["ai", "sre-dashboard", pharmacyId, query],
    queryFn: () => aiService.sreDashboard(pharmacyId, query),
    enabled: !!pharmacyId,
    refetchInterval: 30_000,
  });
}
