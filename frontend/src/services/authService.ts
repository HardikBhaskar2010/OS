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
    throw new Error("Registration is disabled.");
  },

  async login(data: LoginData): Promise<LoginResponse> {
    // Hardcoded credentials for personal use
    const users: Record<string, User & { password_hash: string }> = {
      "boyfriend": {
        id: "1",
        username: "boyfriend",
        password_hash: "love123", // Simple password for now
        role: "boyfriend",
        display_name: "BF",
        created_at: new Date().toISOString()
      },
      "girlfriend": {
        id: "2",
        username: "girlfriend",
        password_hash: "love456", // Simple password for now
        role: "girlfriend",
        display_name: "GF",
        created_at: new Date().toISOString()
      }
    };

    const user = users[data.username.toLowerCase()];
    if (user && user.password_hash === data.password) {
      const { password_hash, ...userWithoutPassword } = user;
      const response = {
        access_token: "mock_token_" + user.id,
        token_type: "bearer",
        user: userWithoutPassword
      };
      setAuthToken(response.access_token);
      return response;
    }
    
    throw new Error("Invalid username or password");
  },

  async getCurrentUser(): Promise<User> {
    const token = getAuthToken();
    if (token === "mock_token_1") {
      return {
        id: "1",
        username: "boyfriend",
        role: "boyfriend",
        display_name: "BF",
        created_at: new Date().toISOString()
      };
    } else if (token === "mock_token_2") {
      return {
        id: "2",
        username: "girlfriend",
        role: "girlfriend",
        display_name: "GF",
        created_at: new Date().toISOString()
      };
    }
    throw new Error("Not authenticated");
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
