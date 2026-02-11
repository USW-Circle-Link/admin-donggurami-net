import { describe, it, expect, beforeEach, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@test/mocks/server'
import { apiClient, setAccessToken } from '@shared/api/apiClient'
import {
  getClubDetail,
  updateClubInfo,
  getLeaderCategories,
  toggleRecruitment,
  getClubMembers,
  deleteClubMembers,
  getApplicants,
  updateApplicationStatus,
  agreeTerms,
} from '../clubLeaderApi'

const API_BASE = 'https://api.donggurami.net'

describe('Club Leader API', () => {
  const clubUUID = 'test-club-uuid'

  beforeEach(() => {
    // Set a mock access token for all tests
    setAccessToken('mock_access_token')
  })

  describe('getClubDetail', () => {
    it('should return club detail', async () => {
      const result = await getClubDetail(clubUUID)

      expect(result.message).toBe('동아리 상세 조회 성공')
      expect(result.data.clubInfo).toBe('테스트 동아리 소개입니다.')
      expect(result.data.clubRecruitment).toBeDefined()
    })

    it('should throw error on unauthorized', async () => {
      server.use(
        http.get(`${API_BASE}/clubs/:clubUUID`, () => {
          return HttpResponse.json(
            {
              exception: 'AuthException',
              code: 'AUTH-401',
              message: '인증되지 않은 사용자입니다',
              status: 401,
              error: 'Unauthorized',
              additionalData: null,
            },
            { status: 401 }
          )
        })
      )

      await expect(getClubDetail(clubUUID)).rejects.toThrow()
    })
  })

  describe('updateClubInfo', () => {
    it('should update club info', async () => {
      // Mock apiClient.put directly for this test due to MSW + FormData + Node.js issue
      const putSpy = vi.spyOn(apiClient, 'put').mockResolvedValueOnce({
        data: {
          message: '동아리 정보 수정 성공',
          data: null,
        },
      } as any)

      const request = {
        clubInfo: '새로운 소개',
        recruitmentStatus: 'OPEN' as const,
        clubRecruitment: '새로운 공고',
        googleFormUrl: 'https://forms.google.com/new',
      }

      const result = await updateClubInfo(clubUUID, undefined, undefined, undefined, request)

      expect(result.message).toBe('동아리 정보 수정 성공')
      expect(result.data).toBeNull()
      expect(putSpy).toHaveBeenCalledWith(
        `/clubs/${clubUUID}`,
        expect.any(FormData),
        expect.objectContaining({
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      )

      putSpy.mockRestore()
    })
  })

  describe('getLeaderCategories', () => {
    it('should return categories', async () => {
      const result = await getLeaderCategories()

      expect(result.message).toBe('카테고리 조회 성공')
      expect(result.data).toHaveLength(2)
      expect(result.data[0].clubCategoryName).toBe('IT')
    })
  })

  describe('toggleRecruitment', () => {
    it('should toggle recruitment status', async () => {
      const result = await toggleRecruitment(clubUUID)

      expect(result.message).toBe('모집 상태 변경 성공')
      expect(result.data).toBeNull()
    })
  })

  describe('getClubMembers', () => {
    it('should return club members', async () => {
      const result = await getClubMembers(clubUUID)

      expect(result.message).toBe('회원 목록 조회 성공')
      expect(result.data).toHaveLength(1)
      expect(result.data[0].userName).toBe('테스트 회원')
    })

    it('should support sort parameter', async () => {
      const result = await getClubMembers(clubUUID, 'name,asc')

      expect(result.message).toBe('회원 목록 조회 성공')
    })
  })

  describe('deleteClubMembers', () => {
    it('should delete club members', async () => {
      const members = [{ clubMemberUUID: 'member-1' }]

      const result = await deleteClubMembers(clubUUID, members)

      expect(result.message).toBe('회원 삭제 성공')
      expect(result.data).toBeNull()
    })
  })

  describe('getApplicants', () => {
    it('should return applicants', async () => {
      const result = await getApplicants(clubUUID)

      expect(result.message).toBe('지원자 목록 조회 성공')
      expect(result.data).toHaveLength(1)
      expect(result.data[0].userName).toBe('지원자1')
    })
  })

  describe('updateApplicationStatus', () => {
    it('should update applicant status', async () => {
      const result = await updateApplicationStatus(clubUUID, 'applicant-1', { status: 'PASS' })

      expect(result.message).toBe('지원자 상태 변경 성공')
      expect(result.data).toBeNull()
    })
  })

  describe('agreeTerms', () => {
    it('should agree to terms', async () => {
      const result = await agreeTerms()

      expect(result.message).toBe('약관 동의 완료')
      expect(result.data).toBeNull()
    })
  })
})
