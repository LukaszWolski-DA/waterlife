'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductList from '@/components/produkty/ProductList';
import ProductFilters from '@/components/produkty/ProductFilters';
import SearchBar from '@/components/produkty/SearchBar';
import { ProductFiltersProvider } from '@/contexts/ProductFiltersContext';

/**
 * Wewnetrzny komponent z logika wyszukiwania
 */
function ProductsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  return (
    <ProductFiltersProvider initialSearchQuery={initialSearch}>
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

/**
 * Strona z lista wszystkich produktow
 * Zawiera filtry, wyszukiwarke i grid produktow
 */
export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Ladowanie...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
