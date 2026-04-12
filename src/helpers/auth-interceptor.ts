import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { getCookie } from "@/utils/cookies";
import { dispatchAccessTokenUpdated } from "@/utils/access-token-events";

export const ENTITLEMENT_DENIED_EVENT = "entitlement:denied";

export interface EntitlementDeniedDetail {
  featureKey: string;
  errorCode: string;
  reason?: string;
  message?: string;
}

function dispatchEntitlementDenied(detail: EntitlementDeniedDetail) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(ENTITLEMENT_DENIED_EVENT, { detail }),
    );
  }
}

export function getApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  let base = raw.replace(/\/+$/, "");

  if (
    typeof window !== "undefined" &&
    base.includes("localhost") &&
    !window.location.hostname.includes("localhost") &&
    window.location.hostname !== "127.0.0.1"
  ) {
    base = base.replace("localhost", window.location.hostname);
  }

  if (base.endsWith("/api/v1")) return base;
  if (base.includes("/api/v1")) return base;
  return `${base}/api/v1`;
}

function getTenantAwareLoginUrl(): string {
  if (typeof window === "undefined") return "/auth/login";
  const slug = getCookie("slug_organization");
  const pathname = window.location.pathname;

  // Extract slug from current URL if available
  const tenantMatch = pathname.match(/^\/tenant\/([^/]+)/);
  const resolvedSlug = slug || tenantMatch?.[1];

  if (resolvedSlug) {
    return `/tenant/${resolvedSlug}/auth/login?reason=session_expired`;
  }
  return "/auth/login?reason=session_expired";
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
      (error) => Promise.reject(error),
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => this.handleResponseError(error),
    );
  }

  private async handleRequest(
    config: InternalAxiosRequestConfig,
  ): Promise<InternalAxiosRequestConfig> {
    const csrf = getCookie("csrf_token");
    if (csrf) config.headers["X-CSRF-Token"] = csrf;

    const orgId = getCookie("current_organization");
    if (orgId) config.headers["X-Organization-ID"] = orgId;

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
    const status = error.response?.status;
    const data = error.response?.data;

    if (status === 403 && data?.errorCode) {
      const errorCode: string = data.errorCode;

      if (
        errorCode === "ENTITLEMENT_NOT_IN_PLAN" ||
        errorCode === "ENTITLEMENT_NO_BILLING_CONTEXT" ||
        errorCode === "ENTITLEMENT_ORG_MISMATCH"
      ) {
        dispatchEntitlementDenied({
          featureKey: data.featureKey ?? "",
          errorCode,
          reason: data.reason,
          message: data.message,
        });
        return Promise.reject(error);
      }
    }

    if (status === 401 && !originalRequest._retry) {
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
          // Tenant-aware redirect: send user to their org's login page
          window.location.href = getTenantAwareLoginUrl();
          return Promise.reject(refreshError);
        }
      } else {
        await new Promise<void>((resolve) =>
          this.refreshSubscribers.push(resolve),
        );
        return this.axiosInstance(originalRequest);
      }
    }

    // 429 Too Many Requests — inform user without redirect
    if (status === 429) {
      const retryAfter = error.response?.headers?.["retry-after"];
      console.warn(
        `Rate limited. Retry after ${retryAfter ?? "unknown"} seconds.`,
      );
    }

    return Promise.reject(error);
  }

  private async refreshSession(): Promise<void> {
    const csrf = getCookie("csrf_token");
    await axios.post(
      `${getApiBaseUrl()}/bff/auth/refresh`,
      {},
      {
        withCredentials: true,
        headers: csrf ? { "X-CSRF-Token": csrf } : {},
      },
    );
    dispatchAccessTokenUpdated();
  }

  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

export const authInterceptor = new AuthInterceptor();
export const apiClient = authInterceptor.getAxiosInstance();
