"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api.service";
import { toast } from "react-hot-toast";
import type { CustomRoleDto, CreateCustomRoleDto, UpdateCustomRoleDto } from "@/types/identity";

const rolesPath = "/identity/roles/custom";

export function useCustomRoles(params?: { status?: string; type?: string; limit?: number; offset?: number }) {
  return useQuery({
    queryKey: ["custom-roles", params],
    queryFn: () => apiService.get<CustomRoleDto[]>(rolesPath, { params }),
  });
}

export function useCustomRoleById(id: string | null) {
  return useQuery({
    queryKey: ["custom-role", id],
    queryFn: () => apiService.get<CustomRoleDto>(`${rolesPath}/${id}`),
    enabled: !!id,
  });
}

export function useCustomRolePermissions(roleId: string | null) {
  return useQuery({
    queryKey: ["custom-role-permissions", roleId],
    queryFn: () => apiService.get<{ permissions: string[] }>(`${rolesPath}/${roleId}/permissions`),
    enabled: !!roleId,
  });
}

export function useCreateCustomRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCustomRoleDto) =>
      apiService.post<{ id: string; name: string; displayName: string }>(rolesPath, data),
    onSuccess: () => {
      toast.success("Rôle créé");
      qc.invalidateQueries({ queryKey: ["custom-roles"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateCustomRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomRoleDto }) =>
      apiService.put<CustomRoleDto>(`${rolesPath}/${id}`, data),
    onSuccess: (_, { id }) => {
      toast.success("Rôle mis à jour");
      qc.invalidateQueries({ queryKey: ["custom-roles"] });
      qc.invalidateQueries({ queryKey: ["custom-role", id] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteCustomRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiService.delete(`${rolesPath}/${id}`),
    onSuccess: () => {
      toast.success("Rôle supprimé");
      qc.invalidateQueries({ queryKey: ["custom-roles"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
