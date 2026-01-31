'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Product, ProductFormData } from '@/types/product';
import {
  getAllProducts,
  getProductById,
  createProduct as createProductInStore,
  updateProduct as updateProductInStore,
  deleteProduct as deleteProductInStore,
  getCategories as getCategoriesFromStore,
  getManufacturers as getManufacturersFromStore,
  initializeStore,
} from '@/lib/products-store';

/**
 * Custom hook do zarządzania produktami w panelu admina
 * Obsługuje CRUD operations z localStorage
 */

interface UseProductsAdminReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  createProduct: (data: ProductFormData) => Promise<Product>;
  updateProduct: (id: string, data: Partial<ProductFormData>) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;
  getProduct: (id: string) => Product | null;
  getCategories: () => string[];
  getManufacturers: () => string[];
  refetch: () => void;
}

export function useProductsAdmin(): UseProductsAdminReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load products on mount
  useEffect(() => {
    try {
      setLoading(true);
      initializeStore(); // Ensure store is initialized
      const loadedProducts = getAllProducts();
      setProducts(loadedProducts);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refetch products manually
  const refetch = useCallback(() => {
    try {
      const loadedProducts = getAllProducts();
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
      const newProduct = createProductInStore(data);
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
      const updatedProduct = updateProductInStore(id, data);

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
      const success = deleteProductInStore(id);

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

  // Get single product
  const getProduct = useCallback((id: string): Product | null => {
    return getProductById(id);
  }, []);

  // Get categories
  const getCategories = useCallback((): string[] => {
    return getCategoriesFromStore();
  }, []);

  // Get manufacturers
  const getManufacturers = useCallback((): string[] => {
    return getManufacturersFromStore();
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
