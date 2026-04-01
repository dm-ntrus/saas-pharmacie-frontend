export const PERMISSIONS = {
  // Permissions de base
  read: 'Lecture des données',
  write: 'Création/Modification des données',
  delete: 'Suppression des données',
  
  // Permissions métier
  manage_users: 'Gestion des utilisateurs',
  manage_settings: 'Gestion des paramètres',
  manage_inventory: 'Gestion de l\'inventaire',
  manage_suppliers: 'Gestion des fournisseurs',
  process_sales: 'Traitement des ventes',
  manage_payments: 'Gestion des paiements',
  manage_prescriptions: 'Gestion des prescriptions',
  manage_patients: 'Gestion des patients',
  view_reports: 'Consultation des rapports',
  manage_billing: 'Gestion de la facturation',
  manage_integrations: 'Gestion des intégrations'
};

export const KEYCLOAK_CONFIG = {
  /**
   * Legacy config (dépréciée).
   * Le flux enterprise-grade utilise désormais la découverte OIDC via `keycloakOidc` (voir `src/services/keycloak-oidc.service.ts`)
   * et des variables d'env:
   * - NEXT_PUBLIC_KEYCLOAK_URL
   * - NEXT_PUBLIC_KEYCLOAK_REALM
   * - NEXT_PUBLIC_KEYCLOAK_CLIENT_ID
   */
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'https://backend.kipmoni.com:8443',
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'med-pharmacy',
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'spa-frontend',

  endpoints: {
    token: `/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'med-pharmacy'}/protocol/openid-connect/token`,
    userInfo: `/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'med-pharmacy'}/protocol/openid-connect/userinfo`,
    logout: `/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'med-pharmacy'}/protocol/openid-connect/logout`,
    register: `/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'med-pharmacy'}/protocol/openid-connect/registrations`,
  },
};







// Constantes de l'application
export const APP_CONFIG = {
  name: 'PharmacySaaS',
  version: '1.0.0',
  description: 'Plateforme SaaS de gestion des pharmacies',
  defaultCurrency: 'EUR',
  defaultLocale: 'fr-FR',
  defaultTimezone: 'Europe/Paris',
};

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
  },
  patients: '/patients',
  products: '/inventory/products',
  prescriptions: '/prescriptions',
  sales: '/sales',
  users: '/users',
  tenant: '/tenant',
  dashboard: '/analytics/dashboard',
  reports: '/reports',
};

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  PHARMACIST: 'pharmacist',
  TECHNICIAN: 'technician',
  CASHIER: 'cashier',
} as const;

export const PAGINATION = {
  defaultPageSize: 20,
  maxPageSize: 100,
  pageSizes: [10, 20, 50, 100],
};

export const DATE_FORMATS = {
  short: 'dd/MM/yyyy',
  long: 'dd MMMM yyyy',
  withTime: 'dd/MM/yyyy HH:mm',
  time: 'HH:mm',
};

export const VALIDATION_RULES = {
  email: {
    required: 'L\'email est requis',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Format d\'email invalide',
    },
  },
  password: {
    required: 'Le mot de passe est requis',
    minLength: {
      value: 6,
      message: 'Le mot de passe doit contenir au moins 6 caractères',
    },
  },
  phone: {
    required: 'Le numéro de téléphone est requis',
    pattern: {
      value: /^(\+33|0)[1-9](\d{8})$/,
      message: 'Numéro de téléphone français invalide',
    },
  },
  required: (fieldName: string) => `${fieldName} est requis`,
};

export const STORAGE_KEYS = {
  authToken: 'auth_token',
  userPreferences: 'user_preferences',
  tenantId: 'tenant_id',
  lastRoute: 'last_route',
};

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

export const QUERY_KEYS = {
  auth: ['auth'],
  user: ['user'],
  patients: ['patients'],
  products: ['products'],
  prescriptions: ['prescriptions'],
  sales: ['sales'],
  dashboard: ['dashboard'],
  stats: ['stats'],
  lowStockAlerts: ['low-stock-alerts'],
  expiringProducts: ['expiring-products'],
} as const;