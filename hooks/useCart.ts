'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Custom hook do zarządzania koszykiem zakupowym
 * Używa localStorage (Zustand persist) dla WSZYSTKICH użytkowników (goście + zalogowani)
 * 
 * Zapis do bazy danych (cart_items + orders) następuje tylko przy checkout
 * (kliknięcie "Wyślij zapytanie ofertowe")
 */

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

// Helper do kalkulacji total i itemCount
const calculateTotals = (items: CartItem[]) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, itemCount };
};

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,

      addItem: (item, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);

          let newItems;
          if (existingItem) {
            // Jeśli produkt już jest w koszyku, zwiększ ilość
            newItems = state.items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + quantity }
                : i
            );
          } else {
            // Dodaj nowy produkt do koszyka
            newItems = [...state.items, { ...item, quantity }];
          }

          const { total, itemCount } = calculateTotals(newItems);

          return {
            items: newItems,
            total,
            itemCount,
          };
        });
      },

      removeItem: (id) => {
        set((state) => {
          const newItems = state.items.filter((item) => item.id !== id);
          const { total, itemCount } = calculateTotals(newItems);

          return {
            items: newItems,
            total,
            itemCount,
          };
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set((state) => {
          const newItems = state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          );
          const { total, itemCount } = calculateTotals(newItems);

          return {
            items: newItems,
            total,
            itemCount,
          };
        });
      },

      clearCart: () => {
        set({ items: [], total: 0, itemCount: 0 });
      },
    }),
    {
      name: 'waterlife-cart', // Nazwa w localStorage
    }
  )
);
