import { useState, useEffect, useCallback } from 'react';
import type { Category, CategoryFormData } from '@/types/category';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  initializeCategoriesStore,
} from '@/lib/categories-store';

export function useCategoriesAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(() => {
    try {
      setLoading(true);
      initializeCategoriesStore();
      const data = getAllCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError('Failed to load categories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const getCategory = useCallback((id: string) => {
    return getCategoryById(id);
  }, []);

  const addCategory = useCallback(async (data: CategoryFormData) => {
    try {
      const newCategory = createCategory(data);
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      setError('Failed to create category');
      console.error(err);
      throw err;
    }
  }, []);

  const editCategory = useCallback(async (id: string, data: Partial<CategoryFormData>) => {
    try {
      const updated = updateCategory(id, data);
      if (updated) {
        setCategories(prev =>
          prev.map(cat => (cat.id === id ? updated : cat))
        );
        return updated;
      }
      throw new Error('Category not found');
    } catch (err) {
      setError('Failed to update category');
      console.error(err);
      throw err;
    }
  }, []);

  const removeCategory = useCallback(async (id: string) => {
    try {
      const success = deleteCategory(id);
      if (success) {
        setCategories(prev => prev.filter(cat => cat.id !== id));
      }
      return success;
    } catch (err) {
      setError('Failed to delete category');
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
