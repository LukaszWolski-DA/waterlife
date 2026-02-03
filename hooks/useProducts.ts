'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Product, ProductFilter } from '@/types/product';
import { getAllProducts, getProductById, getFilteredProducts } from '@/lib/products-store';

/**
 * Custom hook do pobierania produktów z API (Supabase)
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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      // Jeśli są filtry, użyj getFilteredProducts
      // W przeciwnym razie pobierz wszystkie
      let fetchedProducts: Product[];

      if (filters && Object.keys(filters).length > 0) {
        fetchedProducts = await getFilteredProducts(filters);
      } else {
        fetchedProducts = await getAllProducts();
      }

      setProducts(fetchedProducts);
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
  }, [autoFetch, JSON.stringify(filters)]); // Re-fetch when filters change

  return {
    products,
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
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const foundProduct = await getProductById(id);
        setProduct(foundProduct);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Nieznany błąd'));
        console.error('Błąd podczas pobierania produktu:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return {
    product,
    loading,
    error,
  };
}
