'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageLightbox } from './ImageLightbox';
import type { ProductImage } from '@/types/product';

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Znajdź indeks głównego zdjęcia
  const mainIndex = images.findIndex(img => img.isMain);
  const initialMainIndex = mainIndex >= 0 ? mainIndex : 0;

  // Stan wybranego zdjęcia (domyślnie główne)
  const [selectedIndex, setSelectedIndex] = useState(initialMainIndex);

  if (images.length === 0) {
    return (
      <div className="bg-gray-100 aspect-square rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Brak zdjecia produktu</p>
      </div>
    );
  }

  const imageUrls = images.map(img => img.url).filter(url => url && url.length > 0);

  const handleMainClick = () => {
    setLightboxIndex(selectedIndex);
    setLightboxOpen(true);
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <div className="space-y-4">
      {/* Glowne zdjecie */}
      <div
        className="relative aspect-square w-full overflow-hidden rounded-lg border bg-gray-100 cursor-pointer group"
        onClick={handleMainClick}
      >
        {images[selectedIndex]?.url ? (
          <Image
            src={images[selectedIndex].url}
            alt={productName}
            fill
            className="object-contain"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Brak zdjecia
          </div>
        )}
        {/* Podpowiedz przy hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors">
          <span className="opacity-0 group-hover:opacity-100 text-white bg-black/50 px-4 py-2 rounded-full text-sm transition-opacity">
            Kliknij, aby powiekszye
          </span>
        </div>
      </div>

      {/* Miniaturki (tylko gdy wiecej niz 1 zdjecie) */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((image, index) => (
            <button
              key={`${index}-${image.url}`}
              className={`relative w-20 h-20 overflow-hidden rounded-md border-2 bg-gray-100 transition-all ${
                selectedIndex === index
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => handleThumbnailClick(index)}
            >
              {image.url ? (
                <Image
                  src={image.url}
                  alt={`${productName} - miniatura ${index + 1}`}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-[8px]">
                  Brak
                </div>
              )}
              {image.isMain && (
                <div className="absolute bottom-0 left-0 right-0 bg-primary/80 text-primary-foreground text-[10px] text-center py-0.5">
                  Glowne
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <ImageLightbox
        images={imageUrls}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
      />
    </div>
  );
}
