'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';
import { useProductFilters } from '@/contexts/ProductFiltersContext';
import { getAllCategories, getAllManufacturers } from '@/lib/supabase/metadata';

/**
 * Product Filters Component
 * Left sidebar filtering panel with:
 * - Categories (multiselect checkboxes) - loaded from Supabase via metadata.ts
 * - Manufacturers (dropdown with multiselect) - loaded from Supabase via metadata.ts
 * - Price range (from/to inputs)
 * - Availability (in stock checkbox)
 */
interface ProductFiltersProps {
  onFilterChange?: () => void;
}

export default function ProductFilters({ onFilterChange }: ProductFiltersProps = {}) {
  const { filters, updateFilter } = useProductFilters();

  // Load categories and manufacturers from admin dictionaries
  const [categories, setCategories] = useState<string[]>([]);
  const [manufacturers, setManufacturers] = useState<string[]>([]);

  // Local state for price inputs (with debounce)
  const [localMinPrice, setLocalMinPrice] = useState<string>('');
  const [localMaxPrice, setLocalMaxPrice] = useState<string>('');

  useEffect(() => {
    // Load categories from Supabase
    async function loadCategories() {
      const loadedCategories = await getAllCategories();
      setCategories(loadedCategories);
    }
    loadCategories();

    // Load manufacturers from Supabase
    async function loadManufacturers() {
      const loadedManufacturers = await getAllManufacturers();
      setManufacturers(loadedManufacturers);
    }
    loadManufacturers();
  }, []);

  // Debounce price updates (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilter('minPrice', localMinPrice ? Number(localMinPrice) : null);
    }, 500);
    return () => clearTimeout(timer);
  }, [localMinPrice, updateFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilter('maxPrice', localMaxPrice ? Number(localMaxPrice) : null);
    }, 500);
    return () => clearTimeout(timer);
  }, [localMaxPrice, updateFilter]);

  // Toggle category selection
  const toggleCategory = (category: string) => {
    const current = filters.categories;
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category];
    updateFilter('categories', updated);
    onFilterChange?.();
  };

  // Toggle manufacturer selection
  const toggleManufacturer = (manufacturer: string) => {
    const current = filters.manufacturers;
    const updated = current.includes(manufacturer)
      ? current.filter(m => m !== manufacturer)
      : [...current, manufacturer];
    updateFilter('manufacturers', updated);
    onFilterChange?.();
  };

  // Clear all categories
  const clearCategories = () => {
    updateFilter('categories', []);
  };

  // Clear all manufacturers
  const clearManufacturers = () => {
    updateFilter('manufacturers', []);
  };

  return (
    <div className="space-y-6">
      {/* Categories Dropdown (Collapsible) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Kategoria</CardTitle>
        </CardHeader>
        <CardContent>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {filters.categories.length === 0
                  ? 'Wszystkie kategorie'
                  : `Kategorie (${filters.categories.length})`}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">Wybierz kategorie</span>
                  {filters.categories.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearCategories}>
                      Wyczyść
                    </Button>
                  )}
                </div>
                {categories.length > 0 ? (
                  categories.map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={filters.categories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <label
                        htmlFor={`category-${category}`}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {category}
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Brak kategorii</p>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      {/* Manufacturers Dropdown (Collapsible) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Producent</CardTitle>
        </CardHeader>
        <CardContent>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {filters.manufacturers.length === 0
                  ? 'Wszyscy producenci'
                  : `Producenci (${filters.manufacturers.length})`}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">Wybierz producentów</span>
                  {filters.manufacturers.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearManufacturers}>
                      Wyczyść
                    </Button>
                  )}
                </div>
                {manufacturers.length > 0 ? (
                  manufacturers.map(m => (
                    <div key={m} className="flex items-center space-x-2">
                      <Checkbox
                        id={`manufacturer-${m}`}
                        checked={filters.manufacturers.includes(m)}
                        onCheckedChange={() => toggleManufacturer(m)}
                      />
                      <label
                        htmlFor={`manufacturer-${m}`}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {m}
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Brak producentów</p>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      {/* Price Range (Text Inputs) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Zakres cen (PLN)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Od"
              value={localMinPrice}
              onChange={(e) => setLocalMinPrice(e.target.value)}
              min={0}
              className="flex-1"
            />
            <span className="text-muted-foreground">-</span>
            <Input
              type="number"
              placeholder="Do"
              value={localMaxPrice}
              onChange={(e) => setLocalMaxPrice(e.target.value)}
              min={0}
              className="flex-1"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Filtrowanie odbywa się automatycznie
          </p>
        </CardContent>
      </Card>

      {/* Availability */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Dostępność</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="inStock"
              checked={filters.inStock === true}
              onCheckedChange={(checked) => {
                updateFilter('inStock', checked ? true : null);
                onFilterChange?.();
              }}
            />
            <Label htmlFor="inStock" className="text-sm font-normal cursor-pointer">
              W magazynie
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
