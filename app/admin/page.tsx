import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Dashboard administratora
 * Wyświetla statystyki: liczba zamówień, produktów, przychody, nowe wiadomości
 */
export default function AdminDashboardPage() {
  // TODO: Pobrać statystyki z API/Supabase
  const stats = {
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    newMessages: 0,
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
            <div className="text-3xl font-bold">{stats.totalRevenue} PLN</div>
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
            <p className="text-gray-500">Brak zamówień</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Najlepiej sprzedające się produkty</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Brak danych</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
