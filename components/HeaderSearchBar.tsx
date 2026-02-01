'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getAllProducts, initializeStore } from '@/lib/products-store';
import type { Product } from '@/types/product';

interface HeaderSearchBarProps {
  className?: string;
  placeholder?: string;
  onSearch?: () => void; // Callback po wyszukaniu (np. zamknij mobile menu)
}

export function HeaderSearchBar({
  className = '',
  placeholder = 'Szukaj produktów...',
  onSearch
}: HeaderSearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search for suggestions
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(() => {
      initializeStore();
      const allProducts = getAllProducts();
      const searchLower = query.toLowerCase();

      const matches = allProducts
        .filter(p =>
          p.status === 'active' && (
            p.name.toLowerCase().includes(searchLower) ||
            (p.description && p.description.toLowerCase().includes(searchLower)) ||
            (p.category && p.category.toLowerCase().includes(searchLower))
          )
        )
        .slice(0, 5);

      setSuggestions(matches);
      setIsOpen(matches.length > 0);
      setSelectedIndex(-1);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = useCallback((searchQuery: string) => {
    if (searchQuery.trim()) {
      router.push(`/produkty?search=${encodeURIComponent(searchQuery.trim())}`);
      setQuery('');
      setIsOpen(false);
      onSearch?.();
    }
  }, [router, onSearch]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
      inputRef.current?.blur();
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSearch(suggestions[selectedIndex].name);
      } else {
        handleSearch(query);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    }
  };

  const handleSuggestionClick = (product: Product) => {
    handleSearch(product.name);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && suggestions.length > 0 && setIsOpen(true)}
          className="pl-9 pr-8"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
            onClick={handleClear}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Wyczysc</span>
          </Button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 overflow-hidden">
          <ul className="py-1">
            {suggestions.map((product, index) => (
              <li key={product.id}>
                <button
                  type="button"
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center gap-3 ${
                    index === selectedIndex ? 'bg-accent' : ''
                  }`}
                  onClick={() => handleSuggestionClick(product)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <Search className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{product.name}</p>
                    {product.category && (
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
          <div className="border-t px-4 py-2">
            <button
              type="button"
              className="text-xs text-primary hover:underline"
              onClick={() => handleSearch(query)}
            >
              Zobacz wszystkie wyniki dla &quot;{query}&quot;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
