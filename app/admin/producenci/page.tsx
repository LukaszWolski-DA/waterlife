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
import { Input } from '@/components/ui/input';
import { Plus, Pencil, Trash2, Search, Factory } from 'lucide-react';
import { useManufacturersAdmin } from '@/hooks/use-manufacturers-admin';
import { useToast } from '@/hooks/use-toast';

/**
 * Admin page - Manufacturers list
 * CRUD interface for managing product manufacturers
 */
export default function ManufacturersPage() {
  const { manufacturers, loading, deleteManufacturer } = useManufacturersAdmin();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredManufacturers = manufacturers.filter(manufacturer =>
    manufacturer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Czy na pewno chcesz usunąć producenta "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const success = await deleteManufacturer(id);
      if (success) {
        toast({
          title: 'Producent usunięty',
          description: `Producent "${name}" został pomyślnie usunięty.`,
        });
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      toast({
        title: 'Błąd',
        description: 'Nie udało się usunąć producenta.',
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
          <h1 className="text-3xl font-bold">Producenci</h1>
          <p className="text-muted-foreground mt-1">
            Zarządzaj producentami produktów w sklepie
          </p>
        </div>
        <Link href="/admin/producenci/dodaj">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Dodaj producenta
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
                placeholder="Szukaj producenta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Manufacturers table */}
          {filteredManufacturers.length === 0 ? (
            <div className="text-center py-12">
              <Factory className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Brak producentów</p>
              <p className="text-sm text-muted-foreground mt-1">
                {searchQuery
                  ? 'Nie znaleziono producentów pasujących do wyszukiwania'
                  : 'Dodaj pierwszego producenta'}
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                Wyświetlono {filteredManufacturers.length} z {manufacturers.length} producentów
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nazwa</TableHead>
                      <TableHead>Data utworzenia</TableHead>
                      <TableHead className="text-right">Akcje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredManufacturers.map((manufacturer) => (
                      <TableRow key={manufacturer.id}>
                        <TableCell className="font-medium">
                          {manufacturer.name}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(manufacturer.createdAt).toLocaleDateString('pl-PL')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/admin/producenci/${manufacturer.id}`}>
                              <Button variant="ghost" size="sm">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(manufacturer.id, manufacturer.name)}
                              disabled={deletingId === manufacturer.id}
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
