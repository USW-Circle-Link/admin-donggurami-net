import { describe, it, expect } from 'vitest'
import {
  departmentSchema,
  floorTypeSchema,
  adminClubListItemSchema,
  createClubRequestSchema,
  createCategoryRequestSchema,
  floorPhotoResponseSchema,
} from '../adminSchemas'

describe('Admin Validation Schemas', () => {
  describe('departmentSchema', () => {
    it('should validate valid departments', () => {
      const departments = ['학술', '종교', '예술', '체육', '공연', '봉사']
      departments.forEach((dept) => {
        const result = departmentSchema.safeParse(dept)
        expect(result.success).toBe(true)
      })
    })

    it('should reject invalid department', () => {
      const result = departmentSchema.safeParse('invalid')
      expect(result.success).toBe(false)
    })
  })

  describe('floorTypeSchema', () => {
    it('should validate valid floor types', () => {
      const floors = ['B1', 'F1', 'F2']
      floors.forEach((floor) => {
        const result = floorTypeSchema.safeParse(floor)
        expect(result.success).toBe(true)
      })
    })

    it('should reject invalid floor type', () => {
      const result = floorTypeSchema.safeParse('F3')
      expect(result.success).toBe(false)
    })
  })

  describe('adminClubListItemSchema', () => {
    it('should validate correct club list item', () => {
      const validData = {
        clubUUID: '550e8400-e29b-41d4-a716-446655440000',
        clubName: '테스트 동아리',
        mainPhotoUrl: null,
        department: '학술',
        hashtags: ['테스트'],
        leaderName: '홍길동',
        leaderHp: '01012345678',
        memberCount: 15,
        recruitmentStatus: 'OPEN',
      }

      const result = adminClubListItemSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe('createClubRequestSchema', () => {
    it('should validate correct create club request', () => {
      const validData = {
        leaderAccount: 'leader123',
        leaderPw: 'Password1!',
        leaderPwConfirm: 'Password1!',
        clubName: '테스트동아리',
        department: '학술',
        adminPw: 'adminpw',
        clubRoomNumber: 'B101',
      }

      const result = createClubRequestSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject short leader account', () => {
      const invalidData = {
        leaderAccount: 'abc',
        leaderPw: 'Password1!',
        leaderPwConfirm: 'Password1!',
        clubName: '테스트동아리',
        department: '학술',
        adminPw: 'adminpw',
        clubRoomNumber: 'B101',
      }

      const result = createClubRequestSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject password without special characters', () => {
      const invalidData = {
        leaderAccount: 'leader123',
        leaderPw: 'Password1',
        leaderPwConfirm: 'Password1',
        clubName: '테스트동아리',
        department: '학술',
        adminPw: 'adminpw',
        clubRoomNumber: 'B101',
      }

      const result = createClubRequestSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject mismatched passwords', () => {
      const invalidData = {
        leaderAccount: 'leader123',
        leaderPw: 'Password1!',
        leaderPwConfirm: 'Password2!',
        clubName: '테스트동아리',
        department: '학술',
        adminPw: 'adminpw',
        clubRoomNumber: 'B101',
      }

      const result = createClubRequestSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject club name over 10 characters', () => {
      const invalidData = {
        leaderAccount: 'leader123',
        leaderPw: 'Password1!',
        leaderPwConfirm: 'Password1!',
        clubName: '매우긴동아리이름입니다',
        department: '학술',
        adminPw: 'adminpw',
        clubRoomNumber: 'B101',
      }

      const result = createClubRequestSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('createCategoryRequestSchema', () => {
    it('should validate correct category request', () => {
      const validData = { clubCategoryName: '스포츠' }
      const result = createCategoryRequestSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject empty category name', () => {
      const invalidData = { clubCategoryName: '' }
      const result = createCategoryRequestSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject category name over 20 characters', () => {
      const invalidData = { clubCategoryName: 'a'.repeat(21) }
      const result = createCategoryRequestSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('floorPhotoResponseSchema', () => {
    it('should validate correct floor photo response', () => {
      const validData = {
        floor: 'F1',
        presignedUrl: 'https://example.com/photo.jpg',
      }

      const result = floorPhotoResponseSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })
})
