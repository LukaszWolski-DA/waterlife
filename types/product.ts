/**
 * Typy TypeScript dla produktów
 */

// Struktura pojedynczego zdjęcia produktu
export interface ProductImage {
  url: string;
  isMain: boolean;
}

// Helper do pobierania głównego zdjęcia
export function getMainImage(product: Product): string | undefined {
  if (product.images && product.images.length > 0) {
    const mainImage = product.images.find(img => img.isMain);
    return mainImage?.url || product.images[0]?.url;
  }
  return product.imageUrl; // Fallback do legacy pola
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
  manufacturer?: string;  // Optional manufacturer name
  imageUrl?: string;      // Legacy - zachowane dla kompatybilności
  images?: ProductImage[]; // Nowa struktura z wieloma zdjęciami
  featured?: boolean; // Czy produkt jest wyróżniony
  status: 'active' | 'inactive';
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
  imageUrl?: string;      // Legacy - zachowane dla kompatybilności
  images?: ProductImage[]; // Nowa struktura z wieloma zdjęciami
  featured?: boolean;     // Czy produkt jest Bestseller
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
