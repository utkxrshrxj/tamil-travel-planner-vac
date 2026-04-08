import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('namma_token') || null,
  isAuthenticated: !!localStorage.getItem('namma_token'),
  login: (token, user) => {
    localStorage.setItem('namma_token', token);
    set({ token, user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('namma_token');
    set({ token: null, user: null, isAuthenticated: false });
  },
  setUser: (user) => set({ user }),
}));
