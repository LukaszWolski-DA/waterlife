import { NextRequest, NextResponse } from 'next/server';
import { createAuthServerClient } from '@/lib/supabase/server-auth';
import { OrderStatus } from '@/types/order';
import { isAdminEmail, UNAUTHORIZED_RESPONSE, ADMIN_UNAUTHORIZED_RESPONSE } from '@/lib/auth/admin';

/**
 * API endpoint dla zmiany statusu zamówienia (Admin)
 * PATCH - aktualizuje status zamówienia
 */

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const supabase = await createAuthServerClient();

    // Sprawdź sesję i uprawnienia admina
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: UNAUTHORIZED_RESPONSE.error }, { status: 401 });
    }

    if (!isAdminEmail(user.email || '')) {
      return NextResponse.json({ error: ADMIN_UNAUTHORIZED_RESPONSE.error }, { status: 403 });
    }

    // Pobierz nowy status z body
    const body = await request.json();
    const { status } = body;

    // Walidacja statusu
    const validStatuses: string[] = [
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
    ];

    if (!status || typeof status !== 'string' || !validStatuses.includes(status)) {
      console.error('❌ Walidacja statusu nie powiodła się:', { status, type: typeof status });
      return NextResponse.json(
        { 
          error: 'Nieprawidłowy status zamówienia',
          received: status,
          expected: validStatuses,
        },
        { status: 400 }
      );
    }

    // Sprawdź czy zamówienie istnieje
    const { data: existingOrder, error: fetchError } = await supabase
      .from('orders')
      .select('id, status')
      .eq('id', id)
      .single();

    if (fetchError || !existingOrder) {
      return NextResponse.json(
        { error: 'Zamówienie nie zostało znalezione' },
        { status: 404 }
      );
    }

    // Aktualizuj status (cast to OrderStatus for type safety)
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({
        status: status as OrderStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating order status:', updateError);
      return NextResponse.json(
        { error: 'Nie udało się zaktualizować statusu zamówienia' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: 'Status zamówienia został zaktualizowany',
    });
  } catch (error) {
    console.error('Błąd podczas aktualizacji statusu zamówienia:', error);
    return NextResponse.json(
      { error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}
