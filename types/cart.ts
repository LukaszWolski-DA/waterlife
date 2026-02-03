/**
 * Typy TypeScript dla koszyka zakupowego
 */

// Podstawowy item w koszyku (używany w localStorage i UI)
export interface CartItem {
  id: string;          // product ID
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

// Item w bazie danych Supabase (cart_items table)
export interface CartItemDB {
  id: string;          // UUID cart_items row
  user_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
}

// Request body dla API /api/cart
export interface AddToCartRequest {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  imageUrl?: string;
}

export interface UpdateCartItemRequest {
  productId: string;
  quantity: number;
}

export interface RemoveFromCartRequest {
  productId: string;
}

export interface MergeCartRequest {
  items: CartItem[];
}

// Response types
export interface CartResponse {
  success: boolean;
  items?: CartItem[];
  error?: string;
}

export interface CartOperationResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Konwersja z DB do UI format
export function cartItemDBToCartItem(dbItem: CartItemDB, productName: string, productImage?: string): CartItem {
  return {
    id: dbItem.product_id,
    name: productName,
    price: dbItem.price,
    quantity: dbItem.quantity,
    imageUrl: productImage,
  };
}
