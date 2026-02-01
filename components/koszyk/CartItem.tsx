'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { formatPrice } from '@/lib/format-price';

/**
 * Pojedynczy element w koszyku
 * Wyświetla produkt z możliwością zmiany ilości i usunięcia
 */
interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
  };
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export default function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {
  const subtotal = item.price * item.quantity;

  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow">
      {/* Zdjecie produktu */}
      <div className="w-24 h-24 bg-gray-100 rounded-lg relative flex-shrink-0">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-contain rounded-lg"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            Brak zdjecia
          </div>
        )}
      </div>

      {/* Informacje o produkcie */}
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{item.name}</h3>
        <p className="text-gray-600">{formatPrice(item.price)} PLN</p>
      </div>

      {/* Kontrola ilości */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
        >
          -
        </Button>
        <Input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
          className="w-16 text-center"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
        >
          +
        </Button>
      </div>

      {/* Suma częściowa */}
      <div className="text-right w-24">
        <p className="font-bold text-lg">{formatPrice(subtotal)} PLN</p>
      </div>

      {/* Przycisk usunięcia */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(item.id)}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  );
}
