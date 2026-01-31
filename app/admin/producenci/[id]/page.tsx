'use client';

import { useState, useEffect, use } from 'react';
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
 * Admin page - Edit manufacturer
 * Form for editing an existing manufacturer with duplicate detection
 */
interface EditManufacturerPageProps {
  params: Promise<{ id: string }>;
}

export default function EditManufacturerPage({ params }: EditManufacturerPageProps) {
  const { id: manufacturerId } = use(params);
  const router = useRouter();

  const { getManufacturer, updateManufacturer, checkNameExists, findByName } = useManufacturersAdmin();
  const { toast } = useToast();

  const [formData, setFormData] = useState<ManufacturerFormData>({
    name: '',
  });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  useEffect(() => {
    if (!manufacturerId) return;

    const manufacturer = getManufacturer(manufacturerId);
    if (!manufacturer) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setFormData({
      name: manufacturer.name,
    });
    setLoading(false);
  }, [manufacturerId, getManufacturer]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setFormData({ name: newName });

    // Check for duplicates (excluding current manufacturer)
    if (newName.trim().length >= 2) {
      const exists = checkNameExists(newName, manufacturerId);
      if (exists) {
        const existing = findByName(newName);
        setDuplicateWarning(
          `Producent "${existing?.name}" już istnieje w systemie.`
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
      await updateManufacturer(manufacturerId, {
        name: formData.name,
      });
      toast({
        title: 'Producent zaktualizowany',
        description: `Producent "${formData.name}" został pomyślnie zaktualizowany.`,
      });
      router.push('/admin/producenci');
    } catch (error) {
      toast({
        title: 'Błąd',
        description: error instanceof Error ? error.message : 'Nie udało się zaktualizować producenta.',
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
          <Link href="/admin/producenci">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Powrót
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-lg font-medium">Producent nie znaleziony</p>
              <p className="text-sm text-muted-foreground mt-1">
                Producent o podanym ID nie istnieje.
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
        <Link href="/admin/producenci">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Powrót
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edytuj Producenta</h1>
          <p className="text-muted-foreground mt-1">
            Zaktualizuj dane producenta
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
                {saving ? 'Zapisywanie...' : 'Zapisz Zmiany'}
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
