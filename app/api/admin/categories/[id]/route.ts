import { NextRequest, NextResponse } from 'next/server';
import { createAuthServerClient } from '@/lib/supabase/server-auth';
import { isAdminEmail, UNAUTHORIZED_RESPONSE, ADMIN_UNAUTHORIZED_RESPONSE } from '@/lib/auth/admin';
import type { CategoryFormData } from '@/types/category';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/categories/[id]
 * Pobiera pojedynczą kategorię po ID
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const supabase = await createAuthServerClient();
    const { id } = await context.params;

    // Auth check
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.user) {
      return NextResponse.json(
        { error: UNAUTHORIZED_RESPONSE.error },
        { status: UNAUTHORIZED_RESPONSE.status }
      );
    }

    if (!isAdminEmail(session.user.email)) {
      return NextResponse.json(
        { error: ADMIN_UNAUTHORIZED_RESPONSE.error },
        { status: ADMIN_UNAUTHORIZED_RESPONSE.status }
      );
    }

    // Pobierz kategorię
    const { data: category, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Kategoria nie została znaleziona' },
          { status: 404 }
        );
      }

      console.error('[Categories API] Error fetching category:', error);
      return NextResponse.json(
        { error: 'Nie udało się pobrać kategorii' },
        { status: 500 }
      );
    }

    return NextResponse.json({ category });
  } catch (error) {
    console.error('[Categories API] Fatal error:', error);
    return NextResponse.json(
      { error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/categories/[id]
 * Aktualizuje kategorię
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const supabase = await createAuthServerClient();
    const { id } = await context.params;

    // Auth check
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.user) {
      return NextResponse.json(
        { error: UNAUTHORIZED_RESPONSE.error },
        { status: UNAUTHORIZED_RESPONSE.status }
      );
    }

    if (!isAdminEmail(session.user.email)) {
      console.warn(`[Categories API] Unauthorized update by: ${session.user.email}`);
      return NextResponse.json(
        { error: ADMIN_UNAUTHORIZED_RESPONSE.error },
        { status: ADMIN_UNAUTHORIZED_RESPONSE.status }
      );
    }

    // Pobierz dane z body
    const body: Partial<CategoryFormData> = await request.json();

    // Przygotuj dane do update
    const updateData: any = {};
    
    if (body.name !== undefined) {
      if (!body.name.trim()) {
        return NextResponse.json(
          { error: 'Nazwa kategorii nie może być pusta' },
          { status: 400 }
        );
      }
      updateData.name = body.name.trim();
    }
    
    if (body.description !== undefined) {
      updateData.description = body.description?.trim() || null;
    }
    
    if (body.keywords !== undefined) {
      updateData.keywords = body.keywords;
    }

    // Zaktualizuj kategorię
    const { data: category, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      // Not found
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Kategoria nie została znaleziona' },
          { status: 404 }
        );
      }

      // Unique constraint violation
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Kategoria o tej nazwie już istnieje' },
          { status: 409 }
        );
      }

      console.error('[Categories API] Error updating category:', error);
      return NextResponse.json(
        { error: 'Nie udało się zaktualizować kategorii' },
        { status: 500 }
      );
    }

    return NextResponse.json({ category });
  } catch (error) {
    console.error('[Categories API] Fatal error:', error);
    return NextResponse.json(
      { error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/categories/[id]
 * Usuwa kategorię
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const supabase = await createAuthServerClient();
    const { id } = await context.params;

    // Auth check
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.user) {
      return NextResponse.json(
        { error: UNAUTHORIZED_RESPONSE.error },
        { status: UNAUTHORIZED_RESPONSE.status }
      );
    }

    if (!isAdminEmail(session.user.email)) {
      console.warn(`[Categories API] Unauthorized delete by: ${session.user.email}`);
      return NextResponse.json(
        { error: ADMIN_UNAUTHORIZED_RESPONSE.error },
        { status: ADMIN_UNAUTHORIZED_RESPONSE.status }
      );
    }

    // Usuń kategorię
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[Categories API] Error deleting category:', error);
      return NextResponse.json(
        { error: 'Nie udało się usunąć kategorii' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Categories API] Fatal error:', error);
    return NextResponse.json(
      { error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}
