import { getCookie, removeCookie, setCookie } from "@/utils/cookies";
import { dispatchAccessTokenUpdated } from "@/utils/access-token-events";

class TokenService {
  private readonly ACCESS_TOKEN_KEY = "access_token";
  private readonly REFRESH_TOKEN_KEY = "refresh_token";
  private readonly ID_TOKEN_KEY = "id_token";
  private readonly TOKEN_EXPIRY_KEY = "token_expiry";
  // private readonly COOKIE_PATH = "/";

  // Stocke tokens dans localStorage et cookies côté client
  setTokens(
    accessToken: string,
    refreshToken: string,
    expiresIn: number,
    idToken?: string
  ): void {
    const expiryTime = Date.now() + expiresIn * 1000;

    // LocalStorage
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    if (idToken) localStorage.setItem(this.ID_TOKEN_KEY, idToken);
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());

    // Cookies
    setCookie(this.ACCESS_TOKEN_KEY, accessToken);
    setCookie(this.REFRESH_TOKEN_KEY, refreshToken);
    if (idToken) setCookie(this.ID_TOKEN_KEY, idToken);
    setCookie(this.TOKEN_EXPIRY_KEY, String(expiryTime));
    dispatchAccessTokenUpdated();
  }

  getAccessToken(): string | null {
    return (
      getCookie(this.ACCESS_TOKEN_KEY) ||
      localStorage.getItem(this.ACCESS_TOKEN_KEY)
    );
  }

  getRefreshToken(): string | null {
    return (
      getCookie(this.REFRESH_TOKEN_KEY) ||
      localStorage.getItem(this.REFRESH_TOKEN_KEY)
    );
  }

  getIdToken(): string | null {
    return getCookie(this.ID_TOKEN_KEY) || localStorage.getItem(this.ID_TOKEN_KEY);
  }

  isTokenExpired(): boolean {
    const expiry = parseInt(
      getCookie(this.TOKEN_EXPIRY_KEY) ||
        localStorage.getItem(this.TOKEN_EXPIRY_KEY) ||
        "0"
    );
    return Date.now() > expiry;
  }

  clearTokens(): void {
    // LocalStorage
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.ID_TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);

    // Cookies
    removeCookie(this.ACCESS_TOKEN_KEY);
    removeCookie(this.REFRESH_TOKEN_KEY);
    removeCookie(this.ID_TOKEN_KEY);
    removeCookie(this.TOKEN_EXPIRY_KEY);
  }
}

export const tokenService = new TokenService();
