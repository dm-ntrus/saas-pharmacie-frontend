"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiService from "@/services/api.service";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

// Users
export function useUsers(params?: { tenantId?: string; limit?: number; offset?: number }) {
  return useQuery({
    queryKey: ["admin-users", params],
    queryFn: () => apiService.get("/identity/users", { params }),
  });
}

export function useUserById(id: string) {
  return useQuery({
    queryKey: ["admin-user", id],
    queryFn: () => apiService.get(`/identity/users/${id}`),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiService.post("/identity/users", data),
    onSuccess: () => {
      toast.success("Utilisateur créé");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: () => toast.error("Erreur lors de la création"),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiService.put(`/identity/users/${id}`, data),
    onSuccess: () => {
      toast.success("Utilisateur mis à jour");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useDeactivateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiService.post(`/identity/users/${id}/disable`, {}),
    onSuccess: () => {
      toast.success("Utilisateur désactivé");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: () => toast.error("Erreur"),
  });
}

// Custom Roles
export function useCustomRoles(params?: { tenantId?: string }) {
  return useQuery({
    queryKey: ["custom-roles", params],
    queryFn: () => apiService.get("/identity/roles/custom", { params }),
  });
}

export function useCreateCustomRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiService.post("/identity/roles/custom", data),
    onSuccess: () => {
      toast.success("Rôle personnalisé créé");
      queryClient.invalidateQueries({ queryKey: ["custom-roles"] });
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useUpdateCustomRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiService.put(`/identity/roles/custom/${id}`, data),
    onSuccess: () => {
      toast.success("Rôle mis à jour");
      queryClient.invalidateQueries({ queryKey: ["custom-roles"] });
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useDeleteCustomRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiService.delete(`/identity/roles/custom/${id}`),
    onSuccess: () => {
      toast.success("Rôle supprimé");
      queryClient.invalidateQueries({ queryKey: ["custom-roles"] });
    },
    onError: () => toast.error("Erreur"),
  });
}

// Role Assignment
export function useUserRoles(userId: string) {
  return useQuery({
    queryKey: ["user-roles", userId],
    queryFn: () => apiService.get(`/identity/user-roles/${userId}/roles`),
    enabled: !!userId,
  });
}

export function useAssignRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: { roleId: string; organizationId?: string; requiresApproval?: boolean; reason?: string } }) =>
      apiService.post(`/identity/user-roles/${userId}/roles`, data),
    onSuccess: () => {
      toast.success("Rôle assigné");
      queryClient.invalidateQueries({ queryKey: ["user-roles"] });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: () => toast.error("Erreur"),
  });
}

// Organizations
export function useOrganizations() {
  return useQuery({
    queryKey: ["admin-organizations"],
    queryFn: () => apiService.get("/identity/organizations"),
  });
}

export function useOrganizationMembers(orgId: string) {
  return useQuery({
    queryKey: ["org-members", orgId],
    queryFn: () => apiService.get(`/identity/organizations/${orgId}/members`),
    enabled: !!orgId,
  });
}

// 2FA Status — uses current user's ID from auth context
export function useTOTPStatus() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["totp-status", user?.id],
    queryFn: () => apiService.get(`/identity/users/${user!.id}/2fa/status`),
    enabled: !!user?.id,
  });
}

export function useSetupTOTP() {
  const { user } = useAuth();
  return useMutation({
    mutationFn: (data: any) => apiService.post(`/identity/users/${user!.id}/2fa/setup`, data),
    onSuccess: () => toast.success("2FA configuré"),
    onError: () => toast.error("Erreur"),
  });
}

// Active Sessions — uses current user's ID from auth context
export function useActiveSessions() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["active-sessions", user?.id],
    queryFn: () => apiService.get(`/identity/users/${user!.id}/sessions`),
    enabled: !!user?.id,
  });
}

export function useTerminateSession() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) =>
      apiService.post(`/identity/users/${user!.id}/logout`, {}),
    onSuccess: () => {
      toast.success("Session terminée");
      queryClient.invalidateQueries({ queryKey: ["active-sessions"] });
    },
    onError: () => toast.error("Erreur"),
  });
}
