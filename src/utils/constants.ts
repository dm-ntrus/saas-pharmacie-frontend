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