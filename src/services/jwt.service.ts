import { JWTPayload } from "@/types/types";
import { jwtDecode } from "jwt-decode";

export interface Organization {
  id: string;
  name: string;
  roles: string[];
  attributes?: {
    tenant_id?: string[];
    subdomain?: string[];
    [key: string]: string[] | undefined;
  };
}

/**
 * Normalise le claim `organizations` du JWT.
 *
 * - **Array** (enrichToken / legacy): retourné tel quel.
 * - **Map** (Keycloak 26+ scope `organization`): `{ slug: { id, roles } }` → tableau.
 */
export function normalizeJwtOrganizations(raw: unknown): Organization[] {
  if (!raw) return [];

  // Le mapper Keycloak peut configurer `organizations` en `jsonType: 'String'`,
  // donc le claim peut arriver comme une string JSON.
  if (typeof raw === "string") {
    const s = raw.trim();
    if (!s) return [];
    try {
      const parsed = JSON.parse(s);
      return normalizeJwtOrganizations(parsed);
    } catch {
      return [];
    }
  }

  if (Array.isArray(raw)) return raw as Organization[];

  if (typeof raw === "object") {
    return Object.entries(raw as Record<string, any>).map(([slug, val]) => ({
      id: val?.id ?? slug,
      name: slug,
      roles: val?.roles ?? [],
    }));
  }

  return [];
}

class JWTService {
  decode(token: string): JWTPayload {
    try {
      return jwtDecode<JWTPayload>(token);
    } catch {
      throw new Error("Invalid JWT token");
    }
  }

  getOrganizations(token: string): Organization[] {
    const payload = this.decode(token);
    return normalizeJwtOrganizations(payload.organizations);
  }

  getUserId(token: string): string {
    return this.decode(token).sub;
  }

  getEmail(token: string): string {
    return this.decode(token).email;
  }

  hasRoleInOrganization(
    token: string,
    organizationId: string,
    role: string,
  ): boolean {
    const organizations = this.getOrganizations(token);
    const org = organizations.find((o) => o.id === organizationId);
    return org?.roles.includes(role) || false;
  }

  isValid(token: string): boolean {
    try {
      return this.decode(token).exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
}

export const jwtService = new JWTService();
