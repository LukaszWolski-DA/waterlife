import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { sendContactNotificationEmail, sendContactConfirmationEmail } from '@/lib/email';
import { getHomepageContentServer } from '@/lib/homepage-server';
import { contactSchema } from '@/lib/schemas';

/**
 * API endpoint dla formularza kontaktowego
 * POST - wyślij wiadomość kontaktową i powiadom admina emailem
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = result.data;

    // Zapisz wiadomość do Supabase (service role — omija RLS)
    const supabase = createServerClient();

    const { data: newMessage, error: dbError } = await supabase
      .from('contact_messages')
      .insert([
        {
          customer_info: {
            name: name.trim(),
            email: email.trim(),
            phone: phone?.trim() || null,
          },
          subject: subject?.trim() || null,
          message: message.trim(),
          status: 'new',
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { success: false, error: 'Nie udało się zapisać wiadomości' },
        { status: 500 }
      );
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

    // Wyślij emaile (niekrytyczne - logujemy błąd ale nie zwracamy 500)
    try {
      await sendContactNotificationEmail({
        messageId: newMessage.id,
        customerName: name.trim(),
        customerEmail: email.trim(),
        customerPhone: phone?.trim(),
        subject: subject?.trim(),
        message: message.trim(),
      });
      await sendContactConfirmationEmail({
        customerName: name.trim(),
        customerEmail: email.trim(),
        subject: subject?.trim(),
        companyName,
        contactPhone,
        contactEmail,
      });
    } catch (emailError) {
      console.error('Email notification error:', emailError);
    }

    return NextResponse.json(
      {
        success: true,
        data: newMessage,
        message: 'Wiadomość została wysłana pomyślnie',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Błąd podczas przetwarzania wiadomości kontaktowej:', error);
    return NextResponse.json(
      { success: false, error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}
