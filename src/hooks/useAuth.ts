import React, { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { apiClient } from '@/lib/apiClient';
import type { User, UserRole } from '@/types';

// Ajout : gestion du feedback utilisateur
import { toast } from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Vérification de l'authentification au chargement
  useEffect(() => {
    checkAuth();
  }, []);

  // Ajout : gestion du refresh token automatique
  useEffect(() => {
    // Intercepte les erreurs 401 pour tenter un refresh
    const interceptor = apiClient['client'].interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          try {
            // Tente de rafraîchir le token
            await apiClient.refreshToken();
            // Rejoue la requête originale
            return apiClient['client'](error.config);
          } catch (refreshError) {
            // Échec du refresh : déconnexion + feedback
            toast.error('Votre session a expiré. Veuillez vous reconnecter.');
            logout();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
    return () => {
      apiClient['client'].interceptors.response.eject(interceptor);
    };
  }, []);

  const checkAuth = async () => {
    try {
      const token = apiClient.getToken();
      
      if (!token) {
        setLoading(false);
        return;
      }

      const userData = await apiClient.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Erreur d\'authentification:', error);
      apiClient.logout(); // Nettoyer le token invalide
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { user: userData } = await apiClient.login(email, password);
      setUser(userData);
      
      // Redirection vers le tableau de bord
      router.push('/dashboard');
    } catch (error) {
      throw error; // Laisser le composant gérer l'erreur
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setLoading(true);
      const { user: newUser } = await apiClient.register(userData);
      setUser(newUser);
      
      // Redirection vers le tableau de bord
      router.push('/dashboard');
    } catch (error) {
      throw error; // Laisser le composant gérer l'erreur
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    apiClient.logout();
    setUser(null);
    router.push('/login');
  };

  const hasRole = (role: string): boolean => {
    return user?.roles?.includes(role as UserRole) || false;
  };

  const hasPermission = (permission: string): boolean => {
    return user?.permissions?.includes(permission) || false;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return roles.some(role => hasRole(role));
  };

  const refetchUser = async () => {
    try {
      const userData = await apiClient.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    hasRole,
    hasPermission,
    hasAnyRole,
    refetchUser,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

// Hook pour protéger les routes
export const useRequireAuth = (requiredRoles?: string[]) => {
  const { user, loading, isAuthenticated, hasAnyRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (requiredRoles && requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
      router.push('/unauthorized');
      return;
    }
  }, [user, loading, isAuthenticated, hasAnyRole, requiredRoles, router]);

  return { user, loading, isAuthenticated };
};

// Hook pour rediriger si déjà connecté
export const useRedirectIfAuthenticated = (redirectTo: string = '/dashboard') => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, loading, redirectTo, router]);

  return { loading };
};