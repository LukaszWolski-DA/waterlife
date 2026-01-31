import { NextRequest, NextResponse } from 'next/server';

/**
 * API endpoint dla formularza kontaktowego
 * POST - wyślij wiadomość kontaktową (z opcjonalnym załącznikiem)
 */

// POST /api/kontakt - Wyślij wiadomość kontaktową
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;
    const attachment = formData.get('attachment') as File | null;

    // TODO: Walidacja danych z Zod
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Brak wymaganych pól' },
        { status: 400 }
      );
    }

    let attachmentUrl = null;

    // Obsługa załącznika
    if (attachment && attachment.size > 0) {
      // TODO: Upload załącznika do Supabase Storage
      // attachmentUrl = await uploadFile(attachment);
      console.log('Załącznik:', attachment.name, attachment.size);
    }

    // TODO: Zapisanie wiadomości do Supabase
    // TODO: Wysłanie emaila z powiadomieniem do admina

    const contactMessage = {
      id: 'temp-message-id',
      name,
      email,
      subject,
      message,
      attachmentUrl,
      status: 'unread',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: contactMessage,
      message: 'Wiadomość została wysłana pomyślnie',
    }, { status: 201 });
  } catch (error) {
    console.error('Błąd podczas przetwarzania wiadomości kontaktowej:', error);
    return NextResponse.json(
      { success: false, error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}
