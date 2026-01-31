'use client';

import { useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useProductFilters } from '@/contexts/ProductFiltersContext';
import type { ProductFilter } from '@/types/product';
import ProductCard from './ProductCard';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

/**
 * Lista produktów
 * Wyświetla grid z kartami produktów
 * Filtruje produkty na podstawie wybranych filtrów
 * Paginacja: 12 produktów na stronę
 */
export default function ProductList() {
  const { filters, setPage } = useProductFilters();

  // Build filter object for useProducts hook
  const productFilters: ProductFilter = {
    categories: filters.categories,
    manufacturers: filters.manufacturers,
    minPrice: filters.minPrice ?? undefined,
    maxPrice: filters.maxPrice ?? undefined,
    inStock: filters.inStock ?? undefined,
    search: filters.searchQuery || undefined,
  };

  const { products, loading, error } = useProducts({ filters: productFilters });

  // Pagination calculations
  const currentPage = filters.currentPage;
  const itemsPerPage = filters.itemsPerPage;
  const totalProducts = products.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  // Slice products for current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg aspect-square animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Błąd podczas ładowania produktów</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Brak produktów do wyświetlenia</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Product count display */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Wyświetlanie {startIndex + 1}-{Math.min(endIndex, totalProducts)} z {totalProducts} produktów
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination Controls (only show if more than 1 page) */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            {/* Previous Button */}
            <PaginationItem>
              <PaginationPrevious
                onClick={() => currentPage > 1 && setPage(currentPage - 1)}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>

            {/* Page Numbers */}
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;

              // Show first page, last page, current page, and pages around current
              const showPage =
                pageNumber === 1 ||
                pageNumber === totalPages ||
                Math.abs(pageNumber - currentPage) <= 1;

              // Show ellipsis for gaps
              const showEllipsisBefore = pageNumber === currentPage - 2 && currentPage > 3;
              const showEllipsisAfter = pageNumber === currentPage + 2 && currentPage < totalPages - 2;

              if (showEllipsisBefore || showEllipsisAfter) {
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }

              if (!showPage) return null;

              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    onClick={() => setPage(pageNumber)}
                    isActive={pageNumber === currentPage}
                    className="cursor-pointer"
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {/* Next Button */}
            <PaginationItem>
              <PaginationNext
                onClick={() => currentPage < totalPages && setPage(currentPage + 1)}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
