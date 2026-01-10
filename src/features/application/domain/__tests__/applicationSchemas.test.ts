import { describe, it, expect } from 'vitest'
import { canApplyResponseSchema, googleFormUrlResponseSchema } from '../applicationSchemas'

describe('Application Schemas', () => {
  describe('canApplyResponseSchema', () => {
    it('should validate true', () => {
      const result = canApplyResponseSchema.safeParse(true)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBe(true)
      }
    })

    it('should validate false', () => {
      const result = canApplyResponseSchema.safeParse(false)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBe(false)
      }
    })

    it('should reject non-boolean values', () => {
      const result = canApplyResponseSchema.safeParse('true')
      expect(result.success).toBe(false)
    })

    it('should reject null', () => {
      const result = canApplyResponseSchema.safeParse(null)
      expect(result.success).toBe(false)
    })
  })

  describe('googleFormUrlResponseSchema', () => {
    it('should validate valid URL string', () => {
      const result = googleFormUrlResponseSchema.safeParse('https://forms.google.com/test')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBe('https://forms.google.com/test')
      }
    })

    it('should validate empty string', () => {
      const result = googleFormUrlResponseSchema.safeParse('')
      expect(result.success).toBe(true)
    })

    it('should reject non-string values', () => {
      const result = googleFormUrlResponseSchema.safeParse(123)
      expect(result.success).toBe(false)
    })

    it('should reject null', () => {
      const result = googleFormUrlResponseSchema.safeParse(null)
      expect(result.success).toBe(false)
    })
  })
})
