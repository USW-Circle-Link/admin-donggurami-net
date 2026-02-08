import { describe, it, expect } from 'vitest'
import {
  noticeListItemSchema,
  noticeListResponseSchema,
  noticeDetailSchema,
  createNoticeRequestSchema,
  updateNoticeRequestSchema,
} from '../noticeSchemas'

describe('Notice Validation Schemas', () => {
  describe('noticeListItemSchema', () => {
    it('should validate correct notice list item', () => {
      const validData = {
        noticeUUID: '550e8400-e29b-41d4-a716-446655440000',
        noticeTitle: '공지사항 제목',
        noticeCreatedAt: '2023-01-01T00:00:00',
        authorName: '관리자',
      }

      const result = noticeListItemSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should accept item without optional fields', () => {
      const validData = {
        noticeUUID: '550e8400-e29b-41d4-a716-446655440000',
        noticeTitle: '공지사항 제목',
        noticeCreatedAt: '2023-01-01T00:00:00',
        authorName: '관리자',
      }

      const result = noticeListItemSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe('noticeListResponseSchema', () => {
    it('should validate correct paginated response', () => {
      const validData = {
        content: [
          {
            noticeUUID: '550e8400-e29b-41d4-a716-446655440000',
            noticeTitle: '공지사항',
            noticeCreatedAt: '2023-01-01T00:00:00',
            authorName: '관리자',
          },
        ],
        totalPages: 5,
        totalElements: 50,
        currentPage: 0,
      }

      const result = noticeListResponseSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should accept empty content array', () => {
      const validData = {
        content: [],
        totalPages: 0,
        totalElements: 0,
        currentPage: 0,
      }

      const result = noticeListResponseSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe('noticeDetailSchema', () => {
    it('should validate correct notice detail', () => {
      const validData = {
        noticeUUID: '550e8400-e29b-41d4-a716-446655440000',
        noticeTitle: '공지사항 제목',
        noticeContent: '공지사항 내용입니다.',
        noticePhotos: ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'],
        noticeCreatedAt: '2023-01-01T00:00:00',
        authorName: '관리자',
      }

      const result = noticeDetailSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should accept empty noticePhotos array', () => {
      const validData = {
        noticeUUID: '550e8400-e29b-41d4-a716-446655440000',
        noticeTitle: '공지사항 제목',
        noticeContent: '공지사항 내용입니다.',
        noticePhotos: [],
        noticeCreatedAt: '2023-01-01T00:00:00',
        authorName: '관리자',
      }

      const result = noticeDetailSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe('createNoticeRequestSchema', () => {
    it('should validate correct create notice request', () => {
      const validData = {
        noticeTitle: '새 공지사항',
        noticeContent: '공지사항 내용입니다.',
        photoOrders: [1, 2],
      }

      const result = createNoticeRequestSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject empty noticeTitle', () => {
      const invalidData = {
        noticeTitle: '',
        noticeContent: '공지사항 내용입니다.',
        photoOrders: [],
      }

      const result = createNoticeRequestSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject noticeTitle over 200 characters', () => {
      const invalidData = {
        noticeTitle: 'a'.repeat(201),
        noticeContent: '공지사항 내용입니다.',
        photoOrders: [],
      }

      const result = createNoticeRequestSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject empty noticeContent', () => {
      const invalidData = {
        noticeTitle: '공지사항 제목',
        noticeContent: '',
        photoOrders: [],
      }

      const result = createNoticeRequestSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject noticeContent over 3000 characters', () => {
      const invalidData = {
        noticeTitle: '공지사항 제목',
        noticeContent: 'a'.repeat(3001),
        photoOrders: [],
      }

      const result = createNoticeRequestSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject photoOrders with more than 5 items', () => {
      const invalidData = {
        noticeTitle: '공지사항 제목',
        noticeContent: '공지사항 내용입니다.',
        photoOrders: [1, 2, 3, 4, 5, 6],
      }

      const result = createNoticeRequestSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject photoOrders with values outside 1-5', () => {
      const invalidData = {
        noticeTitle: '공지사항 제목',
        noticeContent: '공지사항 내용입니다.',
        photoOrders: [0, 6],
      }

      const result = createNoticeRequestSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('updateNoticeRequestSchema', () => {
    it('should validate correct update notice request', () => {
      const validData = {
        noticeTitle: '수정된 공지사항',
        noticeContent: '수정된 내용입니다.',
        photoOrders: [1, 2, 3],
      }

      const result = updateNoticeRequestSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })
})
