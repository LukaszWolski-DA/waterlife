import { NextRequest, NextResponse } from 'next/server';
import { createAuthServerClient } from '@/lib/supabase/server-auth';
import { isAdminEmail, UNAUTHORIZED_RESPONSE, ADMIN_UNAUTHORIZED_RESPONSE } from '@/lib/auth/admin';
import type { ManufacturerFormData, Manufacturer } from '@/types/manufacturer';

/**
 * GET /api/admin/manufacturers/[id] - pobiera pojedynczego producenta
 * Wymaga autoryzacji admin
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    // Fetch manufacturer
    const { data: manufacturer, error } = await supabase
      .from('manufacturers')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !manufacturer) {
      return NextResponse.json(
        { error: 'Producent nie znaleziony' },
        { status: 404 }
      );
    }

    // Transform to frontend format
    const formattedManufacturer: Manufacturer = {
      id: manufacturer.id,
      name: manufacturer.name,
      createdAt: manufacturer.created_at,
      updatedAt: manufacturer.updated_at,
    };

    return NextResponse.json({ manufacturer: formattedManufacturer });
  } catch (error) {
    console.error('Error in GET /api/admin/manufacturers/[id]:', error);
    return NextResponse.json(
      { error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/manufacturers/[id] - aktualizuje producenta
 * Wymaga autoryzacji admin
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    // Parse body
    const body = await request.json() as Partial<ManufacturerFormData>;

    // Validation
    if (body.name !== undefined) {
      if (body.name.trim().length === 0) {
        return NextResponse.json(
          { error: 'Nazwa producenta nie może być pusta' },
          { status: 400 }
        );
      }
      body.name = body.name.trim();
    }

    // Update manufacturer
    const { data: updatedManufacturer, error } = await supabase
      .from('manufacturers')
      .update({
        name: body.name,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      // Check for not found
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Producent nie znaleziony' },
          { status: 404 }
        );
      }

      // Check for unique constraint violation
      if (error.code === '23505') {
        return NextResponse.json(
          { error: `Producent "${body.name}" już istnieje` },
          { status: 409 }
        );
      }

      console.error('Error updating manufacturer:', error);
      return NextResponse.json(
        { error: 'Nie udało się zaktualizować producenta' },
        { status: 500 }
      );
    }

    if (!updatedManufacturer) {
      return NextResponse.json(
        { error: 'Producent nie znaleziony' },
        { status: 404 }
      );
    }

    // Transform to frontend format
    const manufacturer: Manufacturer = {
      id: updatedManufacturer.id,
      name: updatedManufacturer.name,
      createdAt: updatedManufacturer.created_at,
      updatedAt: updatedManufacturer.updated_at,
    };

    return NextResponse.json({ manufacturer });
  } catch (error) {
    console.error('Error in PATCH /api/admin/manufacturers/[id]:', error);
    return NextResponse.json(
      { error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/manufacturers/[id] - usuwa producenta
 * Wymaga autoryzacji admin
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    // Delete manufacturer
    const { error } = await supabase
      .from('manufacturers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting manufacturer:', error);
      return NextResponse.json(
        { error: 'Nie udało się usunąć producenta' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/admin/manufacturers/[id]:', error);
    return NextResponse.json(
      { error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}
