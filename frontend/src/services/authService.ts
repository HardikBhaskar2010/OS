import { apiRequest, setAuthToken, removeAuthToken, getAuthToken } from '../utils/api';

export interface User {
  id: string;
  username: string;
  role: 'boyfriend' | 'girlfriend';
  display_name: string;
  partner_id?: string;
  anniversary_date?: string;
  relationship_start?: string;
  created_at: string;
}

export interface RegisterData {
  username: string;
  password: string;
  role: string;
  display_name: string;
  anniversary_date?: string;
  relationship_start?: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export const authService = {
  async register(data: RegisterData): Promise<User> {
    const response = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  },

  async login(data: LoginData): Promise<LoginResponse> {
    const response = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setAuthToken(response.access_token);
    return response;
  },

  async getCurrentUser(): Promise<User> {
    return apiRequest('/api/auth/me', {
      method: 'GET',
    });
  },

  async linkPartner(partnerUsername: string): Promise<any> {
    return apiRequest('/api/auth/link-partner', {
      method: 'POST',
      body: JSON.stringify({ partner_username: partnerUsername }),
    });
  },

  logout(): void {
    removeAuthToken();
  },

  isAuthenticated(): boolean {
    return getAuthToken() !== null;
  },
};
