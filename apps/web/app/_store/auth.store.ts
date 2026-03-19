import { create } from 'zustand';
import { api } from '../_lib/api';
import { removeToken } from '../_lib/auth';

export interface AuthUser {
  id: string;
  steamId: string;
  username: string;
  avatar: string;
  balance: number;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isInitialized: boolean;
  setUser: (user: AuthUser | null) => void;
  fetchMe: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isInitialized: false,

  setUser: (user) => set({ user }),

  fetchMe: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get<AuthUser>('/auth/me');
      set({ user: data, isLoading: false, isInitialized: true });
    } catch {
      set({ user: null, isLoading: false, isInitialized: true });
    }
  },

  logout: () => {
    removeToken();
    set({ user: null });
    window.location.href = '/auth';
  },
}));
