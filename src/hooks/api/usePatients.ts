"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api.service";
import { useOrganization } from "@/context/OrganizationContext";
import { toast } from "react-hot-toast";
import type {
  Patient,
  CreatePatientDto,
  UpdatePatientDto,
  PatientUserLinkDto,
} from "@/types/patients";

function usePharmacyId() {
  const { currentOrganization } = useOrganization();
  return currentOrganization?.id ?? "";
}

function basePath(pharmacyId: string) {
  return `/pharmacies/${pharmacyId}/patients`;
}

export function usePatients(status?: string) {
  const pid = usePharmacyId();
  return useQuery<Patient[]>({
    queryKey: ["patients", pid, status],
    queryFn: () =>
      apiService.get<Patient[]>(
        status ? `${basePath(pid)}?status=${status}` : basePath(pid)
      ),
    enabled: !!pid,
    staleTime: 30_000,
  });
}

export function usePatientById(id: string) {
  const pid = usePharmacyId();
  return useQuery<Patient>({
    queryKey: ["patient", pid, id],
    queryFn: () => apiService.get<Patient>(`${basePath(pid)}/${id}`),
    enabled: !!pid && !!id,
  });
}

export function usePatientSearch(q: string) {
  const pid = usePharmacyId();
  return useQuery<Patient[]>({
    queryKey: ["patients-search", pid, q],
    queryFn: () =>
      apiService.get<Patient[]>(`${basePath(pid)}/search?q=${encodeURIComponent(q)}`),
    enabled: !!pid && q.length >= 2,
  });
}

export function usePatientSummary() {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["patient-summary", pid],
    queryFn: () => apiService.get(`${basePath(pid)}/summary`),
    enabled: !!pid,
  });
}

export function useMyPatients() {
  const pid = usePharmacyId();
  return useQuery<Patient[]>({
    queryKey: ["my-patients", pid],
    queryFn: () => apiService.get<Patient[]>(`${basePath(pid)}/my-patients`),
    enabled: !!pid,
  });
}

export function usePatientUsers(patientId: string) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["patient-users", pid, patientId],
    queryFn: () => apiService.get(`${basePath(pid)}/${patientId}/users`),
    enabled: !!pid && !!patientId,
  });
}

export function usePatientPrimaryUser(patientId: string) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["patient-primary-user", pid, patientId],
    queryFn: () => apiService.get(`${basePath(pid)}/${patientId}/primary-user`),
    enabled: !!pid && !!patientId,
  });
}

export function useCreatePatient() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePatientDto) =>
      apiService.post<Patient>(basePath(pid), data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["patients", pid] });
      toast.success("Patient créé");
    },
    onError: (err: unknown) =>
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Erreur"),
  });
}

export function useUpdatePatient() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePatientDto }) =>
      apiService.put<Patient>(`${basePath(pid)}/${id}`, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["patients", pid] });
      qc.invalidateQueries({ queryKey: ["patient", pid, id] });
      toast.success("Patient mis à jour");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useDeactivatePatient() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiService.delete(`${basePath(pid)}/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["patients", pid] });
      toast.success("Patient désactivé");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useLinkPatientToUser() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      patientId,
      data,
    }: { patientId: string; data: PatientUserLinkDto }) =>
      apiService.post(`${basePath(pid)}/${patientId}/users`, data),
    onSuccess: (_, { patientId }) => {
      qc.invalidateQueries({ queryKey: ["patient-users", pid, patientId] });
      qc.invalidateQueries({ queryKey: ["patient", pid, patientId] });
      toast.success("Utilisateur lié");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useUpdatePatientUserLink() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      patientId,
      userId,
      updates,
    }: {
      patientId: string;
      userId: string;
      updates: Partial<PatientUserLinkDto>;
    }) =>
      apiService.put(
        `${basePath(pid)}/${patientId}/users/${userId}`,
        updates
      ),
    onSuccess: (_, { patientId }) => {
      qc.invalidateQueries({ queryKey: ["patient-users", pid, patientId] });
      toast.success("Liaison mise à jour");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useRemovePatientUserLink() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      patientId,
      userId,
    }: { patientId: string; userId: string }) =>
      apiService.delete(`${basePath(pid)}/${patientId}/users/${userId}`),
    onSuccess: (_, { patientId }) => {
      qc.invalidateQueries({ queryKey: ["patient-users", pid, patientId] });
      qc.invalidateQueries({ queryKey: ["patient", pid, patientId] });
      toast.success("Liaison supprimée");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useVerifyPatientUserLink() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      patientId,
      userId,
    }: { patientId: string; userId: string }) =>
      apiService.post(
        `${basePath(pid)}/${patientId}/users/${userId}/verify`
      ),
    onSuccess: (_, { patientId }) => {
      qc.invalidateQueries({ queryKey: ["patient-users", pid, patientId] });
      toast.success("Liaison vérifiée");
    },
    onError: () => toast.error("Erreur"),
  });
}
