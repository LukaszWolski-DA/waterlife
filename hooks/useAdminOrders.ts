import { useState, useEffect, useCallback } from 'react';
import { Order, OrderStatus } from '@/types/order';

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface UseAdminOrdersReturn {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  pagination: PaginationInfo | null;
  refetch: () => Promise<void>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => Promise<boolean>;
}

/**
 * Hook do zarządzania zamówieniami w panelu admina
 */
export function useAdminOrders(
  type: 'active' | 'completed' = 'active',
  page: number = 1,
  limit: number = 20,
  search: string = '',
  dateFilter: string = 'all'
): UseAdminOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        type,
        page: page.toString(),
        limit: limit.toString(),
        search,
        dateFilter,
      });

      const response = await fetch(`/api/admin/orders?${params}`);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Musisz być zalogowany jako admin');
        }
        throw new Error('Nie udało się pobrać zamówień');
      }

      const data = await response.json();
      setOrders(data.orders || []);
      setPagination(data.pagination);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Wystąpił błąd podczas pobierania zamówień';
      setError(errorMessage);
      console.error('Error fetching admin orders:', err);
    } finally {
      setIsLoading(false);
    }
  }, [type, page, limit, search, dateFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = useCallback(async (orderId: string, newStatus: OrderStatus): Promise<boolean> => {
    try {
      const url = `/api/admin/orders/${orderId}/status`;
      const payload = { status: newStatus };
      
      console.log('🔄 [Hook] Aktualizacja statusu:', { orderId, newStatus, url, payload });
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('📥 [Hook] Odpowiedź:', { 
        status: response.status, 
        ok: response.ok,
        statusText: response.statusText 
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ [Hook] Błąd z API:', errorData);
        throw new Error('Nie udało się zaktualizować statusu');
      }

      const data = await response.json();
      
      // Optimistic update - zaktualizuj lokalny stan
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? { ...order, status: newStatus, updated_at: new Date().toISOString() }
            : order
        )
      );

      // Refetch aby mieć pewność że dane są aktualne
      // (zamówienie może przejść między zakładkami)
      setTimeout(() => {
        fetchOrders();
      }, 500);

      return true;
    } catch (err) {
      console.error('Error updating order status:', err);
      return false;
    }
  }, [fetchOrders]);

  return {
    orders,
    isLoading,
    error,
    pagination,
    refetch: fetchOrders,
    updateOrderStatus,
  };
}

/**
 * Hook do pobierania szczegółów pojedynczego zamówienia
 */
export function useAdminOrder(orderId: string | null) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!orderId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Pobieramy zamówienie przez endpoint orders (sprawdzi auth)
      const response = await fetch(`/api/admin/orders?type=active`);
      
      if (!response.ok) {
        throw new Error('Nie udało się pobrać zamówienia');
      }

      const data = await response.json();
      const foundOrder = data.orders.find((o: Order) => o.id === orderId);

      if (!foundOrder) {
        // Spróbuj w completed
        const completedResponse = await fetch(`/api/admin/orders?type=completed`);
        const completedData = await completedResponse.json();
        const completedOrder = completedData.orders.find((o: Order) => o.id === orderId);
        
        if (completedOrder) {
          setOrder(completedOrder);
        } else {
          throw new Error('Zamówienie nie zostało znalezione');
        }
      } else {
        setOrder(foundOrder);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Wystąpił błąd podczas pobierania zamówienia';
      setError(errorMessage);
      console.error('Error fetching order:', err);
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const updateStatus = useCallback(async (_orderId: string, newStatus: OrderStatus): Promise<boolean> => {
    // Używamy orderId z closure, ignorujemy parametr _orderId (dla zgodności z interface)
    if (!orderId) return false;

    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Nie udało się zaktualizować statusu');
      }

      // Optimistic update
      if (order) {
        setOrder({ ...order, status: newStatus, updated_at: new Date().toISOString() });
      }

      // Refetch aby mieć pewność
      setTimeout(() => {
        fetchOrder();
      }, 500);

      return true;
    } catch (err) {
      console.error('Error updating order status:', err);
      return false;
    }
  }, [orderId, order, fetchOrder]);

  return {
    order,
    isLoading,
    error,
    refetch: fetchOrder,
    updateStatus,
  };
}
