import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@test/mocks/server'
import { getMyProfile, changeProfile, checkProfileDuplication } from '../profileApi'

const API_BASE = 'https://api.donggurami.net'

describe('Profile API', () => {
  describe('getMyProfile', () => {
    it('should return my profile', async () => {
      const result = await getMyProfile()

      expect(result.message).toBe('프로필 조회 성공')
      expect(result.data.userName).toBe('테스트 사용자')
      expect(result.data.studentNumber).toBe('20231234')
      expect(result.data.major).toBe('컴퓨터공학과')
    })

    it('should throw error when not authenticated', async () => {
      server.use(
        http.get(`${API_BASE}/profiles/me`, () => {
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

      await expect(getMyProfile()).rejects.toThrow()
    })
  })

  describe('changeProfile', () => {
    it('should change profile', async () => {
      const request = {
        userPw: 'password123',
        userName: '수정된사용자',
        studentNumber: '20231234',
        userHp: '01098765432',
        major: '컴퓨터공학과',
      }

      const result = await changeProfile(request)

      expect(result.message).toBe('프로필 수정 성공')
    })

    it('should throw error on invalid data', async () => {
      server.use(
        http.patch(`${API_BASE}/profiles/change`, () => {
          return HttpResponse.json(
            {
              exception: 'ValidationException',
              code: 'VAL-400',
              message: '유효하지 않은 데이터입니다',
              status: 400,
              error: 'Bad Request',
              additionalData: null,
            },
            { status: 400 }
          )
        })
      )

      const request = {
        userPw: '',
        userName: '',
        studentNumber: '',
        userHp: '',
        major: '',
      }

      await expect(changeProfile(request)).rejects.toThrow()
    })
  })

  describe('checkProfileDuplication', () => {
    it('should return not duplicate', async () => {
      const request = {
        userName: '테스트사용자',
        studentNumber: '20231234',
        userHp: '01012345678',
      }

      const result = await checkProfileDuplication(request)

      expect(result.message).toBe('중복 확인 성공')
      expect(result.data.exists).toBe(false)
    })

    it('should return duplicate when profile exists', async () => {
      server.use(
        http.post(`${API_BASE}/profiles/duplication-check`, () => {
          return HttpResponse.json({
            message: '중복 확인 성공',
            data: {
              exists: true,
              classification: 'MEMBER',
              inTargetClub: false,
              clubUUIDs: [],
              targetClubUUID: null,
              profileId: 1,
            },
          })
        })
      )

      const request = {
        userName: '테스트사용자',
        studentNumber: '20231234',
        userHp: '01012345678',
      }

      const result = await checkProfileDuplication(request)
      expect(result.data.exists).toBe(true)
    })
  })
})
