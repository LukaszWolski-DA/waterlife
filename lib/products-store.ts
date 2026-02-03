import type { Product, ProductFormData, ProductFilter } from '@/types/product';
import { getAllCategories, getAllManufacturers } from './supabase/metadata';

/**
 * Products API client
 * Używa /api/produkty które komunikuje się z Supabase
 *
 * UWAGA: To już nie jest localStorage store!
 * Wszystkie operacje przechodzą przez API → Supabase
 */

/**
 * Pobiera wszystkie produkty z API
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const response = await fetch('/api/produkty');
    const result = await response.json();

    if (!result.success) {
      console.error('Error fetching products:', result.error);
      return [];
    }

    return result.data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

/**
 * Pobiera produkty z filtrami
 */
export async function getFilteredProducts(filters: ProductFilter): Promise<Product[]> {
  try {
    const params = new URLSearchParams();

    if (filters.categories && filters.categories.length > 0) {
      params.append('categories', filters.categories.join(','));
    }
    if (filters.manufacturers && filters.manufacturers.length > 0) {
      params.append('manufacturers', filters.manufacturers.join(','));
    }
    if (filters.minPrice !== undefined) {
      params.append('minPrice', filters.minPrice.toString());
    }
    if (filters.maxPrice !== undefined) {
      params.append('maxPrice', filters.maxPrice.toString());
    }
    if (filters.inStock) {
      params.append('inStock', 'true');
    }
    if (filters.search) {
      params.append('search', filters.search);
    }

    const response = await fetch(`/api/produkty?${params.toString()}`);
    const result = await response.json();

    if (!result.success) {
      console.error('Error filtering products:', result.error);
      return [];
    }

    return result.data || [];
  } catch (error) {
    console.error('Error filtering products:', error);
    return [];
  }
}

/**
 * Pobiera produkt po ID
 * Uwaga: Używa getAllProducts i filtruje - można zoptymalizować później
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const products = await getAllProducts();
    return products.find(p => p.id === id) || null;
  } catch (error) {
    console.error('Error getting product by ID:', error);
    return null;
  }
}

/**
 * Tworzy nowy produkt (ADMIN)
 */
export async function createProduct(data: ProductFormData): Promise<Product> {
  try {
    const response = await fetch('/api/produkty', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to create product');
    }

    console.log('✅ Created product:', result.data.name);
    return result.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

/**
 * Aktualizuje istniejący produkt (ADMIN)
 */
export async function updateProduct(
  id: string,
  data: Partial<ProductFormData>
): Promise<Product | null> {
  try {
    const response = await fetch('/api/produkty', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, ...data }),
    });

    const result = await response.json();

    if (!result.success) {
      console.error('Error updating product:', result.error);
      return null;
    }

    console.log('✅ Updated product:', result.data.name);
    return result.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

/**
 * Usuwa produkt (ADMIN)
 */
export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/produkty?id=${id}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (!result.success) {
      console.error('Error deleting product:', result.error);
      return false;
    }

    console.log('🗑️ Deleted product:', id);
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
}

/**
 * Pobiera kategorie z API (Supabase)
 * TODO: Utworzyć dedykowany endpoint /api/categories
 */
export async function getCategories(): Promise<string[]> {
  return await getAllCategories();
}

/**
 * Pobiera producentów z API (Supabase)
 */
export async function getManufacturers(): Promise<string[]> {
  return await getAllManufacturers();
}

/**
 * DEPRECATED: initializeStore() - nie jest już potrzebne
 * Dane są teraz w Supabase, nie localStorage
 */
export function initializeStore(): void {
  console.warn('⚠️ initializeStore() is deprecated - data is now in Supabase');
}

/**
 * DEPRECATED: resetStore() - nie jest już potrzebne
 * Dane są teraz w Supabase, nie localStorage
 */
export function resetStore(): void {
  console.warn('⚠️ resetStore() is deprecated - data is now in Supabase');
}
