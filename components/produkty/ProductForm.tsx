'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProductsAdmin } from '@/hooks/use-products-admin';
import { initializeManufacturersStore, getManufacturerNames, manufacturerNameExists } from '@/lib/manufacturers-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { productSchema } from '@/lib/validations';
import type { ProductFormData } from '@/types/product';
import { z } from 'zod';
import { MultiImageUpload } from '@/components/admin/MultiImageUpload';
import type { ProductImage } from '@/types/product';

/**
 * Formularz dodawania/edycji produktu
 * Z walidacją Zod i integracją localStorage
 */

interface ProductFormProps {
  mode: 'create' | 'edit';
  productId?: string;
}

export default function ProductForm({ mode, productId }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { createProduct, updateProduct, getProduct, getCategories } = useProductsAdmin();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [manufacturers, setManufacturers] = useState<string[]>([]);
  const [showManufacturerInput, setShowManufacturerInput] = useState(false);
  const [customManufacturer, setCustomManufacturer] = useState('');
  const [manufacturerDuplicateWarning, setManufacturerDuplicateWarning] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    manufacturer: '',
    imageUrl: '',
    images: [],
    featured: false,
  });

  // Load categories, manufacturers and product data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Załaduj kategorie async
        const loadedCategories = await getCategories();
        setCategories(loadedCategories);

        // Załaduj producentów (synchroniczne z localStorage)
        initializeManufacturersStore();
        const loadedManufacturers = getManufacturerNames();
        setManufacturers(loadedManufacturers);

        // Jeśli tryb edycji, załaduj dane produktu async
        if (mode === 'edit' && productId) {
          const product = await getProduct(productId);
          if (product) {
            // Migracja: jeśli produkt ma tylko imageUrl, przekonwertuj na nowy format
            let images: ProductImage[] = product.images || [];
            if (images.length === 0 && product.imageUrl) {
              images = [{ url: product.imageUrl, isMain: true }];
            }

            setFormData({
              name: product.name,
              description: product.description || '',
              price: product.price,
              stock: product.stock,
              category: product.category || '',
              manufacturer: product.manufacturer || '',
              imageUrl: product.imageUrl || '',
              images: images,
              featured: product.featured || false,
            });
          }
        }
      } catch (error) {
        console.error('Error loading form data:', error);
      }
    };

    loadData();
  }, [mode, productId, getProduct, getCategories]);

  const validateForm = (): boolean => {
    try {
      productSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: 'Błąd walidacji',
        description: 'Sprawdź poprawność wypełnienia formularza',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      if (mode === 'create') {
        await createProduct(formData);
        toast({
          title: 'Produkt dodany',
          description: `Produkt "${formData.name}" został pomyślnie dodany.`,
        });
        // Redirect tylko po utworzeniu nowego produktu
        router.push('/admin/produkty');
      } else if (mode === 'edit' && productId) {
        await updateProduct(productId, formData);
        toast({
          title: 'Produkt zaktualizowany',
          description: `Produkt "${formData.name}" został pomyślnie zaktualizowany.`,
        });
        // Zostań na stronie edycji - użytkownik może kontynuować lub kliknąć "Anuluj"
      }
    } catch (error) {
      toast({
        title: 'Błąd',
        description: 'Nie udało się zapisać produktu.',
        variant: 'destructive',
      });
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: '' }));
    }
  };

  const handleManufacturerChange = (value: string) => {
    if (value === '__other__') {
      setShowManufacturerInput(true);
      setFormData((prev) => ({ ...prev, manufacturer: '' }));
    } else {
      setShowManufacturerInput(false);
      setCustomManufacturer('');
      setManufacturerDuplicateWarning(null);
      setFormData((prev) => ({ ...prev, manufacturer: value }));
    }
    if (errors.manufacturer) {
      setErrors((prev) => ({ ...prev, manufacturer: '' }));
    }
  };

  const handleCustomManufacturerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newManufacturer = e.target.value;
    setCustomManufacturer(newManufacturer);

    // Check for duplicates in real-time
    if (newManufacturer.trim().length >= 2) {
      const exists = manufacturerNameExists(newManufacturer);
      if (exists) {
        const existing = manufacturers.find(
          m => m.toLowerCase() === newManufacturer.trim().toLowerCase()
        );
        setManufacturerDuplicateWarning(
          `Producent "${existing}" już istnieje w systemie. Wybierz go z listy powyżej.`
        );
      } else {
        setManufacturerDuplicateWarning(null);
        setFormData((prev) => ({ ...prev, manufacturer: newManufacturer }));
      }
    } else {
      setManufacturerDuplicateWarning(null);
      setFormData((prev) => ({ ...prev, manufacturer: newManufacturer }));
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">
              Nazwa produktu <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Opis</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={errors.description ? 'border-destructive' : ''}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">
                Cena (PLN) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                className={errors.price ? 'border-destructive' : ''}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-destructive">{errors.price}</p>
              )}
            </div>

            <div>
              <Label htmlFor="stock">
                Stan magazynowy <span className="text-destructive">*</span>
              </Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                className={errors.stock ? 'border-destructive' : ''}
              />
              {errors.stock && (
                <p className="mt-1 text-sm text-destructive">{errors.stock}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="category">Kategoria</Label>
            <Select
              key={`category-select-${formData.category}-${categories.length}`}
              value={formData.category}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                <SelectValue placeholder="Wybierz kategorię" />
              </SelectTrigger>
              <SelectContent>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="Technika Grzewcza" disabled>
                    Brak kategorii
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="mt-1 text-sm text-destructive">{errors.category}</p>
            )}
          </div>

          <div>
            <Label htmlFor="manufacturer">Producent</Label>
            <Select
              key={`manufacturer-select-${formData.manufacturer}-${manufacturers.length}`}
              value={showManufacturerInput ? '__other__' : formData.manufacturer}
              onValueChange={handleManufacturerChange}
            >
              <SelectTrigger className={errors.manufacturer ? 'border-destructive' : ''}>
                <SelectValue placeholder="Wybierz producenta" />
              </SelectTrigger>
              <SelectContent>
                {manufacturers.length > 0 ? (
                  <>
                    {manufacturers.map((manufacturer) => (
                      <SelectItem key={manufacturer} value={manufacturer}>
                        {manufacturer}
                      </SelectItem>
                    ))}
                    <SelectItem value="__other__">Inny...</SelectItem>
                  </>
                ) : (
                  <SelectItem value="__other__">Inny...</SelectItem>
                )}
              </SelectContent>
            </Select>
            {errors.manufacturer && (
              <p className="mt-1 text-sm text-destructive">{errors.manufacturer}</p>
            )}

            {showManufacturerInput && (
              <div className="mt-2 space-y-2">
                <Input
                  value={customManufacturer}
                  onChange={handleCustomManufacturerChange}
                  placeholder="np. Nowy Producent"
                />
                {manufacturerDuplicateWarning && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{manufacturerDuplicateWarning}</AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </div>

          <div>
            <Label>Zdjęcia produktu (max 3)</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Kliknij gwiazdkę, aby ustawić zdjęcie główne wyświetlane na liście produktów
            </p>
            <MultiImageUpload
              value={formData.images || []}
              onChange={(images) => {
                // Znajdź główne zdjęcie dla kompatybilności wstecznej
                const mainImage = images.find(img => img.isMain);
                setFormData((prev) => ({
                  ...prev,
                  images,
                  imageUrl: mainImage?.url || images[0]?.url || '',
                }));
                if (errors.images) {
                  setErrors((prev) => ({ ...prev, images: '' }));
                }
              }}
              maxImages={3}
            />
            {errors.images && (
              <p className="mt-1 text-sm text-destructive">{errors.images}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={formData.featured || false}
              onCheckedChange={(checked) => {
                setFormData((prev) => ({ ...prev, featured: checked === true }));
              }}
            />
            <Label htmlFor="featured" className="cursor-pointer">
              Bestseller - produkt wyświetlany na stronie głównej
            </Label>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading || !!manufacturerDuplicateWarning}>
              {loading
                ? 'Zapisywanie...'
                : mode === 'create'
                ? 'Dodaj produkt'
                : 'Zapisz zmiany'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/produkty')}
            >
              Anuluj
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
