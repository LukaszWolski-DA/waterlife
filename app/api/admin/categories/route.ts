import { NextRequest, NextResponse } from 'next/server';
import { createAuthServerClient } from '@/lib/supabase/server-auth';
import { isAdminEmail, UNAUTHORIZED_RESPONSE, ADMIN_UNAUTHORIZED_RESPONSE } from '@/lib/auth/admin';
import type { Category, CategoryFormData } from '@/types/category';

/**
 * GET /api/admin/categories
 * Pobiera wszystkie kategorie (dla admina)
 */
export async function GET() {
  try {
    const supabase = await createAuthServerClient();

    // Auth check
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.user) {
      return NextResponse.json(
        { error: UNAUTHORIZED_RESPONSE.error },
        { status: UNAUTHORIZED_RESPONSE.status }
      );
    }

    if (!isAdminEmail(session.user.email)) {
      console.warn(`[Categories API] Unauthorized access by: ${session.user.email}`);
      return NextResponse.json(
        { error: ADMIN_UNAUTHORIZED_RESPONSE.error },
        { status: ADMIN_UNAUTHORIZED_RESPONSE.status }
      );
    }

    // Pobierz wszystkie kategorie
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('[Categories API] Error fetching categories:', error);
      return NextResponse.json(
        { error: 'Nie udało się pobrać kategorii' },
        { status: 500 }
      );
    }

    return NextResponse.json({ categories: categories || [] });
  } catch (error) {
    console.error('[Categories API] Fatal error:', error);
    return NextResponse.json(
      { error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/categories
 * Tworzy nową kategorię
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createAuthServerClient();

    // Auth check
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.user) {
      return NextResponse.json(
        { error: UNAUTHORIZED_RESPONSE.error },
        { status: UNAUTHORIZED_RESPONSE.status }
      );
    }

    if (!isAdminEmail(session.user.email)) {
      console.warn(`[Categories API] Unauthorized create attempt by: ${session.user.email}`);
      return NextResponse.json(
        { error: ADMIN_UNAUTHORIZED_RESPONSE.error },
        { status: ADMIN_UNAUTHORIZED_RESPONSE.status }
      );
    }

    // Pobierz dane z body
    const body: CategoryFormData = await request.json();

    // Walidacja
    if (!body.name || body.name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Nazwa kategorii jest wymagana' },
        { status: 400 }
      );
    }

    // Utwórz kategorię
    const { data: category, error } = await supabase
      .from('categories')
      .insert({
        name: body.name.trim(),
        description: body.description?.trim() || null,
        keywords: body.keywords || [],
      })
      .select()
      .single();

    if (error) {
      // Unique constraint violation
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Kategoria o tej nazwie już istnieje' },
          { status: 409 }
        );
      }

      console.error('[Categories API] Error creating category:', error);
      return NextResponse.json(
        { error: 'Nie udało się utworzyć kategorii' },
        { status: 500 }
      );
    }

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error('[Categories API] Fatal error:', error);
    return NextResponse.json(
      { error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}
