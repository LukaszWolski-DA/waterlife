import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Strona szczegółów zamówienia
 * Wyświetla pełne informacje o zamówieniu, produktach, kliencie i adresie dostawy
 * Pozwala na zmianę statusu zamówienia
 */
interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;

  // TODO: Pobrać dane zamówienia z API/Supabase
  // const order = await getOrderById(id);
  // if (!order) notFound();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Zamówienie #{id}</h1>
        <div className="space-x-2">
          <Button variant="outline">Zmień status</Button>
          <Button>Wydrukuj</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Produkty</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Lista produktów w zamówieniu</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historia zmian statusu</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Historia statusów zamówienia</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Klient</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-semibold">Imię i nazwisko:</span>
                  <br />
                  Jan Kowalski
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Email:</span>
                  <br />
                  jan@example.com
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Telefon:</span>
                  <br />
                  +48 123 456 789
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Adres dostawy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                ul. Przykładowa 123
                <br />
                00-000 Warszawa
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Podsumowanie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Produkty:</span>
                  <span>0.00 PLN</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Dostawa:</span>
                  <span>0.00 PLN</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Razem:</span>
                  <span>0.00 PLN</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
