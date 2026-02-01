'use client';

import { use, useEffect, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingCart, Package, Shield, Truck } from 'lucide-react';
import { getAllProducts, getProductById, initializeStore } from '@/lib/products-store';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { formatPriceWithCurrency } from '@/lib/format-price';
import type { Product, ProductImage } from '@/types/product';
import { ProductGallery } from '@/components/produkty/ProductGallery';

/**
 * Strona szczegółów pojedynczego produktu
 * Wyświetla zdjęcia, opis, cenę i przycisk dodania do koszyka
 */
interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    initializeStore();
    const foundProduct = getProductById(id);

    if (!foundProduct) {
      setLoading(false);
      return;
    }

    setProduct(foundProduct);

    // Get related products (same category)
    const allProducts = getAllProducts();
    const related = allProducts
      .filter(p => p.category === foundProduct.category && p.id !== id)
      .slice(0, 4);
    setRelatedProducts(related);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Ładowanie produktu...</div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    });

    toast({
      title: "Dodano do koszyka",
      description: `${product.name} został dodany do koszyka.`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/produkty"
          className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Powrót do produktów
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Galeria zdjec produktu */}
        <div>
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <ProductGallery
                images={
                  product.images && product.images.length > 0
                    ? product.images
                    : product.imageUrl
                      ? [{ url: product.imageUrl, isMain: true }]
                      : []
                }
                productName={product.name}
              />
            </CardContent>
          </Card>
        </div>

        {/* Informacje o produkcie */}
        <div>
          <div className="mb-4">
            <Badge variant="outline" className="mb-2">
              {product.category}
            </Badge>
            {product.featured && (
              <Badge className="ml-2">Bestseller</Badge>
            )}
          </div>

          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

          <p className="text-3xl font-bold text-primary mb-6">
            {formatPriceWithCurrency(product.price)}
          </p>

          {/* Stan magazynowy */}
          <div className="flex items-center gap-2 mb-6">
            <Package className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm">
              {product.stock > 0 ? (
                <span className="text-green-600 font-medium">
                  Dostępny ({product.stock} szt.)
                </span>
              ) : (
                <span className="text-red-600 font-medium">Brak w magazynie</span>
              )}
            </span>
          </div>

          {/* Opis */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Opis produktu</h2>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Przycisk dodania do koszyka */}
          <Button
            size="lg"
            className="w-full mb-6"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {product.stock > 0 ? 'Dodaj do koszyka' : 'Brak w magazynie'}
          </Button>

          {/* Dodatkowe informacje */}
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardContent className="flex items-start gap-3 p-4">
                <Truck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Szybka dostawa</p>
                  <p className="text-sm text-muted-foreground">
                    Realizacja zamówienia w 24h
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-start gap-3 p-4">
                <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Gwarancja producenta</p>
                  <p className="text-sm text-muted-foreground">
                    Oryginalny produkt z pełną gwarancją
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Powiązane produkty */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Podobne produkty</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link key={relatedProduct.id} href={`/produkty/${relatedProduct.id}`}>
                <Card className="group hover:border-primary/50 transition-all h-full">
                  <CardContent className="p-4">
                    {relatedProduct.imageUrl ? (
                      <div className="relative aspect-square rounded-lg mb-4 overflow-hidden bg-gray-100">
                        <Image
                          src={relatedProduct.imageUrl}
                          alt={relatedProduct.name}
                          fill
                          className="object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="bg-gray-100 aspect-square rounded-lg mb-4 flex items-center justify-center">
                        <p className="text-xs text-muted-foreground">Brak zdjecia</p>
                      </div>
                    )}
                    <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-xl font-bold text-primary">
                      {formatPriceWithCurrency(relatedProduct.price)}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
