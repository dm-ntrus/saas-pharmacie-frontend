

export interface JWTPayload {
  // Informations standard
  exp: number;                    // Expiration timestamp
  iat: number;                    // Issued at timestamp
  jti: string;                    // JWT ID
  iss: string;                    // Issuer
  sub: string;                    // Subject (Keycloak User ID)
  typ: 'Bearer';
  azp: string;                    // Authorized party (client ID)
  
  // Informations utilisateur
  email: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  
  // Rôles et permissions
  realm_access: {
    roles: string[];
  };
  resource_access: {
    [clientId: string]: {
      roles: string[];
    };
  };
  
  /**
   * Organizations claim. Two possible formats:
   * - **Array** (enrichToken / legacy): `[{ id, name, roles, attributes }]`
   * - **Map** (Keycloak 26+ scope `organization`): `{ slug: { id, roles } }`
   *
   * Use `normalizeJwtOrganizations()` from `jwt.service` to get a uniform array.
   */
  organizations:
    | Array<{
        id: string;
        name: string;
        roles: string[];
        attributes?: {
          tenant_id?: string[];
          subdomain?: string[];
          [key: string]: string[] | undefined;
        };
      }>
    | Record<string, { id?: string; roles?: string[] }>;
  
  // Tenant racine plateforme (toutes les orgs du JWT = pharmacies de ce tenant)
  tenant_id?: string;
  tenantId?: string;
}

enum FeatureType {
  BOOLEAN = 'boolean',           // On/Off simple
  QUANTITATIVE = 'quantitative', // Avec limites (ex: 1000 API calls/month)
  CONFIGURABLE = 'configurable'  // Avec configuration complexe
}

export interface Feature {
  key: string;
  name: string;
  type: FeatureType;
  enabled: boolean;
  limit?: number;              // Pour QUANTITATIVE
  softLimit?: number;          // Warning avant limite
  resetPeriod?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  config?: Record<string, any>; // Pour CONFIGURABLE
}


export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface PaginationParams {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}