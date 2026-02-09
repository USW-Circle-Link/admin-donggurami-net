import { describe, it, expect } from 'vitest'
import {
  clubListResponseSchema,
  clubCategoryResponseSchema,
} from '../clubSchemas'

describe('Club Validation Schemas', () => {
  describe('clubListResponseSchema', () => {
    it('should validate correct club list response', () => {
      const validData = {
        clubUUID: '550e8400-e29b-41d4-a716-446655440000',
        clubName: '테스트 동아리',
        mainPhotoUrl: 'https://example.com/photo.jpg',
        department: '학술',
        hashtags: ['코딩', '개발'],
        memberCount: 30,
        leaderName: '홍길동',
        leaderHp: '010123456789',
        recruitmentStatus: 'OPEN',
      }

      const result = clubListResponseSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should accept null mainPhoto', () => {
      const validData = {
        clubUUID: '550e8400-e29b-41d4-a716-446655440000',
        clubName: '테스트 동아리',
        mainPhotoUrl: null,
        department: '학술',
        hashtags: [],
        memberCount: 30,
        leaderName: '홍길동',
        leaderHp: '010123456789',
        recruitmentStatus: 'OPEN',
      }

      const result = clubListResponseSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid UUID format', () => {
      const invalidData = {
        clubUUID: 'invalid-uuid',
        clubName: '테스트 동아리',
        mainPhotoUrl: 'https://example.com/photo.jpg',
        department: '학술',
        hashtags: ['코딩'],
        memberCount: 30,
        leaderName: '홍길동',
        leaderHp: '010123456789',
        recruitmentStatus: 'OPEN',
      }

      const result = clubListResponseSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('clubCategoryResponseSchema', () => {
    it('should validate correct category response', () => {
      const validData = {
        clubCategoryUUID: '550e8400-e29b-41d4-a716-446655440000',
        clubCategoryName: '학술',
      }

      const result = clubCategoryResponseSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject empty category name', () => {
      const invalidData = {
        clubCategoryUUID: '550e8400-e29b-41d4-a716-446655440000',
        clubCategoryName: '',
      }

      const result = clubCategoryResponseSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

})
