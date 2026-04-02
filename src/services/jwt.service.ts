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
export function normalizeJwtOrganizations(
  raw: JWTPayload["organizations"] | undefined | null,
): Organization[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "object") {
    return Object.entries(raw).map(([slug, val]) => ({
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
