import { apiService } from '@/services/api.service';

/**
 * Compat layer: some components still import from `@/lib/api`.
 * Prefer using `apiService` directly in new code.
 */
export const api = apiService;
export { apiService };

// Some legacy code expects `import api from "@/lib/api"`
export default apiService;

// Some legacy code expects `apiClient` from here.
export { apiClient } from '@/helpers/auth-interceptor';

