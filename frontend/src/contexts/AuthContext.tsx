import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
  id: string;
  username: string;
  role: 'boyfriend' | 'girlfriend';
  display_name: string;
  partner_id: string | null;
  anniversary_date: string | null;
  relationship_start: string | null;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  username: string;
  role: 'boyfriend' | 'girlfriend';
  display_name: string;
}

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

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await loadUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await loadUserProfile(session.user.id);
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserProfile = async (authUserId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', authUserId)
        .single();

      if (error) throw error;
      if (data) {
        setUser(data as User);
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

  const login = async (data: LoginData) => {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      if (authData.user) {
        await loadUserProfile(authData.user.id);
        toast({
          title: "Welcome back! 💕",
          description: `Good to see you!`,
        });
      }
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
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            auth_user_id: authData.user.id,
            username: data.username,
            role: data.role,
            display_name: data.display_name,
          });

        if (profileError) throw profileError;

        toast({
          title: "Registration successful! 🎉",
          description: "Please log in with your new account.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Could not create account",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast({
        title: "Logged out",
        description: "Come back soon! 💕",
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const linkPartner = async (partnerUsername: string) => {
    try {
      if (!user) throw new Error('Not authenticated');

      // Find partner by username
      const { data: partner, error: findError } = await supabase
        .from('users')
        .select('id')
        .eq('username', partnerUsername)
        .single();

      if (findError) throw new Error('Partner not found');

      // Update current user's partner_id
      const { error: updateError } = await supabase
        .from('users')
        .update({ partner_id: partner.id })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Update partner's partner_id to link back
      await supabase
        .from('users')
        .update({ partner_id: user.id })
        .eq('id', partner.id);

      await refreshUser();
      toast({
        title: "Partner linked! 💑",
        description: `Successfully linked with ${partnerUsername}`,
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
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await loadUserProfile(session.user.id);
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
