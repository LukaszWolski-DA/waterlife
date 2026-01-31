'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
 * Admin page - Add new category
 * Form for creating a new product category
 */
export default function AddCategoryPage() {
  const router = useRouter();
  const { createCategory } = useCategoriesAdmin();
  const { toast } = useToast();

  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    keywords: [],
  });

  const [keywordInput, setKeywordInput] = useState('');
  const [saving, setSaving] = useState(false);

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
      await createCategory(formData);
      toast({
        title: 'Kategoria dodana',
        description: `Kategoria "${formData.name}" została pomyślnie utworzona.`,
      });
      router.push('/admin/kategorie');
    } catch (error) {
      toast({
        title: 'Błąd',
        description: 'Nie udało się utworzyć kategorii.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

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
          <h1 className="text-3xl font-bold">Dodaj Kategorię</h1>
          <p className="text-muted-foreground mt-1">
            Utwórz nową kategorię produktów
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
                {saving ? 'Zapisywanie...' : 'Dodaj Kategorię'}
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
