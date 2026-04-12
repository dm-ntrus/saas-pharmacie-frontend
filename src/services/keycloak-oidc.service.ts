type OidcDiscovery = {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint?: string;
  end_session_endpoint?: string;
  revocation_endpoint?: string;
  jwks_uri?: string;
  code_challenge_methods_supported?: string[];
};

type TokenResponse = {
  access_token: string;
  refresh_token?: string;
  id_token?: string;
  expires_in: number;
  refresh_expires_in?: number;
  token_type: string;
  scope?: string;
};

const STORAGE_KEYS = {
  discovery: "kc_oidc_discovery",
  state: "kc_oidc_state",
  nonce: "kc_oidc_nonce",
  codeVerifier: "kc_oidc_code_verifier",
  postLoginRedirect: "kc_post_login_redirect",
} as const;

function requireBrowser() {
  if (typeof window === "undefined") {
    throw new Error("Keycloak OIDC flow must run in the browser");
  }
}

function base64urlFromArrayBuffer(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  const b64 = btoa(binary);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function randomString(bytes = 32): string {
  requireBrowser();
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return base64urlFromArrayBuffer(arr.buffer);
}

async function sha256Base64url(input: string): Promise<string> {
  requireBrowser();
  const enc = new TextEncoder();
  const data = enc.encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64urlFromArrayBuffer(digest);
}

function getEnv(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (!v) throw new Error(`Missing env var ${name}`);
  return v;
}

function getAuthority(): string {
  const base = getEnv("NEXT_PUBLIC_KEYCLOAK_URL").replace(/\/+$/, "");
  const realm = getEnv("NEXT_PUBLIC_KEYCLOAK_REALM");
  return `${base}/realms/${encodeURIComponent(realm)}`;
}

function getClientId(): string {
  return getEnv("NEXT_PUBLIC_KEYCLOAK_CLIENT_ID");
}

function getScope(): string {
  return process.env.NEXT_PUBLIC_KEYCLOAK_SCOPE || "openid profile email";
}

function getRedirectUriForCurrentOrigin(pathname: string): string {
  requireBrowser();
  const origin = window.location.origin;
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${origin}${path}`;
}

function saveSession(key: string, value: string) {
  requireBrowser();
  sessionStorage.setItem(key, value);
}

function readSession(key: string): string | null {
  requireBrowser();
  return sessionStorage.getItem(key);
}

function clearSession(keys: string[]) {
  requireBrowser();
  keys.forEach((k) => sessionStorage.removeItem(k));
}

async function fetchDiscovery(authority: string): Promise<OidcDiscovery> {
  const url = `${authority}/.well-known/openid-configuration`;
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) throw new Error(`OIDC discovery failed (${res.status})`);
  return (await res.json()) as OidcDiscovery;
}

export class KeycloakOidcService {
  private discovery: OidcDiscovery | null = null;

  async getDiscovery(): Promise<OidcDiscovery> {
    requireBrowser();
    if (this.discovery) return this.discovery;

    const cached = readSession(STORAGE_KEYS.discovery);
    if (cached) {
      this.discovery = JSON.parse(cached) as OidcDiscovery;
      return this.discovery;
    }

    const authority = getAuthority();
    const disc = await fetchDiscovery(authority);
    this.discovery = disc;
    saveSession(STORAGE_KEYS.discovery, JSON.stringify(disc));
    return disc;
  }

  async startLogin(options?: {
    redirectPath?: string;
    postLoginRedirect?: string;
  }): Promise<void> {
    requireBrowser();
    const disc = await this.getDiscovery();

    if (!disc.code_challenge_methods_supported?.includes("S256")) {
      // Keycloak should support this; fail-fast in enterprise setups.
      throw new Error("Keycloak does not advertise PKCE S256 support");
    }

    const state = randomString(16);
    const nonce = randomString(16);
    const codeVerifier = randomString(64);
    const codeChallenge = await sha256Base64url(codeVerifier);

    saveSession(STORAGE_KEYS.state, state);
    saveSession(STORAGE_KEYS.nonce, nonce);
    saveSession(STORAGE_KEYS.codeVerifier, codeVerifier);
    if (options?.postLoginRedirect) {
      saveSession(STORAGE_KEYS.postLoginRedirect, options.postLoginRedirect);
    }

    const redirectPath = options?.redirectPath || "/auth/callback";
    const redirectUri = getRedirectUriForCurrentOrigin(redirectPath);

    const u = new URL(disc.authorization_endpoint);
    u.searchParams.set("client_id", getClientId());
    u.searchParams.set("response_type", "code");
    u.searchParams.set("redirect_uri", redirectUri);
    u.searchParams.set("scope", getScope());
    u.searchParams.set("state", state);
    u.searchParams.set("nonce", nonce);
    u.searchParams.set("code_challenge", codeChallenge);
    u.searchParams.set("code_challenge_method", "S256");

    window.location.assign(u.toString());
  }

  async exchangeCodeForTokens(params: {
    code: string;
    state: string;
    redirectPath?: string;
  }): Promise<TokenResponse> {
    requireBrowser();
    const disc = await this.getDiscovery();

    const expectedState = readSession(STORAGE_KEYS.state);
    const codeVerifier = readSession(STORAGE_KEYS.codeVerifier);

    if (!expectedState || params.state !== expectedState) {
      throw new Error("Invalid state (possible CSRF)");
    }
    if (!codeVerifier) throw new Error("Missing PKCE code_verifier");

    const redirectPath = params.redirectPath || "/auth/callback";
    const redirectUri = getRedirectUriForCurrentOrigin(redirectPath);

    const body = new URLSearchParams();
    body.set("grant_type", "authorization_code");
    body.set("client_id", getClientId());
    body.set("code", params.code);
    body.set("redirect_uri", redirectUri);
    body.set("code_verifier", codeVerifier);

    const res = await fetch(disc.token_endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Token exchange failed (${res.status}) ${text}`);
    }

    const tokens = (await res.json()) as TokenResponse;

    // One-time use values
    clearSession([STORAGE_KEYS.state, STORAGE_KEYS.codeVerifier]);
    return tokens;
  }

  async refresh(refreshToken: string): Promise<TokenResponse> {
    requireBrowser();
    const disc = await this.getDiscovery();
    const body = new URLSearchParams();
    body.set("grant_type", "refresh_token");
    body.set("client_id", getClientId());
    body.set("refresh_token", refreshToken);

    const res = await fetch(disc.token_endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Refresh failed (${res.status}) ${text}`);
    }
    return (await res.json()) as TokenResponse;
  }

  async startLogout(options?: {
    idTokenHint?: string;
    postLogoutRedirectPath?: string;
  }): Promise<void> {
    requireBrowser();
    const disc = await this.getDiscovery();
    const endSession = disc.end_session_endpoint;
    if (!endSession) {
      // Fallback: just clear local tokens (caller handles) if endpoint not exposed.
      return;
    }
    const postLogoutRedirectPath = options?.postLogoutRedirectPath || "/";
    const postLogoutRedirectUri = getRedirectUriForCurrentOrigin(postLogoutRedirectPath);

    const u = new URL(endSession);
    if (options?.idTokenHint) u.searchParams.set("id_token_hint", options.idTokenHint);
    u.searchParams.set("post_logout_redirect_uri", postLogoutRedirectUri);
    u.searchParams.set("client_id", getClientId());

    window.location.assign(u.toString());
  }

  getPostLoginRedirect(): string | null {
    requireBrowser();
    return readSession(STORAGE_KEYS.postLoginRedirect);
  }

  clearPostLoginRedirect(): void {
    requireBrowser();
    sessionStorage.removeItem(STORAGE_KEYS.postLoginRedirect);
  }

  buildForgotPasswordUrl(): string {
    const authority = getAuthority();
    const u = new URL(`${authority}/login-actions/reset-credentials`);
    u.searchParams.set("client_id", getClientId());
    return u.toString();
  }

  buildAccountUrl(): string {
    return `${getAuthority()}/account`;
  }
}

export const keycloakOidc = new KeycloakOidcService();

