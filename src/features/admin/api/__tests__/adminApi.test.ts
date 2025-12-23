import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@test/mocks/server'
import {
  getAdminClubs,
  getAdminClub,
  createClub,
  deleteClub,
  checkLeaderAccount,
  checkClubName,
  getAdminCategories,
  createCategory,
  deleteCategory,
  getFloorPhoto,
} from '../adminApi'

const API_BASE = 'https://api.donggurami.net'

describe('Admin API', () => {
  describe('getAdminClubs', () => {
    it('should return clubs list', async () => {
      const result = await getAdminClubs()

      expect(result.message).toBe('동아리 목록 조회 성공')
      expect(result.data.content).toBeDefined()
    })

    it('should support pagination', async () => {
      const result = await getAdminClubs({ page: 0, size: 10 })

      expect(result.message).toBe('동아리 목록 조회 성공')
    })
  })

  describe('getAdminClub', () => {
    it('should return club detail', async () => {
      const result = await getAdminClub('club-1')

      expect(result.message).toBe('동아리 상세 조회 성공')
      expect(result.data.clubName).toBe('테스트 동아리')
    })

    it('should throw error when club not found', async () => {
      server.use(
        http.get(`${API_BASE}/admin/clubs/:clubUUID`, () => {
          return HttpResponse.json(
            {
              exception: 'ClubException',
              code: 'CLB-404',
              message: '동아리를 찾을 수 없습니다',
              status: 404,
              error: 'Not Found',
              additionalData: null,
            },
            { status: 404 }
          )
        })
      )

      await expect(getAdminClub('invalid-uuid')).rejects.toThrow()
    })
  })

  describe('createClub', () => {
    it('should create a new club', async () => {
      const request = {
        clubName: '새 동아리',
        leaderAccount: 'newleader',
        leaderPw: 'Password1!',
        leaderPwConfirm: 'Password1!',
        department: '학술' as const,
        adminPw: 'adminpassword',
        clubRoomNumber: '101호',
      }

      const result = await createClub(request)

      expect(result.message).toBe('동아리 생성 성공')
      expect(result.data).toBe('new-club-uuid')
    })
  })

  describe('deleteClub', () => {
    it('should delete a club', async () => {
      const request = { adminPw: 'adminpassword' }

      const result = await deleteClub('club-1', request)

      expect(result.message).toBe('동아리 삭제 성공')
      expect(result.data).toBeNull()
    })
  })

  describe('checkLeaderAccount', () => {
    it('should return success when account is available', async () => {
      const result = await checkLeaderAccount('newaccount')

      expect(result.message).toBe('아이디 사용 가능')
    })

    it('should throw error when account is duplicate', async () => {
      server.use(
        http.get(`${API_BASE}/admin/clubs/leader/check`, () => {
          return HttpResponse.json(
            {
              exception: 'DuplicateException',
              code: 'DUP-409',
              message: '이미 사용 중인 아이디입니다',
              status: 409,
              error: 'Conflict',
              additionalData: null,
            },
            { status: 409 }
          )
        })
      )

      await expect(checkLeaderAccount('existingaccount')).rejects.toThrow()
    })
  })

  describe('checkClubName', () => {
    it('should return success when name is available', async () => {
      const result = await checkClubName('새동아리')

      expect(result.message).toBe('이름 사용 가능')
    })
  })

  describe('getAdminCategories', () => {
    it('should return categories', async () => {
      const result = await getAdminCategories()

      expect(result.message).toBe('카테고리 조회 성공')
      expect(result.data).toHaveLength(2)
      expect(result.data[0].clubCategoryName).toBe('IT')
    })
  })

  describe('createCategory', () => {
    it('should create a new category', async () => {
      const request = { clubCategoryName: '새 카테고리' }

      const result = await createCategory(request)

      expect(result.message).toBe('카테고리 생성 성공')
      expect(result.data.clubCategoryName).toBe('새 카테고리')
    })
  })

  describe('deleteCategory', () => {
    it('should delete a category', async () => {
      const result = await deleteCategory('cat-1')

      expect(result.message).toBe('카테고리 삭제 성공')
    })
  })

  describe('getFloorPhoto', () => {
    it('should return floor photo', async () => {
      const result = await getFloorPhoto('B1')

      expect(result.message).toBe('층 사진 조회 성공')
      expect(result.data.floor).toBe('B1')
      expect(result.data.presignedUrl).toBeDefined()
    })
  })
})
