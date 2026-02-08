import { describe, it, expect } from 'vitest'
import {
  loginUnifiedSchema,
  loginUnifiedResponseSchema,
  refreshTokenResponseSchema,
  sendVerificationMailSchema,
  sendVerificationMailResponseSchema,
  confirmSignupSchema,
  confirmSignupResponseSchema,
  completeSignupSchema,
  findIdSchema,
  sendPasswordResetCodeSchema,
  verifyPasswordResetCodeSchema,
  resetPasswordSchema,
  roleEnum,
} from '../authSchemas'

describe('Auth Validation Schemas', () => {
  describe('loginUnifiedSchema', () => {
    it('should validate correct unified login data', () => {
      const validData = {
        account: 'testuser',
        password: 'password123',
      }

      const result = loginUnifiedSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate with optional fcmToken and clientId', () => {
      const validData = {
        account: 'adminuser',
        password: 'adminpass123',
        fcmToken: 'fcm_token_string',
        clientId: 'client123',
      }

      const result = loginUnifiedSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject account shorter than 5 characters', () => {
      const invalidData = {
        account: 'abc',
        password: 'password123',
      }

      const result = loginUnifiedSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject account with non-alphanumeric characters', () => {
      const invalidData = {
        account: 'test@user',
        password: 'password123',
      }

      const result = loginUnifiedSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject password shorter than 8 characters', () => {
      const invalidData = {
        account: 'testuser',
        password: 'pass',
      }

      const result = loginUnifiedSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('loginUnifiedResponseSchema', () => {
    it('should validate correct leader login response', () => {
      const validData = {
        accessToken: 'mock_access_token',
        refreshToken: 'mock_refresh_token',
        role: 'LEADER' as const,
        clubuuid: '550e8400-e29b-41d4-a716-446655440000',
        isAgreedTerms: true,
      }

      const result = loginUnifiedResponseSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate correct admin login response without clubuuid', () => {
      const validData = {
        accessToken: 'admin_access_token',
        refreshToken: 'admin_refresh_token',
        role: 'ADMIN' as const,
      }

      const result = loginUnifiedResponseSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid UUID', () => {
      const invalidData = {
        accessToken: 'mock_access_token',
        refreshToken: 'mock_refresh_token',
        role: 'LEADER' as const,
        clubuuid: 'invalid-uuid',
        isAgreedTerms: true,
      }

      const result = loginUnifiedResponseSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject invalid role', () => {
      const invalidData = {
        accessToken: 'mock_access_token',
        refreshToken: 'mock_refresh_token',
        role: 'INVALID_ROLE',
      }

      const result = loginUnifiedResponseSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
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

    it('should reject missing refreshToken', () => {
      const invalidData = {
        accessToken: 'new_access_token',
      }

      const result = refreshTokenResponseSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject missing accessToken', () => {
      const invalidData = {
        refreshToken: 'new_refresh_token',
      }

      const result = refreshTokenResponseSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('roleEnum', () => {
    it('should validate all role types', () => {
      expect(roleEnum.safeParse('USER').success).toBe(true)
      expect(roleEnum.safeParse('LEADER').success).toBe(true)
      expect(roleEnum.safeParse('ADMIN').success).toBe(true)
    })

    it('should reject invalid role', () => {
      expect(roleEnum.safeParse('INVALID').success).toBe(false)
    })
  })

  describe('sendVerificationMailSchema', () => {
    it('should validate correct email format', () => {
      const validData = { email: 'test' }
      const result = sendVerificationMailSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject email with invalid characters', () => {
      const invalidData = { email: 'test@email' }
      const result = sendVerificationMailSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('sendVerificationMailResponseSchema', () => {
    it('should validate correct response', () => {
      const validData = {
        emailToken_uuid: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@naver.com',
      }
      const result = sendVerificationMailResponseSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe('confirmSignupSchema', () => {
    it('should validate correct email', () => {
      const validData = { email: 'test@naver.com' }
      const result = confirmSignupSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe('confirmSignupResponseSchema', () => {
    it('should validate correct response with UUIDs', () => {
      const validData = {
        emailTokenUUID: '550e8400-e29b-41d4-a716-446655440000',
        signupUUID: '660e8400-e29b-41d4-a716-446655440001',
      }
      const result = confirmSignupResponseSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe('completeSignupSchema', () => {
    it('should validate correct signup data', () => {
      const validData = {
        account: 'testuser',
        password: 'Test123!@#',
        confirmPassword: 'Test123!@#',
        userName: '홍길동',
        telephone: '01012345678',
        studentNumber: '20240001',
        major: '컴퓨터공학',
      }

      const result = completeSignupSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject mismatched passwords', () => {
      const invalidData = {
        account: 'testuser',
        password: 'Test123!@#',
        confirmPassword: 'Different123!@#',
        userName: '홍길동',
        telephone: '01012345678',
        studentNumber: '20240001',
        major: '컴퓨터공학',
      }

      const result = completeSignupSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject invalid phone number format', () => {
      const invalidData = {
        account: 'testuser',
        password: 'Test123!@#',
        confirmPassword: 'Test123!@#',
        userName: '홍길동',
        telephone: '010-1234-5678',
        studentNumber: '20240001',
        major: '컴퓨터공학',
      }

      const result = completeSignupSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject invalid student number format', () => {
      const invalidData = {
        account: 'testuser',
        password: 'Test123!@#',
        confirmPassword: 'Test123!@#',
        userName: '홍길동',
        telephone: '01012345678',
        studentNumber: '2024001',
        major: '컴퓨터공학',
      }

      const result = completeSignupSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('findIdSchema', () => {
    it('should validate correct email', () => {
      const validData = { email: 'test@naver.com' }
      const result = findIdSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe('sendPasswordResetCodeSchema', () => {
    it('should validate correct data', () => {
      const validData = {
        userAccount: 'testuser',
        email: 'test@naver.com',
      }

      const result = sendPasswordResetCodeSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid account format', () => {
      const invalidData = {
        userAccount: 'te',
        email: 'test@naver.com',
      }

      const result = sendPasswordResetCodeSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('verifyPasswordResetCodeSchema', () => {
    it('should validate correct auth code', () => {
      const validData = { authCode: '123456' }
      const result = verifyPasswordResetCodeSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe('resetPasswordSchema', () => {
    it('should validate correct password reset data', () => {
      const validData = {
        password: 'NewPass123!@#',
        confirmPassword: 'NewPass123!@#',
      }

      const result = resetPasswordSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject mismatched passwords', () => {
      const invalidData = {
        password: 'NewPass123!@#',
        confirmPassword: 'Different123!@#',
      }

      const result = resetPasswordSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject password without special characters', () => {
      const invalidData = {
        password: 'NewPass123',
        confirmPassword: 'NewPass123',
      }

      const result = resetPasswordSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })
})
