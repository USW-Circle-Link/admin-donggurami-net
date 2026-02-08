import { describe, it, expect, beforeEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@test/mocks/server'
import {
  apiClient,
  setAccessToken,
  clearAccessToken,
  getAccessToken,
} from '../apiClient'
import { useAuthStore } from '@features/auth/store/authStore'

const API_BASE = 'https://api.donggurami.net'

describe('API Client - Token Refresh Interceptor', () => {
  beforeEach(() => {
    clearAccessToken()
    useAuthStore.getState().reset()
  })

  describe('Automatic Token Refresh on 401', () => {
    it('should automatically refresh token when API returns 401', async () => {
      let refreshTokenCalled = false
      let requestCount = 0

      // Mock refresh endpoint
      server.use(
        http.post(`${API_BASE}/auth/refresh`, () => {
          refreshTokenCalled = true
          return HttpResponse.json({
            data: {
              accessToken: 'new_access_token',
              refreshToken: 'new_refresh_token',
            },
          })
        }),

        // Mock API endpoint that first returns 401, then 200
        http.get(`${API_BASE}/protected-resource`, () => {
          requestCount++
          if (requestCount === 1) {
            // First request - token expired
            return HttpResponse.json(
              { message: 'Token expired' },
              { status: 401 }
            )
          } else {
            // Second request - after token refresh
            return HttpResponse.json({ data: 'protected data' })
          }
        })
      )

      // Set initial token
      setAccessToken('old_access_token')
      expect(getAccessToken()).toBe('old_access_token')

      // Make API call that triggers token refresh
      const response = await apiClient.get('/protected-resource')

      // Verify refresh was attempted
      expect(refreshTokenCalled).toBe(true)

      // Verify new token was set
      expect(getAccessToken()).toBe('new_access_token')

      // Verify API request was retried successfully
      expect(response.status).toBe(200)
      expect(response.data).toEqual({ data: 'protected data' })
      expect(requestCount).toBe(2)
    })

    it('should retry original request with new token after refresh', async () => {
      let capturedTokens: string[] = []

      server.use(
        http.post(`${API_BASE}/auth/refresh`, () => {
          return HttpResponse.json({
            data: {
              accessToken: 'refreshed_token',
              refreshToken: 'new_refresh',
            },
          })
        }),

        http.get(`${API_BASE}/api/data`, ({ request }) => {
          const authHeader = request.headers.get('Authorization')
          const token = authHeader?.replace('Bearer ', '')
          if (token) {
            capturedTokens.push(token)
          }

          // First request with old token -> 401
          if (token === 'initial_token') {
            return HttpResponse.json({ message: 'Expired' }, { status: 401 })
          }

          // Second request with new token -> 200
          return HttpResponse.json({ result: 'success' })
        })
      )

      setAccessToken('initial_token')
      const response = await apiClient.get('/api/data')

      // Verify the request was made twice with different tokens
      expect(capturedTokens).toHaveLength(2)
      expect(capturedTokens[0]).toBe('initial_token')
      expect(capturedTokens[1]).toBe('refreshed_token')

      // Verify successful response
      expect(response.status).toBe(200)
      expect(response.data).toEqual({ result: 'success' })
    })

    it('should attempt refresh when 401 occurs (even without in-memory token)', async () => {
      let refreshEndpointCalled = false

      server.use(
        http.post(`${API_BASE}/auth/refresh`, () => {
          refreshEndpointCalled = true
          return HttpResponse.json({
            data: {
              accessToken: 'refreshed_token',
              refreshToken: 'new_refresh',
            },
          })
        }),

        http.get(`${API_BASE}/public-resource`, () => {
          return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
        })
      )

      // No in-memory token
      expect(getAccessToken()).toBeNull()

      try {
        await apiClient.get('/public-resource')
        expect.fail('Should have thrown error')
      } catch (error: any) {
        // After refresh, endpoint still returns 401
        expect(error.response?.status).toBe(401)
      }

      // Verify refresh WAS attempted (interceptor always tries on 401)
      expect(refreshEndpointCalled).toBe(true)
      expect(getAccessToken()).toBe('refreshed_token')
    })
  })

  describe('Token Refresh Failure', () => {
    it('should logout and clear auth when refresh endpoint returns 401', async () => {
      let apiCallCount = 0

      server.use(
        // Refresh endpoint returns 401
        http.post(`${API_BASE}/auth/refresh`, () => {
          return HttpResponse.json(
            { message: 'Refresh token expired', code: 'TOK-002' },
            { status: 401 }
          )
        }),

        http.get(`${API_BASE}/protected-resource`, () => {
          apiCallCount++
          return HttpResponse.json({ message: 'Expired' }, { status: 401 })
        })
      )

      // Setup authenticated state
      setAccessToken('expired_token')
      useAuthStore.getState().setAuth({
        accessToken: 'expired_token',
        role: 'LEADER',
        clubUUID: 'club-123',
        isAgreedTerms: true,
      })

      // Verify authenticated before request
      expect(useAuthStore.getState().isAuthenticated).toBe(true)

      // Try to make API call
      try {
        await apiClient.get('/protected-resource')
        expect.fail('Should have thrown error')
      } catch (error: any) {
        // Should fail with refresh error
        expect(error.response?.status).toBe(401)
      }

      // Verify auth was cleared
      expect(getAccessToken()).toBeNull()
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
      expect(useAuthStore.getState().role).toBeNull()
    })

    it('should logout when refresh endpoint returns 403', async () => {
      server.use(
        http.post(`${API_BASE}/auth/refresh`, () => {
          return HttpResponse.json(
            { message: 'Forbidden', code: 'TOK-003' },
            { status: 403 }
          )
        }),

        http.get(`${API_BASE}/protected-resource`, () => {
          return HttpResponse.json({ message: 'Forbidden' }, { status: 401 })
        })
      )

      setAccessToken('forbidden_token')

      try {
        await apiClient.get('/protected-resource')
        expect.fail('Should have thrown error')
      } catch (error: any) {
        expect(error.response?.status).toBe(403)
      }

      expect(getAccessToken()).toBeNull()
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })

    it('should logout when refresh endpoint returns 500', async () => {
      server.use(
        http.post(`${API_BASE}/auth/refresh`, () => {
          return HttpResponse.json(
            { message: 'Server Error' },
            { status: 500 }
          )
        }),

        http.get(`${API_BASE}/protected-resource`, () => {
          return HttpResponse.json({ message: 'Expired' }, { status: 401 })
        })
      )

      setAccessToken('valid_token')

      try {
        await apiClient.get('/protected-resource')
        expect.fail('Should have thrown error')
      } catch (error: any) {
        expect(error.response?.status).toBe(500)
      }

      expect(getAccessToken()).toBeNull()
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })

    it('should handle network error during refresh', async () => {
      server.use(
        // Network error on refresh
        http.post(`${API_BASE}/auth/refresh`, () => {
          return HttpResponse.error()
        }),

        http.get(`${API_BASE}/protected-resource`, () => {
          return HttpResponse.json({ message: 'Expired' }, { status: 401 })
        })
      )

      setAccessToken('network_error_token')

      try {
        await apiClient.get('/protected-resource')
        expect.fail('Should have thrown network error')
      } catch (error: any) {
        // Should be network error
        expect(error.code).toBeDefined()
      }

      // Verify auth was cleared even on network error
      expect(getAccessToken()).toBeNull()
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })
  })

  describe('Refresh Retry Prevention', () => {
    it('should not retry refresh more than once per request', async () => {
      let refreshCallCount = 0
      let apiCallCount = 0

      server.use(
        http.post(`${API_BASE}/auth/refresh`, () => {
          refreshCallCount++
          // Refresh succeeds but token is still invalid
          return HttpResponse.json({
            data: {
              accessToken: 'new_token',
              refreshToken: 'new_refresh',
            },
          })
        }),

        http.get(`${API_BASE}/protected-resource`, () => {
          apiCallCount++
          // Always return 401 (even with new token)
          return HttpResponse.json({ message: 'Always expired' }, { status: 401 })
        })
      )

      setAccessToken('old_token')

      try {
        await apiClient.get('/protected-resource')
        expect.fail('Should have thrown 401 error')
      } catch (error: any) {
        expect(error.response?.status).toBe(401)
      }

      // Verify refresh was called exactly once
      expect(refreshCallCount).toBe(1)

      // Verify API was called twice (original + retry)
      expect(apiCallCount).toBe(2)

      // Verify new token was set but request still failed
      expect(getAccessToken()).toBe('new_token')
    })

    it('should retry multiple independent requests with their own refresh', async () => {
      let refreshCallCount = 0
      let requestCounters: Record<string, number> = {}

      server.use(
        http.post(`${API_BASE}/auth/refresh`, () => {
          refreshCallCount++
          return HttpResponse.json({
            data: {
              accessToken: `refreshed_token_${refreshCallCount}`,
              refreshToken: `refresh_${refreshCallCount}`,
            },
          })
        }),

        // First endpoint
        http.get(`${API_BASE}/endpoint1`, () => {
          requestCounters.endpoint1 = (requestCounters.endpoint1 || 0) + 1
          if (requestCounters.endpoint1 === 1) {
            return HttpResponse.json({}, { status: 401 })
          }
          return HttpResponse.json({ data: 'endpoint1 data' })
        }),

        // Second endpoint
        http.get(`${API_BASE}/endpoint2`, () => {
          requestCounters.endpoint2 = (requestCounters.endpoint2 || 0) + 1
          if (requestCounters.endpoint2 === 1) {
            return HttpResponse.json({}, { status: 401 })
          }
          return HttpResponse.json({ data: 'endpoint2 data' })
        })
      )

      setAccessToken('initial_token')

      // Make two independent requests
      const response1 = await apiClient.get('/endpoint1')
      const response2 = await apiClient.get('/endpoint2')

      // Both should succeed
      expect(response1.data).toEqual({ data: 'endpoint1 data' })
      expect(response2.data).toEqual({ data: 'endpoint2 data' })

      // Each should have triggered its own refresh
      expect(refreshCallCount).toBe(2)

      // Each endpoint should have been called twice
      expect(requestCounters.endpoint1).toBe(2)
      expect(requestCounters.endpoint2).toBe(2)
    })
  })

  describe('Token Synchronization', () => {
    it('should sync new token to both apiClient and authStore', async () => {
      server.use(
        http.post(`${API_BASE}/auth/refresh`, () => {
          return HttpResponse.json({
            data: {
              accessToken: 'synced_token',
              refreshToken: 'synced_refresh',
            },
          })
        }),

        http.get(`${API_BASE}/protected`, () => {
          return HttpResponse.json({}, { status: 401 })
        })
      )

      setAccessToken('initial_token')
      useAuthStore.getState().setAuth({
        accessToken: 'initial_token',
        role: 'ADMIN',
      })

      try {
        await apiClient.get('/protected')
      } catch (error) {
        // Expected to fail for test purposes
      }

      // Verify both are synced
      expect(getAccessToken()).toBe('synced_token')
      expect(useAuthStore.getState().accessToken).toBe('synced_token')
    })

    it('should clear both apiClient and authStore on refresh failure', async () => {
      server.use(
        http.post(`${API_BASE}/auth/refresh`, () => {
          return HttpResponse.json({}, { status: 401 })
        }),

        http.get(`${API_BASE}/protected`, () => {
          return HttpResponse.json({}, { status: 401 })
        })
      )

      setAccessToken('will_fail_token')
      useAuthStore.getState().setAuth({
        accessToken: 'will_fail_token',
        role: 'LEADER',
        clubUUID: 'club-123',
        isAgreedTerms: true,
      })

      try {
        await apiClient.get('/protected')
      } catch (error) {
        // Expected to fail for test purposes
      }

      // Verify both are cleared
      expect(getAccessToken()).toBeNull()
      expect(useAuthStore.getState().accessToken).toBeNull()
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })
  })

  describe('Concurrent Requests with 401', () => {
    it('should handle concurrent 401 responses', async () => {
      let refreshCallCount = 0
      const requestCounters: Record<string, number> = {
        api1: 0,
        api2: 0,
        api3: 0,
      }

      server.use(
        http.post(`${API_BASE}/auth/refresh`, () => {
          refreshCallCount++
          return HttpResponse.json({
            data: {
              accessToken: 'concurrent_token',
              refreshToken: 'concurrent_refresh',
            },
          })
        }),

        // Multiple endpoints that return 401 on first call, 200 on retry
        http.get(`${API_BASE}/api1`, () => {
          requestCounters.api1++
          if (requestCounters.api1 === 1) {
            return HttpResponse.json({}, { status: 401 })
          }
          return HttpResponse.json({ data: 'api1 success' })
        }),

        http.get(`${API_BASE}/api2`, () => {
          requestCounters.api2++
          if (requestCounters.api2 === 1) {
            return HttpResponse.json({}, { status: 401 })
          }
          return HttpResponse.json({ data: 'api2 success' })
        }),

        http.get(`${API_BASE}/api3`, () => {
          requestCounters.api3++
          if (requestCounters.api3 === 1) {
            return HttpResponse.json({}, { status: 401 })
          }
          return HttpResponse.json({ data: 'api3 success' })
        })
      )

      setAccessToken('initial_token')

      // Make multiple concurrent requests
      const promises = [
        apiClient.get('/api1').catch((e) => e),
        apiClient.get('/api2').catch((e) => e),
        apiClient.get('/api3').catch((e) => e),
      ]

      const results = await Promise.all(promises)

      // All should succeed after refresh and retry
      results.forEach((result: any) => {
        expect(result.status).toBe(200)
      })

      // Refresh should have been called
      expect(refreshCallCount).toBeGreaterThanOrEqual(1)

      // Each endpoint should have been retried
      Object.values(requestCounters).forEach((count) => {
        expect(count).toBe(2)
      })

      // New token should be set
      expect(getAccessToken()).toBe('concurrent_token')
    })
  })
})
