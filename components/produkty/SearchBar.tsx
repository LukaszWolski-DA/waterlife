'use client';

import { useState, useEffect } from 'react';
import { useProductFilters } from '@/contexts/ProductFiltersContext';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Search Bar Component
 * Allows users to search products by name and description
 * Features:
 * - Real-time filtering with 500ms debounce
 * - Clear button (X) when input has value
 * - Search icon for visual clarity
 */
export default function SearchBar() {
  const { filters, updateFilter } = useProductFilters();
  const [localSearch, setLocalSearch] = useState<string>('');

  // Debounce: Update context after 500ms (matches ProductFilters pattern)
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilter('searchQuery', localSearch);
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, updateFilter]);

  // Sync with context on mount
  useEffect(() => {
    setLocalSearch(filters.searchQuery || '');
  }, []);

  const handleClear = () => {
    setLocalSearch('');
    updateFilter('searchQuery', '');
  };

  return (
    <div className="relative max-w-md w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Szukaj produktów..."
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        className="pl-10 pr-10"
      />
      {localSearch && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
