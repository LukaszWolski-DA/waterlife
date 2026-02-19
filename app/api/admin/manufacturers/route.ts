import { NextRequest, NextResponse } from 'next/server';
import { createAuthServerClient } from '@/lib/supabase/server-auth';
import { isAdminEmail, UNAUTHORIZED_RESPONSE, ADMIN_UNAUTHORIZED_RESPONSE } from '@/lib/auth/admin';
import type { Manufacturer, ManufacturerFormData } from '@/types/manufacturer';

/**
 * GET /api/admin/manufacturers - pobiera wszystkich producentów
 * Wymaga autoryzacji admin
 */
export async function GET() {
  try {
    // Auth check
    const supabase = await createAuthServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return UNAUTHORIZED_RESPONSE;
    }

    if (!isAdminEmail(user.email || '')) {
      return ADMIN_UNAUTHORIZED_RESPONSE;
    }

    // Fetch manufacturers
    const { data: manufacturers, error } = await supabase
      .from('manufacturers')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching manufacturers:', error);
      return NextResponse.json(
        { error: 'Nie udało się pobrać producentów' },
        { status: 500 }
      );
    }

    // Transform to frontend format
    const formattedManufacturers: Manufacturer[] = manufacturers.map(m => ({
      id: m.id,
      name: m.name,
      createdAt: m.created_at,
      updatedAt: m.updated_at,
    }));

    return NextResponse.json({ manufacturers: formattedManufacturers });
  } catch (error) {
    console.error('Error in GET /api/admin/manufacturers:', error);
    return NextResponse.json(
      { error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/manufacturers - tworzy nowego producenta
 * Wymaga autoryzacji admin
 */
export async function POST(request: NextRequest) {
  try {
    // Auth check
    const supabase = await createAuthServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return UNAUTHORIZED_RESPONSE;
    }

    if (!isAdminEmail(user.email || '')) {
      return ADMIN_UNAUTHORIZED_RESPONSE;
    }

    // Parse body
    const body = await request.json() as ManufacturerFormData;

    // Validation
    if (!body.name || body.name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Nazwa producenta jest wymagana' },
        { status: 400 }
      );
    }

    const trimmedName = body.name.trim();

    // Insert manufacturer
    const { data: newManufacturer, error } = await supabase
      .from('manufacturers')
      .insert([{ name: trimmedName }])
      .select()
      .single();

    if (error) {
      // Check for unique constraint violation
      if (error.code === '23505') {
        return NextResponse.json(
          { error: `Producent "${trimmedName}" już istnieje` },
          { status: 409 }
        );
      }

      console.error('Error creating manufacturer:', error);
      return NextResponse.json(
        { error: 'Nie udało się utworzyć producenta' },
        { status: 500 }
      );
    }

    // Transform to frontend format
    const manufacturer: Manufacturer = {
      id: newManufacturer.id,
      name: newManufacturer.name,
      createdAt: newManufacturer.created_at,
      updatedAt: newManufacturer.updated_at,
    };

    return NextResponse.json({ manufacturer }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/admin/manufacturers:', error);
    return NextResponse.json(
      { error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}
