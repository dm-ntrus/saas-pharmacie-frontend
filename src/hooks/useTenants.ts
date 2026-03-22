'use client';

import { useMutation } from '@tanstack/react-query';
import { apiService } from "@/services/api.service";
import type { CreateTenantDto } from '@/types/tenant.types';

const REGISTER_ENDPOINT = '/auth/register';

/**
 * Maps CreateTenantDto to the payload expected by the existing register endpoint.
 * Backend can later accept full CreateTenantDto; until then we send a compatible shape.
 */
function toRegisterPayload(data: CreateTenantDto) {
  return {
    ...data,
    email: data.ownerData.email,
    firstName: data.ownerData.firstName,
    lastName: data.ownerData.lastName,
    password: data.ownerData.password,
    phone: data.ownerData.phone,
    acceptTerms: data.ownerData.acceptTerms,
    marketingConsent: data.ownerData.acceptMarketing,
    pharmacyName: data.tenantData.name,
    licenseNumber: data.tenantData.licenseNumber,
    address: data.tenantData.address?.street,
    city: data.tenantData.address?.city,
    country: data.tenantData.address?.country ?? data.tenantData.localization?.currency,
    plan: data.planSelection.planId,
    paymentMethod: data.paymentInfo.paymentMethod,
  };
}

export function useCreateTenant() {
  return useMutation({
    mutationFn: async (data: CreateTenantDto) => {
      const payload = toRegisterPayload(data);
      return apiService.post<{ user: unknown; access_token: string; refresh_token?: string; tenant?: { id: string } }>(
        REGISTER_ENDPOINT,
        payload
      );
    },
  });
}
