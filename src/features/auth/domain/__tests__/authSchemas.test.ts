import { describe, it, expect } from 'vitest'
import {
  clubLeaderLoginSchema,
  clubLeaderLoginApiSchema,
  adminLoginSchema,
  clubLeaderLoginResponseSchema,
  adminLoginResponseSchema,
  refreshTokenResponseSchema,
} from '../authSchemas'

describe('Auth Validation Schemas', () => {
  describe('clubLeaderLoginSchema', () => {
    it('should validate correct club leader login data', () => {
      const validData = {
        leaderAccount: 'testleader',
        leaderPw: 'password123',
      }

      const result = clubLeaderLoginSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject empty leaderAccount', () => {
      const invalidData = {
        leaderAccount: '',
        leaderPw: 'password123',
      }

      const result = clubLeaderLoginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject empty leaderPw', () => {
      const invalidData = {
        leaderAccount: 'leader123',
        leaderPw: '',
      }

      const result = clubLeaderLoginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('clubLeaderLoginApiSchema', () => {
    it('should add default loginType', () => {
      const validData = {
        leaderAccount: 'testleader',
        leaderPw: 'password123',
      }

      const result = clubLeaderLoginApiSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.loginType).toBe('LEADER')
      }
    })
  })

  describe('adminLoginSchema', () => {
    it('should validate correct admin login data', () => {
      const validData = {
        adminAccount: 'admin',
        adminPw: 'adminpw',
      }

      const result = adminLoginSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate admin login with clientId', () => {
      const validData = {
        adminAccount: 'admin',
        adminPw: 'adminpw',
        clientId: 'client123',
      }

      const result = adminLoginSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject empty adminAccount', () => {
      const invalidData = {
        adminAccount: '',
        adminPw: 'adminpw',
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
      const validData = {
        accessToken: 'mock_access_token',
        refreshToken: 'mock_refresh_token',
        role: 'LEADER' as const,
        clubUUID: '550e8400-e29b-41d4-a716-446655440000',
        isAgreedTerms: true,
      }

      const result = clubLeaderLoginResponseSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid UUID', () => {
      const invalidData = {
        accessToken: 'mock_access_token',
        refreshToken: 'mock_refresh_token',
        role: 'LEADER' as const,
        clubUUID: 'invalid-uuid',
        isAgreedTerms: true,
      }

      const result = clubLeaderLoginResponseSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('adminLoginResponseSchema', () => {
    it('should validate correct admin login response', () => {
      const validData = {
        accessToken: 'admin_access_token',
        refreshToken: 'admin_refresh_token',
        role: 'ADMIN' as const,
      }

      const result = adminLoginResponseSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe('refreshTokenResponseSchema', () => {
    it('should validate correct refresh token response', () => {
      const validData = {
        accessToken: 'new_access_token',
        refreshToken: 'new_refresh_token',
      }

      const result = refreshTokenResponseSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject missing tokens', () => {
      const invalidData = {
        accessToken: 'new_access_token',
      }

      const result = refreshTokenResponseSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })
})
