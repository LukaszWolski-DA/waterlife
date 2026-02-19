import { NextRequest, NextResponse } from 'next/server';
import { createAuthServerClient } from '@/lib/supabase/server-auth';

/**
 * API endpoint dla zarządzania zamówieniami w panelu admina
 * GET - pobiera wszystkie zamówienia (dla admina)
 */

export async function GET(request: NextRequest) {
  try {
    const supabase = await createAuthServerClient();

    // Sprawdź sesję użytkownika (TODO: dodać sprawdzenie czy to admin)
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - musisz być zalogowany jako admin' },
        { status: 401 }
      );
    }

    // Pobierz parametry z URL
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'active'; // 'active' lub 'completed'
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const dateFilter = searchParams.get('dateFilter') || 'all'; // 'all', 'today', '7days', '30days'

    // Określ statusy na podstawie typu
    const activeStatuses = ['pending', 'confirmed', 'processing'];
    const completedStatuses = ['shipped', 'delivered', 'cancelled'];
    const statuses = type === 'active' ? activeStatuses : completedStatuses;

    // Query builder
    let query = supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .in('status', statuses)
      .order('created_at', { ascending: false });

    // Filtrowanie po dacie
    if (dateFilter !== 'all') {
      const now = new Date();
      let startDate: Date;

      switch (dateFilter) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case '7days':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30days':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(0);
      }

      query = query.gte('created_at', startDate.toISOString());
    }

    // Filtrowanie po wyszukiwaniu (klient, email, ID)
    // Uwaga: Supabase nie wspiera OR z różnymi polami w jednym .filter()
    // Musimy pobrać wszystkie i filtrować po stronie serwera
    let filteredOrders = null;
    
    if (search) {
      const searchLower = search.toLowerCase();
      
      // Pobierz wszystkie zamówienia bez paginacji (dla filtrowania)
      const { data: allOrders, error: searchError } = await query;
      
      if (searchError) {
        console.error('Error searching orders:', searchError);
        return NextResponse.json(
          { error: 'Nie udało się wyszukać zamówień' },
          { status: 500 }
        );
      }

      // Filtruj po stronie serwera
      filteredOrders = (allOrders || []).filter((order: any) => {
        const fullName = order.customer_info?.fullName?.toLowerCase() || '';
        const email = order.customer_info?.email?.toLowerCase() || '';
        const orderId = order.id?.toLowerCase() || '';

        return fullName.includes(searchLower) || 
               email.includes(searchLower) || 
               orderId.includes(searchLower);
      });

      // Paginacja dla przefiltrowanych wyników
      const count = filteredOrders.length;
      const totalPages = type === 'completed' ? Math.ceil(count / limit) : 1;
      
      if (type === 'completed') {
        const from = (page - 1) * limit;
        const to = from + limit;
        filteredOrders = filteredOrders.slice(from, to);
      }

      return NextResponse.json({
        orders: filteredOrders,
        pagination: {
          page,
          limit,
          total: count,
          totalPages,
        },
      });
    }

    // Paginacja tylko dla completed
    if (type === 'completed') {
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);
    }

    const { data: orders, error: ordersError, count } = await query;

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      return NextResponse.json(
        { error: 'Nie udało się pobrać zamówień' },
        { status: 500 }
      );
    }

    // Oblicz informacje o paginacji
    const totalPages = type === 'completed' && count ? Math.ceil(count / limit) : 1;

    return NextResponse.json({
      orders: orders || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Błąd podczas pobierania zamówień:', error);
    return NextResponse.json(
      { error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}
