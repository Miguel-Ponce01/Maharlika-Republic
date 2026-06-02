import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number; // in PHP
  image: string;
  quantity: number;
  specs: string;
  variantId: number;
  maxStock: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (newItem) => set((state) => {
        const exists = state.items.find(item => item.id === newItem.id);
        if (exists) {
          return {
            items: state.items.map(item =>
              item.id === newItem.id 
                ? { ...item, quantity: Math.min(item.quantity + newItem.quantity, item.maxStock) } 
                : item
            )
          };
        }
        return { items: [...state.items, { ...newItem, quantity: Math.min(newItem.quantity, newItem.maxStock) }] };
      }),
      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map(item =>
          item.id === id ? { ...item, quantity: Math.max(1, Math.min(quantity, item.maxStock)) } : item
        )
      })),
      clearCart: () => set({ items: [] })
    }),
    {
      name: 'maharlika-cart-storage'
    }
  )
);
