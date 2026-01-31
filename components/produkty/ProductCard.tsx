'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatPrice } from '@/lib/format-price';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart } from 'lucide-react';

/**
 * Karta produktu - miniatura
 * Wyświetla zdjęcie, nazwę, cenę i przycisk dodania do koszyka
 */
interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
    description?: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCart((state) => state.addItem);
  const { toast } = useToast();

  const handleAddToCart = () => {
    // Add product to cart
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    });

    // Show toast confirmation
    toast({
      title: "Dodano do koszyka",
      description: `${product.name} został dodany do koszyka.`,
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition">
      <Link href={`/produkty/${product.id}`}>
        <div className="aspect-square bg-gray-100 relative">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Brak zdjęcia
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/produkty/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-blue-600 transition">
            {product.name}
          </h3>
        </Link>
        {product.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <span className="text-2xl font-bold text-blue-600">
          {formatPrice(product.price)} PLN
        </span>
        <Button size="sm" onClick={handleAddToCart}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Do koszyka
        </Button>
      </CardFooter>
    </Card>
  );
}
