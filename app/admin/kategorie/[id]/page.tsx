'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useCategoriesAdmin } from '@/hooks/use-categories-admin';
import { useToast } from '@/hooks/use-toast';
import type { CategoryFormData } from '@/types/category';

/**
 * Admin page - Edit category
 * Form for editing an existing product category
 */
export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params?.id as string;

  const { getCategory, updateCategory } = useCategoriesAdmin();
  const { toast } = useToast();

  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    keywords: [],
  });

  const [keywordInput, setKeywordInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!categoryId) return;

    async function loadCategory() {
      try {
        const category = await getCategory(categoryId);
        if (!category) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        setFormData({
          name: category.name,
          description: category.description || '',
          keywords: category.keywords || [],
        });
        setLoading(false);
      } catch (error) {
        console.error('Error loading category:', error);
        setNotFound(true);
        setLoading(false);
      }
    }

    loadCategory();
  }, [categoryId, getCategory]);

  const handleAddKeyword = () => {
    const trimmed = keywordInput.trim();
    if (!trimmed) return;

    if (formData.keywords?.includes(trimmed)) {
      toast({
        title: 'Słowo kluczowe już istnieje',
        description: 'To słowo kluczowe zostało już dodane.',
        variant: 'destructive',
      });
      return;
    }

    setFormData(prev => ({
      ...prev,
      keywords: [...(prev.keywords || []), trimmed],
    }));
    setKeywordInput('');
  };

  const handleRemoveKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords?.filter(k => k !== keyword) || [],
    }));
  };

  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: 'Błąd walidacji',
        description: 'Nazwa kategorii jest wymagana.',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      await updateCategory(categoryId, {
        name: formData.name,
        description: formData.description,
        keywords: formData.keywords || [],
      });
      toast({
        title: 'Kategoria zaktualizowana',
        description: `Kategoria "${formData.name}" została pomyślnie zaktualizowana.`,
      });
      router.push('/admin/kategorie');
    } catch (error) {
      toast({
        title: 'Błąd',
        description: 'Nie udało się zaktualizować kategorii.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/kategorie">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Powrót
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-lg font-medium">Kategoria nie znaleziona</p>
              <p className="text-sm text-muted-foreground mt-1">
                Kategoria o podanym ID nie istnieje.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/kategorie">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Powrót
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edytuj Kategorię</h1>
          <p className="text-muted-foreground mt-1">
            Zaktualizuj dane kategorii produktów
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dane Kategorii</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Nazwa <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, name: e.target.value }))
                }
                placeholder="np. Technika Grzewcza"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Opis</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, description: e.target.value }))
                }
                placeholder="Opcjonalny opis kategorii..."
                rows={4}
              />
            </div>

            {/* Keywords */}
            <div className="space-y-2">
              <Label htmlFor="keywords">Słowa Kluczowe</Label>
              <div className="flex gap-2">
                <Input
                  id="keywords"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={handleKeywordKeyDown}
                  placeholder="Dodaj słowo kluczowe i naciśnij Enter"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddKeyword}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Keywords list */}
              {formData.keywords && formData.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.keywords.map((keyword, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="text-sm pr-1"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(keyword)}
                        className="ml-2 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={saving}>
                {saving ? 'Zapisywanie...' : 'Zapisz Zmiany'}
              </Button>
              <Link href="/admin/kategorie">
                <Button type="button" variant="outline" disabled={saving}>
                  Anuluj
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
