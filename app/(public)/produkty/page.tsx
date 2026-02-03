'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductList from '@/components/produkty/ProductList';
import ProductFilters from '@/components/produkty/ProductFilters';
import SearchBar from '@/components/produkty/SearchBar';
import { ProductFiltersProvider } from '@/contexts/ProductFiltersContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { SlidersHorizontal } from 'lucide-react';

/**
 * Wewnetrzny komponent z logika wyszukiwania
 */
function ProductsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <ProductFiltersProvider initialSearchQuery={initialSearch}>
      <div className="container mx-auto px-4 py-8">
        {/* Heading with Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-4xl font-bold">Nasze Produkty</h1>

          <div className="flex items-center gap-2">
            <SearchBar />

            {/* Mobile Filters Button */}
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="default" className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filtry
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filtry produktów</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <ProductFilters onFilterChange={() => setFiltersOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar - ukryty na mobile */}
          <aside className="hidden lg:block lg:col-span-1">
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
