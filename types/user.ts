/**
 * Typy dla profilu użytkownika
 */

export interface UserProfile {
  id: string;
  full_name: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  company: string | null;
  nip: string | null;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export interface UpdateUserProfileRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
  company?: string;
  nip?: string;
}

export interface UserProfileResponse {
  profile: UserProfile;
}

export interface UpdateUserProfileResponse {
  success: boolean;
  profile?: UserProfile;
  error?: string;
}
