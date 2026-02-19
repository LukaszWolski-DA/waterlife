import type { Category, CategoryFormData } from '@/types/category';

/**
 * Categories Store - API version (migrated from localStorage to Supabase)
 * All functions are now asynchronous and interact with /api/admin/categories
 */

/**
 * Get all categories from API
 */
export async function getAllCategories(): Promise<Category[]> {
  try {
    const response = await fetch('/api/admin/categories', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error fetching categories:', error);
      throw new Error(error.error || 'Nie udało się pobrać kategorii');
    }

    const { categories } = await response.json();
    return categories;
  } catch (error) {
    console.error('Error getting categories:', error);
    throw error;
  }
}

/**
 * Get category by ID from API
 */
export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const response = await fetch(`/api/admin/categories/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      const error = await response.json();
      console.error('Error fetching category:', error);
      throw new Error(error.error || 'Nie udało się pobrać kategorii');
    }

    const { category } = await response.json();
    return category;
  } catch (error) {
    console.error('Error getting category:', error);
    throw error;
  }
}

/**
 * Create a new category via API
 */
export async function createCategory(data: CategoryFormData): Promise<Category> {
  try {
    const response = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error creating category:', error);
      throw new Error(error.error || 'Nie udało się utworzyć kategorii');
    }

    const { category } = await response.json();
    return category;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
}

/**
 * Update an existing category via API
 */
export async function updateCategory(id: string, data: Partial<CategoryFormData>): Promise<Category> {
  try {
    const response = await fetch(`/api/admin/categories/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error updating category:', error);
      throw new Error(error.error || 'Nie udało się zaktualizować kategorii');
    }

    const { category } = await response.json();
    return category;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
}

/**
 * Delete a category via API
 */
export async function deleteCategory(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/admin/categories/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error deleting category:', error);
      throw new Error(error.error || 'Nie udało się usunąć kategorii');
    }

    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}

/**
 * Get category names only (for dropdowns)
 * Helper function that fetches all categories and returns just the names
 */
export async function getCategoryNames(): Promise<string[]> {
  try {
    const categories = await getAllCategories();
    return categories.map(cat => cat.name);
  } catch (error) {
    console.error('Error getting category names:', error);
    return [];
  }
}
