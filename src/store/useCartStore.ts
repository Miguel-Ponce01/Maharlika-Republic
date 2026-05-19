import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number; // in PHP
  image: string;
  quantity: number;
  specs: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const DEFAULT_ITEMS: CartItem[] = [
  {
    id: "iphone-16-pro-max",
    name: "iPhone 16 Pro Max",
    price: 84990,
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=400&auto=format&fit=crop",
    quantity: 1,
    specs: "256GB, Desert Titanium"
  },
  {
    id: "macbook-pro-m3-max",
    name: "MacBook Pro 16\" M3 Max",
    price: 199990,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=400&auto=format&fit=crop",
    quantity: 1,
    specs: "36GB RAM, 1TB SSD, Space Black"
  }
];

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: DEFAULT_ITEMS,
      addItem: (newItem) => set((state) => {
        const exists = state.items.find(item => item.id === newItem.id);
        if (exists) {
          return {
            items: state.items.map(item =>
              item.id === newItem.id ? { ...item, quantity: item.quantity + newItem.quantity } : item
            )
          };
        }
        return { items: [...state.items, newItem] };
      }),
      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map(item =>
          item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
        )
      })),
      clearCart: () => set({ items: [] })
    }),
    {
      name: 'maharlika-cart-storage'
    }
  )
);
