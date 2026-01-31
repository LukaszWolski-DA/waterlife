import { NextRequest, NextResponse } from 'next/server';

/**
 * API endpoint dla zapytań ofertowych
 * POST - wysyła zapytanie ofertowe na email
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
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { customer, items, total } = body;

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

    // Na razie logujemy do konsoli
    console.log('=== NOWE ZAPYTANIE OFERTOWE ===');
    console.log('Klient:', `${customer.firstName} ${customer.lastName}`);
    console.log('Email:', customer.email);
    console.log('Telefon:', customer.phone);
    console.log('Produkty:', items.length);
    console.log('Wartość:', `${total.toLocaleString('pl-PL')} zł`);
    console.log('================================');

    return NextResponse.json({
      success: true,
      message: 'Zapytanie ofertowe zostało wysłane',
    });
  } catch (error) {
    console.error('Błąd podczas wysyłania zapytania:', error);
    return NextResponse.json(
      { success: false, error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}
