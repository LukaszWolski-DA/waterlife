'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Product, ProductFilter } from '@/types/product';
import { getAllProducts, getProductById, initializeStore } from '@/lib/products-store';

/**
 * Custom hook do pobierania produktów z localStorage
 * Obsługuje pobieranie, filtrowanie i zarządzanie stanem produktów
 */

interface UseProductsOptions {
  filters?: ProductFilter;
  autoFetch?: boolean;
}

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useProducts(options: UseProductsOptions = {}): UseProductsReturn {
  const { filters, autoFetch = true } = options;
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = () => {
    try {
      setLoading(true);
      initializeStore();
      const products = getAllProducts();
      setAllProducts(products);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Nieznany błąd'));
      console.error('Błąd podczas pobierania produktów:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchProducts();
    }
  }, [autoFetch]);

  // Filter products based on filters
  const filteredProducts = useMemo(() => {
    let products = allProducts;

    // Filter by multiple categories (OR logic)
    if (filters?.categories && filters.categories.length > 0) {
      products = products.filter(p =>
        p.category && filters.categories!.includes(p.category)
      );
    }

    // Filter by multiple manufacturers (OR logic)
    if (filters?.manufacturers && filters.manufacturers.length > 0) {
      products = products.filter(p =>
        p.manufacturer && filters.manufacturers!.includes(p.manufacturer)
      );
    }

    // Filter by price range
    if (filters?.minPrice !== undefined) {
      products = products.filter(p => p.price >= filters.minPrice!);
    }
    if (filters?.maxPrice !== undefined) {
      products = products.filter(p => p.price <= filters.maxPrice!);
    }

    // Filter by stock availability
    if (filters?.inStock) {
      products = products.filter(p => p.stock > 0);
    }

    // Filter by search query
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        (p.description && p.description.toLowerCase().includes(searchLower))
      );
    }

    return products;
  }, [allProducts, filters]);

  return {
    products: filteredProducts,
    loading,
    error,
    refetch: fetchProducts,
  };
}

/**
 * Hook do pobierania pojedynczego produktu
 */
export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      setLoading(true);
      initializeStore();
      const foundProduct = getProductById(id);
      setProduct(foundProduct);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Nieznany błąd'));
      console.error('Błąd podczas pobierania produktu:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  return {
    product,
    loading,
    error,
  };
}
