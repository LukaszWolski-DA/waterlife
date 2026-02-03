import { createServerClient } from './server';
import type { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  full_name: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'user';
}

/**
 * Get current user with profile (SERVER-SIDE)
 * Call from API routes or server components
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = createServerClient();

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return null;

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) return null;

  return {
    id: user.id,
    email: user.email!,
    full_name: profile.full_name,
    role: profile.role,
  };
}

/**
 * Check if current user is admin (SERVER-SIDE)
 */
export async function isUserAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === 'admin';
}
