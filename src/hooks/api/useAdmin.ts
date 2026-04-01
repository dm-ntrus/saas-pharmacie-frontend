import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiService from "@/services/api.service";
import { toast } from "react-hot-toast";

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
      toast.success("Utilisateur cree");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: () => toast.error("Erreur lors de la creation"),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiService.put(`/identity/users/${id}`, data),
    onSuccess: () => {
      toast.success("Utilisateur mis a jour");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useDeactivateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiService.put(`/identity/users/${id}/deactivate`, {}),
    onSuccess: () => {
      toast.success("Utilisateur desactive");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: () => toast.error("Erreur"),
  });
}

// Custom Roles
export function useCustomRoles(params?: { tenantId?: string }) {
  return useQuery({
    queryKey: ["custom-roles", params],
    queryFn: () => apiService.get("/api/roles/custom", { params }),
  });
}

export function useCreateCustomRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiService.post("/api/roles/custom", data),
    onSuccess: () => {
      toast.success("Role personnalise cree");
      queryClient.invalidateQueries({ queryKey: ["custom-roles"] });
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useUpdateCustomRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiService.put(`/api/roles/custom/${id}`, data),
    onSuccess: () => {
      toast.success("Role mis a jour");
      queryClient.invalidateQueries({ queryKey: ["custom-roles"] });
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useDeleteCustomRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiService.delete(`/api/roles/custom/${id}`),
    onSuccess: () => {
      toast.success("Role supprime");
      queryClient.invalidateQueries({ queryKey: ["custom-roles"] });
    },
    onError: () => toast.error("Erreur"),
  });
}

// Role Assignment
export function useUserRoles(userId: string) {
  return useQuery({
    queryKey: ["user-roles", userId],
    queryFn: () => apiService.get(`/api/users/${userId}/roles`),
    enabled: !!userId,
  });
}

export function useAssignRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: any }) =>
      apiService.post(`/api/users/${userId}/roles`, data),
    onSuccess: () => {
      toast.success("Role assigne");
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

// 2FA Status
export function useTOTPStatus() {
  return useQuery({
    queryKey: ["totp-status"],
    queryFn: () => apiService.get("/identity/users/me/2fa/status"),
  });
}

export function useSetupTOTP() {
  return useMutation({
    mutationFn: (data: any) => apiService.post("/identity/users/me/2fa/setup", data),
    onSuccess: () => toast.success("2FA configure"),
    onError: () => toast.error("Erreur"),
  });
}

// Active Sessions
export function useActiveSessions() {
  return useQuery({
    queryKey: ["active-sessions"],
    queryFn: () => apiService.get("/identity/users/me/sessions"),
  });
}

export function useTerminateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => apiService.delete(`/identity/users/me/sessions/${sessionId}`),
    onSuccess: () => {
      toast.success("Session terminee");
      queryClient.invalidateQueries({ queryKey: ["active-sessions"] });
    },
    onError: () => toast.error("Erreur"),
  });
}
