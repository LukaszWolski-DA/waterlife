import { NextRequest, NextResponse } from 'next/server';
import { createAuthServerClient } from '@/lib/supabase/server-auth';
import { OrderStatus } from '@/types/order';

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

    // Sprawdź sesję użytkownika (TODO: dodać sprawdzenie czy to admin)
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - musisz być zalogowany jako admin' },
        { status: 401 }
      );
    }

    // Pobierz nowy status z body
    const body = await request.json();
    const { status } = body;

    console.log('📦 Otrzymany request zmiany statusu:', { orderId: id, status, bodyType: typeof status });

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

    console.log(`✅ Order ${id} status changed: ${existingOrder.status} → ${status}`);

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
