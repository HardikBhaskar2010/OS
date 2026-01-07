import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService, User, LoginData, RegisterData } from '../services/authService';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  linkPartner: (partnerUsername: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    if (authService.isAuthenticated()) {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Failed to load user:', error);
        authService.logout();
      }
    }
    setIsLoading(false);
  };

  const login = async (data: LoginData) => {
    try {
      const response = await authService.login(data);
      setUser(response.user);
      toast({
        title: "Welcome back! 💕",
        description: `Good to see you, ${response.user.display_name}!`,
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const user = await authService.register(data);
      toast({
        title: "Registration successful! 🎉",
        description: "Please log in with your new account.",
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Could not create account",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast({
      title: "Logged out",
      description: "Come back soon! 💕",
    });
  };

  const linkPartner = async (partnerUsername: string) => {
    try {
      const response = await authService.linkPartner(partnerUsername);
      await refreshUser();
      toast({
        title: "Partner linked! 💑",
        description: response.message,
      });
    } catch (error: any) {
      toast({
        title: "Failed to link partner",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const refreshUser = async () => {
    if (authService.isAuthenticated()) {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Failed to refresh user:', error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        linkPartner,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
