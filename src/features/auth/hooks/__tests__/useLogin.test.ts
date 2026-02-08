import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@test/mocks/server'
import { createQueryWrapper } from '@test/utils/testUtils'
import { useLogin } from '../useLogin'
import { useAuthStore } from '../../store/authStore'

const API_BASE = 'https://api.donggurami.net'

describe('useLogin', () => {
  beforeEach(() => {
    useAuthStore.getState().reset()
  })

  it('should successfully login leader and update auth store', async () => {
    server.use(
      http.post(`${API_BASE}/auth/login`, () => {
        return HttpResponse.json({
          message: '로그인 성공',
          data: {
            accessToken: 'mock_access_token',
            refreshToken: 'mock_refresh_token',
            role: 'LEADER',
            clubuuid: '550e8400-e29b-41d4-a716-446655440000',
            isAgreedTerms: true,
          },
        })
      })
    )

    const { result } = renderHook(() => useLogin(), {
      wrapper: createQueryWrapper(),
    })

    result.current.mutate({
      account: 'testleader',
      password: 'password123',
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const authState = useAuthStore.getState()
    expect(authState.isAuthenticated).toBe(true)
    expect(authState.accessToken).toBe('mock_access_token')
    expect(authState.role).toBe('LEADER')
    expect(authState.clubUUID).toBe('550e8400-e29b-41d4-a716-446655440000')
    expect(authState.isAgreedTerms).toBe(true)
  })

  it('should successfully login admin and update auth store', async () => {
    server.use(
      http.post(`${API_BASE}/auth/login`, () => {
        return HttpResponse.json({
          message: '로그인 성공',
          data: {
            accessToken: 'admin_access_token',
            refreshToken: 'admin_refresh_token',
            role: 'ADMIN',
          },
        })
      })
    )

    const { result } = renderHook(() => useLogin(), {
      wrapper: createQueryWrapper(),
    })

    result.current.mutate({
      account: 'admin',
      password: 'adminpw12', // At least 8 characters
      clientId: 'client123',
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const authState = useAuthStore.getState()
    expect(authState.isAuthenticated).toBe(true)
    expect(authState.accessToken).toBe('admin_access_token')
    expect(authState.role).toBe('ADMIN')
  })

  it('should successfully login user with optional fields', async () => {
    server.use(
      http.post(`${API_BASE}/auth/login`, () => {
        return HttpResponse.json({
          message: '로그인 성공',
          data: {
            accessToken: 'user_access_token',
            refreshToken: 'user_refresh_token',
            role: 'USER',
          },
        })
      })
    )

    const { result } = renderHook(() => useLogin(), {
      wrapper: createQueryWrapper(),
    })

    result.current.mutate({
      account: 'testuser',
      password: 'password123',
      fcmToken: 'fcm_token_string',
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const authState = useAuthStore.getState()
    expect(authState.isAuthenticated).toBe(true)
    expect(authState.accessToken).toBe('user_access_token')
    expect(authState.role).toBe('USER')
  })

  it('should handle login failure', async () => {
    server.use(
      http.post(`${API_BASE}/auth/login`, () => {
        return HttpResponse.json(
          {
            exception: 'UserException',
            code: 'USR-211',
            message: '아이디 혹은 비밀번호가 일치하지 않습니다',
            status: 401,
            error: 'Unauthorized',
            additionalData: null,
          },
          { status: 401 }
        )
      })
    )

    const { result } = renderHook(() => useLogin(), {
      wrapper: createQueryWrapper(),
    })

    result.current.mutate({
      account: 'wrong',
      password: 'wrong',
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    const authState = useAuthStore.getState()
    expect(authState.isAuthenticated).toBe(false)
  })

  it('should handle validation error for invalid account', async () => {
    const { result } = renderHook(() => useLogin(), {
      wrapper: createQueryWrapper(),
    })

    result.current.mutate({
      account: 'ab', // Too short
      password: 'password123',
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    const authState = useAuthStore.getState()
    expect(authState.isAuthenticated).toBe(false)
  })

  it('should handle validation error for invalid password', async () => {
    const { result } = renderHook(() => useLogin(), {
      wrapper: createQueryWrapper(),
    })

    result.current.mutate({
      account: 'testuser',
      password: 'short', // Too short
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    const authState = useAuthStore.getState()
    expect(authState.isAuthenticated).toBe(false)
  })
})
