'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { useAdminOrder } from '@/hooks/useAdminOrders';
import { OrderStatusSelect } from '@/components/admin/OrderStatusSelect';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  AlertCircle,
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  FileText,
  Calendar,
  User,
  Package,
} from 'lucide-react';

/**
 * Strona szczegółów zamówienia
 * Wyświetla pełne informacje o zamówieniu, produktach, kliencie
 * Pozwala na zmianę statusu zamówienia
 */
interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const router = useRouter();
  const [orderId, setOrderId] = React.useState<string | null>(null);

  useEffect(() => {
    params.then(({ id }) => setOrderId(id));
  }, [params]);

  const { order, isLoading, error, updateStatus } = useAdminOrder(orderId);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('pl-PL', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-32" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div>
        <Button
          variant="ghost"
          onClick={() => router.push('/admin/zamowienia')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Wróć do listy
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || 'Zamówienie nie zostało znalezione'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/zamowienia')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Wróć do listy
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              Zamówienie #{order.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className="text-muted-foreground mt-1">
              Złożone {formatDate(order.created_at)}
            </p>
          </div>
        </div>
        <div>
          <OrderStatusSelect
            currentStatus={order.status}
            orderId={order.id}
            onStatusChange={updateStatus}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Produkty i Uwagi */}
        <div className="lg:col-span-2 space-y-6">
          {/* Produkty */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Produkty w zamówieniu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produkt</TableHead>
                    <TableHead className="text-right">Cena jedn.</TableHead>
                    <TableHead className="text-center">Ilość</TableHead>
                    <TableHead className="text-right">Suma</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.cart_snapshot.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.price)} zł
                      </TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(item.price * item.quantity)} zł
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50">
                    <TableCell colSpan={3} className="font-bold text-right">
                      SUMA CAŁKOWITA
                    </TableCell>
                    <TableCell className="text-right font-bold text-lg">
                      {formatCurrency(order.total)} zł
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Uwagi */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Uwagi klienta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap bg-muted p-4 rounded-lg">
                  {order.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Dane klienta i informacje */}
        <div className="space-y-6">
          {/* Dane klienta */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Dane klienta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Imię i nazwisko</p>
                <p className="font-semibold">{order.customer_info.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <a
                  href={`mailto:${order.customer_info.email}`}
                  className="font-medium text-blue-600 hover:underline flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  {order.customer_info.email}
                </a>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Telefon</p>
                <a
                  href={`tel:${order.customer_info.phone}`}
                  className="font-medium text-blue-600 hover:underline flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  {order.customer_info.phone}
                </a>
              </div>
              {order.customer_info.company && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Firma</p>
                  <p className="font-medium flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {order.customer_info.company}
                  </p>
                </div>
              )}
              {order.customer_info.nip && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">NIP</p>
                  <p className="font-mono font-medium">{order.customer_info.nip}</p>
                </div>
              )}
              <div className="pt-4 border-t">
                <Badge variant={order.is_guest ? 'secondary' : 'default'}>
                  {order.is_guest ? 'Zamówienie gościa' : 'Użytkownik zalogowany'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Informacje techniczne */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Informacje
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">ID zamówienia</p>
                <p className="font-mono text-xs bg-muted p-2 rounded">
                  {order.id}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Data złożenia</p>
                <p className="font-medium">{formatDate(order.created_at)}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Ostatnia aktualizacja</p>
                <p className="font-medium">{formatDate(order.updated_at)}</p>
              </div>
              {order.user_id && (
                <div>
                  <p className="text-muted-foreground mb-1">User ID</p>
                  <p className="font-mono text-xs">{order.user_id}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Import React na górze
import * as React from 'react';
