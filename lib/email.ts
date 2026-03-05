import { Resend } from 'resend';

// Inicjalizacja klienta Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Typy dla danych zamówienia
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  nip?: string;
  message?: string;
}

interface OrderEmailData {
  orderId: string;
  customer: CustomerInfo;
  items: OrderItem[];
  total: number;
  createdAt: string;
}

/**
 * Wysyła email potwierdzający zamówienie do klienta
 */
export async function sendCustomerOrderConfirmationEmail(data: OrderEmailData) {
  const { orderId, customer, items, total, createdAt } = data;

  // Szablon HTML dla klienta - w stylu strony WaterLife
  const emailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6; 
          color: #0f172a; 
          background-color: #f8fafc;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: #ffffff;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }
        
        /* Header - w stylu hero section */
        .header { 
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
          color: white; 
          padding: 40px 30px;
          text-align: center;
          position: relative;
        }
        .header-icon {
          font-size: 48px;
          margin-bottom: 15px;
          opacity: 0.9;
        }
        .header h1 { 
          margin: 0 0 10px 0; 
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }
        .header p { 
          margin: 0;
          font-size: 16px; 
          opacity: 0.85;
          font-weight: 400;
        }
        
        /* Content area */
        .content { 
          padding: 40px 30px;
          background: #ffffff;
        }
        
        /* Order info box */
        .order-info { 
          background: #f0f9ff;
          padding: 24px;
          border-radius: 12px;
          margin-bottom: 30px;
          border: 1px solid #e0f2fe;
        }
        .order-info h2 { 
          margin: 0 0 16px 0;
          color: #0369a1;
          font-size: 18px;
          font-weight: 600;
        }
        .order-info-row {
          display: flex;
          justify-content: space-between;
          margin: 12px 0;
          padding: 10px 0;
        }
        .order-info-row:not(:last-child) {
          border-bottom: 1px solid #e0f2fe;
        }
        .order-label { 
          font-weight: 500;
          color: #475569;
        }
        .order-value { 
          font-weight: 600;
          color: #0f172a;
        }
        .order-number { 
          font-family: 'Courier New', monospace;
          background: #fff;
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 15px;
          color: #0369a1;
          border: 1px solid #e0f2fe;
        }
        
        /* Greeting */
        .greeting {
          margin-bottom: 24px;
        }
        .greeting p {
          margin: 8px 0;
          font-size: 15px;
          color: #475569;
        }
        .greeting strong {
          color: #0f172a;
        }
        
        /* Products section */
        .products-section { 
          margin: 32px 0;
        }
        .products-section h2 { 
          color: #0f172a;
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 16px;
        }
        .products-table { 
          width: 100%;
          border-collapse: collapse;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
        }
        .products-table th { 
          background: #f8fafc;
          padding: 14px 16px;
          text-align: left;
          font-weight: 600;
          color: #475569;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 2px solid #e2e8f0;
        }
        .products-table td { 
          padding: 14px 16px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 15px;
        }
        .products-table tr:last-child td { 
          border-bottom: none;
        }
        .products-table tbody tr:hover {
          background: #f8fafc;
        }
        .total-row { 
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: white;
          font-weight: 700;
          font-size: 18px;
        }
        .total-row td {
          border-bottom: none !important;
        }
        
        /* Next steps box */
        .next-steps { 
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          padding: 24px;
          border-radius: 12px;
          margin: 32px 0;
          border: 1px solid #fde047;
        }
        .next-steps h3 { 
          margin: 0 0 12px 0;
          color: #854d0e;
          font-size: 17px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .next-steps p { 
          margin: 0;
          color: #713f12;
          font-size: 15px;
          line-height: 1.6;
        }
        
        /* Contact section */
        .contact-section {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 2px solid #e2e8f0;
        }
        .contact-section p {
          margin: 8px 0;
          font-size: 15px;
          color: #475569;
        }
        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 16px;
        }
        .contact-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 8px;
          font-size: 14px;
        }
        .contact-item strong {
          color: #0f172a;
          min-width: 80px;
        }
        .contact-item a {
          color: #0369a1;
          text-decoration: none;
        }
        
        /* Footer */
        .footer { 
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          padding: 32px 30px;
          text-align: center;
          color: #cbd5e1;
        }
        .footer-brand {
          margin-bottom: 16px;
        }
        .footer-brand strong {
          color: white;
          font-size: 20px;
          font-weight: 700;
        }
        .footer-brand-tagline {
          color: #94a3b8;
          font-size: 14px;
          margin-top: 4px;
        }
        .footer p { 
          margin: 8px 0;
          font-size: 13px;
          opacity: 0.8;
        }
        .footer-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          margin: 20px 0;
        }
        
        /* Responsive */
        @media only screen and (max-width: 600px) {
          .header { padding: 30px 20px; }
          .content { padding: 30px 20px; }
          .footer { padding: 24px 20px; }
          .products-table th,
          .products-table td { padding: 10px 12px; font-size: 14px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header w stylu WaterLife -->
        <div class="header">
          <div class="header-icon">💧</div>
          <h1>Dziękujemy za zamówienie!</h1>
          <p>Otrzymaliśmy Twoje zapytanie ofertowe</p>
        </div>

        <div class="content">
          <!-- Order info -->
          <div class="order-info">
            <h2>Potwierdzenie zamówienia</h2>
            <div class="order-info-row">
              <span class="order-label">Numer zamówienia:</span>
              <span class="order-number">#${orderId.slice(0, 8).toUpperCase()}</span>
            </div>
            <div class="order-info-row">
              <span class="order-label">Data złożenia:</span>
              <span class="order-value">${new Date(createdAt).toLocaleDateString('pl-PL', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
          </div>

          <!-- Greeting -->
          <div class="greeting">
            <p>Cześć <strong>${customer.firstName}</strong>!</p>
            <p>Potwierdzamy otrzymanie Twojego zapytania ofertowego. Poniżej znajdziesz szczegóły zamówienia:</p>
          </div>

          <!-- Products -->
          <div class="products-section">
            <h2>Wybrane produkty</h2>
            <table class="products-table">
              <thead>
                <tr>
                  <th>Produkt</th>
                  <th style="text-align: center;">Ilość</th>
                  <th style="text-align: right;">Wartość</th>
                </tr>
              </thead>
              <tbody>
                ${items.map(item => `
                  <tr>
                    <td><strong>${item.name}</strong></td>
                    <td style="text-align: center;">${item.quantity} szt.</td>
                    <td style="text-align: right; font-weight: 600;">${(item.price * item.quantity).toLocaleString('pl-PL')} zł</td>
                  </tr>
                `).join('')}
                <tr class="total-row">
                  <td colspan="2" style="text-align: left;">SUMA CAŁKOWITA</td>
                  <td style="text-align: right;">${total.toLocaleString('pl-PL')} zł</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Next steps -->
          <div class="next-steps">
            <h3>📋 Co dalej?</h3>
            <p>Nasz zespół przeanalizuje Twoje zapytanie i <strong>skontaktuje się z Tobą w ciągu 24 godzin roboczych</strong> z indywidualną ofertą cenową dostosowaną do Twoich potrzeb.</p>
          </div>

          <!-- Contact -->
          <div class="contact-section">
            <p>Masz dodatkowe pytania? Skontaktuj się z nami:</p>
            <div class="contact-info">
              <div class="contact-item">
                <strong>Email:</strong>
                <a href="mailto:biuro@waterlife.net.pl">biuro@waterlife.net.pl</a>
              </div>
              <div class="contact-item">
                <strong>Telefon:</strong>
                <span>+48 123 456 789</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <div class="footer-brand">
            <strong>💧 WaterLife</strong>
            <div class="footer-brand-tagline">Profesjonalne rozwiązania wodne</div>
          </div>
          <div class="footer-divider"></div>
          <p>To jest automatyczna wiadomość potwierdzająca.</p>
          <p>Prosimy nie odpowiadać na ten email.</p>
          <p style="margin-top: 16px; font-size: 12px;">© ${new Date().getFullYear()} WaterLife. Wszelkie prawa zastrzeżone.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    // W trybie testowym - wyślij na EMAIL_OFFICE_TEST
    // W produkcji - wyślij na email klienta
    const recipientEmail = process.env.EMAIL_OFFICE_TEST || customer.email;

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'WaterLife <onboarding@resend.dev>',
      to: recipientEmail,
      subject: `Potwierdzenie zamówienia #${orderId.slice(0, 8).toUpperCase()}`,
      html: emailHTML,
    });

    return { success: true, id: result.id };
  } catch (error) {
    console.error('❌ Błąd wysyłki emaila do klienta:', error);
    return { success: false, error };
  }
}

