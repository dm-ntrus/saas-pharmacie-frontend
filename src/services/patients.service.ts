import { apiService } from "./api.service";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address?: string;
  city?: string;
  insuranceNumber?: string;
  insuranceProvider?: string;
  allergies?: string[];
  chronicConditions?: string[];
  createdAt: string;
}

interface CreatePatientDto {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address?: string;
  city?: string;
  insuranceNumber?: string;
  insuranceProvider?: string;
  allergies?: string[];
  chronicConditions?: string[];
}

class PatientsService {
  private getBasePath(orgId: string) {
    return `/api/organizations/${orgId}/patients`;
  }
  
  /**
   * Récupérer tous les patients
   */
  async getPatients(orgId: string): Promise<Patient[]> {
    return apiService.get<Patient[]>(this.getBasePath(orgId));
  }
  
  /**
   * Créer un nouveau patient
   */
  async createPatient(orgId: string, data: CreatePatientDto): Promise<Patient> {
    return apiService.post<Patient>(this.getBasePath(orgId), data);
  }
  
  /**
   * Rechercher des patients
   */
  async searchPatients(orgId: string, query: string): Promise<Patient[]> {
    return apiService.get<Patient[]>(
      `${this.getBasePath(orgId)}/search?q=${encodeURIComponent(query)}`
    );
  }
  
  /**
   * Obtenir l'historique d'un patient
   */
  async getPatientHistory(orgId: string, patientId: string): Promise<{
    prescriptions: any[];
    sales: any[];
    visits: any[];
  }> {
    return apiService.get(
      `${this.getBasePath(orgId)}/${patientId}/history`
    );
  }
}

export const patientsService = new PatientsService();