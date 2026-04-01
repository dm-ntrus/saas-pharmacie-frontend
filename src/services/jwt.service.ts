import { JWTPayload } from "@/types/types";
import { jwtDecode } from "jwt-decode";

export interface Organization {
  id: string; // Organization Keycloak ID
  name: string; // Nom de l'organisation
  roles: string[]; // Rôles dans cette organisation
  attributes: {
    tenant_id: string[]; // ID du tenant en DB
    subdomain: string[]; // Sous-domaine
    [key: string]: string[];
  };
}

class JWTService {
  // Décoder le token
  decode(token: string): JWTPayload {
    try {
      return jwtDecode<JWTPayload>(token);
    } catch {
      throw new Error("Invalid JWT token");
    }
  }

  // Extraire les organizations
  getOrganizations(token: string): Organization[] {
    const payload = this.decode(token);
    return payload.organizations || [];
  }

  // Extraire l'ID utilisateur
  getUserId(token: string): string {
    const payload = this.decode(token);
    return payload.sub;
  }

  // Extraire l'email
  getEmail(token: string): string {
    const payload = this.decode(token);
    return payload.email;
  }

  // Vérifier si l'utilisateur a un rôle dans une organization
  hasRoleInOrganization(
    token: string,
    organizationId: string,
    role: string
  ): boolean {
    const organizations = this.getOrganizations(token);
    const org = organizations.find((o) => o.id === organizationId);
    return org?.roles.includes(role) || false;
  }

  // Vérifier si le token est valide
  isValid(token: string): boolean {
    try {
      const payload = this.decode(token);
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
}

export const jwtService = new JWTService();
