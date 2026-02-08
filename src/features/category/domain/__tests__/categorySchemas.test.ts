import { describe, it, expect } from 'vitest'
import {
  categorySchema,
  createCategoryRequestSchema,
} from '../categorySchemas'

describe('Category Validation Schemas', () => {
  describe('categorySchema', () => {
    it('should validate correct category', () => {
      const validData = {
        clubCategoryUUID: '550e8400-e29b-41d4-a716-446655440000',
        clubCategoryName: '학술',
      }

      const result = categorySchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid UUID', () => {
      const invalidData = {
        clubCategoryUUID: 'not-a-uuid',
        clubCategoryName: '학술',
      }

      const result = categorySchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject empty clubCategoryName', () => {
      const invalidData = {
        clubCategoryUUID: '550e8400-e29b-41d4-a716-446655440000',
        clubCategoryName: '',
      }

      const result = categorySchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject clubCategoryName over 20 characters', () => {
      const invalidData = {
        clubCategoryUUID: '550e8400-e29b-41d4-a716-446655440000',
        clubCategoryName: 'a'.repeat(21),
      }

      const result = categorySchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('createCategoryRequestSchema', () => {
    it('should validate correct create category request', () => {
      const validData = {
        clubCategoryName: '체육',
      }

      const result = createCategoryRequestSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject empty clubCategoryName', () => {
      const invalidData = {
        clubCategoryName: '',
      }

      const result = createCategoryRequestSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('카테고리명은 필수입니다.')
      }
    })

    it('should reject clubCategoryName over 20 characters', () => {
      const invalidData = {
        clubCategoryName: 'a'.repeat(21),
      }

      const result = createCategoryRequestSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('카테고리명은 20자 이하여야 합니다.')
      }
    })

    it('should accept clubCategoryName with exactly 20 characters', () => {
      const validData = {
        clubCategoryName: 'a'.repeat(20),
      }

      const result = createCategoryRequestSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should accept clubCategoryName with 1 character', () => {
      const validData = {
        clubCategoryName: 'a',
      }

      const result = createCategoryRequestSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })
})
