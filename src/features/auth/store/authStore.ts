import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { UserRole } from '@shared/types/api'

interface AuthState {
  isAuthenticated: boolean
  accessToken: string | null
  role: UserRole | null
  clubUUID: string | null // LEADER only
  isAgreedTerms: boolean | null // LEADER only
}

interface AuthActions {
  setAuth: (data: {
    accessToken: string
    role: UserRole
    clubUUID?: string // optional for ADMIN
    isAgreedTerms?: boolean // optional for ADMIN
  }) => void
  updateAccessToken: (token: string) => void
  setAgreedTerms: () => void
  clearAuth: () => void
  reset: () => void
}

type AuthStore = AuthState & AuthActions

const initialState: AuthState = {
  isAuthenticated: false,
  accessToken: null,
  role: null,
  clubUUID: null,
  isAgreedTerms: null,
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,

      setAuth: (data) =>
        set({
          isAuthenticated: true,
          accessToken: data.accessToken,
          role: data.role,
          clubUUID: data.clubUUID ?? null,
          isAgreedTerms: data.isAgreedTerms ?? null,
        }),

      updateAccessToken: (token) => set({ accessToken: token }),

      setAgreedTerms: () => set({ isAgreedTerms: true }),

      clearAuth: () => set({ ...initialState }),

      reset: () => set({ ...initialState }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Persist auth state including accessToken
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        role: state.role,
        clubUUID: state.clubUUID,
        isAgreedTerms: state.isAgreedTerms,
      }),
    }
  )
)
