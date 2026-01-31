import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, getProductsByCategory } from '@/lib/mock-products';

/**
 * API endpoint dla produktów
 * GET - pobierz wszystkie produkty (z opcjonalnymi filtrami)
 * POST - utwórz nowy produkt (tylko admin)
 */

// GET /api/produkty - Pobierz listę produktów
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const minPriceStr = searchParams.get('minPrice');
    const maxPriceStr = searchParams.get('maxPrice');
    const inStockStr = searchParams.get('inStock');
    const search = searchParams.get('search');

    // Pobierz produkty (z mock data)
    let products = category
      ? getProductsByCategory(category)
      : getAllProducts();

    // Filtruj po cenie
    if (minPriceStr) {
      const minPrice = parseFloat(minPriceStr);
      products = products.filter(p => p.price >= minPrice);
    }

    if (maxPriceStr) {
      const maxPrice = parseFloat(maxPriceStr);
      products = products.filter(p => p.price <= maxPrice);
    }

    // Filtruj po dostępności
    if (inStockStr === 'true') {
      products = products.filter(p => p.stock > 0);
    }

    // Filtruj po wyszukiwanej frazie
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Błąd podczas pobierania produktów:', error);
    return NextResponse.json(
      { success: false, error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}

// POST /api/produkty - Utwórz nowy produkt
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: Walidacja danych z Zod
    // TODO: Sprawdzenie autoryzacji admina
    // TODO: Zapisanie produktu do Supabase

    const newProduct = {
      id: 'temp-id',
      ...body,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: newProduct,
    }, { status: 201 });
  } catch (error) {
    console.error('Błąd podczas tworzenia produktu:', error);
    return NextResponse.json(
      { success: false, error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}

// PUT /api/produkty - Zaktualizuj produkt
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    // TODO: Walidacja danych
    // TODO: Sprawdzenie autoryzacji admina
    // TODO: Aktualizacja produktu w Supabase

    return NextResponse.json({
      success: true,
      data: { id, ...updateData },
    });
  } catch (error) {
    console.error('Błąd podczas aktualizacji produktu:', error);
    return NextResponse.json(
      { success: false, error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}

// DELETE /api/produkty - Usuń produkt
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Brak ID produktu' },
        { status: 400 }
      );
    }

    // TODO: Sprawdzenie autoryzacji admina
    // TODO: Usunięcie produktu z Supabase

    return NextResponse.json({
      success: true,
      message: 'Produkt został usunięty',
    });
  } catch (error) {
    console.error('Błąd podczas usuwania produktu:', error);
    return NextResponse.json(
      { success: false, error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}
