import { useState, useEffect, useCallback } from 'react';
import { UserProfile, UpdateUserProfileRequest } from '@/types/user';

interface UseUserProfileReturn {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (data: UpdateUserProfileRequest) => Promise<boolean>;
  refetch: () => Promise<void>;
}

/**
 * Hook do zarządzania profilem użytkownika
 */
export function useUserProfile(): UseUserProfileReturn {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/user/profile');

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Musisz być zalogowany');
        }
        throw new Error('Nie udało się pobrać profilu');
      }

      const data = await response.json();
      setProfile(data.profile);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Wystąpił błąd podczas pobierania profilu';
      setError(errorMessage);
      console.error('Error fetching user profile:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(async (data: UpdateUserProfileRequest): Promise<boolean> => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Nie udało się zaktualizować profilu');
      }

      const result = await response.json();
      
      // Aktualizuj lokalny stan
      if (result.profile) {
        setProfile(result.profile);
      }

      return true;
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  }, []);

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    refetch: fetchProfile,
  };
}
