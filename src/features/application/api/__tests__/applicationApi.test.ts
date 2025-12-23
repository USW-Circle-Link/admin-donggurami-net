import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@test/mocks/server'
import { checkCanApply, getGoogleFormUrl, submitApplication } from '../applicationApi'

const API_BASE = 'https://api.donggurami.net'

describe('Application API', () => {
  const clubUUID = 'test-club-uuid'

  describe('checkCanApply', () => {
    it('should return true when user can apply', async () => {
      const result = await checkCanApply(clubUUID)

      expect(result.message).toBe('지원 가능 여부 확인 성공')
      expect(result.data).toBe(true)
    })

    it('should return false when user cannot apply', async () => {
      server.use(
        http.get(`${API_BASE}/apply/can-apply/:clubUUID`, () => {
          return HttpResponse.json({
            message: '지원 불가',
            data: false,
          })
        })
      )

      const result = await checkCanApply(clubUUID)
      expect(result.data).toBe(false)
    })

    it('should throw error on server error', async () => {
      server.use(
        http.get(`${API_BASE}/apply/can-apply/:clubUUID`, () => {
          return HttpResponse.json(
            {
              exception: 'ServerException',
              code: 'SRV-500',
              message: '서버 오류',
              status: 500,
              error: 'Internal Server Error',
              additionalData: null,
            },
            { status: 500 }
          )
        })
      )

      await expect(checkCanApply(clubUUID)).rejects.toThrow()
    })
  })

  describe('getGoogleFormUrl', () => {
    it('should return google form URL', async () => {
      const result = await getGoogleFormUrl(clubUUID)

      expect(result.message).toBe('구글 폼 URL 조회 성공')
      expect(result.data).toBe('https://forms.google.com/test-form')
    })

    it('should throw error when club not found', async () => {
      server.use(
        http.get(`${API_BASE}/apply/:clubUUID`, () => {
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

      await expect(getGoogleFormUrl(clubUUID)).rejects.toThrow()
    })
  })

  describe('submitApplication', () => {
    it('should submit application successfully', async () => {
      const result = await submitApplication(clubUUID)

      expect(result.message).toBe('지원서 제출 성공')
      expect(result.data).toBeNull()
    })

    it('should throw error when already applied', async () => {
      server.use(
        http.post(`${API_BASE}/apply/:clubUUID`, () => {
          return HttpResponse.json(
            {
              exception: 'ApplicationException',
              code: 'APL-409',
              message: '이미 지원한 동아리입니다',
              status: 409,
              error: 'Conflict',
              additionalData: null,
            },
            { status: 409 }
          )
        })
      )

      await expect(submitApplication(clubUUID)).rejects.toThrow()
    })
  })
})
