'use client';

import { useState, useRef } from 'react';
import { Upload, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import type { ProductImage } from '@/types/product';

interface MultiImageUploadProps {
  value: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  maxImages?: number;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export function MultiImageUpload({
  value = [],
  onChange,
  maxImages = 3
}: MultiImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Nieprawidłowy format pliku. Dozwolone: JPG, PNG, WEBP';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'Plik jest zbyt duży. Maksymalny rozmiar: 5MB';
    }
    return null;
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/admin/upload-image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    const data = await response.json();
    return data.url;
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - value.length;
    if (remainingSlots <= 0) {
      toast({
        title: 'Limit zdjęć',
        description: `Maksymalnie ${maxImages} zdjęcia na produkt.`,
        variant: 'destructive',
      });
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    setIsUploading(true);

    try {
      const newImages: ProductImage[] = [];

      for (const file of filesToUpload) {
        const error = validateFile(file);
        if (error) {
          toast({
            title: 'Błąd walidacji',
            description: error,
            variant: 'destructive',
          });
          continue;
        }

        const url = await uploadImage(file);
        if (url) {
          newImages.push({
            url,
            isMain: value.length === 0 && newImages.length === 0,
          });
        }
      }

      if (newImages.length > 0) {
        onChange([...value, ...newImages]);
        toast({
          title: 'Zdjęcia przesłane',
          description: `Przesłano ${newImages.length} zdjęć.`,
        });
      }
    } catch (error) {
      toast({
        title: 'Błąd uploadu',
        description: error instanceof Error ? error.message : 'Nie udało się przesłać obrazu.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (index: number) => {
    const newImages = value.filter((_, i) => i !== index);

    // Jeśli usunięte zdjęcie było główne, ustaw pierwsze jako główne
    if (value[index].isMain && newImages.length > 0) {
      newImages[0] = { ...newImages[0], isMain: true };
    }

    onChange(newImages);
  };

  const handleSetMain = (index: number) => {
    const newImages = value.map((img, i) => ({
      ...img,
      isMain: i === index,
    }));
    onChange(newImages);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      {/* Siatka zdjęć */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {value.map((image, index) => (
            <div key={`${index}-${image.url}`} className="relative group">
              <div className={`relative aspect-square w-full overflow-hidden rounded-lg border-2 bg-gray-100 ${
                image.isMain ? 'border-primary ring-2 ring-primary/20' : 'border-border'
              }`}>
                {image.url ? (
                  <Image
                    src={image.url}
                    alt={`Zdjęcie ${index + 1}`}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    Brak URL
                  </div>
                )}
                {image.isMain && (
                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                    Główne
                  </div>
                )}
              </div>

              {/* Kontrolki */}
              <div className="absolute bottom-2 left-2 right-2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  type="button"
                  size="sm"
                  variant={image.isMain ? "default" : "secondary"}
                  className="h-8"
                  onClick={() => handleSetMain(index)}
                  disabled={image.isMain}
                  title={image.isMain ? "To jest główne zdjęcie" : "Ustaw jako główne"}
                >
                  <Star className={`h-4 w-4 ${image.isMain ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  className="h-8"
                  onClick={() => handleRemove(index)}
                  title="Usuń zdjęcie"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Obszar uploadu (pokaż jeśli poniżej limitu) */}
      {value.length < maxImages && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_TYPES.join(',')}
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center gap-4">
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                <p className="text-sm text-muted-foreground">Przesyłanie...</p>
              </>
            ) : (
              <>
                <div className="rounded-full bg-primary/10 p-4">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Kliknij lub przeciągnij zdjęcia tutaj
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG, WEBP (max 5MB) - {maxImages - value.length} {maxImages - value.length === 1 ? 'slot pozostały' : 'sloty pozostałe'}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Podpowiedź */}
      {value.length > 0 && value.length < maxImages && (
        <p className="text-xs text-muted-foreground">
          Najedź na zdjęcie, aby zobaczyć opcje. Kliknij gwiazdkę, aby ustawić jako główne.
        </p>
      )}
    </div>
  );
}
