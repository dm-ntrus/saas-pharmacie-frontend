"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTenantApiContext } from "@/hooks/useTenantApiContext";
import { apiService } from "@/services/api.service";
import { toast } from "react-hot-toast";
import type { CreateUserDto, UpdateUserDto, PaginatedUsersDto, UserResponseDto } from "@/types/identity";

const identityPath = "/identity/users";

function useTenantId() {
  return useTenantApiContext().billingTenantId;
}

export function useIdentityUsers(params?: { tenantId?: string; limit?: number; offset?: number; search?: string; status?: string }) {
  const tenantId = useTenantId();
  return useQuery({
    queryKey: ["identity-users", tenantId, params],
    queryFn: () =>
      apiService.get<PaginatedUsersDto | UserResponseDto[]>(identityPath, {
        params: { tenantId: params?.tenantId ?? tenantId, limit: params?.limit ?? 20, offset: params?.offset ?? 0, search: params?.search, status: params?.status },
      }),
    enabled: !!tenantId,
  });
}

export function useIdentityUserById(id: string | null) {
  return useQuery({
    queryKey: ["identity-user", id],
    queryFn: () => apiService.get<UserResponseDto>(`${identityPath}/${id}`),
    enabled: !!id,
  });
}

export function useCreateIdentityUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserDto) => apiService.post<UserResponseDto>(identityPath, data),
    onSuccess: () => {
      toast.success("Utilisateur créé");
      qc.invalidateQueries({ queryKey: ["identity-users"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateIdentityUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) =>
      apiService.put<UserResponseDto>(`${identityPath}/${id}`, data),
    onSuccess: (_, { id }) => {
      toast.success("Utilisateur mis à jour");
      qc.invalidateQueries({ queryKey: ["identity-users"] });
      qc.invalidateQueries({ queryKey: ["identity-user", id] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteIdentityUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiService.delete(`${identityPath}/${id}`),
    onSuccess: () => {
      toast.success("Utilisateur supprimé");
      qc.invalidateQueries({ queryKey: ["identity-users"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useEnableIdentityUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiService.post(`${identityPath}/${id}/enable`, {}),
    onSuccess: (_, id) => {
      toast.success("Utilisateur activé");
      qc.invalidateQueries({ queryKey: ["identity-users"] });
      qc.invalidateQueries({ queryKey: ["identity-user", id] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDisableIdentityUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiService.post(`${identityPath}/${id}/disable`, {}),
    onSuccess: (_, id) => {
      toast.success("Utilisateur désactivé");
      qc.invalidateQueries({ queryKey: ["identity-users"] });
      qc.invalidateQueries({ queryKey: ["identity-user", id] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useResetIdentityUserPassword() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, newPassword, temporary }: { id: string; newPassword: string; temporary?: boolean }) =>
      apiService.post(`${identityPath}/${id}/reset-password`, { newPassword, temporary }),
    onSuccess: (_, { id }) => {
      toast.success("Mot de passe réinitialisé");
      qc.invalidateQueries({ queryKey: ["identity-user", id] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useIdentityUserOrganizations(userId: string | null) {
  return useQuery({
    queryKey: ["identity-user-organizations", userId],
    queryFn: () => apiService.get<unknown[]>(`${identityPath}/${userId}/organizations`),
    enabled: !!userId,
  });
}

export function useIdentityUserPermissions(userId: string | null, orgId: string | null) {
  return useQuery({
    queryKey: ["identity-user-permissions", userId, orgId],
    queryFn: () =>
      apiService.get<{ permissions: string[]; roles: string[] }>(`${identityPath}/${userId}/organizations/${orgId}/permissions`),
    enabled: !!userId && !!orgId,
  });
}

export function useAddUserToOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, orgId, roles }: { userId: string; orgId: string; roles?: string[] }) =>
      apiService.post(`${identityPath}/${userId}/organizations/${orgId}`, { roles }),
    onSuccess: (_, { userId }) => {
      toast.success("Utilisateur ajouté à l'organisation");
      qc.invalidateQueries({ queryKey: ["identity-user", userId] });
      qc.invalidateQueries({ queryKey: ["identity-user-organizations", userId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useRemoveUserFromOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, orgId }: { userId: string; orgId: string }) =>
      apiService.delete(`${identityPath}/${userId}/organizations/${orgId}`),
    onSuccess: (_, { userId }) => {
      toast.success("Utilisateur retiré de l'organisation");
      qc.invalidateQueries({ queryKey: ["identity-user", userId] });
      qc.invalidateQueries({ queryKey: ["identity-user-organizations", userId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useAssignRolesToUserInOrg() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, orgId, roles }: { userId: string; orgId: string; roles: string[] }) =>
      apiService.post(`${identityPath}/${userId}/organizations/${orgId}/roles`, { roles }),
    onSuccess: (_, { userId }) => {
      toast.success("Rôles mis à jour");
      qc.invalidateQueries({ queryKey: ["identity-user", userId] });
      qc.invalidateQueries({ queryKey: ["identity-user-organizations", userId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useIdentityUserSessions(userId: string | null) {
  return useQuery({
    queryKey: ["identity-user-sessions", userId],
    queryFn: () => apiService.get<unknown[]>(`${identityPath}/${userId}/sessions`),
    enabled: !!userId,
  });
}

export function useLogoutIdentityUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => apiService.post(`${identityPath}/${userId}/logout`, {}),
    onSuccess: (_, userId) => {
      toast.success("Déconnexion effectuée");
      qc.invalidateQueries({ queryKey: ["identity-user", userId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// ─── 2FA ─────────────────────────────────────────────────────────────────────

export function use2FAStatus(userId: string | null) {
  return useQuery({
    queryKey: ["2fa-status", userId],
    queryFn: () => apiService.get<{ enabled: boolean; backupCodesRemaining?: number }>(`${identityPath}/${userId}/2fa/status`),
    enabled: !!userId,
  });
}

export function use2FASetup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => apiService.post<{ qrCodeUrl?: string; secret?: string; backupCodes?: string[] }>(`${identityPath}/${userId}/2fa/setup`, {}),
    onSuccess: (_, userId) => qc.invalidateQueries({ queryKey: ["2fa-status", userId] }),
    onError: (err: Error) => toast.error(err.message),
  });
}

export function use2FAVerifySetup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, code }: { userId: string; code: string }) =>
      apiService.post(`${identityPath}/${userId}/2fa/verify-setup`, { code }),
    onSuccess: (_, { userId }) => {
      toast.success("2FA activé");
      qc.invalidateQueries({ queryKey: ["2fa-status", userId] });
      qc.invalidateQueries({ queryKey: ["identity-user", userId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function use2FADisable() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, password }: { userId: string; password: string }) =>
      apiService.post(`${identityPath}/${userId}/2fa/disable`, { password }),
    onSuccess: (_, { userId }) => {
      toast.success("2FA désactivé");
      qc.invalidateQueries({ queryKey: ["2fa-status", userId] });
      qc.invalidateQueries({ queryKey: ["identity-user", userId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
