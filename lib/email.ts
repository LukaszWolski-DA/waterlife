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
  contactPhone?: string;
  contactEmail?: string;
  companyName?: string;
}

/**
 * Wysyła email potwierdzający zamówienie do klienta
 */
export async function sendCustomerOrderConfirmationEmail(data: OrderEmailData) {
  const { orderId, customer, items, total, createdAt } = data;
  const contactEmail = data.contactEmail ?? 'biuro@waterlife.net.pl';
  const contactPhone = data.contactPhone ?? '';
  const companyName = data.companyName ?? 'Waterlife';

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
          background-color: #f1f5f9;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
        }

        /* Header */
        .header {
          background: #334155;
          padding: 20px 28px;
        }
        .header-logo-mark {
          display: inline-block;
          background: #1e40af;
          border-radius: 6px;
          padding: 4px 9px;
          font-size: 13px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: 0.5px;
          vertical-align: middle;
        }
        .header-logo-name {
          font-size: 18px;
          font-weight: 700;
          color: #ffffff;
          vertical-align: middle;
          margin-left: 9px;
        }
        .header-logo-tagline {
          font-size: 12px;
          color: #64748b;
          margin-top: 2px;
        }
        .header-title {
          font-size: 20px;
          font-weight: 700;
          color: #ffffff;
          text-align: right;
          vertical-align: middle;
        }
        .header-subtitle {
          font-size: 13px;
          color: #94a3b8;
          text-align: right;
          margin-top: 3px;
        }

        /* Content */
        .content {
          padding: 32px 28px;
          background: #ffffff;
        }

        /* Order meta */
        .order-meta {
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 20px;
          margin-bottom: 24px;
        }
        .order-meta-row {
          padding: 7px 0;
          font-size: 14px;
          border-bottom: 1px solid #f1f5f9;
        }
        .order-meta-row:last-child { border-bottom: none; }
        .order-meta-row td { padding: 0; vertical-align: middle; }
        .order-meta-row td:last-child { text-align: right; }
        .meta-label { color: #64748b; }
        .meta-value { font-weight: 600; color: #0f172a; }
        .order-number {
          font-family: 'Courier New', monospace;
          font-size: 13px;
          color: #1e40af;
          font-weight: 700;
        }

        /* Greeting */
        .greeting {
          margin-bottom: 24px;
          font-size: 15px;
          color: #475569;
        }
        .greeting p { margin: 6px 0; }
        .greeting strong { color: #0f172a; }

        /* Products */
        .products-section { margin: 24px 0; }
        .products-section h2 {
          font-size: 16px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 13px;
          color: #64748b;
        }
        .products-table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #e2e8f0;
        }
        .products-table th {
          background: #f8fafc;
          padding: 10px 14px;
          text-align: left;
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          border-bottom: 1px solid #e2e8f0;
        }
        .products-table td {
          padding: 11px 14px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 14px;
          color: #0f172a;
        }
        .products-table tbody tr:last-child td { border-bottom: none; }
        .total-row {
          background: #334155;
          color: #ffffff;
        }
        .total-row td {
          padding: 12px 14px;
          font-size: 15px;
          font-weight: 700;
          border-bottom: none !important;
          color: #ffffff;
        }

        /* Next steps */
        .next-steps {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-left: 3px solid #1e40af;
          padding: 18px 20px;
          margin: 28px 0 0 0;
        }
        .next-steps h3 {
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }
        .next-steps p {
          font-size: 14px;
          color: #475569;
          line-height: 1.6;
          margin: 0;
        }

        /* Footer */
        .footer {
          background: #334155;
          padding: 20px 28px;
        }
        .footer-top {
          border-bottom: 1px solid #475569;
          padding-bottom: 14px;
          margin-bottom: 14px;
        }
        .footer-contact {
          font-size: 13px;
          color: #64748b;
          margin-top: 6px;
        }
        .footer-contact a { color: #94a3b8; text-decoration: none; }
        .footer-legal {
          font-size: 12px;
          color: #94a3b8;
          line-height: 1.6;
        }

        @media only screen and (max-width: 600px) {
          .header { padding: 16px 20px; }
          .content { padding: 24px 20px; }
          .footer { padding: 16px 20px; }
          .products-table th,
          .products-table td { padding: 9px 10px; }
        }
      </style>
    </head>
    <body>
      <div class="container">

        <!-- Header -->
        <div class="header">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="vertical-align: middle;">
                <span style="font-size:22px; font-weight:700; color:#ffffff; letter-spacing:-0.3px;">${companyName}</span>
              </td>
              <td style="vertical-align: middle;">
                <div class="header-title">Dziękujemy za zapytanie!</div>
                <div class="header-subtitle">Potwierdzenie zapytania ofertowego</div>
              </td>
            </tr>
          </table>
        </div>

        <div class="content">

          <!-- Order meta -->
          <table class="order-meta" width="100%" cellpadding="0" cellspacing="0">
            <tr class="order-meta-row">
              <td class="meta-label">Nr zapytania</td>
              <td><span class="order-number">#${orderId.slice(0, 8).toUpperCase()}</span></td>
            </tr>
            <tr class="order-meta-row">
              <td class="meta-label">Data złożenia</td>
              <td><span class="meta-value">${new Date(createdAt).toLocaleDateString('pl-PL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span></td>
            </tr>
          </table>

          <!-- Greeting -->
          <div class="greeting">
            <p>Cześć <strong>${customer.firstName}</strong>,</p>
            <p>potwierdzamy otrzymanie Twojego zapytania ofertowego. Poniżej znajdziesz szczegóły przesłanych produktów.</p>
          </div>

          <!-- Products -->
          <div class="products-section">
            <h2>Produkty w zapytaniu</h2>
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
                  <td colspan="2">Suma orientacyjna</td>
                  <td style="text-align: right;">${total.toLocaleString('pl-PL')} zł</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Next steps -->
          <div class="next-steps">
            <h3>Co dalej?</h3>
            <p>Nasz zespół przeanalizuje Twoje zapytanie i <strong>skontaktuje się z Tobą w ciągu 24 godzin roboczych</strong> z indywidualną ofertą dostosowaną do Twoich potrzeb.</p>
          </div>

        </div>

        <!-- Footer -->
        <div class="footer">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom: 1px solid #475569; padding-bottom: 12px; margin-bottom: 12px;">
            <tr>
              <td style="vertical-align: middle;">
                <span style="font-size:18px; font-weight:700; color:#ffffff; letter-spacing:-0.3px;">${companyName}</span>
              </td>
              <td style="vertical-align: middle; text-align: right;">
                <div class="footer-contact">
                  ${contactEmail ? `<div><span style="color:#94a3b8;">E-mail:&nbsp;</span><a href="mailto:${contactEmail}" style="color:#94a3b8; text-decoration:none;">${contactEmail}</a></div>` : ''}
                  ${contactPhone ? `<div><span style="color:#94a3b8;">Nr tel:&nbsp;</span><span style="color:#94a3b8;">${contactPhone}</span></div>` : ''}
                </div>
              </td>
            </tr>
          </table>
          <div class="footer-legal">
            <p>To jest automatyczna wiadomość potwierdzająca. Prosimy nie odpowiadać na ten email.</p>
            <p style="margin-top: 4px;">© ${new Date().getFullYear()} Waterlife. Wszelkie prawa zastrzeżone.</p>
          </div>
        </div>

      </div>
    </body>
    </html>
  `;

  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'WaterLife <onboarding@resend.dev>',
      to: customer.email,
      subject: `Potwierdzenie zapytania ofertowego #${orderId.slice(0, 8).toUpperCase()}`,
      html: emailHTML,
    });

    return { success: true, id: result.data?.id };
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

    return { success: true, id: result.data?.id };
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
  attachment?: {
    filename: string;
    content: Buffer;
    contentType: string;
  };
}

export async function sendContactNotificationEmail(data: ContactNotificationData) {
  const { messageId, customerName, customerEmail, customerPhone, subject, message, attachment } = data;

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
      ...(attachment ? { attachments: [attachment] } : {}),
    });

    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('❌ Błąd wysyłki powiadomienia o kontakcie:', error);
    return { success: false, error };
  }
}

