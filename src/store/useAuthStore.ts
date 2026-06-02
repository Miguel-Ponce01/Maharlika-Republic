import { create } from 'zustand';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  isAuthModalOpen: boolean;
  setUser: (user: User | null) => void;
  setAuthModalOpen: (isOpen: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthModalOpen: false,
  setUser: (user) => set({ user }),
  setAuthModalOpen: (isOpen) => set({ isAuthModalOpen: isOpen }),
}));
