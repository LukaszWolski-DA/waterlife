import { useState, useEffect, useCallback } from 'react';
import type { HomepageContent, HomepageFormData } from '@/types/homepage';
import {
  getHomepageContent,
  updateHomepageContent,
  resetHomepageContent,
  initializeHomepageStore,
} from '@/lib/homepage-store';

export function useHomepageAdmin() {
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContent = useCallback(() => {
    try {
      setLoading(true);
      initializeHomepageStore();
      const data = getHomepageContent();
      setContent(data);
      setError(null);
    } catch (err) {
      setError('Failed to load homepage content');
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
      const updated = updateHomepageContent(data);
      setContent(updated);
      return updated;
    } catch (err) {
      setError('Failed to update homepage content');
      console.error(err);
      throw err;
    }
  }, []);

  const resetContent = useCallback(async () => {
    try {
      const reset = resetHomepageContent();
      setContent(reset);
      return reset;
    } catch (err) {
      setError('Failed to reset homepage content');
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
