'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

/**
 * Component do uploadu obrazów produktów
 * Z drag-and-drop, preview i walidacją
 */

interface ImageUploadProps {
  value?: string; // Current image URL
  onChange: (url: string) => void;
  onRemove?: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
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

  const uploadImage = async (file: File) => {
    setIsUploading(true);

    try {
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

      if (data.success && data.url) {
        setPreview(data.url);
        onChange(data.url);
        toast({
          title: 'Zdjęcie przesłane',
          description: 'Obraz został pomyślnie przesłany.',
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Błąd uploadu',
        description: error instanceof Error ? error.message : 'Nie udało się przesłać obrazu.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = async (file: File) => {
    const error = validateFile(file);

    if (error) {
      toast({
        title: 'Błąd walidacji',
        description: error,
        variant: 'destructive',
      });
      return;
    }

    await uploadImage(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange('');
    if (onRemove) onRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative w-full">
          <div className="relative aspect-square w-full max-w-xs overflow-hidden rounded-lg border bg-gray-100">
            <Image
              src={preview}
              alt="Product preview"
              fill
              className="object-contain"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="mt-2"
            onClick={handleRemove}
          >
            <X className="mr-2 h-4 w-4" />
            Usuń zdjęcie
          </Button>
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_TYPES.join(',')}
            onChange={handleInputChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center gap-4">
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-sm text-muted-foreground">Przesyłanie...</p>
              </>
            ) : (
              <>
                <div className="rounded-full bg-primary/10 p-4">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Kliknij lub przeciągnij obraz tutaj
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG, WEBP (max 5MB)
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
