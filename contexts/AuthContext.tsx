'use client';

import { createContext, useContext, useState, useEffect, useMemo, ReactNode, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  name: string;
  email: string;
  type: 'admin' | 'user';
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  loginUser: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerUser: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  const isAdmin = user?.type === 'admin';

  // Check session on mount and listen for auth changes
  useEffect(() => {
    let isMounted = true;
    console.log('🔄 AuthProvider useEffect MOUNT');

    // Load user profile from database
    const loadUserProfile = async (authUser: SupabaseUser) => {
      console.log('👤 loadUserProfile START:', authUser.email);
      try {
        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        // Don't update state if component unmounted
        if (!isMounted) {
          console.log('⚠️ loadUserProfile: component unmounted, skipping state update');
          return;
        }

        if (error) {
          // Ignore AbortError - normal unmount case
          if (error.message?.includes('AbortError') || (error as any).name === 'AbortError') {
            console.log('⚠️ loadUserProfile: AbortError, skipping');
            return;
          }
          console.error('Nie udało się załadować profilu:', error.message || error);
          setLoading(false);
          return;
        }

        if (profile) {
          console.log('✅ loadUserProfile SUCCESS:', profile.full_name, profile.role);
          setUser({
            id: authUser.id,
            name: profile.full_name,
            email: authUser.email!,
            type: profile.role,
          });
          setIsAuthenticated(true);
        }
        setLoading(false);
      } catch (err: any) {
        if (!isMounted) return;
        if (err?.name === 'AbortError') return;
        console.error('Błąd ładowania profilu:', err);
        setLoading(false);
      }
    };

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔍 getSession result:', session?.user?.email || 'NO SESSION');
      if (!isMounted) {
        console.log('⚠️ getSession: component unmounted, skipping');
        return;
      }
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔑 onAuthStateChange:', event, session?.user?.email || 'NO SESSION');
      if (!isMounted) {
        console.log('⚠️ onAuthStateChange: component unmounted, skipping');
        return;
      }
      if (session?.user) {
        loadUserProfile(session.user);
      }
      // Note: Don't reset state on SIGNED_OUT here - let logout() handle it directly
      // This prevents race conditions where SIGNED_OUT fires unexpectedly
    });

    return () => {
      console.log('🔄 AuthProvider useEffect CLEANUP');
      isMounted = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // User login
  const loginUser = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Profile loaded automatically via onAuthStateChange
    return { success: true };
  };

  // User registration
  const registerUser = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Profile loaded automatically via trigger + onAuthStateChange
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isAdmin,
        loading,
        loginUser,
        registerUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
