import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@test/mocks/server'
import {
  createForm,
  updateFormStatus,
  submitApplication,
  getApplicationDetail,
} from '../formApi'

const API_BASE = 'https://api.donggurami.net'

describe('Form Management API', () => {
  const clubId = 'test-club-uuid'
  const formId = 'test-form-uuid'
  const applicationId = 'test-application-uuid'

  describe('createForm', () => {
    it('should create a new form', async () => {
      server.use(
        http.post(`${API_BASE}/api/clubs/:clubId/forms`, () => {
          return HttpResponse.json({
            message: '폼 생성 성공',
            data: {
              formId: 'new-form-uuid',
            },
          })
        })
      )

      const request = {
        title: '2024 신입 부원 모집',
        description: '신입 부원을 모집합니다',
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-01-31T23:59:59Z',
        questions: [
          {
            sequence: 1,
            type: 'SHORT_TEXT' as const,
            content: '지원 동기를 작성해주세요',
            required: true,
          },
        ],
      }

      const result = await createForm(clubId, request)

      expect(result.message).toBe('폼 생성 성공')
      expect(result.data.formId).toBe('new-form-uuid')
    })

    it('should throw error on invalid request', async () => {
      server.use(
        http.post(`${API_BASE}/api/clubs/:clubId/forms`, () => {
          return HttpResponse.json(
            {
              exception: 'ValidationException',
              code: 'FORM-400',
              message: '유효하지 않은 폼 데이터입니다',
              status: 400,
              error: 'Bad Request',
              additionalData: null,
            },
            { status: 400 }
          )
        })
      )

      const request = {
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        questions: [],
      }

      await expect(createForm(clubId, request)).rejects.toThrow()
    })
  })

  describe('updateFormStatus', () => {
    it('should update form status to CLOSED', async () => {
      server.use(
        http.patch(`${API_BASE}/api/clubs/:clubId/forms/:formId/status`, () => {
          return HttpResponse.json({
            message: '폼 상태 변경 성공',
            data: null,
          })
        })
      )

      const request = {
        status: 'CLOSED' as const,
      }

      const result = await updateFormStatus(clubId, formId, request)

      expect(result.message).toBe('폼 상태 변경 성공')
      expect(result.data).toBeNull()
    })

    it('should update form status to PUBLISHED', async () => {
      server.use(
        http.patch(`${API_BASE}/api/clubs/:clubId/forms/:formId/status`, () => {
          return HttpResponse.json({
            message: '폼 상태 변경 성공',
            data: null,
          })
        })
      )

      const request = {
        status: 'PUBLISHED' as const,
      }

      const result = await updateFormStatus(clubId, formId, request)

      expect(result.message).toBe('폼 상태 변경 성공')
      expect(result.data).toBeNull()
    })

    it('should throw error on unauthorized', async () => {
      server.use(
        http.patch(`${API_BASE}/api/clubs/:clubId/forms/:formId/status`, () => {
          return HttpResponse.json(
            {
              exception: 'AuthException',
              code: 'AUTH-403',
              message: '권한이 없습니다',
              status: 403,
              error: 'Forbidden',
              additionalData: null,
            },
            { status: 403 }
          )
        })
      )

      const request = {
        status: 'CLOSED' as const,
      }

      await expect(updateFormStatus(clubId, formId, request)).rejects.toThrow()
    })
  })

  describe('submitApplication', () => {
    it('should submit application successfully', async () => {
      server.use(
        http.post(`${API_BASE}/api/clubs/:clubId/forms/:formId/applications`, () => {
          return HttpResponse.json({
            message: '지원서 제출 성공',
            data: {
              applicationId: 'new-application-uuid',
            },
          })
        })
      )

      const request = {
        answers: [
          {
            questionId: 1,
            optionId: null,
            answerText: '저는 이 동아리에 관심이 많아 지원하게 되었습니다',
          },
          {
            questionId: 2,
            optionId: 'option-uuid-1',
            answerText: null,
          },
        ],
      }

      const result = await submitApplication(clubId, formId, request)

      expect(result.message).toBe('지원서 제출 성공')
      expect(result.data.applicationId).toBe('new-application-uuid')
    })

    it('should throw error when form is closed', async () => {
      server.use(
        http.post(`${API_BASE}/api/clubs/:clubId/forms/:formId/applications`, () => {
          return HttpResponse.json(
            {
              exception: 'FormException',
              code: 'FORM-400',
              message: '마감된 폼입니다',
              status: 400,
              error: 'Bad Request',
              additionalData: null,
            },
            { status: 400 }
          )
        })
      )

      const request = {
        answers: [
          {
            questionId: 1,
            optionId: null,
            answerText: '답변',
          },
        ],
      }

      await expect(submitApplication(clubId, formId, request)).rejects.toThrow()
    })

    it('should throw error on missing required fields', async () => {
      server.use(
        http.post(`${API_BASE}/api/clubs/:clubId/forms/:formId/applications`, () => {
          return HttpResponse.json(
            {
              exception: 'ValidationException',
              code: 'FORM-400',
              message: '필수 항목이 누락되었습니다',
              status: 400,
              error: 'Bad Request',
              additionalData: null,
            },
            { status: 400 }
          )
        })
      )

      const request = {
        answers: [
          {
            questionId: 1,
            optionId: null,
            answerText: null,
          },
        ],
      }

      await expect(submitApplication(clubId, formId, request)).rejects.toThrow()
    })
  })

  describe('getApplicationDetail', () => {
    it('should return application detail', async () => {
      server.use(
        http.get(`${API_BASE}/api/clubs/:clubId/applications/:applicationId`, () => {
          return HttpResponse.json({
            message: '지원서 상세 조회 성공',
            data: {
              applicationId: 123,
              applicant: {
                name: '홍길동',
                studentId: '20241234',
                department: '컴퓨터공학과',
                phone: '01012345678',
              },
              status: 'SUBMITTED',
              isRead: false,
              submittedAt: '2024-01-15T10:00:00Z',
              answers: [
                {
                  questionId: 1,
                  question: '지원 동기를 작성해주세요',
                  type: 'SHORT_TEXT',
                  answer: '저는 이 동아리에 관심이 많아 지원하게 되었습니다',
                },
              ],
            },
          })
        })
      )

      const result = await getApplicationDetail(clubId, applicationId)

      expect(result.message).toBe('지원서 상세 조회 성공')
      expect(result.data.applicationId).toBe(123)
      expect(result.data.applicant.name).toBe('홍길동')
      expect(result.data.answers).toHaveLength(1)
      expect(result.data.status).toBe('SUBMITTED')
    })

    it('should throw error when application not found', async () => {
      server.use(
        http.get(`${API_BASE}/api/clubs/:clubId/applications/:applicationId`, () => {
          return HttpResponse.json(
            {
              exception: 'NotFoundException',
              code: 'APT-404',
              message: '지원서를 찾을 수 없습니다',
              status: 404,
              error: 'Not Found',
              additionalData: null,
            },
            { status: 404 }
          )
        })
      )

      await expect(getApplicationDetail(clubId, 'invalid-id')).rejects.toThrow()
    })

    it('should throw error on unauthorized access', async () => {
      server.use(
        http.get(`${API_BASE}/api/clubs/:clubId/applications/:applicationId`, () => {
          return HttpResponse.json(
            {
              exception: 'AuthException',
              code: 'AUTH-403',
              message: '권한이 없습니다',
              status: 403,
              error: 'Forbidden',
              additionalData: null,
            },
            { status: 403 }
          )
        })
      )

      await expect(getApplicationDetail(clubId, applicationId)).rejects.toThrow()
    })
  })
})
