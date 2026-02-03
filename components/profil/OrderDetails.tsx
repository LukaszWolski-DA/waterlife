import { Order, ORDER_STATUS_LABELS } from '@/types/order';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface OrderDetailsProps {
  order: Order;
}

export function OrderDetails({ order }: OrderDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadgeVariant = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'confirmed':
      case 'processing':
      case 'shipped':
        return 'default';
      case 'delivered':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="details" className="border-none">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex flex-col items-start gap-2 text-left w-full pr-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono text-muted-foreground">
                  #{order.id.slice(0, 8)}
                </span>
                <Badge variant={getStatusBadgeVariant(order.status)}>
                  {ORDER_STATUS_LABELS[order.status]}
                </Badge>
              </div>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(order.created_at), {
                  addSuffix: true,
                  locale: pl,
                })}
              </span>
            </div>
            <div className="flex items-center justify-between w-full">
              <span className="text-sm text-muted-foreground">
                {order.cart_snapshot.items.length} {order.cart_snapshot.items.length === 1 ? 'produkt' : 'produkty'}
              </span>
              <span className="text-lg font-bold">
                {order.total.toLocaleString('pl-PL')} zł
              </span>
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent>
          <div className="pt-4 space-y-6">
            {/* Dane kontaktowe */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Dane kontaktowe</h4>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Imię i nazwisko:</span>
                  <span className="font-medium">{order.customer_info.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{order.customer_info.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Telefon:</span>
                  <span className="font-medium">{order.customer_info.phone}</span>
                </div>
                {order.customer_info.company && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Firma:</span>
                    <span className="font-medium">{order.customer_info.company}</span>
                  </div>
                )}
                {order.customer_info.nip && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">NIP:</span>
                    <span className="font-medium">{order.customer_info.nip}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Produkty */}
            <div>
              <h4 className="font-semibold mb-3">Produkty</h4>
              <div className="border rounded-lg overflow-hidden">
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
                    {order.cart_snapshot.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-right">
                          {item.price.toLocaleString('pl-PL')} zł
                        </TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right font-medium">
                          {(item.price * item.quantity).toLocaleString('pl-PL')} zł
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Uwagi */}
            {order.notes && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Uwagi</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {order.notes}
                </p>
              </div>
            )}

            {/* Podsumowanie */}
            <div className="flex justify-between items-center pt-4 border-t">
              <span className="text-muted-foreground">Data złożenia:</span>
              <span className="text-sm">{formatDate(order.created_at)}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Suma całkowita:</span>
              <span>{order.total.toLocaleString('pl-PL')} zł</span>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
