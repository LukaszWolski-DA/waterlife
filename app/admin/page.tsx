import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ORDER_STATUS_LABELS } from '@/types/order';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import { createAuthServerClient } from '@/lib/supabase/server-auth';

// Cache na 1 minutę
export const revalidate = 60;

interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
  newMessages: number;
}

interface RecentOrder {
  id: string;
  created_at: string;
  customer_info: {
    fullName: string;
    email: string;
  };
  total: number;
  status: string;
}

/**
 * Dashboard administratora
 * Wyświetla statystyki: liczba zamówień, produktów, przychody, nowe wiadomości
 */
export default async function AdminDashboardPage() {
  // Pobierz statystyki bezpośrednio z Supabase
  let stats: DashboardStats = {
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    newMessages: 0,
  };
  
  let recentOrders: RecentOrder[] = [];
  
  try {
    const supabase = await createAuthServerClient();
    
    // Pobierz statystyki równolegle
    const [ordersResult, productsResult, revenueResult] = await Promise.all([
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('total'),
    ]);
    
    stats.totalOrders = ordersResult.count || 0;
    stats.totalProducts = productsResult.count || 0;
    stats.totalRevenue = revenueResult.data?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
    
    console.log('[Dashboard] Stats:', stats);
    
    // Pobierz ostatnie 5 zamówień
    const { data: orders } = await supabase
      .from('orders')
      .select('id, created_at, customer_info, total, status')
      .order('created_at', { ascending: false })
      .limit(5);
    
    recentOrders = orders || [];
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
  }
  
  // Formatowanie kwoty PLN
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('pl-PL', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Zamówienia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-gray-500 mt-1">Łącznie zamówień</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Produkty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-gray-500 mt-1">W katalogu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Przychody
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(stats.totalRevenue)} PLN</div>
            <p className="text-xs text-gray-500 mt-1">Łączne przychody</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Wiadomości
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.newMessages}</div>
            <p className="text-xs text-gray-500 mt-1">Nowe wiadomości</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ostatnie zamówienia</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-gray-500">Brak zamówień</p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <Link 
                    key={order.id}
                    href={`/admin/zamowienia/${order.id}`}
                    className="block p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-mono text-sm text-gray-600">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </div>
                      <Badge 
                        variant="outline" 
                        className={getStatusColor(order.status)}
                      >
                        {ORDER_STATUS_LABELS[order.status]}
                      </Badge>
                    </div>
                    <div className="text-sm font-medium">
                      {order.customer_info.fullName}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(order.created_at), {
                          addSuffix: true,
                          locale: pl,
                        })}
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(order.total)} PLN
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Najlepiej sprzedające się produkty</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Brak danych</p>
            <p className="text-xs text-gray-400 mt-1">
              Funkcjonalność dostępna wkrótce
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
