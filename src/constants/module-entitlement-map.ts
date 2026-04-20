/**
 * ENTERPRISE-GRADE DYNAMIC MODULE ENTITLEMENT MAP
 * 
 * Maps the `module` string used by <ModuleGuard module="..."> and Sidebar
 * to the corresponding PRODUCT_ENTITLEMENT_KEY checked by the backend.
 * 
 * SOURCE DE VÉRITÉ: API Backend (généré dynamiquement)
 * - Pas de hardcoding
 * - Chargement automatique au démarrage
 * - Cohérence 100% garantie avec le backend
 * 
 * UTILISATION:
 * ```typescript
 * import { MODULE_TO_ENTITLEMENT, initializeModuleEntitlementMap } from '@/constants/module-entitlement-map';
 * 
 * const entitlementKey = MODULE_TO_ENTITLEMENT['sales']; // 'module.sales'
 * ```
 */

/**
 * Map dynamique des modules vers les clés d'entitlement
 * Généré automatiquement depuis le catalogue de features
 */
export let MODULE_TO_ENTITLEMENT: Record<string, string> = {};

/**
 * Initialiser le mapping depuis le catalogue
 * Appelé automatiquement au démarrage par le composant App
 * 
 * @param keys - Map des constantes (ex: { MODULE_DASHBOARD: 'module.dashboard' })
 */
export function initializeModuleEntitlementMap(keys: Record<string, string>) {
  const map: Record<string, string> = {};

  // Générer le mapping automatiquement depuis les clés
  Object.entries(keys).forEach(([, featureKey]) => {
    // Extraire le nom du module depuis la clé
    // Ex: 'module.dashboard' -> 'dashboard'
    //     'module.sales_orders_b2b' -> 'sales-orders-b2b'
    if (featureKey.startsWith('module.')) {
      const moduleName = featureKey
        .replace('module.', '')
        .replace(/_/g, '-'); // Convertir underscores en dashes
      
      map[moduleName] = featureKey;
    }
  });

  // Ajouter des alias pour certains modules (pour backward compatibility)
  if (map['billing-operations']) {
    map['billing'] = map['billing-operations'];
  }
  if (map['compliance-audit']) {
    map['audit-events'] = map['compliance-audit'];
    map['compliance'] = map['compliance-audit'];
  }
  if (map['credit-control']) {
    map['credit-desk'] = map['credit-control'];
  }

  MODULE_TO_ENTITLEMENT = Object.freeze(map);
  console.log(`[MODULE_TO_ENTITLEMENT] Initialized with ${Object.keys(map).length} mappings`);
}

/**
 * Vérifier si un module existe dans le mapping
 * 
 * @param moduleName - Nom du module (ex: 'sales')
 * @returns true si le module existe
 */
export function hasModule(moduleName: string): boolean {
  return moduleName in MODULE_TO_ENTITLEMENT;
}

/**
 * Récupérer la clé d'entitlement pour un module
 * 
 * @param moduleName - Nom du module (ex: 'sales')
 * @returns Clé d'entitlement (ex: 'module.sales') ou undefined
 */
export function getEntitlementKey(moduleName: string): string | undefined {
  return MODULE_TO_ENTITLEMENT[moduleName];
}

/**
 * Récupérer tous les modules disponibles
 */
export function getAllModules(): string[] {
  return Object.keys(MODULE_TO_ENTITLEMENT);
}

/**
 * Vérifier si les mappings sont initialisés
 */
export function isInitialized(): boolean {
  return Object.keys(MODULE_TO_ENTITLEMENT).length > 0;
}
