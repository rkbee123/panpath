import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password?: string, isAdmin?: boolean) => Promise<any>;
  signIn: (email: string, password?: string) => Promise<any>;
  signOut: () => Promise<void>;
  verifyOTP: (email: string, token: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      checkAdminStatus(session?.user);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        checkAdminStatus(session?.user);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (user: User | null) => {
    if (!user) {
      setIsAdmin(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        setIsAdmin(data.role === 'admin');
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const signUp = async (email: string, password?: string, isAdmin = false) => {
    if (isAdmin && password) {
      // Admin signup with password
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'admin'
          }
        }
      });

      if (!error && data.user) {
        // Create admin profile
        await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            role: 'admin'
          });
      }

      return { data, error };
    } else {
      // Regular user signup with OTP
      return await supabase.auth.signInWithOtp({
        email,
        options: {
          data: {
            role: 'user'
          }
        }
      });
    }
  };

  const signIn = async (email: string, password?: string) => {
    if (password) {
      // Admin login with password
      return await supabase.auth.signInWithPassword({
        email,
        password
      });
    } else {
      // User login with OTP
      return await supabase.auth.signInWithOtp({
        email
      });
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const verifyOTP = async (email: string, token: string) => {
    return await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email'
    });
  };

  const value = {
    user,
    session,
    loading,
    isAdmin,
    signUp,
    signIn,
    signOut,
    verifyOTP
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}