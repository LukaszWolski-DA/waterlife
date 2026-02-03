import { NextRequest, NextResponse } from 'next/server';
import {
  getAllProductsServer,
  getFilteredProductsServer,
  createProductServer,
  updateProductServer,
  deleteProductServer,
} from '@/lib/supabase/products';
import type { ProductFormData } from '@/types/product';

/**
 * API endpoint dla produktów
 * GET - pobierz wszystkie produkty (z opcjonalnymi filtrami)
 * POST - utwórz nowy produkt (tylko admin)
 */

// GET /api/produkty - Pobierz listę produktów z Supabase
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const categoriesParam = searchParams.get('categories');
    const manufacturersParam = searchParams.get('manufacturers');
    const minPriceStr = searchParams.get('minPrice');
    const maxPriceStr = searchParams.get('maxPrice');
    const inStockStr = searchParams.get('inStock');
    const search = searchParams.get('search');

    // Sprawdź czy są jakiekolwiek filtry
    const hasFilters =
      categoriesParam ||
      manufacturersParam ||
      minPriceStr ||
      maxPriceStr ||
      inStockStr ||
      search;

    let products;

    if (hasFilters) {
      // Użyj filtrowanego zapytania
      const filters = {
        categories: categoriesParam ? categoriesParam.split(',') : undefined,
        manufacturers: manufacturersParam ? manufacturersParam.split(',') : undefined,
        minPrice: minPriceStr ? parseFloat(minPriceStr) : undefined,
        maxPrice: maxPriceStr ? parseFloat(maxPriceStr) : undefined,
        inStock: inStockStr === 'true' ? true : undefined,
        search: search || undefined,
      };

      products = await getFilteredProductsServer(filters);
    } else {
      // Pobierz wszystkie produkty
      products = await getAllProductsServer();
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

// POST /api/produkty - Utwórz nowy produkt (ADMIN)
export async function POST(request: NextRequest) {
  try {
    // TODO: Sprawdzenie autoryzacji admina
    // W przyszłości: const session = await getServerSession();
    // if (!session || !session.user.isAdmin) return 401

    const body = await request.json();

    // Podstawowa walidacja
    if (!body.name || !body.price || body.stock === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: 'Brak wymaganych pól: name, price, stock',
        },
        { status: 400 }
      );
    }

    // Utwórz produkt w Supabase
    const productData: ProductFormData = {
      name: body.name,
      description: body.description,
      price: body.price,
      stock: body.stock,
      category: body.category,
      manufacturer: body.manufacturer,
      images: body.images || [],
      featured: body.featured || false,
    };

    const newProduct = await createProductServer(productData);

    return NextResponse.json(
      {
        success: true,
        data: newProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Błąd podczas tworzenia produktu:', error);
    return NextResponse.json(
      { success: false, error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}

// PUT /api/produkty - Zaktualizuj produkt (ADMIN)
export async function PUT(request: NextRequest) {
  try {
    // TODO: Sprawdzenie autoryzacji admina

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Brak ID produktu' },
        { status: 400 }
      );
    }

    // Aktualizuj produkt w Supabase
    const updatedProduct = await updateProductServer(id, updateData);

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, error: 'Produkt nie został znaleziony' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    console.error('Błąd podczas aktualizacji produktu:', error);
    return NextResponse.json(
      { success: false, error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}

// DELETE /api/produkty - Usuń produkt (ADMIN)
export async function DELETE(request: NextRequest) {
  try {
    // TODO: Sprawdzenie autoryzacji admina

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Brak ID produktu' },
        { status: 400 }
      );
    }

    // Usuń produkt z Supabase
    await deleteProductServer(id);

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
