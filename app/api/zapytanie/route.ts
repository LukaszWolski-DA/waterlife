import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { getHomepageContentServer } from '@/lib/homepage-server';
import {
  sendCustomerOrderConfirmationEmail,
  sendOfficeOrderNotificationEmail
} from '@/lib/email';
import { zapytanieSchema } from '@/lib/schemas';

/**
 * API endpoint dla zapytań ofertowych
 * POST - zapisuje zamówienie do bazy (orders + cart_items jako historia) i wysyła zapytanie ofertowe na email
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = zapytanieSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { customer, items, total, userId, isGuest = true } = result.data;

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

    // Pobierz dane kontaktowe firmy z konfiguracji admina
    let contactPhone: string | undefined;
    let contactEmail: string | undefined;
    let companyName: string | undefined;
    try {
      const homepageContent = await getHomepageContentServer();
      contactPhone = homepageContent.contact.phone;
      contactEmail = homepageContent.contact.email;
      companyName = homepageContent.hero.companyName;
    } catch {
      // Fallback — dane kontaktowe nie są krytyczne dla wysyłki
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
        contactPhone,
        contactEmail,
        companyName,
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
