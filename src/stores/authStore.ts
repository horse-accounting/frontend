import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../api/types'

interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  pendingVerificationEmail: string | null

  // Actions
  setAuth: (user: User, accessToken: string) => void
  setUser: (user: User) => void
  setPendingVerification: (accessToken: string, email: string) => void
  clearPendingVerification: () => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      pendingVerificationEmail: null,

      setAuth: (user, accessToken) =>
        set({
          user,
          accessToken,
          isAuthenticated: true,
          pendingVerificationEmail: null,
        }),

      setUser: (user) =>
        set({
          user,
        }),

      setPendingVerification: (accessToken, email) =>
        set({
          accessToken,
          pendingVerificationEmail: email,
          isAuthenticated: false,
          user: null,
        }),

      clearPendingVerification: () =>
        set({
          pendingVerificationEmail: null,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          pendingVerificationEmail: null,
        }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Selector hooks for better performance
export const useUser = () => useAuthStore((state) => state.user)
export const useAccessToken = () => useAuthStore((state) => state.accessToken)
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated)
export const usePendingVerificationEmail = () => useAuthStore((state) => state.pendingVerificationEmail)
