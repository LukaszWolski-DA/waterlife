import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { sendContactNotificationEmail, sendContactConfirmationEmail } from '@/lib/email';
import { getHomepageContentServer } from '@/lib/homepage-server';
import { contactSchema } from '@/lib/schemas';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * API endpoint dla formularza kontaktowego
 * POST - wyślij wiadomość kontaktową i powiadom admina emailem
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const body = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone') || undefined,
      subject: formData.get('subject') || undefined,
      message: formData.get('message'),
    };

    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = result.data;

    // Walidacja załącznika
    const file = formData.get('attachment');
    let attachment: { filename: string; content: Buffer; contentType: string } | undefined;

    if (file instanceof File && file.size > 0) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { success: false, error: 'Plik jest za duży (maksymalny rozmiar to 10MB)' },
          { status: 400 }
        );
      }

      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: 'Nieobsługiwany format pliku. Dozwolone: JPG, PNG, PDF, DOCX' },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      attachment = {
        filename: file.name,
        content: Buffer.from(arrayBuffer),
        contentType: file.type,
      };
    }

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
        attachment,
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
