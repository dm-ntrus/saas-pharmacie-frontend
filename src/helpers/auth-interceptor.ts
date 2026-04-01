import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { getCookie } from "@/utils/cookies";
import { dispatchAccessTokenUpdated } from "@/utils/access-token-events";

/** Base URL de l'API backend : inclut /api/v1 (aligné avec main.ts setGlobalPrefix + enableVersioning). */
export function getApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const base = raw.replace(/\/+$/, "");
  if (base.endsWith("/api/v1")) return base;
  if (base.includes("/api/v1")) return base;
  return `${base}/api/v1`;
}

class AuthInterceptor {
  private axiosInstance: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: Array<() => void> = [];

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: getApiBaseUrl(),
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        return this.handleRequest(config);
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => this.handleResponseError(error)
    );
  }

  private async handleRequest(
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> {
    // CSRF protection for cookie-auth (double-submit token)
    const csrf = getCookie("csrf_token");
    if (csrf) config.headers["X-CSRF-Token"] = csrf;

    // Read org, language, currency from cookies
    const orgId = getCookie("current_organization");
    if (orgId) config.headers["X-Organization-ID"] = orgId;

    // Pour les routes tenant (ex. /tenants/:id/billing), envoyer X-Tenant-ID (aligné backend TenantContextMiddleware)
    const path = config.url ?? "";
    if (path.includes("/tenants/")) {
      const tenantId = getCookie("tenant_id");
      if (tenantId) config.headers["X-Tenant-ID"] = tenantId;
    }

    const language = getCookie("language") || "fr";
    const currency = getCookie("currency") || "XOF";
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    config.headers["X-Language"] = language;
    config.headers["X-Currency"] = currency;
    config.headers["X-Timezone"] = timezone;

    return config;
  }

  private async handleResponseError(error: any): Promise<never> {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!this.isRefreshing) {
        this.isRefreshing = true;
        try {
          await this.refreshSession();
          this.isRefreshing = false;

          this.refreshSubscribers.forEach((cb) => cb());
          this.refreshSubscribers = [];

          return this.axiosInstance(originalRequest);
        } catch (refreshError) {
          this.isRefreshing = false;
          this.refreshSubscribers = [];
          window.location.href = "/auth/login";
          return Promise.reject(refreshError);
        }
      } else {
        await new Promise<void>((resolve) => this.refreshSubscribers.push(resolve));
        return this.axiosInstance(originalRequest);
      }
    }

    return Promise.reject(error);
  }

  private async refreshSession(): Promise<void> {
    await axios.post(
      `${getApiBaseUrl()}/bff/auth/refresh`,
      {},
      { withCredentials: true }
    );
    dispatchAccessTokenUpdated();
  }

  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

export const authInterceptor = new AuthInterceptor();
export const apiClient = authInterceptor.getAxiosInstance();
