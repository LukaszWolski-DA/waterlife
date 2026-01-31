'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useManufacturersAdmin } from '@/hooks/use-manufacturers-admin';
import { useToast } from '@/hooks/use-toast';
import type { ManufacturerFormData } from '@/types/manufacturer';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * Admin page - Add new manufacturer
 * Form for creating a new manufacturer with duplicate detection
 */
export default function AddManufacturerPage() {
  const router = useRouter();
  const { createManufacturer, checkNameExists, findByName } = useManufacturersAdmin();
  const { toast } = useToast();

  const [formData, setFormData] = useState<ManufacturerFormData>({
    name: '',
  });

  const [saving, setSaving] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setFormData({ name: newName });

    // Check for duplicates in real-time
    if (newName.trim().length >= 2) {
      const exists = checkNameExists(newName);
      if (exists) {
        const existing = findByName(newName);
        setDuplicateWarning(
          `Producent "${existing?.name}" już istnieje w systemie. Czy chciałeś wybrać istniejącego producenta?`
        );
      } else {
        setDuplicateWarning(null);
      }
    } else {
      setDuplicateWarning(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: 'Błąd walidacji',
        description: 'Nazwa producenta jest wymagana.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.name.trim().length < 2) {
      toast({
        title: 'Błąd walidacji',
        description: 'Nazwa producenta musi mieć minimum 2 znaki.',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      await createManufacturer(formData);
      toast({
        title: 'Producent dodany',
        description: `Producent "${formData.name}" został pomyślnie utworzony.`,
      });
      router.push('/admin/producenci');
    } catch (error) {
      toast({
        title: 'Błąd',
        description: error instanceof Error ? error.message : 'Nie udało się utworzyć producenta.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/producenci">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Powrót
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Dodaj Producenta</h1>
          <p className="text-muted-foreground mt-1">
            Utwórz nowego producenta produktów
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dane Producenta</CardTitle>
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
                onChange={handleNameChange}
                placeholder="np. Viessmann"
                required
                autoFocus
              />
              <p className="text-sm text-muted-foreground">
                Wprowadź pełną nazwę producenta
              </p>
            </div>

            {/* Duplicate warning */}
            {duplicateWarning && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{duplicateWarning}</AlertDescription>
              </Alert>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={saving || !!duplicateWarning}>
                {saving ? 'Zapisywanie...' : 'Dodaj Producenta'}
              </Button>
              <Link href="/admin/producenci">
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
