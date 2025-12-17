import { describe, it, expect, beforeEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@test/mocks/server'
import {
  apiClient,
  setAccessToken,
  clearAccessToken,
  getAccessToken,
} from '../apiClient'

const API_BASE = 'https://api.donggurami.net'

describe('API Client', () => {
  beforeEach(() => {
    clearAccessToken()
  })

  describe('Base Configuration', () => {
    it('should have correct base URL', () => {
      expect(apiClient.defaults.baseURL).toBe('https://api.donggurami.net')
    })

    it('should have JSON content type header', () => {
      expect(apiClient.defaults.headers['Content-Type']).toBe('application/json')
    })

    it('should have withCredentials enabled for cookies', () => {
      expect(apiClient.defaults.withCredentials).toBe(true)
    })
  })

  describe('Token Management', () => {
    it('should set access token', () => {
      setAccessToken('test-access-token')
      expect(getAccessToken()).toBe('test-access-token')
    })

    it('should clear access token', () => {
      setAccessToken('test-access-token')
      clearAccessToken()
      expect(getAccessToken()).toBeNull()
    })

    it('should return null when no token is set', () => {
      expect(getAccessToken()).toBeNull()
    })
  })

  describe('Request Interceptor', () => {
    it('should include Authorization header when access token is set', async () => {
      let capturedAuthHeader: string | undefined

      server.use(
        http.get(`${API_BASE}/test`, ({ request }) => {
          capturedAuthHeader = request.headers.get('Authorization') ?? undefined
          return HttpResponse.json({ success: true })
        })
      )

      setAccessToken('test-access-token')
      await apiClient.get('/test')

      expect(capturedAuthHeader).toBe('Bearer test-access-token')
    })

    it('should not include Authorization header when no token', async () => {
      let capturedAuthHeader: string | null = null

      server.use(
        http.get(`${API_BASE}/test`, ({ request }) => {
          capturedAuthHeader = request.headers.get('Authorization')
          return HttpResponse.json({ success: true })
        })
      )

      await apiClient.get('/test')

      expect(capturedAuthHeader).toBeNull()
    })
  })
})
