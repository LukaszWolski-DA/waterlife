import { NextRequest, NextResponse } from 'next/server';
import { createAuthServerClient } from '@/lib/supabase/server-auth';

/**
 * API endpoint dla profilu użytkownika
 * GET - pobiera profil zalogowanego użytkownika
 * PATCH - aktualizuje profil zalogowanego użytkownika
 */

export async function GET(request: NextRequest) {
  try {
    const supabase = await createAuthServerClient();

    // Sprawdź sesję użytkownika
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - musisz być zalogowany' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Pobierz profil użytkownika
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return NextResponse.json(
        { error: 'Nie udało się pobrać profilu użytkownika' },
        { status: 500 }
      );
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Błąd podczas pobierania profilu:', error);
    return NextResponse.json(
      { error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createAuthServerClient();

    // Sprawdź sesję użytkownika
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - musisz być zalogowany' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Pobierz dane do aktualizacji
    const body = await request.json();
    const { first_name, last_name, phone, company, nip } = body;

    // Walidacja danych
    if (!first_name || !last_name) {
      return NextResponse.json(
        { error: 'Imię i nazwisko są wymagane' },
        { status: 400 }
      );
    }

    // Przygotuj dane do aktualizacji
    const updateData: any = {
      first_name,
      last_name,
      full_name: `${first_name} ${last_name}`, // Aktualizuj też full_name
      phone: phone || null,
      company: company || null,
      nip: nip || null,
      updated_at: new Date().toISOString(),
    };

    // Aktualizuj profil
    const { data: updatedProfile, error: updateError } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating user profile:', updateError);
      return NextResponse.json(
        { error: 'Nie udało się zaktualizować profilu' },
        { status: 500 }
      );
    }

    console.log('✅ User profile updated:', userId);

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
      message: 'Profil został zaktualizowany',
    });
  } catch (error) {
    console.error('Błąd podczas aktualizacji profilu:', error);
    return NextResponse.json(
      { error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}
