/**
 * ENTERPRISE-GRADE DYNAMIC FEATURE CATALOG SYSTEM (FRONTEND)
 * 
 * SOURCE DE VÉRITÉ: API Backend (/api/v1/platform/feature-flags/catalog)
 * - Pas de hardcoding des clés
 * - Chargement automatique au démarrage de l'app
 * - Cache React Query (staleTime 1h)
 * - Type-safe avec TypeScript
 * - Invalidation automatique
 * 
 * UTILISATION:
 * ```typescript
 * import { useFeatureCatalog, useFeatureKeys } from '@/hooks/useFeatureCatalog';
 * 
 * // Dans un composant
 * const { data: catalog, isLoading } = useFeatureCatalog();
 * const { keys, hasKey } = useFeatureKeys();
 * 
 * if (hasKey('module.sales')) {
 *   // Feature disponible
 * }
 * ```
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useMemo } from 'react';

// Types
export interface FeatureCatalogEntry {
  key: string;
  name: string;
  description?: string;
  category: string;
  feature_type: string;
  status: string;
  dependencies?: string[];
  metadata?: {
    icon?: string;
    color?: string;
    order?: number;
    ui_section?: string;
    requires_config?: boolean;
  };
}

export interface FeatureCatalogResponse {
  features: FeatureCatalogEntry[];
  categories: string[];
  total: number;
  cached_at: string;
  cache_ttl_seconds: number;
}

export interface FeatureKeysResponse {
  keys: string[];
  total: number;
}

export interface CategoryResponse {
  categories: Array<{
    name: string;
    count: number;
    label: string;
  }>;
  total: number;
}

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const CATALOG_ENDPOINT = `${API_BASE_URL}/api/v1/platform/feature-flags/catalog`;

/**
 * Fetch le catalogue complet depuis l'API
 */
async function fetchFeatureCatalog(
  activeOnly = true,
  category?: string
): Promise<FeatureCatalogResponse> {
  const params = new URLSearchParams();
  if (!activeOnly) params.append('activeOnly', 'false');
  if (category) params.append('category', category);

  const url = `${CATALOG_ENDPOINT}?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch feature catalog: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch uniquement les clés (léger)
 */
async function fetchFeatureKeys(activeOnly = true): Promise<FeatureKeysResponse> {
  const params = new URLSearchParams();
  if (!activeOnly) params.append('activeOnly', 'false');

  const url = `${CATALOG_ENDPOINT}/keys?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch feature keys: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch les catégories
 */
async function fetchCategories(): Promise<CategoryResponse> {
  const url = `${CATALOG_ENDPOINT}/categories`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Hook principal pour récupérer le catalogue complet
 * 
 * @param activeOnly - Filtrer uniquement les features actives (défaut: true)
 * @param category - Filtrer par catégorie (optionnel)
 * @returns Query result avec le catalogue
 * 
 * @example
 * ```typescript
 * const { data, isLoading, error } = useFeatureCatalog();
 * 
 * if (isLoading) return <Spinner />;
 * if (error) return <Error />;
 * 
 * return (
 *   <div>
 *     {data.features.map(feature => (
 *       <FeatureCard key={feature.key} feature={feature} />
 *     ))}
 *   </div>
 * );
 * ```
 */
export function useFeatureCatalog(
  activeOnly = true,
  category?: string
): UseQueryResult<FeatureCatalogResponse, Error> {
  return useQuery({
    queryKey: ['feature-catalog', activeOnly, category],
    queryFn: () => fetchFeatureCatalog(activeOnly, category),
    staleTime: 1000 * 60 * 60, // 1 heure (même que le cache backend)
    gcTime: 1000 * 60 * 60 * 2, // 2 heures
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook léger pour récupérer uniquement les clés
 * Utilisé pour validation rapide des features
 * 
 * @param activeOnly - Filtrer uniquement les features actives (défaut: true)
 * @returns Query result avec les clés + helpers
 * 
 * @example
 * ```typescript
 * const { keys, hasKey, isLoading } = useFeatureKeys();
 * 
 * if (hasKey('module.sales')) {
 *   return <SalesModule />;
 * }
 * ```
 */
export function useFeatureKeys(activeOnly = true) {
  const query = useQuery({
    queryKey: ['feature-keys', activeOnly],
    queryFn: () => fetchFeatureKeys(activeOnly),
    staleTime: 1000 * 60 * 60, // 1 heure
    gcTime: 1000 * 60 * 60 * 2, // 2 heures
    retry: 3,
  });

  const helpers = useMemo(() => {
    const keys = query.data?.keys || [];
    const keysSet = new Set(keys.map(k => k.toLowerCase()));

    return {
      keys,
      total: query.data?.total || 0,
      hasKey: (key: string) => keysSet.has(key.toLowerCase()),
      getConstantName: (key: string) => key.toUpperCase().replace(/\./g, '_'),
    };
  }, [query.data]);

  return {
    ...query,
    ...helpers,
  };
}

/**
 * Hook pour récupérer les catégories
 * 
 * @example
 * ```typescript
 * const { data: categories, isLoading } = useCategories();
 * 
 * return (
 *   <CategoryFilter>
 *     {categories?.categories.map(cat => (
 *       <CategoryButton key={cat.name} category={cat} />
 *     ))}
 *   </CategoryFilter>
 * );
 * ```
 */
export function useCategories(): UseQueryResult<CategoryResponse, Error> {
  return useQuery({
    queryKey: ['feature-categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 60, // 1 heure
    gcTime: 1000 * 60 * 60 * 2, // 2 heures
    retry: 3,
  });
}

/**
 * Hook pour vérifier si une feature spécifique est disponible
 * 
 * @param featureKey - Clé de la feature (ex: 'module.sales')
 * @returns true si la feature existe et est active
 * 
 * @example
 * ```typescript
 * const hasSales = useHasFeature('module.sales');
 * 
 * if (!hasSales) {
 *   return <UpgradePrompt />;
 * }
 * ```
 */
export function useHasFeature(featureKey: string): boolean {
  const { hasKey, isLoading } = useFeatureKeys();
  
  if (isLoading) return false;
  return hasKey(featureKey);
}

/**
 * Hook pour récupérer une feature spécifique avec ses metadata
 * 
 * @param featureKey - Clé de la feature (ex: 'module.sales')
 * @returns Feature entry ou undefined
 * 
 * @example
 * ```typescript
 * const salesFeature = useFeature('module.sales');
 * 
 * return (
 *   <FeatureCard
 *     icon={salesFeature?.metadata?.icon}
 *     name={salesFeature?.name}
 *     description={salesFeature?.description}
 *   />
 * );
 * ```
 */
export function useFeature(featureKey: string): FeatureCatalogEntry | undefined {
  const { data } = useFeatureCatalog();
  
  return useMemo(() => {
    return data?.features.find(f => f.key.toLowerCase() === featureKey.toLowerCase());
  }, [data, featureKey]);
}
