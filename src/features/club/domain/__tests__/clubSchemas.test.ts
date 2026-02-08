import { describe, it, expect } from 'vitest'
import {
  clubListResponseSchema,
  clubCategoryResponseSchema,
  clubListByCategoryResponseSchema,
  clubIntroResponseSchema,
  clubSimpleResponseSchema,
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
        leaderHp: '01012345678',
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
        leaderHp: '01012345678',
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
        leaderHp: '01012345678',
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

  describe('clubListByCategoryResponseSchema', () => {
    it('should validate correct category with clubs response', () => {
      const validData = {
        clubCategoryUUID: '550e8400-e29b-41d4-a716-446655440000',
        clubCategoryName: '학술',
        clubs: [
          {
            clubUUID: '550e8400-e29b-41d4-a716-446655440001',
            clubName: '코딩 동아리',
            mainPhotoUrl: 'https://example.com/photo.jpg',
            department: '학술',
            hashtags: ['코딩'],
            memberCount: 30,
            leaderName: '홍길동',
            leaderHp: '01012345678',
            recruitmentStatus: 'OPEN',
          },
        ],
      }

      const result = clubListByCategoryResponseSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should accept empty clubs array', () => {
      const validData = {
        clubCategoryUUID: '550e8400-e29b-41d4-a716-446655440000',
        clubCategoryName: '학술',
        clubs: [],
      }

      const result = clubListByCategoryResponseSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe('clubIntroResponseSchema', () => {
    it('should validate correct club intro response', () => {
      const validData = {
        clubUUID: '550e8400-e29b-41d4-a716-446655440000',
        mainPhoto: 'https://example.com/main.jpg',
        infoPhotos: ['https://example.com/photo1.jpg'],
        clubName: '테스트 동아리',
        leaderName: '홍길동',
        leaderHp: '01012345678',
        clubInsta: 'https://instagram.com/test',
        clubInfo: '동아리 소개글입니다.',
        recruitmentStatus: 'OPEN',
        googleFormUrl: 'https://forms.google.com/test',
        clubHashtags: ['코딩', '개발'],
        clubCategoryNames: ['학술'],
        clubRoomNumber: 'B101',
        clubRecruitment: '모집 공고문입니다.',
      }

      const result = clubIntroResponseSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate with CLOSE recruitment status', () => {
      const validData = {
        clubUUID: '550e8400-e29b-41d4-a716-446655440000',
        mainPhoto: null,
        infoPhotos: [],
        clubName: '테스트 동아리',
        leaderName: '홍길동',
        leaderHp: '01012345678',
        clubInsta: null,
        clubInfo: null,
        recruitmentStatus: 'CLOSE',
        googleFormUrl: null,
        clubHashtags: [],
        clubCategoryNames: [],
        clubRoomNumber: 'B101',
        clubRecruitment: null,
      }

      const result = clubIntroResponseSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid recruitment status', () => {
      const invalidData = {
        clubUUID: '550e8400-e29b-41d4-a716-446655440000',
        mainPhoto: null,
        infoPhotos: [],
        clubName: '테스트 동아리',
        leaderName: '홍길동',
        leaderHp: '01012345678',
        clubInsta: null,
        clubInfo: null,
        recruitmentStatus: 'INVALID',
        googleFormUrl: null,
        clubHashtags: [],
        clubCategoryNames: [],
        clubRoomNumber: 'B101',
        clubRecruitment: null,
      }

      const result = clubIntroResponseSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('clubSimpleResponseSchema', () => {
    it('should validate correct simple club response', () => {
      const validData = {
        clubUUID: '550e8400-e29b-41d4-a716-446655440000',
        clubName: '테스트 동아리',
        mainPhoto: 'https://example.com/photo.jpg',
      }

      const result = clubSimpleResponseSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should accept null mainPhoto', () => {
      const validData = {
        clubUUID: '550e8400-e29b-41d4-a716-446655440000',
        clubName: '테스트 동아리',
        mainPhoto: null,
      }

      const result = clubSimpleResponseSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })
})
