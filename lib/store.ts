import { create } from 'zustand'

export interface User {
  id: string
  walletAddress: string
  balance: string
}

interface AuthState {
  token: string | null
  user: User | null
  loading: boolean
  error: string | null
  setToken: (token: string | null) => void
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clear: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  loading: false,
  error: null,
  setToken: (token) => set({ token }),
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clear: () => set({ token: null, user: null, error: null }),
}))
