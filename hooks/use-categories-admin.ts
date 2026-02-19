import { useState, useEffect, useCallback } from 'react';
import type { Category, CategoryFormData } from '@/types/category';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/lib/categories-store';

/**
 * Hook for managing categories in admin panel
 * Updated to work with asynchronous API calls
 */
export function useCategoriesAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError('Nie udało się załadować kategorii');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const getCategory = useCallback(async (id: string) => {
    return await getCategoryById(id);
  }, []);

  const addCategory = useCallback(async (data: CategoryFormData) => {
    try {
      const newCategory = await createCategory(data);
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      setError('Nie udało się utworzyć kategorii');
      console.error(err);
      throw err;
    }
  }, []);

  const editCategory = useCallback(async (id: string, data: Partial<CategoryFormData>) => {
    try {
      const updated = await updateCategory(id, data);
      if (updated) {
        setCategories(prev =>
          prev.map(cat => (cat.id === id ? updated : cat))
        );
        return updated;
      }
      throw new Error('Kategoria nie znaleziona');
    } catch (err) {
      setError('Nie udało się zaktualizować kategorii');
      console.error(err);
      throw err;
    }
  }, []);

  const removeCategory = useCallback(async (id: string) => {
    try {
      const success = await deleteCategory(id);
      if (success) {
        setCategories(prev => prev.filter(cat => cat.id !== id));
      }
      return success;
    } catch (err) {
      setError('Nie udało się usunąć kategorii');
      console.error(err);
      return false;
    }
  }, []);

  const refetch = useCallback(() => {
    loadCategories();
  }, [loadCategories]);

  return {
    categories,
    loading,
    error,
    getCategory,
    createCategory: addCategory,
    updateCategory: editCategory,
    deleteCategory: removeCategory,
    refetch,
  };
}
