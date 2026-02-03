import { createClient } from './client';

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

/**
 * Register new user (CLIENT-SIDE)
 */
export async function registerUser(data: RegisterData) {
  const supabase = createClient();

  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.full_name,
      },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, user: authData.user };
}

/**
 * Login user (CLIENT-SIDE)
 */
export async function loginUser(data: LoginData) {
  const supabase = createClient();

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, user: authData.user };
}

/**
 * Logout user (CLIENT-SIDE)
 */
export async function logoutUser() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  return { success: !error, error: error?.message };
}

/**
 * Get current session (CLIENT-SIDE)
 */
export async function getCurrentSession() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/**
 * Get current user profile (CLIENT-SIDE)
 */
export async function getUserProfile() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) return null;

  return {
    id: user.id,
    email: user.email!,
    full_name: profile.full_name,
    role: profile.role,
  };
}
