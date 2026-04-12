/**
 * @deprecated LEGACY — This entire file is superseded by `FeatureFlagContext`
 * (`useFeatureFlags()`) which fetches plan entitlements from the backend API.
 * The static in-memory flags here are NOT connected to the billing system
 * and should NOT be used for module gating.
 *
 * Migration: use `useFeatureFlags().isFeatureEnabled(key)` from
 * `@/context/FeatureFlagContext` with keys from `@/constants/product-entitlement-keys`.
 *
 * This file will be removed in the next major cleanup.
 */
import React from 'react';

export interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage?: number;
  targetUsers?: string[];
  targetPlans?: string[];
  environment?: 'development' | 'staging' | 'production' | 'all';
  expiresAt?: string;
}

export interface UserContext {
  userId?: string;
  email?: string;
  plan?: 'simple' | 'moyenne' | 'standard' | 'grossiste';
  tenantId?: string;
  country?: string;
  isAdmin?: boolean;
}

// Configuration des feature flags
const FEATURE_FLAGS: FeatureFlag[] = [
  // Fonctionnalités Core
  {
    key: 'pos_advanced_discounts',
    name: 'Remises Avancées POS',
    description: 'Système de remises complexes avec règles conditionnelles',
    enabled: true,
    targetPlans: ['standard', 'grossiste']
  },
  {
    key: 'mobile_money_integration',
    name: 'Mobile Money Complet',
    description: 'Intégration complète avec tous les opérateurs Mobile Money',
    enabled: true,
    rolloutPercentage: 100
  },
  {
    key: 'prescription_ai_validation',
    name: 'Validation IA Prescriptions',
    description: 'Validation automatique des prescriptions par intelligence artificielle',
    enabled: true,
    targetPlans: ['standard', 'grossiste'],
    rolloutPercentage: 75
  },
  
  // Fonctionnalités Analytics
  {
    key: 'advanced_analytics',
    name: 'Analytics Avancées',
    description: 'Tableaux de bord BI avec prédictions et recommandations',
    enabled: true,
    targetPlans: ['moyenne', 'standard', 'grossiste']
  },
  {
    key: 'predictive_inventory',
    name: 'Prédiction Inventaire',
    description: 'Algorithmes de prédiction de stock et optimisation automatique',
    enabled: true,
    targetPlans: ['standard', 'grossiste'],
    rolloutPercentage: 60
  },
  {
    key: 'customer_segmentation',
    name: 'Segmentation Client IA',
    description: 'Segmentation automatique des clients par IA',
    enabled: false,
    targetPlans: ['standard', 'grossiste'],
    environment: 'development'
  },

  // Modules Avancés
  {
    key: 'telemedicine_module',
    name: 'Module Télémédecine',
    description: 'Consultations vidéo et prescriptions à distance',
    enabled: true,
    targetPlans: ['standard', 'grossiste']
  },
  {
    key: 'laboratory_module',
    name: 'Module Laboratoire',
    description: 'Gestion complète des analyses et préparations magistrales',
    enabled: true,
    targetPlans: ['standard', 'grossiste']
  },
  {
    key: 'ecommerce_module',
    name: 'E-commerce Intégré',
    description: 'Boutique en ligne avec livraison et paiement',
    enabled: true,
    targetPlans: ['moyenne', 'standard', 'grossiste'],
    rolloutPercentage: 80
  },
  
  // Fonctionnalités Expérimentales
  {
    key: 'blockchain_traceability',
    name: 'Traçabilité Blockchain',
    description: 'Traçabilité pharmaceutique sur blockchain',
    enabled: false,
    targetPlans: ['grossiste'],
    environment: 'development',
    rolloutPercentage: 10
  },
  {
    key: 'voice_commands',
    name: 'Commandes Vocales',
    description: 'Interface vocale pour le point de vente',
    enabled: false,
    environment: 'development',
    rolloutPercentage: 5
  },
  {
    key: 'ar_scanner',
    name: 'Scanner AR',
    description: 'Scanner de médicaments en réalité augmentée',
    enabled: false,
    environment: 'development'
  },

  // Intégrations
  {
    key: 'api_webhooks',
    name: 'Webhooks API',
    description: 'Système de webhooks pour intégrations temps réel',
    enabled: true,
    targetPlans: ['standard', 'grossiste']
  },
  {
    key: 'third_party_erp',
    name: 'Intégration ERP Tiers',
    description: 'Connecteurs pour SAP, Oracle et autres ERP',
    enabled: true,
    targetPlans: ['grossiste']
  },
  {
    key: 'government_reporting',
    name: 'Rapports Gouvernementaux',
    description: 'Génération automatique des rapports réglementaires',
    enabled: true,
    rolloutPercentage: 100
  },

  // UX/UI
  {
    key: 'dark_mode',
    name: 'Mode Sombre',
    description: 'Interface en mode sombre',
    enabled: true,
    rolloutPercentage: 100
  },
  {
    key: 'mobile_app_redesign',
    name: 'Nouvelle Interface Mobile',
    description: 'Interface mobile redessinée',
    enabled: false,
    rolloutPercentage: 20,
    environment: 'development'
  },
  {
    key: 'gesture_navigation',
    name: 'Navigation Gestuelle',
    description: 'Navigation par gestes sur tablette',
    enabled: false,
    environment: 'development'
  },

  // Sécurité et Conformité
  {
    key: 'enhanced_audit_logs',
    name: 'Logs d\'Audit Renforcés',
    description: 'Logs détaillés pour conformité renforcée',
    enabled: true,
    targetPlans: ['standard', 'grossiste']
  },
  {
    key: 'biometric_auth',
    name: 'Authentification Biométrique',
    description: 'Connexion par empreinte digitale ou visage',
    enabled: false,
    rolloutPercentage: 15,
    environment: 'development'
  },
  {
    key: 'gdpr_enhanced',
    name: 'RGPD Renforcé',
    description: 'Fonctionnalités RGPD avancées',
    enabled: true,
    rolloutPercentage: 100
  }
];

