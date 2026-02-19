import { NextResponse } from 'next/server';
import { createAuthServerClient } from '@/lib/supabase/server-auth';
import { isAdminEmail, UNAUTHORIZED_RESPONSE, ADMIN_UNAUTHORIZED_RESPONSE } from '@/lib/auth/admin';

/**
 * GET /api/admin/dashboard
 * Pobiera statystyki dla dashboardu admina
 */
export async function GET() {
  try {
    const supabase = await createAuthServerClient();
    
    // Sprawdź autoryzację
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.user) {
      return NextResponse.json(
        { error: UNAUTHORIZED_RESPONSE.error },
        { status: UNAUTHORIZED_RESPONSE.status }
      );
    }
    
    // Sprawdź czy user jest adminem
    if (!isAdminEmail(session.user.email)) {
      console.warn(`[Dashboard] Unauthorized access attempt by: ${session.user.email}`);
      return NextResponse.json(
        { error: ADMIN_UNAUTHORIZED_RESPONSE.error },
        { status: ADMIN_UNAUTHORIZED_RESPONSE.status }
      );
    }
    
    // Pobierz statystyki równolegle
    const [ordersResult, productsResult, revenueResult] = await Promise.all([
      // Liczba zamówień
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      // Liczba produktów
      supabase.from('products').select('*', { count: 'exact', head: true }),
      // Suma przychodów
      supabase.from('orders').select('total'),
    ]);
    
    const totalOrders = ordersResult.count || 0;
    const totalProducts = productsResult.count || 0;
    const totalRevenue = revenueResult.data?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
    
    // Pobierz ostatnie 5 zamówień
    const { data: recentOrders, error: ordersError } = await supabase
      .from('orders')
      .select('id, created_at, customer_info, total, status')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (ordersError) {
      console.error('[Dashboard] Error fetching recent orders:', ordersError);
    }
    
    return NextResponse.json({
      stats: {
        totalOrders,
        totalProducts,
        totalRevenue,
        newMessages: 0, // TODO: Implementować później gdy będzie tabela contact_messages
      },
      recentOrders: recentOrders || [],
    });
  } catch (error) {
    console.error('[Dashboard] Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}
