import axios from 'axios';
import { KEYCLOAK_CONFIG } from '@/utils/constants';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: 'Bearer';
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const formData = new URLSearchParams({
      grant_type: 'password',
      client_id: KEYCLOAK_CONFIG.clientId,
      username: credentials.email,
      password: credentials.password,
      scope: 'openid profile email'
    });

    const response = await axios.post<LoginResponse>(
      `${KEYCLOAK_CONFIG.url}${KEYCLOAK_CONFIG.endpoints.token}`,
      formData.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response?.data?.error_description) {
      throw new Error(error.response.data.error_description);
    }
    throw new Error('Login failed');
  }
}
