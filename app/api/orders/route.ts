import { NextRequest, NextResponse } from 'next/server';
import { createAuthServerClient } from '@/lib/supabase/server-auth';

/**
 * API endpoint dla zamówień użytkownika
 * GET - pobiera wszystkie zamówienia zalogowanego użytkownika
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

    // Pobierz zamówienia użytkownika (tylko te które nie są gościnne)
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .eq('is_guest', false)
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      return NextResponse.json(
        { error: 'Nie udało się pobrać zamówień' },
        { status: 500 }
      );
    }

    return NextResponse.json({ orders: orders || [] });
  } catch (error) {
    console.error('Błąd podczas pobierania zamówień:', error);
    return NextResponse.json(
      { error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}
