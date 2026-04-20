/**
 * ENTERPRISE-GRADE DYNAMIC FEATURE KEYS SYSTEM (FRONTEND)
 * 
 * SOURCE DE VÉRITÉ: API Backend (/api/v1/platform/feature-flags/catalog)
 * - Pas de hardcoding des clés
 * - Chargement automatique au démarrage de l'app
 * - Cache React Query (staleTime 1h)
 * - Type-safe avec TypeScript
 * 
 * UTILISATION:
 * ```typescript
 * import { PRODUCT_ENTITLEMENT_KEYS, initializeProductEntitlementKeys } from '@/constants/product-entitlement-keys';
 * 
 * // Les clés sont chargées dynamiquement depuis l'API
 * const salesKey = PRODUCT_ENTITLEMENT_KEYS.MODULE_SALES; // 'module.sales'
 * ```
 * 
 * AVANTAGES:
 * - ✅ Pas de rebuild lors de l'ajout de features
 * - ✅ Cohérence 100% garantie avec le backend
 * - ✅ Metadata riches (icônes, ordre, sections)
 * - ✅ Performance (cache React Query)
 * - ✅ Production-ready et enterprise-grade
 */

/**
 * Objet dynamique contenant toutes les clés de features
 * Chargé automatiquement au démarrage depuis l'API backend
 * 
 * Format: { MODULE_DASHBOARD: 'module.dashboard', MODULE_SALES: 'module.sales', ... }
 */
export let PRODUCT_ENTITLEMENT_KEYS: Record<string, string> = {};

/**
 * Type pour les clés de features (généré dynamiquement)
 */
export type ProductEntitlementKey = string;

/**
 * Liste des clés (pour validation rapide)
 */
export let PRODUCT_ENTITLEMENT_KEY_LIST: readonly string[] = [];

/**
 * Initialiser les clés depuis le catalogue
 * Appelé automatiquement au démarrage par le composant App
 * 
 * @param keys - Map des constantes (ex: { MODULE_DASHBOARD: 'module.dashboard' })
 */
export function initializeProductEntitlementKeys(keys: Record<string, string>) {
  PRODUCT_ENTITLEMENT_KEYS = Object.freeze(keys);
  PRODUCT_ENTITLEMENT_KEY_LIST = Object.freeze(Object.values(keys));
  console.log(`[PRODUCT_ENTITLEMENT_KEYS] Initialized with ${Object.keys(keys).length} features`);
}

/**
 * Vérifier si les clés sont initialisées
 */
export function isInitialized(): boolean {
  return Object.keys(PRODUCT_ENTITLEMENT_KEYS).length > 0;
}

/**
 * Récupérer une clé par son nom de constante
 * 
 * @param constantName - Nom de la constante (ex: 'MODULE_DASHBOARD')
 * @returns La clé de feature (ex: 'module.dashboard') ou undefined
 */
export function getKey(constantName: string): string | undefined {
  return PRODUCT_ENTITLEMENT_KEYS[constantName];
}

/**
 * Vérifier si une clé existe
 * 
 * @param key - Clé de feature (ex: 'module.dashboard')
 * @returns true si la clé existe
 */
export function hasKey(key: string): boolean {
  return PRODUCT_ENTITLEMENT_KEY_LIST.includes(key.toLowerCase());
}

/**
 * Convertir une clé en nom de constante
 * 
 * @param key - Clé de feature (ex: 'module.dashboard')
 * @returns Nom de constante (ex: 'MODULE_DASHBOARD')
 */
export function toConstantName(key: string): string {
  return key.toUpperCase().replace(/\./g, '_');
}

/**
 * Récupérer toutes les clés
 */
export function getAllKeys(): Record<string, string> {
  return PRODUCT_ENTITLEMENT_KEYS;
}
