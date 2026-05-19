import { create } from 'zustand';

interface UIState {
  isSearchOpen: boolean;
  isCartOpen: boolean;
  toggleSearch: () => void;
  setSearchOpen: (open: boolean) => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSearchOpen: false,
  isCartOpen: false,
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  setCartOpen: (open) => set({ isCartOpen: open }),
}));
