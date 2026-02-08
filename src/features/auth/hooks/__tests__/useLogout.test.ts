import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@test/mocks/server'
import { createQueryWrapper } from '@test/utils/testUtils'
import { useLogout } from '../useLogout'
import { useAuthStore } from '../../store/authStore'
import { setAccessToken, getAccessToken } from '@shared/api/apiClient'

const API_BASE = 'https://api.donggurami.net'

describe('useLogout', () => {
  beforeEach(() => {
    // Set up authenticated state
    useAuthStore.getState().setAuth({
      accessToken: 'test_token',
      role: 'LEADER',
      clubUUID: '550e8400-e29b-41d4-a716-446655440000',
      isAgreedTerms: true,
    })
    setAccessToken('test_token')
  })

  it('should clear auth state on successful logout', async () => {
    const { result } = renderHook(() => useLogout(), {
      wrapper: createQueryWrapper(),
    })

    result.current.mutate()

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    // Verify auth store was cleared
    const authState = useAuthStore.getState()
    expect(authState.isAuthenticated).toBe(false)
    expect(authState.accessToken).toBeNull()
    expect(authState.role).toBeNull()

    // Verify access token was cleared
    expect(getAccessToken()).toBeNull()
  })

  it('should clear auth state even on logout error', async () => {
    server.use(
      http.post(`${API_BASE}/auth/logout`, () => {
        return HttpResponse.json({ message: 'Server error' }, { status: 500 })
      })
    )

    const { result } = renderHook(() => useLogout(), {
      wrapper: createQueryWrapper(),
    })

    result.current.mutate()

    await waitFor(() => expect(result.current.isError).toBe(true))

    // Auth should still be cleared even on error
    const authState = useAuthStore.getState()
    expect(authState.isAuthenticated).toBe(false)
    expect(getAccessToken()).toBeNull()
  })
})
