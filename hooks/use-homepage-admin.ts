import { useState, useEffect, useCallback } from 'react';
import type { HomepageContent, HomepageFormData } from '@/types/homepage';
import {
  getHomepageContent,
  updateHomepageContent,
  resetHomepageContent,
} from '@/lib/homepage-store';

/**
 * Hook do zarządzania treściami strony głównej
 * Używa Supabase API (nie localStorage)
 */
export function useHomepageAdmin() {
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getHomepageContent();
      setContent(data);
    } catch (err) {
      setError('Nie udało się załadować treści strony głównej');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const updateContent = useCallback(async (data: HomepageFormData) => {
    try {
      const updated = await updateHomepageContent(data);
      setContent(updated);
      return updated;
    } catch (err) {
      setError('Nie udało się zaktualizować treści');
      console.error(err);
      throw err;
    }
  }, []);

  const resetContent = useCallback(async () => {
    try {
      const reset = await resetHomepageContent();
      setContent(reset);
      return reset;
    } catch (err) {
      setError('Nie udało się przywrócić domyślnych treści');
      console.error(err);
      throw err;
    }
  }, []);

  const refetch = useCallback(() => {
    loadContent();
  }, [loadContent]);

  return {
    content,
    loading,
    error,
    updateContent,
    resetContent,
    refetch,
  };
}
