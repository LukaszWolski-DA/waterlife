'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Pencil, Trash2, Search, Tag } from 'lucide-react';
import { useCategoriesAdmin } from '@/hooks/use-categories-admin';
import { useToast } from '@/hooks/use-toast';

/**
 * Admin page - Categories list
 * CRUD interface for managing product categories
 */
export default function CategoriesPage() {
  const { categories, loading, deleteCategory } = useCategoriesAdmin();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Czy na pewno chcesz usunąć kategorię "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const success = await deleteCategory(id);
      if (success) {
        toast({
          title: 'Kategoria usunięta',
          description: `Kategoria "${name}" została pomyślnie usunięta.`,
        });
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      toast({
        title: 'Błąd',
        description: 'Nie udało się usunąć kategorii.',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kategorie Produktów</h1>
          <p className="text-muted-foreground mt-1">
            Zarządzaj kategoriami produktów w sklepie
          </p>
        </div>
        <Link href="/admin/kategorie/dodaj">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Dodaj kategorię
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          {/* Search bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Szukaj kategorii..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Categories table */}
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Brak kategorii</p>
              <p className="text-sm text-muted-foreground mt-1">
                {searchQuery
                  ? 'Nie znaleziono kategorii pasujących do wyszukiwania'
                  : 'Dodaj pierwszą kategorię produktów'}
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                Wyświetlono {filteredCategories.length} z {categories.length} kategorii
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nazwa</TableHead>
                      <TableHead>Opis</TableHead>
                      <TableHead>Słowa kluczowe</TableHead>
                      <TableHead className="text-right">Akcje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">
                          {category.name}
                        </TableCell>
                        <TableCell className="max-w-md">
                          <p className="line-clamp-2 text-sm text-muted-foreground">
                            {category.description || '-'}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {category.keywords && category.keywords.length > 0 ? (
                              category.keywords.slice(0, 3).map((keyword, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {keyword}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-xs text-muted-foreground">-</span>
                            )}
                            {category.keywords && category.keywords.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{category.keywords.length - 3}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/admin/kategorie/${category.id}`}>
                              <Button variant="ghost" size="sm">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(category.id, category.name)}
                              disabled={deletingId === category.id}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
