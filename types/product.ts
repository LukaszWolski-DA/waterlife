/**
 * Typy TypeScript dla produktów
 */

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
  manufacturer?: string;  // Optional manufacturer name
  imageUrl?: string;
  images?: string[]; // Wiele zdjęć produktu
  featured?: boolean; // Czy produkt jest wyróżniony
  status: 'active' | 'inactive' | 'out_of_stock';
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
  manufacturer?: string;  // Optional manufacturer name
  imageUrl?: string;
}

export interface ProductFilter {
  categories?: string[];       // Changed from category?: string to support multiple
  manufacturers?: string[];    // NEW - support multiple manufacturers
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}
