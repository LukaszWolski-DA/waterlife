"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Eye, ArrowRight, Flame, Droplets, Zap } from "lucide-react";
import { getAllProducts, initializeStore } from "@/lib/products-store";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { formatPriceWithCurrency } from "@/lib/format-price";
import type { Product, ProductImage } from "@/types/product";

// Helper do pobierania glownego zdjecia
function getMainImageUrl(product: Product): string | undefined {
  if (product.images && product.images.length > 0) {
    const mainImage = product.images.find(img => img.isMain);
    return mainImage?.url || product.images[0]?.url;
  }
  return product.imageUrl;
}

// Mapowanie kategorii na ikony
const categoryIcons: Record<string, any> = {
  "Technika Grzewcza": Flame,
  "Systemy Sanitarne": Droplets,
  "Nawadnianie": Zap,
};

export function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addItem } = useCart();
  const { toast } = useToast();

  // Load products from API (Supabase)
  useEffect(() => {
    const loadProducts = async () => {
      const allProducts = await getAllProducts();
      // Get only bestsellers (featured === true), sorted by price descending, max 6
      const featuredProducts = allProducts
        .filter(p => p.featured === true && p.status === 'active')
        .sort((a, b) => b.price - a.price)
        .slice(0, 6);
      setProducts(featuredProducts);
    };

    loadProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    const mainImageUrl = getMainImageUrl(product);
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: mainImageUrl,
    });

    toast({
      title: "Dodano do koszyka",
      description: `${product.name} został dodany do koszyka.`,
    });
  };

  return (
    <section className="py-20 md:py-28 bg-secondary/50" id="products" suppressHydrationWarning>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-primary font-medium mb-2 tracking-wide uppercase text-sm">
              Polecane produkty
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
              Najczęściej wybierane przez klientów
            </h2>
          </div>
          <Button variant="outline" className="self-start md:self-auto group bg-transparent" asChild>
            <Link href="/produkty">
              Zobacz wszystkie produkty
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const IconComponent = product.category ? categoryIcons[product.category] || Flame : Flame;

            return (
              <Card
                key={product.id}
                className="group overflow-hidden border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
              >
                <CardContent className="p-0">
                  <div className="relative aspect-square bg-gray-100">
                    {getMainImageUrl(product) ? (
                      <Image
                        src={getMainImageUrl(product)!}
                        alt={product.name}
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <div className="bg-gray-100 w-full h-full flex items-center justify-center">
                        <div className="bg-primary/10 rounded-full p-8">
                          <IconComponent className="h-16 w-16 text-primary" />
                        </div>
                      </div>
                    )}
                    {product.featured && (
                      <Badge
                        className="absolute top-4 left-4 z-10"
                        variant="default"
                      >
                        Bestseller
                      </Badge>
                    )}
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <Button size="icon" variant="secondary" className="rounded-full" asChild>
                          <Link href={`/produkty/${product.id}`}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Podgląd</span>
                          </Link>
                        </Button>
                        <Button
                          size="icon"
                          className="rounded-full"
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingCart className="h-4 w-4" />
                          <span className="sr-only">Dodaj do koszyka</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
                      {product.category}
                    </p>
                    <Link href={`/produkty/${product.id}`}>
                      <h3 className="font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold text-primary">
                        {formatPriceWithCurrency(product.price)}
                      </p>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-muted-foreground hover:text-primary"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Dodaj
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
