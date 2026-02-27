import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { 
  sendCustomerOrderConfirmationEmail, 
  sendOfficeOrderNotificationEmail 
} from '@/lib/email';

/**
 * API endpoint dla zapytań ofertowych
 * POST - zapisuje zamówienie do bazy (orders + cart_items jako historia) i wysyła zapytanie ofertowe na email
 */

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  nip?: string;
  message?: string;
}

interface RequestBody {
  customer: Customer;
  items: CartItem[];
  total: number;
  userId?: string;
  isGuest?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { customer, items, total, userId, isGuest = true } = body;

    // Walidacja danych
    if (!customer.firstName || !customer.lastName || !customer.email || !customer.phone) {
      return NextResponse.json(
        { success: false, error: 'Brak wymaganych danych klienta' },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Koszyk jest pusty' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Przygotuj dane zamówienia (dopasowane do struktury tabeli orders)
    const orderData = {
      customer_info: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        fullName: `${customer.firstName} ${customer.lastName}`,
        email: customer.email,
        phone: customer.phone,
        company: customer.company || null,
        nip: customer.nip || null,
      },
      total: total,
      status: 'pending' as const,
      notes: customer.message || null,
      user_id: userId || null,
      is_guest: isGuest,
      cart_snapshot: {
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
        })),
        total: total,
        timestamp: new Date().toISOString(),
      },
    };

    // Zapisz zamówienie do bazy
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      console.error('Error saving order:', orderError);
      throw new Error('Nie udało się zapisać zamówienia');
    }

    // Wysyłka emaili - asynchronicznie (nie blokuje procesu)
    try {
      // Email potwierdzający dla klienta
      const customerEmailResult = await sendCustomerOrderConfirmationEmail({
        orderId: order.id,
        customer: {
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
          company: customer.company,
          nip: customer.nip,
          message: customer.message,
        },
        items: items,
        total: total,
        createdAt: order.created_at,
      });

      // Email powiadomienia dla biura
      const officeEmailResult = await sendOfficeOrderNotificationEmail({
        orderId: order.id,
        customer: {
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
          company: customer.company,
          nip: customer.nip,
          message: customer.message,
        },
        items: items,
        total: total,
        createdAt: order.created_at,
      });

      if (!customerEmailResult.success || !officeEmailResult.success) {
        if (!customerEmailResult.success) {
          console.error('Email do klienta: błąd wysyłki');
        }
        if (!officeEmailResult.success) {
          console.error('Email do biura: błąd wysyłki');
        }
      }
    } catch (emailError) {
      // Błąd wysyłki emaila nie przerywa procesu - zamówienie już jest w bazie
      console.error('❌ Błąd podczas wysyłki emaili:', emailError);
    }

    // Zapisz produkty do cart_items jako historia zamówienia
    // (tylko jeśli użytkownik zalogowany - dla gości pomijamy)
    if (userId && !isGuest) {
      try {
        const cartItemsData = items.map(item => ({
          user_id: userId,
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        }));

        const { error: cartError } = await supabase
          .from('cart_items')
          .insert(cartItemsData);

        if (cartError) {
          console.error('Error saving cart history:', cartError);
          // Nie przerywaj procesu - zamówienie już jest zapisane
        }
      } catch (error) {
        console.error('Error saving cart items:', error);
        // Nie przerywaj procesu
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Zapytanie ofertowe zostało wysłane',
      orderId: order.id,
    });
  } catch (error) {
    console.error('Błąd podczas wysyłania zapytania:', error);
    return NextResponse.json(
      { success: false, error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}
