import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@test/mocks/server'
import { createQueryWrapper } from '@test/utils/testUtils'
import { useClubLeaderLogin, useAdminLogin } from '../useLogin'
import { useAuthStore } from '../../store/authStore'

const API_BASE = 'https://api.donggurami.net'

describe('useClubLeaderLogin', () => {
  beforeEach(() => {
    useAuthStore.getState().reset()
  })

  it('should successfully login and update auth store', async () => {
    const { result } = renderHook(() => useClubLeaderLogin(), {
      wrapper: createQueryWrapper(),
    })

    result.current.mutate({
      leaderAccount: 'testleader',
      leaderPw: 'password123',
      loginType: 'LEADER',
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    // Verify auth store was updated
    const authState = useAuthStore.getState()
    expect(authState.isAuthenticated).toBe(true)
    expect(authState.accessToken).toBe('mock_access_token')
    expect(authState.role).toBe('LEADER')
  })

  it('should handle login failure', async () => {
    server.use(
      http.post(`${API_BASE}/club-leader/login`, () => {
        return HttpResponse.json(
          { message: 'Invalid credentials' },
          { status: 401 }
        )
      })
    )

    const { result } = renderHook(() => useClubLeaderLogin(), {
      wrapper: createQueryWrapper(),
    })

    result.current.mutate({
      leaderAccount: 'wrong',
      leaderPw: 'wrong',
      loginType: 'LEADER',
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    // Auth store should remain unauthenticated
    const authState = useAuthStore.getState()
    expect(authState.isAuthenticated).toBe(false)
  })
})

describe('useAdminLogin', () => {
  beforeEach(() => {
    useAuthStore.getState().reset()
  })

  it('should successfully login admin and update auth store', async () => {
    const { result } = renderHook(() => useAdminLogin(), {
      wrapper: createQueryWrapper(),
    })

    result.current.mutate({
      adminAccount: 'admin',
      adminPw: 'adminpw',
      clientId: 'client123',
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const authState = useAuthStore.getState()
    expect(authState.isAuthenticated).toBe(true)
    expect(authState.accessToken).toBe('admin_access_token')
    expect(authState.role).toBe('ADMIN')
  })

  it('should handle admin login failure', async () => {
    server.use(
      http.post(`${API_BASE}/admin/login`, () => {
        return HttpResponse.json(
          { message: 'Invalid credentials' },
          { status: 401 }
        )
      })
    )

    const { result } = renderHook(() => useAdminLogin(), {
      wrapper: createQueryWrapper(),
    })

    result.current.mutate({
      adminAccount: '',
      adminPw: '',
      clientId: '',
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    const authState = useAuthStore.getState()
    expect(authState.isAuthenticated).toBe(false)
  })
})
