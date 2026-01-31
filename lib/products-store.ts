import type { Product, ProductFormData } from '@/types/product';
import { getAllProducts as getMockProducts } from './mock-products';
import { initializeManufacturersStore, getManufacturerNames } from './manufacturers-store';

/**
 * LocalStorage manager dla produktów
 * Używa localStorage jako źródła prawdy dla CRUD operations
 */

const STORAGE_KEY = 'waterlife_products';

/**
 * Inicjalizuje store z mock products jeśli jest pusty
 */
export function initializeStore(): void {
  if (typeof window === 'undefined') return;

  try {
    const existing = localStorage.getItem(STORAGE_KEY);

    if (!existing) {
      const mockProducts = getMockProducts();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockProducts));
      console.log('📦 Initialized products store with', mockProducts.length, 'mock products');
    }
  } catch (error) {
    console.error('Error initializing products store:', error);
  }
}

/**
 * Pobiera wszystkie produkty z localStorage
 */
export function getAllProducts(): Product[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
      initializeStore();
      const newData = localStorage.getItem(STORAGE_KEY);
      return newData ? JSON.parse(newData) : [];
    }

    return JSON.parse(data);
  } catch (error) {
    console.error('Error getting products:', error);
    return [];
  }
}

/**
 * Pobiera produkt po ID
 */
export function getProductById(id: string): Product | null {
  if (typeof window === 'undefined') return null;

  try {
    const products = getAllProducts();
    return products.find(p => p.id === id) || null;
  } catch (error) {
    console.error('Error getting product by ID:', error);
    return null;
  }
}

/**
 * Tworzy nowy produkt
 */
export function createProduct(data: ProductFormData): Product {
  if (typeof window === 'undefined') {
    throw new Error('Cannot create product on server side');
  }

  try {
    const products = getAllProducts();

    // Generate unique ID
    const id = Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);

    const newProduct: Product = {
      id,
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      category: data.category,
      imageUrl: data.imageUrl,
      images: data.imageUrl ? [data.imageUrl] : [],
      featured: false,
      status: data.stock > 0 ? 'active' : 'out_of_stock',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    products.push(newProduct);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));

    console.log('✅ Created product:', newProduct.name);
    return newProduct;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

/**
 * Aktualizuje istniejący produkt
 */
export function updateProduct(id: string, data: Partial<ProductFormData>): Product | null {
  if (typeof window === 'undefined') {
    throw new Error('Cannot update product on server side');
  }

  try {
    const products = getAllProducts();
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
      console.error('Product not found:', id);
      return null;
    }

    const updatedProduct: Product = {
      ...products[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    // Update status based on stock
    if (data.stock !== undefined) {
      updatedProduct.status = data.stock > 0 ? 'active' : 'out_of_stock';
    }

    // Update images array if imageUrl changed
    if (data.imageUrl) {
      updatedProduct.images = [data.imageUrl];
    }

    products[index] = updatedProduct;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));

    console.log('✅ Updated product:', updatedProduct.name);
    return updatedProduct;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

/**
 * Usuwa produkt
 */
export function deleteProduct(id: string): boolean {
  if (typeof window === 'undefined') {
    throw new Error('Cannot delete product on server side');
  }

  try {
    const products = getAllProducts();
    const filtered = products.filter(p => p.id !== id);

    if (filtered.length === products.length) {
      console.error('Product not found:', id);
      return false;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    console.log('🗑️ Deleted product:', id);
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

/**
 * Pobiera kategorie z categories-store
 */
export function getCategories(): string[] {
  if (typeof window === 'undefined') return [];

  try {
    // Import dynamically to avoid circular dependency
    const { initializeCategoriesStore, getCategoryNames } = require('./categories-store');
    initializeCategoriesStore(); // Inicjalizuj store przed odczytem
    return getCategoryNames();
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
}

/**
 * Pobiera producentów z manufacturers-store
 */
export function getManufacturers(): string[] {
  if (typeof window === 'undefined') return [];

  try {
    initializeManufacturersStore();
    return getManufacturerNames();
  } catch (error) {
    console.error('Error getting manufacturers:', error);
    return [];
  }
}

/**
 * Resetuje store do mock products
 */
export function resetStore(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
    initializeStore();
    console.log('🔄 Reset products store to mock data');
  } catch (error) {
    console.error('Error resetting store:', error);
  }
}
