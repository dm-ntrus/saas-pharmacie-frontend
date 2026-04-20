/**
 * FEATURE CATALOG INITIALIZER
 * 
 * Composant qui charge le catalogue de features au démarrage de l'application
 * et initialise les constantes PRODUCT_ENTITLEMENT_KEYS et MODULE_TO_ENTITLEMENT
 * 
 * UTILISATION:
 * ```typescript
 * // Dans App.tsx
 * import { FeatureCatalogInitializer } from '@/components/FeatureCatalogInitializer';
 * 
 * function App() {
 *   return (
 *     <QueryClientProvider client={queryClient}>
 *       <FeatureCatalogInitializer>
 *         <YourApp />
 *       </FeatureCatalogInitializer>
 *     </QueryClientProvider>
 *   );
 * }
 * ```
 */

import { useEffect, ReactNode } from 'react';
import { useFeatureKeys } from '@/hooks/useFeatureCatalog';
import { initializeProductEntitlementKeys } from '@/constants/product-entitlement-keys';
import { initializeModuleEntitlementMap } from '@/constants/module-entitlement-map';

interface FeatureCatalogInitializerProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

/**
 * Composant d'initialisation du catalogue de features
 * 
 * Charge les clés depuis l'API au démarrage et initialise:
 * - PRODUCT_ENTITLEMENT_KEYS
 * - MODULE_TO_ENTITLEMENT
 * 
 * Affiche un fallback pendant le chargement et en cas d'erreur.
 */
export function FeatureCatalogInitializer({
  children,
  fallback = <LoadingFallback />,
  onError,
}: FeatureCatalogInitializerProps) {
  const { keys, isLoading, error } = useFeatureKeys();

  // Initialiser les constantes quand les clés sont chargées
  useEffect(() => {
    if (keys && keys.length > 0) {
      // Générer les constantes depuis les clés
      const constantsMap: Record<string, string> = {};
      
      keys.forEach(key => {
        // Convertir 'module.dashboard' en 'MODULE_DASHBOARD'
        const constantName = key.toUpperCase().replace(/\./g, '_');
        constantsMap[constantName] = key;
      });

      // Initialiser PRODUCT_ENTITLEMENT_KEYS
      initializeProductEntitlementKeys(constantsMap);

      // Initialiser MODULE_TO_ENTITLEMENT
      initializeModuleEntitlementMap(constantsMap);
    }
  }, [keys]);

  // Gérer les erreurs
  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  // Afficher le fallback pendant le chargement
  if (isLoading) {
    return <>{fallback}</>;
  }

  // Afficher une erreur si le chargement a échoué
  if (error) {
    return <ErrorFallback error={error} />;
  }

  // Afficher l'application une fois les clés chargées
  return <>{children}</>;
}

/**
 * Fallback de chargement par défaut
 */
function LoadingFallback() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: '1rem',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          border: '4px solid #f3f4f6',
          borderTopColor: '#3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <p style={{ color: '#6b7280', fontSize: '14px' }}>
        Chargement du catalogue de features...
      </p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

/**
 * Fallback d'erreur par défaut
 */
function ErrorFallback({ error }: { error: Error }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: '1rem',
        padding: '2rem',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: '#fee2e2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
        }}
      >
        ⚠️
      </div>
      <h2 style={{ color: '#dc2626', fontSize: '18px', fontWeight: 600 }}>
        Erreur de chargement
      </h2>
      <p style={{ color: '#6b7280', fontSize: '14px', textAlign: 'center', maxWidth: '400px' }}>
        Impossible de charger le catalogue de features. Veuillez vérifier votre connexion et réessayer.
      </p>
      <p style={{ color: '#9ca3af', fontSize: '12px', fontFamily: 'monospace' }}>
        {error.message}
      </p>
      <button
        onClick={() => window.location.reload()}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '0.375rem',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 500,
        }}
      >
        Réessayer
      </button>
    </div>
  );
}

/**
 * Hook pour vérifier si le catalogue est initialisé
 * 
 * @example
 * ```typescript
 * const isReady = useFeatureCatalogReady();
 * 
 * if (!isReady) {
 *   return <Spinner />;
 * }
 * ```
 */
export function useFeatureCatalogReady(): boolean {
  const { keys } = useFeatureKeys();
  return keys && keys.length > 0;
}
