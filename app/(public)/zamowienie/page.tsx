'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/hooks/useCart';
import CartSummary from '@/components/koszyk/CartSummary';

/**
 * Strona finalizacji zamówienia
 * Formularz z danymi klienta i adresem dostawy
 */
export default function OrderPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Wysłać zamówienie do API
      const formData = new FormData(e.currentTarget);
      const orderData = {
        customerName: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        city: formData.get('city'),
        postalCode: formData.get('postalCode'),
        items,
        total,
      };

      // await createOrder(orderData);
      console.log('Zamówienie:', orderData);

      clearCart();
      router.push('/'); // TODO: Przekierowanie do strony potwierdzenia
    } catch (error) {
      console.error('Błąd podczas składania zamówienia:', error);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    router.push('/koszyk');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Finalizacja zamówienia</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formularz zamówienia */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Dane kontaktowe</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Imię i nazwisko *</Label>
                <Input id="name" name="name" required />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div>
                <Label htmlFor="phone">Telefon *</Label>
                <Input id="phone" name="phone" type="tel" required />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Adres dostawy</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="address">Ulica i numer *</Label>
                <Input id="address" name="address" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postalCode">Kod pocztowy *</Label>
                  <Input id="postalCode" name="postalCode" required />
                </div>
                <div>
                  <Label htmlFor="city">Miasto *</Label>
                  <Input id="city" name="city" required />
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Przetwarzanie...' : 'Złóż zamówienie'}
          </Button>
        </form>

        {/* Podsumowanie */}
        <div className="lg:col-span-1">
          <CartSummary total={total} />
        </div>
      </div>
    </div>
  );
}
