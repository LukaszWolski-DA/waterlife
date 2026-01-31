'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProductsAdmin } from '@/hooks/use-products-admin';
import ProductForm from '@/components/produkty/ProductForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

/**
 * Strona edycji produktu
 * Ładuje produkt z localStorage i wyświetla formularz z pre-wypełnionymi danymi
 */

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const { getProduct } = useProductsAdmin();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const productId = params.id as string;

  useEffect(() => {
    setLoading(true);
    const product = getProduct(productId);

    if (!product) {
      setNotFound(true);
    }

    setLoading(false);
  }, [productId, getProduct]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Ładowanie produktu...</div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="p-8">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-lg border border-destructive bg-destructive/10 p-8 text-center">
            <h2 className="mb-2 text-2xl font-bold">Produkt nie znaleziony</h2>
            <p className="mb-6 text-muted-foreground">
              Produkt o ID {productId} nie istnieje.
            </p>
            <Link href="/admin/produkty">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Powrót do listy produktów
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mx-auto max-w-2xl">
        <Link href="/admin/produkty" className="mb-6 inline-block">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Powrót do listy
          </Button>
        </Link>

        <h1 className="mb-6 text-3xl font-bold">Edytuj produkt</h1>

        <ProductForm mode="edit" productId={productId} />
      </div>
    </div>
  );
}
