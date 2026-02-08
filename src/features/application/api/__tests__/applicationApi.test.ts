import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@test/mocks/server'
import { checkEligibility, submitApplication, getApplicationDetail } from '../applicationApi'
import type { SubmitApplicationRequest } from '../../domain/applicationSchemas'

const API_BASE = 'https://api.donggurami.net'

describe('Application API', () => {
  const clubUUID = 'test-club-uuid'
  const aplictUUID = 'test-aplict-uuid'

  describe('checkEligibility', () => {
    it('should return true when user is eligible', async () => {
      const result = await checkEligibility(clubUUID)

      expect(result.message).toBe('지원 가능 여부 확인 성공')
      expect(result.data).toBe(true)
    })

    it('should return false when user is not eligible', async () => {
      server.use(
        http.get(`${API_BASE}/clubs/:clubUUID/applications/eligibility`, () => {
          return HttpResponse.json({
            message: '지원 불가',
            data: false,
          })
        })
      )

      const result = await checkEligibility(clubUUID)
      expect(result.data).toBe(false)
    })

    it('should throw error on server error', async () => {
      server.use(
        http.get(`${API_BASE}/clubs/:clubUUID/applications/eligibility`, () => {
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

      await expect(checkEligibility(clubUUID)).rejects.toThrow()
    })
  })

  describe('submitApplication', () => {
    const submitData: SubmitApplicationRequest = {
      answers: [
        { questionId: 1, optionId: 1, answerText: null },
        { questionId: 2, optionId: null, answerText: 'Sample answer' },
      ],
    }

    it('should submit application successfully', async () => {
      const result = await submitApplication(clubUUID, submitData)

      expect(result.message).toBe('지원서 제출 성공')
      expect(result.data).toBeNull()
    })

    it('should throw error when already applied', async () => {
      server.use(
        http.post(`${API_BASE}/clubs/:clubUUID/applications`, () => {
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

      await expect(submitApplication(clubUUID, submitData)).rejects.toThrow()
    })
  })

  describe('getApplicationDetail', () => {
    it('should return application detail', async () => {
      const result = await getApplicationDetail(clubUUID, aplictUUID)

      expect(result.message).toBe('지원서 상세 조회 성공')
      expect(result.data).toEqual({
        aplictUUID: 'test-aplict-uuid',
        applicantName: '홍길동',
        studentNumber: '20210001',
        department: '컴퓨터공학과',
        submittedAt: '2024-01-15T10:30:00',
        status: 'WAIT',
        isRead: false,
        qnaList: [
          {
            questionId: 1,
            question: '지원 동기',
            type: 'TEXT',
            answer: '열정적으로 활동하고 싶습니다',
          },
          {
            questionId: 2,
            question: '희망 분야',
            type: 'TEXT',
            answer: null,
          },
        ],
      })
    })

    it('should throw error when application not found', async () => {
      server.use(
        http.get(`${API_BASE}/clubs/:clubUUID/applications/:aplictUUID`, () => {
          return HttpResponse.json(
            {
              exception: 'ApplicationException',
              code: 'APL-404',
              message: '지원서를 찾을 수 없습니다',
              status: 404,
              error: 'Not Found',
              additionalData: null,
            },
            { status: 404 }
          )
        })
      )

      await expect(getApplicationDetail(clubUUID, aplictUUID)).rejects.toThrow()
    })
  })
})
