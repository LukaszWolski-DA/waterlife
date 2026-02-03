import { useState, useEffect, useCallback } from 'react';
import { Order } from '@/types/order';

interface UseOrdersReturn {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook do zarządzania zamówieniami użytkownika
 */
export function useOrders(): UseOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/orders');

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Musisz być zalogowany aby zobaczyć zamówienia');
        }
        throw new Error('Nie udało się pobrać zamówień');
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Wystąpił błąd podczas pobierania zamówień';
      setError(errorMessage);
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    isLoading,
    error,
    refetch: fetchOrders,
  };
}
