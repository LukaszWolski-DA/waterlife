'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdminOrders } from '@/hooks/useAdminOrders';
import { ORDER_STATUS_LABELS } from '@/types/order';
import { OrderStatusSelect } from '@/components/admin/OrderStatusSelect';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  Eye,
  Package,
  CheckCircle2,
  Search,
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { pl } from 'date-fns/locale';

/**
 * Strona zarządzania zamówieniami - lista wszystkich zamówień
 * Wyświetla zakładki: Aktywne i Obsłużone z paginacją
 */
export default function AdminOrdersPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  const { orders, isLoading, error, pagination, updateOrderStatus } = useAdminOrders(
    activeTab,
    currentPage,
    20,
    searchQuery,
    dateFilter
  );

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('pl-PL', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatFullDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy-MM-dd HH:mm:ss');
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      processing: 'bg-purple-100 text-purple-800 border-purple-200',
      shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset do strony 1 przy wyszukiwaniu
  };

  const handleDateFilterChange = (value: string) => {
    setDateFilter(value);
    setCurrentPage(1); // Reset do strony 1 przy zmianie filtra
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Zarządzanie zamówieniami</h1>
          <p className="text-muted-foreground mt-2">
            Przeglądaj i zarządzaj wszystkimi zamówieniami
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => {
        setActiveTab(value as 'active' | 'completed');
        setCurrentPage(1); // Reset do strony 1 przy zmianie zakładki
      }}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Aktywne
            {!isLoading && activeTab !== 'active' && (
              <Badge variant="secondary" className="ml-1">
                {orders.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Obsłużone
            {!isLoading && activeTab !== 'completed' && pagination && (
              <Badge variant="secondary" className="ml-1">
                {pagination.total}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Error state */}
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Active Orders Tab */}
        <TabsContent value="active" className="mt-6">
          {/* Filters */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Szukaj po kliencie, email lub ID..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={dateFilter} onValueChange={handleDateFilterChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtruj po dacie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie</SelectItem>
                <SelectItem value="today">Dzisiaj</SelectItem>
                <SelectItem value="7days">Ostatnie 7 dni</SelectItem>
                <SelectItem value="30days">Ostatnie 30 dni</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-lg border p-12 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Brak aktywnych zamówień</h3>
              <p className="text-muted-foreground">
                Wszystkie zamówienia zostały obsłużone
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nr zamówienia</TableHead>
                    <TableHead>Data złożenia</TableHead>
                    <TableHead>Klient</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Wartość</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Akcje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </TableCell>
                      <TableCell className="text-sm">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help">
                                {formatDistanceToNow(new Date(order.created_at), {
                                  addSuffix: true,
                                  locale: pl,
                                })}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{formatFullDate(order.created_at)}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell className="font-medium">
                        {order.customer_info.fullName}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {order.customer_info.email}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(order.total)} zł
                      </TableCell>
                      <TableCell>
                        <OrderStatusSelect
                          currentStatus={order.status}
                          orderId={order.id}
                          onStatusChange={updateOrderStatus}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/zamowienia/${order.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Szczegóły
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* Completed Orders Tab */}
        <TabsContent value="completed" className="mt-6">
          {/* Filters */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Szukaj po kliencie, email lub ID..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={dateFilter} onValueChange={handleDateFilterChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtruj po dacie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie</SelectItem>
                <SelectItem value="today">Dzisiaj</SelectItem>
                <SelectItem value="7days">Ostatnie 7 dni</SelectItem>
                <SelectItem value="30days">Ostatnie 30 dni</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-lg border p-12 text-center">
              <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Brak obsłużonych zamówień</h3>
              <p className="text-muted-foreground">
                Obsłużone zamówienia pojawią się tutaj
              </p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nr zamówienia</TableHead>
                      <TableHead>Data złożenia</TableHead>
                      <TableHead>Klient</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-right">Wartość</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Akcje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </TableCell>
                        <TableCell className="text-sm">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help">
                                  {new Date(order.created_at).toLocaleDateString('pl-PL', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{formatFullDate(order.created_at)}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell className="font-medium">
                          {order.customer_info.fullName}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {order.customer_info.email}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(order.total)} zł
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getStatusColor(order.status)}
                          >
                            {ORDER_STATUS_LABELS[order.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/zamowienia/${order.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              Szczegóły
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 px-2">
                  <div className="text-sm text-muted-foreground">
                    Strona {pagination.page} z {pagination.totalPages} (Łącznie:{' '}
                    {pagination.total} zamówień)
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Poprzednia
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                      disabled={currentPage === pagination.totalPages}
                    >
                      Następna
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
