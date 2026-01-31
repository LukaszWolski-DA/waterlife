import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/format-price';

/**
 * Podsumowanie koszyka
 * Wyświetla sumę produktów, koszty dostawy i kwotę końcową
 */
interface CartSummaryProps {
  total: number;
  deliveryCost?: number;
}

export default function CartSummary({ total, deliveryCost = 0 }: CartSummaryProps) {
  const finalTotal = total + deliveryCost;

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Podsumowanie</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Produkty:</span>
            <span>{formatPrice(total)} PLN</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Dostawa:</span>
            <span>
              {deliveryCost === 0 ? 'Gratis' : `${formatPrice(deliveryCost)} PLN`}
            </span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between font-bold text-lg">
          <span>Razem:</span>
          <span className="text-blue-600">{formatPrice(finalTotal)} PLN</span>
        </div>

        {deliveryCost === 0 && total > 0 && (
          <p className="text-xs text-green-600 text-center">
            Darmowa dostawa od 0 PLN
          </p>
        )}
      </CardContent>
    </Card>
  );
}
