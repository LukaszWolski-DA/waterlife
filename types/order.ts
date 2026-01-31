/**
 * Typy TypeScript dla zamówień
 */

export type OrderStatus =
  | 'pending'       // Oczekujące
  | 'processing'    // W trakcie realizacji
  | 'shipped'       // Wysłane
  | 'delivered'     // Dostarczone
  | 'cancelled';    // Anulowane

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number; // Cena w momencie zamówienia
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string; // Numer zamówienia, np. "WL-2024-001"
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCost: number;
  total: number;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderFormData {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes?: string;
}

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  status: OrderStatus;
  note?: string;
  createdAt: string;
  createdBy?: string; // ID administratora
}
