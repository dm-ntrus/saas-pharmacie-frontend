'use client';

import { useMutation } from '@tanstack/react-query';
import { apiService } from "@/services/api.service";
import type { CreateTenantDto, TenantRegistrationResponse } from '@/types/tenant.types';

const REGISTER_ENDPOINT = '/tenants/register';

export function useCreateTenant() {
  return useMutation({
    mutationFn: async (data: CreateTenantDto) => {
      return apiService.post<TenantRegistrationResponse>(
        REGISTER_ENDPOINT,
        data,
        {
          // Tenant registration may return 201/202/200 depending on async/sync modes.
          validateStatus: (s) => s >= 200 && s < 300,
        },
      );
    },
  });
}
