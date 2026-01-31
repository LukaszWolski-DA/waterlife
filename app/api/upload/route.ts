import { NextRequest, NextResponse } from 'next/server';

/**
 * API endpoint dla uploadu plików
 * POST - upload pliku (zdjęcia produktów, załączniki)
 * Obsługuje zdjęcia produktów i załączniki do formularza kontaktowego
 */

// POST /api/upload - Upload pliku
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'product' | 'attachment'

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Brak pliku' },
        { status: 400 }
      );
    }

    // Walidacja rozmiaru pliku (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'Plik jest za duży (max 5MB)' },
        { status: 400 }
      );
    }

    // Walidacja typu pliku
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Nieprawidłowy typ pliku' },
        { status: 400 }
      );
    }

    // TODO: Upload do Supabase Storage
    // const fileName = `${Date.now()}-${file.name}`;
    // const bucket = type === 'product' ? 'products' : 'attachments';
    // const { data, error } = await supabase.storage
    //   .from(bucket)
    //   .upload(fileName, file);

    // if (error) throw error;

    // Tymczasowa symulacja uploadu
    const fileUrl = `/uploads/${Date.now()}-${file.name}`;

    return NextResponse.json({
      success: true,
      data: {
        url: fileUrl,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Błąd podczas uploadu pliku:', error);
    return NextResponse.json(
      { success: false, error: 'Błąd podczas uploadu pliku' },
      { status: 500 }
    );
  }
}

// DELETE /api/upload - Usuń plik
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const fileUrl = searchParams.get('url');

    if (!fileUrl) {
      return NextResponse.json(
        { success: false, error: 'Brak URL pliku' },
        { status: 400 }
      );
    }

    // TODO: Sprawdzenie autoryzacji
    // TODO: Usunięcie pliku z Supabase Storage

    return NextResponse.json({
      success: true,
      message: 'Plik został usunięty',
    });
  } catch (error) {
    console.error('Błąd podczas usuwania pliku:', error);
    return NextResponse.json(
      { success: false, error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}
