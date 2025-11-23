import { AxiosError } from 'axios';
import { apiClient } from '@/helpers/auth-interceptor';

class ApiService {
  /**
   * Effectuer une requête GET
   */
  async get<T>(endpoint: string, config = {}): Promise<T> {
    try {
      const response = await apiClient.get<T>(endpoint, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Effectuer une requête POST
   */
  async post<T>(endpoint: string, data?: any, config = {}): Promise<T> {
    try {
      const response = await apiClient.post<T>(endpoint, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Effectuer une requête PUT
   */
  async put<T>(endpoint: string, data?: any, config = {}): Promise<T> {
    try {
      const response = await apiClient.put<T>(endpoint, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Effectuer une requête PATCH
   */
  async patch<T>(endpoint: string, data?: any, config = {}): Promise<T> {
    try {
      const response = await apiClient.patch<T>(endpoint, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Effectuer une requête DELETE
   */
  async delete<T>(endpoint: string, config = {}): Promise<T> {
    try {
      const response = await apiClient.delete<T>(endpoint, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Upload de fichiers avec FormData
   */
  async upload<T>(endpoint: string, formData: FormData, config = {}): Promise<T> {
    try {
      const response = await apiClient.post<T>(endpoint, formData, {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Gérer les erreurs
   */
  private handleError(error: unknown): Error {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const errorData = error.response?.data;
      const errorMessage = errorData?.message || errorData?.error || 'Une erreur est survenue';

      switch (status) {
        case 401:
          // Géré par l'intercepteur, mais au cas où
          return new Error('Session expirée. Veuillez vous reconnecter.');

        case 403:
          return new Error('Accès refusé. Vous n\'avez pas les permissions nécessaires.');

        case 404:
          return new Error('Ressource non trouvée.');

        case 422:
          return new Error(`Données invalides : ${errorMessage}`);

        case 429:
          return new Error('Trop de requêtes. Veuillez réessayer plus tard.');

        case 500:
          return new Error('Erreur serveur. Veuillez réessayer plus tard.');

        default:
          return new Error(errorMessage);
      }
    }

    // Erreur réseau ou autre
    if (error instanceof Error) {
      return error;
    }

    return new Error('Une erreur inattendue est survenue');
  }
}

export const apiService = new ApiService();