import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '../authStore'

describe('Auth Store', () => {
  beforeEach(() => {
    // Reset store before each test
    useAuthStore.getState().reset()
  })

  describe('Initial State', () => {
    it('should have initial unauthenticated state', () => {
      const state = useAuthStore.getState()

      expect(state.isAuthenticated).toBe(false)
      expect(state.accessToken).toBeNull()
      expect(state.role).toBeNull()
      expect(state.clubUUID).toBeNull()
      expect(state.isAgreedTerms).toBeNull()
    })
  })

  describe('setAuth', () => {
    it('should set authenticated state for LEADER login', () => {
      const { setAuth } = useAuthStore.getState()

      setAuth({
        accessToken: 'test_token',
        role: 'LEADER',
        clubUUID: '550e8400-e29b-41d4-a716-446655440000',
        isAgreedTerms: true,
      })

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.accessToken).toBe('test_token')
      expect(state.role).toBe('LEADER')
      expect(state.clubUUID).toBe('550e8400-e29b-41d4-a716-446655440000')
      expect(state.isAgreedTerms).toBe(true)
    })

    it('should set ADMIN role correctly without clubUUID and isAgreedTerms', () => {
      const { setAuth } = useAuthStore.getState()

      setAuth({
        accessToken: 'admin_token',
        role: 'ADMIN',
      })

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.accessToken).toBe('admin_token')
      expect(state.role).toBe('ADMIN')
      expect(state.clubUUID).toBeNull()
      expect(state.isAgreedTerms).toBeNull()
    })
  })

  describe('clearAuth', () => {
    it('should clear auth state on logout', () => {
      const { setAuth, clearAuth } = useAuthStore.getState()

      setAuth({
        accessToken: 'test_token',
        role: 'LEADER',
        clubUUID: '550e8400-e29b-41d4-a716-446655440000',
        isAgreedTerms: true,
      })

      clearAuth()

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
      expect(state.accessToken).toBeNull()
      expect(state.role).toBeNull()
      expect(state.clubUUID).toBeNull()
      expect(state.isAgreedTerms).toBeNull()
    })
  })

  describe('updateAccessToken', () => {
    it('should update only access token', () => {
      const { setAuth, updateAccessToken } = useAuthStore.getState()

      setAuth({
        accessToken: 'old_token',
        role: 'LEADER',
        clubUUID: '550e8400-e29b-41d4-a716-446655440000',
        isAgreedTerms: true,
      })

      updateAccessToken('new_token')

      const state = useAuthStore.getState()
      expect(state.accessToken).toBe('new_token')
      expect(state.role).toBe('LEADER') // unchanged
      expect(state.clubUUID).toBe('550e8400-e29b-41d4-a716-446655440000') // unchanged
    })
  })

  describe('reset', () => {
    it('should reset store to initial state', () => {
      const { setAuth, reset } = useAuthStore.getState()

      setAuth({
        accessToken: 'test_token',
        role: 'LEADER',
        clubUUID: '550e8400-e29b-41d4-a716-446655440000',
        isAgreedTerms: true,
      })

      reset()

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
      expect(state.accessToken).toBeNull()
      expect(state.role).toBeNull()
      expect(state.clubUUID).toBeNull()
      expect(state.isAgreedTerms).toBeNull()
    })
  })
})
