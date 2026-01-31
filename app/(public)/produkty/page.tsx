'use client';

import ProductList from '@/components/produkty/ProductList';
import ProductFilters from '@/components/produkty/ProductFilters';
import SearchBar from '@/components/produkty/SearchBar';
import { ProductFiltersProvider } from '@/contexts/ProductFiltersContext';

/**
 * Strona z listą wszystkich produktów
 * Zawiera filtry, wyszukiwarkę i grid produktów
 */
export default function ProductsPage() {
  return (
    <ProductFiltersProvider>
      <div className="container mx-auto px-4 py-8">
        {/* Heading with Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-4xl font-bold">Nasze Produkty</h1>
          <SearchBar />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar z filtrami */}
          <aside className="lg:col-span-1">
            <ProductFilters />
          </aside>

          {/* Lista produktów */}
          <div className="lg:col-span-3">
            <ProductList />
          </div>
        </div>
      </div>
    </ProductFiltersProvider>
  );
}
