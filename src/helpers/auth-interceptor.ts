import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { tokenService } from "@/services/token.service";
import { KEYCLOAK_CONFIG } from "@/utils/constants";

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

const getCookie = (name: string) => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
};

class AuthInterceptor {
  private axiosInstance: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
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
    let token = tokenService.getAccessToken();

    if (token && tokenService.isTokenExpired()) {
      if (!this.isRefreshing) {
        this.isRefreshing = true;
        try {
          const newToken = await this.refreshAccessToken();
          this.isRefreshing = false;

          this.refreshSubscribers.forEach((cb) => cb(newToken));
          this.refreshSubscribers = [];

          token = newToken;
        } catch (error) {
          this.isRefreshing = false;
          this.refreshSubscribers = [];
          tokenService.clearTokens();
          window.location.href = "/auth/login";
          return Promise.reject(error);
        }
      } else {
        token = await new Promise<string>((resolve) =>
          this.refreshSubscribers.push(resolve)
        );
      }
    }

    if (token) config.headers.Authorization = `Bearer ${token}`;

    // Read org, language, currency from cookies
    const orgId = getCookie("current_organization");
    if (orgId) config.headers["X-Organization-ID"] = orgId;

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
          const newToken = await this.refreshAccessToken();
          this.isRefreshing = false;

          this.refreshSubscribers.forEach((cb) => cb(newToken));
          this.refreshSubscribers = [];

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return this.axiosInstance(originalRequest);
        } catch (refreshError) {
          this.isRefreshing = false;
          this.refreshSubscribers = [];
          tokenService.clearTokens();
          window.location.href = "/auth/login";
          return Promise.reject(refreshError);
        }
      } else {
        const newToken = await new Promise<string>((resolve) =>
          this.refreshSubscribers.push(resolve)
        );
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return this.axiosInstance(originalRequest);
      }
    }

    return Promise.reject(error);
  }

  private async refreshAccessToken(): Promise<string> {
    const refreshToken = tokenService.getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token available");

    const formData = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: KEYCLOAK_CONFIG.clientId,
      refresh_token: refreshToken,
    });

    const response = await axios.post<LoginResponse>(
      `${KEYCLOAK_CONFIG.url}${KEYCLOAK_CONFIG.endpoints.token}`,
      formData.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    tokenService.setTokens(
      response.data.access_token,
      response.data.refresh_token,
      response.data.expires_in
    );

    return response.data.access_token;
  }

  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

export const authInterceptor = new AuthInterceptor();
export const apiClient = authInterceptor.getAxiosInstance();