'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CartItem from '@/components/koszyk/CartItem';
import CartSummary from '@/components/koszyk/CartSummary';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Send, ArrowLeft } from 'lucide-react';

/**
 * Strona koszyka zakupowego
 * Wyświetla produkty w koszyku, pozwala na zmianę ilości i przejście do zamówienia
 */
export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { profile } = useUserProfile();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    nip: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Autouzupełnianie formularza dla zalogowanych użytkowników
  useEffect(() => {
    if (isAuthenticated && user && profile) {
      setFormData((prev) => ({
        ...prev,
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        email: user.email,
        phone: profile.phone || '',
        company: profile.company || '',
        nip: profile.nip || '',
        // message pozostaje puste - użytkownik wpisuje za każdym razem
      }));
    }
  }, [isAuthenticated, user, profile]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Imię jest wymagane';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Nazwisko jest wymagane';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email jest wymagany';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Nieprawidłowy format email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefon jest wymagany';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: 'Błąd walidacji',
        description: 'Sprawdź poprawność wypełnienia formularza',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/zapytanie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: formData,
          items,
          total,
          userId: user?.id || null,
          isGuest: !isAuthenticated,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Zapytanie wysłane!',
          description: 'Skontaktujemy się z Tobą najszybciej jak to możliwe.',
        });
        clearCart();
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          company: '',
          nip: '',
          message: '',
        });
        setErrors({});
      } else {
        throw new Error(data.error || 'Błąd podczas wysyłania');
      }
    } catch (error) {
      toast({
        title: 'Błąd',
        description: 'Nie udało się wysłać zapytania. Spróbuj ponownie.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Twój koszyk jest pusty</h1>
        <p className="text-gray-600 mb-8">Dodaj produkty do koszyka, aby kontynuować zakupy</p>
        <Link href="/produkty">
          <Button>Przeglądaj produkty</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header z przyciskiem powrotu */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Koszyk</h1>
        <Button
          variant="outline"
          onClick={() => router.push('/produkty')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Kontynuuj zakupy
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista produktów w koszyku */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={removeItem}
                onUpdateQuantity={updateQuantity}
              />
            ))}
          </div>

          {/* Formularz zapytania ofertowego */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Wyślij zapytanie ofertowe</CardTitle>
              <p className="text-sm text-muted-foreground">
                Wypełnij formularz, a nasi specjaliści skontaktują się z Tobą
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                      Imię <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => {
                        setFormData({ ...formData, firstName: e.target.value });
                        if (errors.firstName) setErrors({ ...errors, firstName: '' });
                      }}
                      placeholder="Jan"
                      className={errors.firstName ? 'border-destructive' : ''}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-destructive mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                      Nazwisko <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => {
                        setFormData({ ...formData, lastName: e.target.value });
                        if (errors.lastName) setErrors({ ...errors, lastName: '' });
                      }}
                      placeholder="Kowalski"
                      className={errors.lastName ? 'border-destructive' : ''}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-destructive mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                      placeholder="jan@example.com"
                      className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Telefon <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (errors.phone) setErrors({ ...errors, phone: '' });
                      }}
                      placeholder="+48 123 456 789"
                      className={errors.phone ? 'border-destructive' : ''}
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-2">
                      Firma (opcjonalnie)
                    </label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Nazwa firmy"
                    />
                  </div>
                  <div>
                    <label htmlFor="nip" className="block text-sm font-medium mb-2">
                      NIP (opcjonalnie)
                    </label>
                    <Input
                      id="nip"
                      value={formData.nip}
                      onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                      placeholder="1234567890"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Uwagi do zamówienia (opcjonalnie)
                  </label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Dodatkowe informacje..."
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  <Send className="mr-2 h-5 w-5" />
                  {isSubmitting ? 'Wysyłanie...' : 'Wyślij zapytanie ofertowe'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Podsumowanie koszyka */}
        <div className="lg:col-span-1">
          <CartSummary total={total} />
        </div>
      </div>
    </div>
  );
}
