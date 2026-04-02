import { getCookie, removeCookie, setCookie } from "@/utils/cookies";
import { dispatchAccessTokenUpdated } from "@/utils/access-token-events";

/**
 * Token service for hybrid auth model.
 *
 * In production, tokens are primarily managed via BFF HttpOnly cookies.
 * This service handles the fallback for direct OIDC flows (tenant callback)
 * where the browser performs the token exchange.
 *
 * Tokens are stored ONLY in short-lived cookies (not localStorage) to limit
 * XSS blast radius. The BFF access_token cookie (kc_at) set by the server
 * is HttpOnly and takes priority over client-set cookies.
 */
class TokenService {
  private readonly ACCESS_TOKEN_KEY = "access_token";
  private readonly REFRESH_TOKEN_KEY = "refresh_token";
  private readonly ID_TOKEN_KEY = "id_token";
  private readonly TOKEN_EXPIRY_KEY = "token_expiry";

  setTokens(
    accessToken: string,
    refreshToken: string,
    expiresIn: number,
    idToken?: string,
  ): void {
    const expiryTime = Date.now() + expiresIn * 1000;
    const cookieDays = Math.max(expiresIn / 86400, 1 / 24); // at least 1 hour

    setCookie(this.ACCESS_TOKEN_KEY, accessToken, cookieDays);
    setCookie(this.REFRESH_TOKEN_KEY, refreshToken, cookieDays);
    if (idToken) setCookie(this.ID_TOKEN_KEY, idToken, cookieDays);
    setCookie(this.TOKEN_EXPIRY_KEY, String(expiryTime), cookieDays);

    dispatchAccessTokenUpdated();
  }

  getAccessToken(): string | null {
    return getCookie(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return getCookie(this.REFRESH_TOKEN_KEY);
  }

  getIdToken(): string | null {
    return getCookie(this.ID_TOKEN_KEY);
  }

  isTokenExpired(): boolean {
    const expiry = parseInt(
      getCookie(this.TOKEN_EXPIRY_KEY) || "0",
    );
    return Date.now() > expiry;
  }

  clearTokens(): void {
    removeCookie(this.ACCESS_TOKEN_KEY);
    removeCookie(this.REFRESH_TOKEN_KEY);
    removeCookie(this.ID_TOKEN_KEY);
    removeCookie(this.TOKEN_EXPIRY_KEY);

    // Also clean up any legacy localStorage entries
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(this.ACCESS_TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        localStorage.removeItem(this.ID_TOKEN_KEY);
        localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
      } catch {
        // SSR or restricted context
      }
    }
  }
}

export const tokenService = new TokenService();
