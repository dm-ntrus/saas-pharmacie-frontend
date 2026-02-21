import { getCookie, removeCookie, setCookie } from "@/utils/cookies";

class TokenService {
  private readonly ACCESS_TOKEN_KEY = "access_token";
  private readonly REFRESH_TOKEN_KEY = "refresh_token";
  private readonly TOKEN_EXPIRY_KEY = "token_expiry";
  // private readonly COOKIE_PATH = "/";

  // Stocke tokens dans localStorage et cookies côté client
  setTokens(
    accessToken: string,
    refreshToken: string,
    expiresIn: number
  ): void {
    const expiryTime = Date.now() + expiresIn * 1000;

    // LocalStorage
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());

    // Cookies
    setCookie(this.ACCESS_TOKEN_KEY, accessToken);
    setCookie(this.REFRESH_TOKEN_KEY, refreshToken);
    setCookie(this.TOKEN_EXPIRY_KEY, String(expiryTime));
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
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);

    // Cookies
    removeCookie(this.ACCESS_TOKEN_KEY);
    removeCookie(this.REFRESH_TOKEN_KEY);
    removeCookie(this.TOKEN_EXPIRY_KEY);
  }
}

export const tokenService = new TokenService();
