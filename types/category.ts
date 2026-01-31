/**
 * Category types for WaterLife
 * Kategorie produktów z opisem i słowami kluczowymi
 */

export interface Category {
  id: string;
  name: string;
  description?: string;
  keywords?: string[]; // Słowa kluczowe do wyszukiwarki
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  keywords?: string[];
}

export type CategoryInput = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>;
