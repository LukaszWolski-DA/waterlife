import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

/**
 * Strona zarządzania zamówieniami - lista wszystkich zamówień
 * Wyświetla tabelę z zamówieniami, statusami i opcjami zarządzania
 */
export default function AdminOrdersPage() {
  // TODO: Pobrać zamówienia z API/Supabase
  const orders: any[] = [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Zarządzanie zamówieniami</h1>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nr zamówienia</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Klient</TableHead>
              <TableHead>Wartość</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Akcje</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500">
                  Brak zamówień
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.total} PLN</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/zamowienia/${order.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Szczegóły
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