class FeatureFlagService {
  private flags: Map<string, FeatureFlag>;
  private userContext: UserContext | null = null;
  
  constructor() {
    this.flags = new Map();
    this.loadFlags();
  }

  private loadFlags(): void {
    FEATURE_FLAGS.forEach(flag => {
      this.flags.set(flag.key, flag);
    });
  }

  setUserContext(context: UserContext): void {
    this.userContext = context;
  }

  isEnabled(flagKey: string): boolean {
    const flag = this.flags.get(flagKey);
    if (!flag) return false;

    // Vérifier l'environnement
    const currentEnv = process.env.NODE_ENV || 'development';
    if (flag.environment && flag.environment !== 'all' && flag.environment !== currentEnv) {
      return false;
    }

    // Vérifier si le flag est globalement désactivé
    if (!flag.enabled) return false;

    // Vérifier l'expiration
    if (flag.expiresAt && new Date(flag.expiresAt) < new Date()) {
      return false;
    }

    // Vérifier les utilisateurs ciblés
    if (flag.targetUsers && this.userContext?.userId) {
      if (!flag.targetUsers.includes(this.userContext.userId)) {
        return false;
      }
    }

    // Vérifier les plans ciblés
    if (flag.targetPlans && this.userContext?.plan) {
      if (!flag.targetPlans.includes(this.userContext.plan)) {
        return false;
      }
    }

    // Vérifier le rollout percentage
    if (flag.rolloutPercentage && flag.rolloutPercentage < 100) {
      const userId = this.userContext?.userId || 'anonymous';
      const hash = this.hashString(flagKey + userId);
      const percentage = hash % 100;
      if (percentage >= flag.rolloutPercentage) {
        return false;
      }
    }

    return true;
  }

  getFlag(flagKey: string): FeatureFlag | undefined {
    return this.flags.get(flagKey);
  }

  getAllFlags(): FeatureFlag[] {
    return Array.from(this.flags.values());
  }

  getEnabledFlags(): FeatureFlag[] {
    return this.getAllFlags().filter(flag => this.isEnabled(flag.key));
  }

  // Méthodes pour la gestion dynamique des flags
  enableFlag(flagKey: string): void {
    const flag = this.flags.get(flagKey);
    if (flag) {
      flag.enabled = true;
      this.flags.set(flagKey, flag);
    }
  }

  disableFlag(flagKey: string): void {
    const flag = this.flags.get(flagKey);
    if (flag) {
      flag.enabled = false;
      this.flags.set(flagKey, flag);
    }
  }

  updateRolloutPercentage(flagKey: string, percentage: number): void {
    const flag = this.flags.get(flagKey);
    if (flag) {
      flag.rolloutPercentage = Math.max(0, Math.min(100, percentage));
      this.flags.set(flagKey, flag);
    }
  }

  // Fonction de hachage simple pour la distribution du rollout
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convertir en 32-bit integer
    }
    return Math.abs(hash);
  }
}

// Instance singleton du service
export const featureFlags = new FeatureFlagService();

// Hooks et utilitaires pour React
export const useFeatureFlag = (flagKey: string): boolean => {
  return featureFlags.isEnabled(flagKey);
};

export const useFeatureFlags = (flagKeys: string[]): Record<string, boolean> => {
  const flags: Record<string, boolean> = {};
  flagKeys.forEach(key => {
    flags[key] = featureFlags.isEnabled(key);
  });
  return flags;
};

// HOC pour conditionner l'affichage de composants
export function withFeatureFlag<T extends object>(
  Component: React.ComponentType<T>,
  flagKey: string,
  fallback?: React.ComponentType<T>
) {
  return function FeatureFlaggedComponent(props: T) {
    const isEnabled = featureFlags.isEnabled(flagKey);
    
    if (isEnabled) {
      return React.createElement(Component, props);
    }
    
    if (fallback) {
      return React.createElement(fallback, props);
    }
    
    return null;
  };
}

// Constantes pour les flags les plus utilisés
export const FLAGS = {
  // Core Features
  POS_ADVANCED_DISCOUNTS: 'pos_advanced_discounts',
  MOBILE_MONEY_INTEGRATION: 'mobile_money_integration',
  PRESCRIPTION_AI_VALIDATION: 'prescription_ai_validation',
  
  // Analytics
  ADVANCED_ANALYTICS: 'advanced_analytics',
  PREDICTIVE_INVENTORY: 'predictive_inventory',
  CUSTOMER_SEGMENTATION: 'customer_segmentation',
  
  // Modules
  TELEMEDICINE_MODULE: 'telemedicine_module',
  LABORATORY_MODULE: 'laboratory_module',
  ECOMMERCE_MODULE: 'ecommerce_module',
  
  // Experimental
  BLOCKCHAIN_TRACEABILITY: 'blockchain_traceability',
  VOICE_COMMANDS: 'voice_commands',
  AR_SCANNER: 'ar_scanner',
  
  // UI/UX
  DARK_MODE: 'dark_mode',
  MOBILE_APP_REDESIGN: 'mobile_app_redesign',
  GESTURE_NAVIGATION: 'gesture_navigation',
  
  // Security
  ENHANCED_AUDIT_LOGS: 'enhanced_audit_logs',
  BIOMETRIC_AUTH: 'biometric_auth',
  GDPR_ENHANCED: 'gdpr_enhanced'
} as const;

export default featureFlags;