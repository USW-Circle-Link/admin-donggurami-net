import { describe, it, expect } from 'vitest'
import {
  clubLeaderLoginSchema,
  adminLoginSchema,
  clubLeaderLoginResponseSchema,
  adminLoginResponseSchema,
  refreshTokenResponseSchema,
} from '../authSchemas'

describe('Auth Validation Schemas', () => {
  describe('clubLeaderLoginSchema', () => {
    it('should validate correct club leader login data', () => {
      const validData = {
        leaderAccount: 'asd',
        leaderPw: 'asd',
        loginType: 'LEADER' as const,
      }

      const result = clubLeaderLoginSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should add default loginType when not provided', () => {
      const validData = {
        leaderAccount: 'asd',
        leaderPw: 'asd',
      }

      const result = clubLeaderLoginSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.loginType).toBe('LEADER')
      }
    })

    it('should reject empty leaderAccount', () => {
      const invalidData = {
        leaderAccount: '',
        leaderPw: 'password123',
        loginType: 'LEADER' as const,
      }

      const result = clubLeaderLoginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject empty leaderPw', () => {
      const invalidData = {
        leaderAccount: 'leader123',
        leaderPw: '',
        loginType: 'LEADER' as const,
      }

      const result = clubLeaderLoginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject invalid loginType', () => {
      const invalidData = {
        leaderAccount: 'leader123',
        leaderPw: 'password',
        loginType: 'ADMIN' as const,
      }

      const result = clubLeaderLoginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('adminLoginSchema', () => {
    it('should validate correct admin login data with clientId', () => {
      const validData = {
        adminAccount: 'admin',
        adminPw: 'adminpw',
        clientId: 'client123',
      }

      const result = adminLoginSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate admin login data without clientId (optional)', () => {
      const validData = {
        adminAccount: 'admin',
        adminPw: 'adminpw',
      }

      const result = adminLoginSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject empty adminAccount', () => {
      const invalidData = {
        adminAccount: '',
        adminPw: 'adminpw',
        clientId: 'client123',
      }

      const result = adminLoginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject empty adminPw', () => {
      const invalidData = {
        adminAccount: 'admin',
        adminPw: '',
      }

      const result = adminLoginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('clubLeaderLoginResponseSchema', () => {
    it('should validate correct club leader login response', () => {
      const validResponse = {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'refresh_token_value',
        role: 'LEADER',
        clubUUID: '550e8400-e29b-41d4-a716-446655440000',
        isAgreedTerms: true,
      }

      const result = clubLeaderLoginResponseSchema.safeParse(validResponse)
      expect(result.success).toBe(true)
    })

    it('should reject invalid UUID format', () => {
      const invalidResponse = {
        accessToken: 'token',
        refreshToken: 'refresh',
        role: 'LEADER',
        clubUUID: 'invalid-uuid',
        isAgreedTerms: true,
      }

      const result = clubLeaderLoginResponseSchema.safeParse(invalidResponse)
      expect(result.success).toBe(false)
    })

    it('should reject non-LEADER role', () => {
      const invalidResponse = {
        accessToken: 'token',
        refreshToken: 'refresh',
        role: 'ADMIN',
        clubUUID: '550e8400-e29b-41d4-a716-446655440000',
        isAgreedTerms: true,
      }

      const result = clubLeaderLoginResponseSchema.safeParse(invalidResponse)
      expect(result.success).toBe(false)
    })

    it('should reject missing clubUUID', () => {
      const invalidResponse = {
        accessToken: 'token',
        refreshToken: 'refresh',
        role: 'LEADER',
        isAgreedTerms: true,
      }

      const result = clubLeaderLoginResponseSchema.safeParse(invalidResponse)
      expect(result.success).toBe(false)
    })
  })

  describe('adminLoginResponseSchema', () => {
    it('should validate correct admin login response', () => {
      const validResponse = {
        accessToken: 'admin_token',
        refreshToken: 'admin_refresh',
        role: 'ADMIN',
      }

      const result = adminLoginResponseSchema.safeParse(validResponse)
      expect(result.success).toBe(true)
    })

    it('should reject non-ADMIN role', () => {
      const invalidResponse = {
        accessToken: 'token',
        refreshToken: 'refresh',
        role: 'LEADER',
      }

      const result = adminLoginResponseSchema.safeParse(invalidResponse)
      expect(result.success).toBe(false)
    })

    it('should not require clubUUID or isAgreedTerms', () => {
      const validResponse = {
        accessToken: 'token',
        refreshToken: 'refresh',
        role: 'ADMIN',
      }

      const result = adminLoginResponseSchema.safeParse(validResponse)
      expect(result.success).toBe(true)
    })
  })

  describe('refreshTokenResponseSchema', () => {
    it('should validate correct refresh token response', () => {
      const validResponse = {
        accessToken: 'new_access_token',
        refreshToken: 'new_refresh_token',
      }

      const result = refreshTokenResponseSchema.safeParse(validResponse)
      expect(result.success).toBe(true)
    })

    it('should reject missing accessToken', () => {
      const invalidResponse = {
        refreshToken: 'new_refresh_token',
      }

      const result = refreshTokenResponseSchema.safeParse(invalidResponse)
      expect(result.success).toBe(false)
    })

    it('should reject missing refreshToken', () => {
      const invalidResponse = {
        accessToken: 'new_access_token',
      }

      const result = refreshTokenResponseSchema.safeParse(invalidResponse)
      expect(result.success).toBe(false)
    })
  })
})
