'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/hooks/useOrders';
import { OrderDetails } from '@/components/profil/OrderDetails';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { orders, isLoading, error, refetch } = useOrders();

  // Redirect jeśli nie zalogowany
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [authLoading, isAuthenticated, router]);

  // Loading state - sprawdzanie autentykacji
  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  // Nie zalogowany
  if (!isAuthenticated) {
    return null; // Redirect się już wykonał
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => router.push('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Wróć do strony głównej
        </Button>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <ShoppingBag className="h-8 w-8" />
          Moje zamówienia
        </h1>
        <p className="text-muted-foreground mt-2">
          Historia Twoich zapytań ofertowych
        </p>
      </div>

      {/* Error state */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && orders.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Brak zamówień</h3>
            <p className="text-muted-foreground text-center mb-6">
              Nie masz jeszcze żadnych zamówień.
              <br />
              Przeglądaj produkty i złóż swoje pierwsze zapytanie ofertowe!
            </p>
            <Button asChild>
              <Link href="/produkty">Przeglądaj produkty</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Orders list */}
      {!isLoading && !error && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4">
                <OrderDetails order={order} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Retry button on error */}
      {error && (
        <div className="flex justify-center mt-6">
          <Button onClick={refetch} variant="outline">
            Spróbuj ponownie
          </Button>
        </div>
      )}
    </div>
  );
}
