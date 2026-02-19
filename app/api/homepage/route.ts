import { NextRequest, NextResponse } from 'next/server';
import { createAuthServerClient } from '@/lib/supabase/server-auth';
import { isAdminEmail, ADMIN_UNAUTHORIZED_RESPONSE, UNAUTHORIZED_RESPONSE } from '@/lib/auth/admin';
import type { HomepageContent, HomepageFormData } from '@/types/homepage';

/**
 * GET /api/homepage
 * Pobiera treści strony głównej z Supabase
 * Public endpoint - każdy może czytać
 */
export async function GET() {
  try {
    const supabase = await createAuthServerClient();

    // Pobierz homepage content z bazy
    const { data, error } = await supabase
      .from('homepage_content')
      .select('content, updated_at')
      .eq('section', 'homepage')
      .single();

    if (error) {
      console.error('Error fetching homepage content:', error);
      return NextResponse.json(
        { error: 'Nie udało się pobrać treści strony głównej' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Brak treści strony głównej w bazie danych' },
        { status: 404 }
      );
    }

    // Dodaj updatedAt do content
    const content: HomepageContent = {
      ...data.content,
      updatedAt: data.updated_at,
    };

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Błąd podczas pobierania treści strony głównej:', error);
    return NextResponse.json(
      { error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/homepage
 * Aktualizuje treści strony głównej w Supabase
 * Wymaga autoryzacji (admin)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createAuthServerClient();

    // Sprawdź sesję użytkownika
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return NextResponse.json(
        { error: UNAUTHORIZED_RESPONSE.error },
        { status: UNAUTHORIZED_RESPONSE.status }
      );
    }

    // Sprawdź czy user jest adminem
    if (!isAdminEmail(session.user.email)) {
      console.warn(`[HOMEPAGE API] Unauthorized edit attempt by: ${session.user.email}`);
      return NextResponse.json(
        { error: ADMIN_UNAUTHORIZED_RESPONSE.error },
        { status: ADMIN_UNAUTHORIZED_RESPONSE.status }
      );
    }

    // Pobierz dane z body
    const body: HomepageFormData = await request.json();

    // Walidacja - sprawdź czy wszystkie wymagane pola są obecne
    if (!body.hero || !body.stats || !body.contact || !body.categoriesIntro || !body.categoryCards || !body.brands) {
      return NextResponse.json(
        { error: 'Niepełne dane formularza' },
        { status: 400 }
      );
    }

    // Zaktualizuj w bazie
    const { data, error } = await supabase
      .from('homepage_content')
      .update({
        content: body,
        updated_at: new Date().toISOString(),
      })
      .eq('section', 'homepage')
      .select('content, updated_at')
      .single();

    if (error) {
      console.error('Error updating homepage content:', error);
      return NextResponse.json(
        { error: 'Nie udało się zaktualizować treści' },
        { status: 500 }
      );
    }

    // Dodaj updatedAt do content
    const content: HomepageContent = {
      ...data.content,
      updatedAt: data.updated_at,
    };

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Błąd podczas aktualizacji treści strony głównej:', error);
    return NextResponse.json(
      { error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}
