import { apiService } from "@/services/api.service";
import { unwrapNestSuccessData } from "@/lib/api/unwrap-nest-success";
import type { TenantProvisioningPublicStatus } from "@/types/tenant-registration.types";

const PROV_ID_RE = /^prov_[a-f0-9]{16}$/i;

export function isValidProvisioningId(id: string | undefined | null): boolean {
  return !!id && PROV_ID_RE.test(id.trim());
}

export async function fetchTenantProvisioningStatus(
  provisioningId: string,
): Promise<TenantProvisioningPublicStatus> {
  const raw = await apiService.get<unknown>(
    `/tenants/register/status/${encodeURIComponent(provisioningId.trim())}`,
  );
  return unwrapNestSuccessData<TenantProvisioningPublicStatus>(raw);
}
