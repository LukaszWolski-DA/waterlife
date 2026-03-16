import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { sendContactNotificationEmail, sendContactConfirmationEmail } from '@/lib/email';
import type { ContactFormData } from '@/types/contact';

/**
 * API endpoint dla formularza kontaktowego
 * POST - wyślij wiadomość kontaktową i powiadom admina emailem
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ContactFormData;

    const { name, email, phone, subject, message } = body;

    // Walidacja wymaganych pól
    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Imię i nazwisko jest wymagane' },
        { status: 400 }
      );
    }

    if (!email || !email.trim()) {
      return NextResponse.json(
        { success: false, error: 'Email jest wymagany' },
        { status: 400 }
      );
    }

    // Prosta walidacja email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Nieprawidłowy format email' },
        { status: 400 }
      );
    }

    if (!message || !message.trim()) {
      return NextResponse.json(
        { success: false, error: 'Wiadomość jest wymagana' },
        { status: 400 }
      );
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
