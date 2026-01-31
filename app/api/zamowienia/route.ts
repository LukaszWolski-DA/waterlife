import { NextRequest, NextResponse } from 'next/server';

/**
 * API endpoint dla zamówień
 * GET - pobierz wszystkie zamówienia (tylko admin)
 * POST - utwórz nowe zamówienie (klient)
 */

// GET /api/zamowienia - Pobierz listę zamówień
export async function GET(request: NextRequest) {
  try {
    // TODO: Sprawdzenie autoryzacji admina
    // TODO: Pobrać zamówienia z Supabase

    const orders: any[] = [];

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error('Błąd podczas pobierania zamówień:', error);
    return NextResponse.json(
      { success: false, error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}

// POST /api/zamowienia - Utwórz nowe zamówienie
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: Walidacja danych zamówienia z Zod
    // TODO: Walidacja czy produkty są dostępne
    // TODO: Sprawdzenie stanów magazynowych
    // TODO: Zapisanie zamówienia do Supabase
    // TODO: Wysłanie emaila potwierdzającego

    const newOrder = {
      id: 'temp-order-id',
      ...body,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: newOrder,
    }, { status: 201 });
  } catch (error) {
    console.error('Błąd podczas tworzenia zamówienia:', error);
    return NextResponse.json(
      { success: false, error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}

// PUT /api/zamowienia - Zaktualizuj status zamówienia
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    // TODO: Sprawdzenie autoryzacji admina
    // TODO: Walidacja statusu zamówienia
    // TODO: Aktualizacja zamówienia w Supabase
    // TODO: Wysłanie emaila o zmianie statusu do klienta

    return NextResponse.json({
      success: true,
      data: { id, status, updatedAt: new Date().toISOString() },
    });
  } catch (error) {
    console.error('Błąd podczas aktualizacji zamówienia:', error);
    return NextResponse.json(
      { success: false, error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}