/**
 * Wysyła email potwierdzający do klienta po wypełnieniu formularza kontaktowego
 */
interface ContactConfirmationData {
  customerName: string;
  customerEmail: string;
  subject?: string;
  companyName?: string;
  contactPhone?: string;
  contactEmail?: string;
}

export async function sendContactConfirmationEmail(data: ContactConfirmationData) {
  const { customerName, customerEmail, subject } = data;
  const companyName = data.companyName ?? 'Waterlife';
  const contactEmail = data.contactEmail ?? 'biuro@waterlife.net.pl';
  const contactPhone = data.contactPhone ?? '';

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
          background-color: #f1f5f9;
        }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
        .header { background: #334155; padding: 20px 28px; }
        .header-title { font-size: 20px; font-weight: 700; color: #ffffff; text-align: right; vertical-align: middle; }
        .header-subtitle { font-size: 13px; color: #94a3b8; text-align: right; margin-top: 3px; }
        .content { padding: 32px 28px; background: #ffffff; }
        .greeting { margin-bottom: 24px; font-size: 15px; color: #475569; }
        .greeting p { margin: 6px 0; }
        .greeting strong { color: #0f172a; }
        .next-steps {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-left: 3px solid #1e40af;
          padding: 18px 20px;
          margin: 24px 0 0 0;
        }
        .next-steps h3 {
          font-size: 13px; font-weight: 600; color: #0f172a;
          margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.4px;
        }
        .next-steps p { font-size: 14px; color: #475569; line-height: 1.6; margin: 0; }
        .footer { background: #334155; padding: 20px 28px; }
        .footer-contact { font-size: 13px; color: #94a3b8; }
        .footer-contact a { color: #94a3b8; text-decoration: none; }
        .footer-legal { font-size: 12px; color: #94a3b8; line-height: 1.6; margin-top: 12px; }
        @media only screen and (max-width: 600px) {
          .header { padding: 16px 20px; }
          .content { padding: 24px 20px; }
          .footer { padding: 16px 20px; }
        }
      </style>
    </head>
    <body>
      <div class="container">

        <!-- Header -->
        <div class="header">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="vertical-align: middle;">
                <span style="font-size:22px; font-weight:700; color:#ffffff; letter-spacing:-0.3px;">${companyName}</span>
              </td>
              <td style="vertical-align: middle;">
                <div class="header-title">Dziękujemy za wiadomość!</div>
                <div class="header-subtitle">Potwierdzenie kontaktu</div>
              </td>
            </tr>
          </table>
        </div>

        <div class="content">

          <!-- Greeting -->
          <div class="greeting">
            <p>Cześć <strong>${customerName}</strong>,</p>
            <p>potwierdzamy otrzymanie Twojej wiadomości${subject ? ` dotyczącej: <strong>${subject}</strong>` : ''}. Nasz zespół zapozna się z jej treścią i odpowie możliwie jak najszybciej.</p>
          </div>

          <!-- Next steps -->
          <div class="next-steps">
            <h3>Co dalej?</h3>
            <p>Odpowiemy na Twoją wiadomość <strong>w ciągu 24 godzin roboczych</strong>. Jeśli sprawa jest pilna, skontaktuj się z nami bezpośrednio.</p>
          </div>

        </div>

        <!-- Footer -->
        <div class="footer">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom: 1px solid #475569; padding-bottom: 12px; margin-bottom: 12px;">
            <tr>
              <td style="vertical-align: middle;">
                <span style="font-size:18px; font-weight:700; color:#ffffff; letter-spacing:-0.3px;">${companyName}</span>
              </td>
              <td style="vertical-align: middle; text-align: right;">
                <div class="footer-contact">
                  ${contactEmail ? `<div><span style="color:#94a3b8;">E-mail:&nbsp;</span><a href="mailto:${contactEmail}">${contactEmail}</a></div>` : ''}
                  ${contactPhone ? `<div><span style="color:#94a3b8;">Nr tel:&nbsp;</span><span>${contactPhone}</span></div>` : ''}
                </div>
              </td>
            </tr>
          </table>
          <div class="footer-legal">
            <p>To jest automatyczna wiadomość potwierdzająca. Prosimy nie odpowiadać na ten email.</p>
            <p style="margin-top: 4px;">© ${new Date().getFullYear()} ${companyName}. Wszelkie prawa zastrzeżone.</p>
          </div>
        </div>

      </div>
    </body>
    </html>
  `;

  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'WaterLife <onboarding@resend.dev>',
      to: customerEmail,
      subject: `Potwierdzenie wiadomości${subject ? ` - ${subject}` : ''}`,
      html: emailHTML,
    });

    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('❌ Błąd wysyłki potwierdzenia kontaktu do klienta:', error);
    return { success: false, error };
  }
}
