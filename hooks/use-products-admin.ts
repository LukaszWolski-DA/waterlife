'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Product, ProductFormData } from '@/types/product';
import {
  getAllProducts,
  getProductById,
  createProduct as createProductAPI,
  updateProduct as updateProductAPI,
  deleteProduct as deleteProductAPI,
  getCategories as getCategoriesAPI,
  getManufacturers as getManufacturersAPI,
} from '@/lib/products-store';

/**
 * Custom hook do zarządzania produktami w panelu admina
 * Obsługuje CRUD operations przez API (Supabase)
 */

interface UseProductsAdminReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  createProduct: (data: ProductFormData) => Promise<Product>;
  updateProduct: (id: string, data: Partial<ProductFormData>) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;
  getProduct: (id: string) => Promise<Product | null>;
  getCategories: () => Promise<string[]>;
  getManufacturers: () => Promise<string[]>;
  refetch: () => Promise<void>;
}

export function useProductsAdmin(): UseProductsAdminReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load products on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const loadedProducts = await getAllProducts();
        setProducts(loadedProducts);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Refetch products manually
  const refetch = useCallback(async () => {
    try {
      const loadedProducts = await getAllProducts();
      setProducts(loadedProducts);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
      console.error('Error refetching products:', err);
    }
  }, []);

  // Create product
  const createProduct = useCallback(async (data: ProductFormData): Promise<Product> => {
    try {
      const newProduct = await createProductAPI(data);
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create product';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Update product
  const updateProduct = useCallback(async (id: string, data: Partial<ProductFormData>): Promise<Product | null> => {
    try {
      const updatedProduct = await updateProductAPI(id, data);

      if (updatedProduct) {
        setProducts(prev =>
          prev.map(p => (p.id === id ? updatedProduct : p))
        );
      }

      return updatedProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update product';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Delete product
  const deleteProduct = useCallback(async (id: string): Promise<boolean> => {
    try {
      const success = await deleteProductAPI(id);

      if (success) {
        setProducts(prev => prev.filter(p => p.id !== id));
      }

      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete product';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Get single product (async)
  const getProduct = useCallback(async (id: string): Promise<Product | null> => {
    return await getProductById(id);
  }, []);

  // Get categories (async)
  const getCategories = useCallback(async (): Promise<string[]> => {
    return await getCategoriesAPI();
  }, []);

  // Get manufacturers (async)
  const getManufacturers = useCallback(async (): Promise<string[]> => {
    return await getManufacturersAPI();
  }, []);

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    getCategories,
    getManufacturers,
    refetch,
  };
}
