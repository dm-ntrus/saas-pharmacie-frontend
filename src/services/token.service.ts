class TokenService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly TOKEN_EXPIRY_KEY = 'token_expiry';
  private readonly COOKIE_PATH = '/';

  // Stocke tokens dans localStorage et cookies côté client
  setTokens(accessToken: string, refreshToken: string, expiresIn: number): void {
    const expiryTime = Date.now() + expiresIn * 1000;

    // LocalStorage
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());

    // Cookies
    document.cookie = `${this.ACCESS_TOKEN_KEY}=${accessToken}; path=${this.COOKIE_PATH}; SameSite=Lax; ${
      process.env.NODE_ENV === 'production' ? 'Secure;' : ''
    }`;
    document.cookie = `${this.REFRESH_TOKEN_KEY}=${refreshToken}; path=${this.COOKIE_PATH}; SameSite=Lax; ${
      process.env.NODE_ENV === 'production' ? 'Secure;' : ''
    }`;
    document.cookie = `${this.TOKEN_EXPIRY_KEY}=${expiryTime}; path=${this.COOKIE_PATH}; SameSite=Lax; ${
      process.env.NODE_ENV === 'production' ? 'Secure;' : ''
    }`;
  }

  getAccessToken(): string | null {
    return this.getCookie(this.ACCESS_TOKEN_KEY) || localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return this.getCookie(this.REFRESH_TOKEN_KEY) || localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  isTokenExpired(): boolean {
    const expiry = parseInt(this.getCookie(this.TOKEN_EXPIRY_KEY) || localStorage.getItem(this.TOKEN_EXPIRY_KEY) || '0');
    return Date.now() > expiry;
  }

  clearTokens(): void {
    // LocalStorage
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);

    // Cookies
    document.cookie = `${this.ACCESS_TOKEN_KEY}=; Max-Age=0; path=${this.COOKIE_PATH}`;
    document.cookie = `${this.REFRESH_TOKEN_KEY}=; Max-Age=0; path=${this.COOKIE_PATH}`;
    document.cookie = `${this.TOKEN_EXPIRY_KEY}=; Max-Age=0; path=${this.COOKIE_PATH}`;
  }

  private getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }
}

export const tokenService = new TokenService();