/**
 * Wysyła email powiadomienia o nowym zamówieniu do biura
 */
export async function sendOfficeOrderNotificationEmail(data: OrderEmailData) {
  const { orderId, customer, items, total, createdAt } = data;

  // Szablon HTML dla biura - formalny, szczegółowy
  const emailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 20px; background: #f9fafb; }
        .customer-info { background: white; padding: 15px; margin-bottom: 20px; border-radius: 5px; border-left: 4px solid #3b82f6; }
        .customer-info h2 { margin: 0 0 15px 0; color: #1e40af; font-size: 18px; }
        .info-row { display: flex; justify-content: space-between; margin: 8px 0; padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
        .info-row:last-child { border-bottom: none; }
        .info-label { font-weight: 600; color: #64748b; }
        .info-value { color: #0f172a; }
        .products-table { width: 100%; border-collapse: collapse; background: white; margin: 20px 0; }
        .products-table th { background: #f3f4f6; padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb; }
        .products-table td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
        .total { font-size: 18px; font-weight: bold; text-align: right; padding: 15px; background: white; margin-top: 10px; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
        .order-id { font-family: 'Courier New', monospace; background: #fef3c7; padding: 2px 6px; border-radius: 3px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 Nowe zapytanie ofertowe</h1>
        </div>

        <div class="content">
          <div class="customer-info">
            <h2>Dane klienta</h2>
            <div class="info-row">
              <span class="info-label">Imię i nazwisko:</span>
              <span class="info-value">${customer.firstName} ${customer.lastName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email:</span>
              <span class="info-value"><a href="mailto:${customer.email}">${customer.email}</a></span>
            </div>
            <div class="info-row">
              <span class="info-label">Telefon:</span>
              <span class="info-value"><a href="tel:${customer.phone}">${customer.phone}</a></span>
            </div>
            ${customer.company ? `
            <div class="info-row">
              <span class="info-label">Firma:</span>
              <span class="info-value">${customer.company}</span>
            </div>
            ` : ''}
            ${customer.nip ? `
            <div class="info-row">
              <span class="info-label">NIP:</span>
              <span class="info-value">${customer.nip}</span>
            </div>
            ` : ''}
            <div class="info-row">
              <span class="info-label">Nr zamówienia:</span>
              <span class="info-value"><span class="order-id">#${orderId.slice(0, 8).toUpperCase()}</span></span>
            </div>
            <div class="info-row">
              <span class="info-label">Data:</span>
              <span class="info-value">${new Date(createdAt).toLocaleString('pl-PL')}</span>
            </div>
            ${customer.message ? `
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
              <p class="info-label" style="margin-bottom: 8px;">Uwagi klienta:</p>
              <p class="info-value" style="white-space: pre-wrap; background: #fef3c7; padding: 10px; border-radius: 4px;">${customer.message}</p>
            </div>
            ` : ''}
          </div>

          <h2 style="color: #1e293b;">Produkty w zapytaniu</h2>
          <table class="products-table">
            <thead>
              <tr>
                <th>Produkt</th>
                <th style="text-align: right;">Cena jedn.</th>
                <th style="text-align: center;">Ilość</th>
                <th style="text-align: right;">Suma</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td><strong>${item.name}</strong></td>
                  <td style="text-align: right;">${item.price.toLocaleString('pl-PL')} zł</td>
                  <td style="text-align: center;">${item.quantity}</td>
                  <td style="text-align: right;"><strong>${(item.price * item.quantity).toLocaleString('pl-PL')} zł</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total">
            <p style="margin: 0;">SUMA CAŁKOWITA: <span style="color: #1e40af;">${total.toLocaleString('pl-PL')} zł</span></p>
          </div>
        </div>

        <div class="footer">
          <p><strong>Akcja wymagana:</strong> Skontaktuj się z klientem w ciągu 24h roboczych</p>
          <p>To zapytanie zostało automatycznie wygenerowane przez formularz na stronie WaterLife</p>
          <p>Data wygenerowania: ${new Date().toLocaleString('pl-PL')}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    // W trybie testowym i produkcyjnym - wyślij na EMAIL_OFFICE_TEST lub EMAIL_OFFICE
    const recipientEmail = process.env.EMAIL_OFFICE_TEST || process.env.EMAIL_OFFICE || 'biuro@waterlife.net.pl';

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'WaterLife <onboarding@resend.dev>',
      to: recipientEmail,
      subject: `🔔 Nowe zapytanie ofertowe - ${customer.firstName} ${customer.lastName}`,
      html: emailHTML,
    });

    return { success: true, id: result.id };
  } catch (error) {
    console.error('❌ Błąd wysyłki emaila do biura:', error);
    return { success: false, error };
  }
}

/**
 * Wysyła powiadomienie email do admina o nowej wiadomości kontaktowej
 */
interface ContactNotificationData {
  messageId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  subject?: string;
  message: string;
}

export async function sendContactNotificationEmail(data: ContactNotificationData) {
  const { messageId, customerName, customerEmail, customerPhone, subject, message } = data;

  const emailHTML = `
    <!DOCTYPE html>
    <html lang="pl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nowa wiadomość kontaktowa</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">💬 Nowa Wiadomość Kontaktowa</h1>
        </div>

        <!-- Content -->
        <div style="padding: 30px 20px;">
          <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
            <p style="margin: 0; color: #1e40af; font-weight: bold;">Otrzymałeś nową wiadomość ze strony WaterLife</p>
          </div>

          <h2 style="color: #1f2937; font-size: 18px; margin-top: 0;">Dane nadawcy:</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; width: 140px;"><strong>Imię i nazwisko:</strong></td>
              <td style="padding: 8px 0; color: #1f2937;">${customerName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;"><strong>Email:</strong></td>
              <td style="padding: 8px 0; color: #1f2937;"><a href="mailto:${customerEmail}" style="color: #3b82f6; text-decoration: none;">${customerEmail}</a></td>
            </tr>
            ${customerPhone ? `
            <tr>
              <td style="padding: 8px 0; color: #6b7280;"><strong>Telefon:</strong></td>
              <td style="padding: 8px 0; color: #1f2937;"><a href="tel:${customerPhone}" style="color: #3b82f6; text-decoration: none;">${customerPhone}</a></td>
            </tr>
            ` : ''}
            ${subject ? `
            <tr>
              <td style="padding: 8px 0; color: #6b7280;"><strong>Temat:</strong></td>
              <td style="padding: 8px 0; color: #1f2937;">${subject}</td>
            </tr>
            ` : ''}
          </table>

          <h2 style="color: #1f2937; font-size: 18px; margin-bottom: 10px;">Treść wiadomości:</h2>
          <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px; white-space: pre-wrap; color: #1f2937; line-height: 1.6;">
${message}
          </div>

          <div style="margin-top: 30px; padding: 20px; background-color: #fef3c7; border-radius: 6px; text-align: center;">
            <p style="margin: 0 0 15px 0; color: #92400e; font-weight: bold;">⚠️ Akcja wymagana</p>
            <p style="margin: 0 0 15px 0; color: #92400e;">Odpowiedz na tę wiadomość w ciągu 24 godzin roboczych</p>
            <a href="mailto:${customerEmail}?subject=Re: ${subject || 'Kontakt ze strony WaterLife'}" 
               style="display: inline-block; background-color: #3b82f6; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Odpowiedz na email
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 12px;">
            ID wiadomości: ${messageId}
          </p>
          <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 12px;">
            Data: ${new Date().toLocaleString('pl-PL')}
          </p>
          <p style="margin: 0; color: #6b7280; font-size: 12px;">
            Ta wiadomość została automatycznie wygenerowana przez system WaterLife
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const recipientEmail = process.env.EMAIL_OFFICE_TEST || process.env.EMAIL_OFFICE || 'biuro@waterlife.net.pl';

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'WaterLife <onboarding@resend.dev>',
      to: recipientEmail,
      subject: `💬 Nowa wiadomość: ${customerName} - ${subject || 'Kontakt ze strony'}`,
      html: emailHTML,
      replyTo: customerEmail, // Ważne - admin może odpowiedzieć bezpośrednio
    });

    return { success: true, id: result.id };
  } catch (error) {
    console.error('❌ Błąd wysyłki powiadomienia o kontakcie:', error);
    return { success: false, error };
  }
}
