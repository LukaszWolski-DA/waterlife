import { NextResponse } from 'next/server';
import { createAuthServerClient } from '@/lib/supabase/server-auth';
import { isAdminEmail, UNAUTHORIZED_RESPONSE, ADMIN_UNAUTHORIZED_RESPONSE } from '@/lib/auth/admin';
import type { ContactMessage } from '@/types/contact';

/**
 * GET /api/admin/messages - pobiera wszystkie wiadomości kontaktowe
 * Wymaga autoryzacji admin
 * Query params:
 * - status: filtrowanie po statusie (new, read, replied, archived)
 * - limit: maksymalna liczba wyników (default: 50)
 * - offset: przesunięcie dla paginacji (default: 0)
 */
export async function GET(request: Request) {
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

    // Parse query params
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = supabase
      .from('contact_messages')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter by status if provided
    if (status && ['new', 'read', 'replied', 'archived'].includes(status)) {
      query = query.eq('status', status);
    }

    const { data: messages, error, count } = await query;

    if (error) {
      console.error('Error fetching messages:', error);
      return NextResponse.json(
        { error: 'Nie udało się pobrać wiadomości' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      messages: messages as ContactMessage[],
      total: count || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error in GET /api/admin/messages:', error);
    return NextResponse.json(
      { error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}
