'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * Product Filters Context
 * Manages filter state for products page
 * Filters: categories, manufacturers, price range, availability, search, pagination
 */

interface ProductFiltersState {
  categories: string[];        // Multiple categories
  manufacturers: string[];     // Multiple manufacturers
  minPrice: number | null;
  maxPrice: number | null;
  inStock: boolean | null;
  searchQuery: string;         // For Use Case 3
  currentPage: number;          // Current page number
  itemsPerPage: number;         // Items per page (default: 12)
}

interface ProductFiltersContextType {
  filters: ProductFiltersState;
  updateFilter: (key: keyof ProductFiltersState, value: any) => void;
  clearFilters: () => void;
  setPage: (page: number) => void;           // Convenient setter for page
  resetToFirstPage: () => void;              // Reset to page 1 when filters change
}

const ProductFiltersContext = createContext<ProductFiltersContextType | undefined>(undefined);

export function ProductFiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<ProductFiltersState>({
    categories: [],
    manufacturers: [],
    minPrice: null,
    maxPrice: null,
    inStock: null,
    searchQuery: '',
    currentPage: 1,              // Start at page 1
    itemsPerPage: 12,             // 12 products per page
  });

  const updateFilter = (key: keyof ProductFiltersState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      manufacturers: [],
      minPrice: null,
      maxPrice: null,
      inStock: null,
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 12,
    });
  };

  const setPage = (page: number) => {
    setFilters(prev => ({ ...prev, currentPage: page }));
  };

  const resetToFirstPage = () => {
    setFilters(prev => ({ ...prev, currentPage: 1 }));
  };

  // Auto-reset to page 1 when any filter changes
  useEffect(() => {
    resetToFirstPage();
  }, [filters.categories, filters.manufacturers, filters.minPrice, filters.maxPrice, filters.inStock, filters.searchQuery]);

  return (
    <ProductFiltersContext.Provider value={{ filters, updateFilter, clearFilters, setPage, resetToFirstPage }}>
      {children}
    </ProductFiltersContext.Provider>
  );
}

export function useProductFilters() {
  const context = useContext(ProductFiltersContext);
  if (!context) {
    throw new Error('useProductFilters must be used within ProductFiltersProvider');
  }
  return context;
}
