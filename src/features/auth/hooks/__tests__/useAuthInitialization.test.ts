import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@test/mocks/server'
import { createQueryWrapper } from '@test/utils/testUtils'
import { useAuthInitialization } from '../useAuthInitialization'
import { useAuthStore } from '../../store/authStore'
import * as apiClient from '@shared/api/apiClient'
import type { UserRole } from '@shared/types/api'

const API_BASE = 'https://api.donggurami.net'

// Mock react-router's useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}))

describe('useAuthInitialization - Session Timeout Behavior', () => {
  beforeEach(() => {
    // Clear auth store
    useAuthStore.getState().reset()
    // Clear mocks
    mockNavigate.mockClear()
    // Clear localStorage
    localStorage.clear()
  })

  afterEach(() => {
    // Clean up spies
    vi.restoreAllMocks()
  })

  describe('Happy Path - Valid Token on Startup', () => {
    it('should keep user logged in when valid token exists in localStorage', async () => {
      // Set up existing auth state (simulating persisted state)
      useAuthStore.getState().setAuth({
        accessToken: 'valid_access_token',
        role: 'LEADER',
        clubUUID: 'club-uuid-123',
        isAgreedTerms: true,
      })

      // Mock successful token refresh
      server.use(
        http.post(`${API_BASE}/integration/refresh-token`, () => {
          return HttpResponse.json({
            data: {
              accessToken: 'refreshed_valid_token',
              refreshToken: 'new_refresh_token',
            },
          })
        })
      )

      const setAccessTokenSpy = vi.spyOn(apiClient, 'setAccessToken')

      renderHook(() => useAuthInitialization(), {
        wrapper: createQueryWrapper(),
      })

      await waitFor(() => {
        // Should set the existing token first
        expect(setAccessTokenSpy).toHaveBeenCalledWith('valid_access_token')
        // Then update with the refreshed token
        expect(setAccessTokenSpy).toHaveBeenCalledWith('refreshed_valid_token')
      })

      // Verify auth store maintains authentication
      const authState = useAuthStore.getState()
      expect(authState.isAuthenticated).toBe(true)
      expect(authState.accessToken).toBe('refreshed_valid_token')
      expect(authState.role).toBe('LEADER')
      expect(authState.clubUUID).toBe('club-uuid-123')

      // Should NOT redirect to login
      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it('should verify refresh endpoint is called on app startup', async () => {
      useAuthStore.getState().setAuth({
        accessToken: 'startup_token',
        role: 'ADMIN',
      })

      let refreshEndpointCalled = false

      server.use(
        http.post(`${API_BASE}/integration/refresh-token`, () => {
          refreshEndpointCalled = true
          return HttpResponse.json({
            data: {
              accessToken: 'new_token',
              refreshToken: 'new_refresh',
            },
          })
        })
      )

      renderHook(() => useAuthInitialization(), {
        wrapper: createQueryWrapper(),
      })

      await waitFor(() => {
        expect(refreshEndpointCalled).toBe(true)
      })
    })

    it('should do nothing when no accessToken is stored', async () => {
      const setAccessTokenSpy = vi.spyOn(apiClient, 'setAccessToken')

      renderHook(() => useAuthInitialization(), {
        wrapper: createQueryWrapper(),
      })

      // Wait a bit to ensure no async operations
      await waitFor(
        () => {
          expect(setAccessTokenSpy).not.toHaveBeenCalled()
        },
        { timeout: 1000 }
      )

      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })

  describe('Token Expiration - Invalid Token', () => {
    it('should clear auth state when token is invalid/expired', async () => {
      // Set up expired token
      useAuthStore.getState().setAuth({
        accessToken: 'expired_token',
        role: 'LEADER',
        clubUUID: 'club-123',
        isAgreedTerms: true,
      })

      // Mock 401 Unauthorized response
      server.use(
        http.post(`${API_BASE}/integration/refresh-token`, () => {
          return HttpResponse.json(
            { message: 'Token expired', code: 'TOK-001' },
            { status: 401 }
          )
        })
      )

      const clearAccessTokenSpy = vi.spyOn(apiClient, 'clearAccessToken')

      renderHook(() => useAuthInitialization(), {
        wrapper: createQueryWrapper(),
      })

      await waitFor(() => {
        expect(clearAccessTokenSpy).toHaveBeenCalled()
      })

      // Verify auth was completely cleared
      const authState = useAuthStore.getState()
      expect(authState.isAuthenticated).toBe(false)
      expect(authState.accessToken).toBe(null)
      expect(authState.role).toBe(null)
      expect(authState.clubUUID).toBe(null)
      expect(authState.isAgreedTerms).toBe(null)
    })

    it('should redirect to login page when token is invalid', async () => {
      useAuthStore.getState().setAuth({
        accessToken: 'invalid_token',
        role: 'ADMIN',
      })

      server.use(
        http.post(`${API_BASE}/integration/refresh-token`, () => {
          return HttpResponse.json(
            { message: 'Invalid token' },
            { status: 401 }
          )
        })
      )

      renderHook(() => useAuthInitialization(), {
        wrapper: createQueryWrapper(),
      })

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true })
      })
    })

    it('should clear localStorage when token is expired', async () => {
      useAuthStore.getState().setAuth({
        accessToken: 'expired_token',
        role: 'LEADER',
        clubUUID: 'club-123',
        isAgreedTerms: true,
      })

      server.use(
        http.post(`${API_BASE}/integration/refresh-token`, () => {
          return HttpResponse.json(
            { message: 'Token expired' },
            { status: 401 }
          )
        })
      )

      renderHook(() => useAuthInitialization(), {
        wrapper: createQueryWrapper(),
      })

      await waitFor(() => {
        const stored = localStorage.getItem('auth-storage')
        if (stored) {
          const parsedState = JSON.parse(stored).state
          expect(parsedState.isAuthenticated).toBe(false)
          expect(parsedState.accessToken).toBe(null)
        }
      })
    })
  })

  describe('Token Refresh Success', () => {
    it('should update accessToken when refresh succeeds', async () => {
      useAuthStore.getState().setAuth({
        accessToken: 'old_token',
        role: 'LEADER',
        clubUUID: 'club-456',
        isAgreedTerms: true,
      })

      server.use(
        http.post(`${API_BASE}/integration/refresh-token`, () => {
          return HttpResponse.json({
            data: {
              accessToken: 'brand_new_token',
              refreshToken: 'brand_new_refresh_token',
            },
          })
        })
      )

      const setAccessTokenSpy = vi.spyOn(apiClient, 'setAccessToken')

      renderHook(() => useAuthInitialization(), {
        wrapper: createQueryWrapper(),
      })

      await waitFor(() => {
        expect(setAccessTokenSpy).toHaveBeenCalledWith('brand_new_token')
      })

      // Verify the new token is in the store
      const authState = useAuthStore.getState()
      expect(authState.accessToken).toBe('brand_new_token')
      expect(authState.isAuthenticated).toBe(true)
    })

    it('should store new token in both memory and localStorage', async () => {
      useAuthStore.getState().setAuth({
        accessToken: 'old_token',
        role: 'ADMIN',
      })

      server.use(
        http.post(`${API_BASE}/integration/refresh-token`, () => {
          return HttpResponse.json({
            data: {
              accessToken: 'new_persisted_token',
              refreshToken: 'new_refresh',
            },
          })
        })
      )

      renderHook(() => useAuthInitialization(), {
        wrapper: createQueryWrapper(),
      })

      await waitFor(() => {
        // Check in-memory token
        expect(apiClient.getAccessToken()).toBe('new_persisted_token')

        // Check localStorage persistence
        const stored = localStorage.getItem('auth-storage')
        if (stored) {
          const parsedState = JSON.parse(stored).state
          expect(parsedState.accessToken).toBe('new_persisted_token')
        }
      })
    })

    it('should not redirect when refresh succeeds', async () => {
      useAuthStore.getState().setAuth({
        accessToken: 'valid_token',
        role: 'LEADER',
        clubUUID: 'club-789',
        isAgreedTerms: true,
      })

      server.use(
        http.post(`${API_BASE}/integration/refresh-token`, () => {
          return HttpResponse.json({
            data: {
              accessToken: 'refreshed_token',
              refreshToken: 'refreshed_refresh_token',
            },
          })
        })
      )

      renderHook(() => useAuthInitialization(), {
        wrapper: createQueryWrapper(),
      })

      await waitFor(() => {
        const authState = useAuthStore.getState()
        expect(authState.accessToken).toBe('refreshed_token')
      })

      // Should NOT redirect
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })

  describe('Token Refresh Failure', () => {
    it('should logout user when refresh endpoint returns 401', async () => {
      useAuthStore.getState().setAuth({
        accessToken: 'expired_token',
        role: 'LEADER',
        clubUUID: 'club-123',
        isAgreedTerms: true,
      })

      server.use(
        http.post(`${API_BASE}/integration/refresh-token`, () => {
          return HttpResponse.json(
            { message: 'Refresh token expired', code: 'TOK-002' },
            { status: 401 }
          )
        })
      )

      const clearAccessTokenSpy = vi.spyOn(apiClient, 'clearAccessToken')

      renderHook(() => useAuthInitialization(), {
        wrapper: createQueryWrapper(),
      })

      await waitFor(() => {
        expect(clearAccessTokenSpy).toHaveBeenCalled()
      })

      const authState = useAuthStore.getState()
      expect(authState.isAuthenticated).toBe(false)
      expect(authState.accessToken).toBe(null)
      expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true })
    })

    it('should logout user when refresh endpoint returns 403', async () => {
      useAuthStore.getState().setAuth({
        accessToken: 'forbidden_token',
        role: 'ADMIN',
      })

      server.use(
        http.post(`${API_BASE}/integration/refresh-token`, () => {
          return HttpResponse.json(
            { message: 'Forbidden', code: 'TOK-003' },
            { status: 403 }
          )
        })
      )

      const clearAccessTokenSpy = vi.spyOn(apiClient, 'clearAccessToken')

      renderHook(() => useAuthInitialization(), {
        wrapper: createQueryWrapper(),
      })

      await waitFor(() => {
        expect(clearAccessTokenSpy).toHaveBeenCalled()
      })

      const authState = useAuthStore.getState()
      expect(authState.isAuthenticated).toBe(false)
      expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true })
    })

    it('should logout user when refresh endpoint returns 500', async () => {
      useAuthStore.getState().setAuth({
        accessToken: 'valid_token',
        role: 'LEADER',
        clubUUID: 'club-456',
        isAgreedTerms: true,
      })

      server.use(
        http.post(`${API_BASE}/integration/refresh-token`, () => {
          return HttpResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
          )
        })
      )

      const clearAccessTokenSpy = vi.spyOn(apiClient, 'clearAccessToken')

      renderHook(() => useAuthInitialization(), {
        wrapper: createQueryWrapper(),
      })

      await waitFor(() => {
        expect(clearAccessTokenSpy).toHaveBeenCalled()
      })

      const authState = useAuthStore.getState()
      expect(authState.isAuthenticated).toBe(false)
      expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true })
    })

    it('should completely clear auth state on refresh failure', async () => {
      useAuthStore.getState().setAuth({
        accessToken: 'expired_token',
        role: 'LEADER',
        clubUUID: 'club-uuid-999',
        isAgreedTerms: true,
      })

      server.use(
        http.post(`${API_BASE}/integration/refresh-token`, () => {
          return HttpResponse.json(
            { message: 'Unauthorized' },
            { status: 401 }
          )
        })
      )

      renderHook(() => useAuthInitialization(), {
        wrapper: createQueryWrapper(),
      })

      await waitFor(() => {
        const authState = useAuthStore.getState()
        expect(authState.isAuthenticated).toBe(false)
        expect(authState.accessToken).toBe(null)
        expect(authState.role).toBe(null)
        expect(authState.clubUUID).toBe(null)
        expect(authState.isAgreedTerms).toBe(null)
      })
    })
  })

  describe('Network Error During Refresh', () => {
    it('should trigger logout on network error', async () => {
      useAuthStore.getState().setAuth({
        accessToken: 'valid_token',
        role: 'ADMIN',
      })

      // Mock network error
      server.use(
        http.post(`${API_BASE}/integration/refresh-token`, () => {
          return HttpResponse.error()
        })
      )

      const clearAccessTokenSpy = vi.spyOn(apiClient, 'clearAccessToken')

      renderHook(() => useAuthInitialization(), {
        wrapper: createQueryWrapper(),
      })

      await waitFor(() => {
        expect(clearAccessTokenSpy).toHaveBeenCalled()
      })

      const authState = useAuthStore.getState()
      expect(authState.isAuthenticated).toBe(false)
      expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true })
    })

    it('should clear auth state on network timeout', async () => {
      useAuthStore.getState().setAuth({
        accessToken: 'timeout_token',
        role: 'LEADER',
        clubUUID: 'club-timeout',
        isAgreedTerms: true,
      })

      // Simulate network timeout
      server.use(
        http.post(`${API_BASE}/integration/refresh-token`, async () => {
          await new Promise((resolve) => setTimeout(resolve, 100))
          return HttpResponse.error()
        })
      )

      const clearAccessTokenSpy = vi.spyOn(apiClient, 'clearAccessToken')

      renderHook(() => useAuthInitialization(), {
        wrapper: createQueryWrapper(),
      })

      await waitFor(
        () => {
          expect(clearAccessTokenSpy).toHaveBeenCalled()
        },
        { timeout: 3000 }
      )

      const authState = useAuthStore.getState()
      expect(authState.isAuthenticated).toBe(false)
    })

    it('should allow user to retry login after network recovery', async () => {
      useAuthStore.getState().setAuth({
        accessToken: 'network_fail_token',
        role: 'LEADER',
        clubUUID: 'club-network',
        isAgreedTerms: true,
      })

      server.use(
        http.post(`${API_BASE}/integration/refresh-token`, () => {
          return HttpResponse.error()
        })
      )

      renderHook(() => useAuthInitialization(), {
        wrapper: createQueryWrapper(),
      })

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true })
      })

      // Verify user can attempt login again
      const authState = useAuthStore.getState()
      expect(authState.isAuthenticated).toBe(false)

      // User should be able to call login endpoints again
      // (tested in login tests)
    })
  })

  describe('Session Persistence Across Page Refresh', () => {
    it('should recover token from localStorage after page refresh', async () => {
      // Simulate persisted token in localStorage
      const persistedState = {
        state: {
          isAuthenticated: true,
          accessToken: 'persisted_token',
          role: 'LEADER' as UserRole,
          clubUUID: 'club-persisted',
          isAgreedTerms: true,
        },
        version: 0,
      }
      localStorage.setItem('auth-storage', JSON.stringify(persistedState))

      // Re-initialize auth store from localStorage
      useAuthStore.getState().reset()
      // Trigger rehydration (Zustand persist does this automatically)
      // For testing, manually set the state
      useAuthStore.setState(persistedState.state)

      server.use(
        http.post(`${API_BASE}/integration/refresh-token`, () => {
          return HttpResponse.json({
            data: {
              accessToken: 'refreshed_after_reload',
              refreshToken: 'new_refresh',
            },
          })
        })
      )

      const setAccessTokenSpy = vi.spyOn(apiClient, 'setAccessToken')

      renderHook(() => useAuthInitialization(), {
        wrapper: createQueryWrapper(),
      })

      await waitFor(() => {
        expect(setAccessTokenSpy).toHaveBeenCalledWith('persisted_token')
        expect(setAccessTokenSpy).toHaveBeenCalledWith('refreshed_after_reload')
      })

      const authState = useAuthStore.getState()
      expect(authState.isAuthenticated).toBe(true)
      expect(authState.accessToken).toBe('refreshed_after_reload')
    })

    it('should sync apiClient with authStore on each request', async () => {
      useAuthStore.getState().setAuth({
        accessToken: 'sync_test_token',
        role: 'ADMIN',
      })

      server.use(
        http.post(`${API_BASE}/integration/refresh-token`, () => {
          return HttpResponse.json({
            data: {
              accessToken: 'synced_token',
              refreshToken: 'synced_refresh',
            },
          })
        })
      )

      renderHook(() => useAuthInitialization(), {
        wrapper: createQueryWrapper(),
      })

      await waitFor(() => {
        // Verify apiClient has the latest token
        expect(apiClient.getAccessToken()).toBe('synced_token')

        // Verify authStore has the latest token
        const authState = useAuthStore.getState()
        expect(authState.accessToken).toBe('synced_token')
      })
    })

    it('should handle multiple page refreshes correctly', async () => {
      // First session
      useAuthStore.getState().setAuth({
        accessToken: 'session_1_token',
        role: 'LEADER',
        clubUUID: 'club-session-1',
        isAgreedTerms: true,
      })

      server.use(
        http.post(`${API_BASE}/integration/refresh-token`, () => {
          return HttpResponse.json({
            data: {
              accessToken: 'session_1_refreshed',
              refreshToken: 'session_1_refresh',
            },
          })
        })
      )

      const { unmount } = renderHook(() => useAuthInitialization(), {
        wrapper: createQueryWrapper(),
      })

      await waitFor(() => {
        const authState = useAuthStore.getState()
        expect(authState.accessToken).toBe('session_1_refreshed')
      })

      // Simulate page refresh (unmount and remount)
      unmount()

      // Second session (simulating page refresh)
      server.use(
        http.post(`${API_BASE}/integration/refresh-token`, () => {
          return HttpResponse.json({
            data: {
              accessToken: 'session_2_refreshed',
              refreshToken: 'session_2_refresh',
            },
          })
        })
      )

      const { unmount: unmount2 } = renderHook(() => useAuthInitialization(), {
        wrapper: createQueryWrapper(),
      })

      await waitFor(() => {
        const authState = useAuthStore.getState()
        expect(authState.accessToken).toBe('session_2_refreshed')
      })

      unmount2()
    })
  })
})
