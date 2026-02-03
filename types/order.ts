/**
 * Typy dla zamówień
 */

export interface OrderCustomerInfo {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  company?: string | null;
  nip?: string | null;
}

export interface OrderCartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface OrderCartSnapshot {
  items: OrderCartItem[];
  total: number;
  timestamp: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customer_info: OrderCustomerInfo;
  total: number;
  status: OrderStatus;
  notes?: string | null;
  cart_snapshot: OrderCartSnapshot;
  created_at: string;
  updated_at: string;
  user_id?: string | null;
  is_guest?: boolean;
}

export interface OrdersResponse {
  orders: Order[];
}

// Helper dla wyświetlania statusu po polsku
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Oczekujące',
  confirmed: 'Potwierdzone',
  processing: 'W realizacji',
  shipped: 'Wysłane',
  delivered: 'Dostarczone',
  cancelled: 'Anulowane',
};

// Helper dla kolorów statusu (Tailwind classes)
export const ORDER_STATUS_VARIANTS: Record<OrderStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'secondary',
  confirmed: 'default',
  processing: 'default',
  shipped: 'default',
  delivered: 'outline',
  cancelled: 'destructive',
};
