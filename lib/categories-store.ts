import type { Category, CategoryFormData } from '@/types/category';

const STORAGE_KEY = 'waterlife_categories';

// Początkowe kategorie (mock data)
const INITIAL_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Technika Grzewcza',
    description: 'Kotły gazowe, kondensacyjne, piece CO i akcesoria grzewcze',
    keywords: ['kotły', 'grzewcze', 'piece', 'ogrzewanie', 'kondensacyjne'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Systemy Sanitarne',
    description: 'Podgrzewacze wody, bojlery, pompy i instalacje sanitarne',
    keywords: ['podgrzewacze', 'bojlery', 'woda', 'sanitarne', 'pompy'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Nawadnianie',
    description: 'Systemy nawadniania ogrodów, trawników i terenów zielonych',
    keywords: ['nawadnianie', 'ogród', 'trawnik', 'zraszacze', 'systemy'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Initialize categories store with mock data if empty
 */
export function initializeCategoriesStore(): void {
  if (typeof window === 'undefined') return;

  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIES));
    }
  } catch (error) {
    console.error('Error initializing categories store:', error);
  }
}

/**
 * Get all categories from localStorage
 */
export function getAllCategories(): Category[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      initializeCategoriesStore();
      return INITIAL_CATEGORIES;
    }
    return JSON.parse(data) as Category[];
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
}

/**
 * Get category by ID
 */
export function getCategoryById(id: string): Category | null {
  const categories = getAllCategories();
  return categories.find(cat => cat.id === id) || null;
}

/**
 * Create a new category
 */
export function createCategory(data: CategoryFormData): Category {
  const categories = getAllCategories();

  const newCategory: Category = {
    ...data,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  categories.push(newCategory);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error('Error creating category:', error);
    throw new Error('Failed to create category');
  }

  return newCategory;
}

/**
 * Update an existing category
 */
export function updateCategory(id: string, data: Partial<CategoryFormData>): Category | null {
  const categories = getAllCategories();
  const index = categories.findIndex(cat => cat.id === id);

  if (index === -1) {
    console.error('Category not found:', id);
    return null;
  }

  const updated: Category = {
    ...categories[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  categories[index] = updated;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error('Error updating category:', error);
    throw new Error('Failed to update category');
  }

  return updated;
}

/**
 * Delete a category
 */
export function deleteCategory(id: string): boolean {
  const categories = getAllCategories();
  const filtered = categories.filter(cat => cat.id !== id);

  if (filtered.length === categories.length) {
    console.error('Category not found:', id);
    return false;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    return false;
  }
}

/**
 * Get category names only (for dropdowns)
 */
export function getCategoryNames(): string[] {
  const categories = getAllCategories();
  return categories.map(cat => cat.name);
}
