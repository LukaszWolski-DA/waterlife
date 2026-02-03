import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

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

    console.log('✅ Order saved to database:', order.id);

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
        } else {
          console.log('✅ Cart items saved as history:', cartItemsData.length, 'items');
        }
      } catch (error) {
        console.error('Error saving cart items:', error);
        // Nie przerywaj procesu
      }
    }

    // Formatowanie emaila HTML
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .customer-info { background: white; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
          .products-table { width: 100%; border-collapse: collapse; background: white; }
          .products-table th { background: #f3f4f6; padding: 10px; text-align: left; }
          .products-table td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
          .total { font-size: 18px; font-weight: bold; text-align: right; padding: 15px; background: white; margin-top: 10px; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Nowe zapytanie ofertowe</h1>
          </div>

          <div class="content">
            <div class="customer-info">
              <h2>Dane klienta</h2>
              <p><strong>Imię i nazwisko:</strong> ${customer.firstName} ${customer.lastName}</p>
              <p><strong>Email:</strong> <a href="mailto:${customer.email}">${customer.email}</a></p>
              <p><strong>Telefon:</strong> <a href="tel:${customer.phone}">${customer.phone}</a></p>
              ${customer.company ? `<p><strong>Firma:</strong> ${customer.company}</p>` : ''}
              ${customer.nip ? `<p><strong>NIP:</strong> ${customer.nip}</p>` : ''}
              ${customer.message ? `<p><strong>Uwagi:</strong><br>${customer.message.replace(/\n/g, '<br>')}</p>` : ''}
            </div>

            <h2>Produkty w zapytaniu</h2>
            <table class="products-table">
              <thead>
                <tr>
                  <th>Produkt</th>
                  <th>Cena jednostkowa</th>
                  <th>Ilość</th>
                  <th>Suma</th>
                </tr>
              </thead>
              <tbody>
                ${items.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.price.toLocaleString('pl-PL')} zł</td>
                    <td>${item.quantity}</td>
                    <td>${(item.price * item.quantity).toLocaleString('pl-PL')} zł</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="total">
              <p>SUMA CAŁKOWITA: ${total.toLocaleString('pl-PL')} zł</p>
            </div>
          </div>

          <div class="footer">
            <p>To zapytanie zostało automatycznie wygenerowane przez formularz na stronie WaterLife</p>
            <p>Data: ${new Date().toLocaleString('pl-PL')}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // TODO: Wysłanie emaila
    // Tutaj należy zintegrować z serwisem email (np. Resend, SendGrid, Nodemailer)
    // Przykład z Resend:
    // await resend.emails.send({
    //   from: 'WaterLife <noreply@waterlife.net.pl>',
    //   to: 'biuro@waterlife.net.pl',
    //   subject: `Nowe zapytanie ofertowe - ${customer.firstName} ${customer.lastName}`,
    //   html: emailHTML,
    // });

    // Logowanie do konsoli
    console.log('=== NOWE ZAPYTANIE OFERTOWE ===');
    console.log('ID zamówienia:', order.id);
    console.log('Klient:', `${customer.firstName} ${customer.lastName}`);
    console.log('Email:', customer.email);
    console.log('Telefon:', customer.phone);
    console.log('Typ:', isGuest ? 'Gość' : 'Zalogowany');
    console.log('Produkty:', items.length);
    console.log('Wartość:', `${total.toLocaleString('pl-PL')} zł`);
    console.log('================================');

    // TODO: Wysłanie emaila
    // Tutaj należy zintegrować z serwisem email (np. Resend, SendGrid, Nodemailer)
    // Przykład z Resend:
    // await resend.emails.send({
    //   from: 'WaterLife <noreply@waterlife.net.pl>',
    //   to: 'biuro@waterlife.net.pl',
    //   subject: `Nowe zapytanie ofertowe - ${customer.firstName} ${customer.lastName}`,
    //   html: emailHTML,
    // });

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
