import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@test/mocks/server'
import * as api from '../formApi'
import type { CreateFormRequest } from '../../domain/formSchemas'

const API_BASE = 'https://api.donggurami.net'
const TEST_CLUB_ID = '550e8400-e29b-41d4-a716-446655440000'
const TEST_APPLICATION_ID = '550e8400-e29b-41d4-a716-446655440002'

describe('Form Management API', () => {
  describe('createForm()', () => {
    it('should POST to correct endpoint with valid payload', async () => {
      const request: CreateFormRequest = {
        description: '2024년 신입 회원을 모집합니다',
        questions: [
          {
            sequence: 1,
            type: 'SHORT_TEXT',
            content: '지원 동기를 작성해주세요',
            required: true,
          },
          {
            sequence: 2,
            type: 'RADIO',
            content: '참여 가능 시간을 선택해주세요',
            required: true,
            options: [
              { sequence: 1, content: '평일 오후' },
              { sequence: 2, content: '주말 오전' },
            ],
          },
        ],
      }

      // POST returns void (no data)
      await expect(api.createForm(TEST_CLUB_ID, request)).resolves.toBeUndefined()
    })

    it('should validate question types', async () => {
      const request: CreateFormRequest = {
        description: 'Test',
        questions: [
          {
            sequence: 1,
            type: 'SHORT_TEXT',
            content: 'Short answer question',
            required: true,
          },
          {
            sequence: 2,
            type: 'LONG_TEXT',
            content: 'Long answer question',
            required: false,
          },
          {
            sequence: 3,
            type: 'CHECKBOX',
            content: 'Multiple choice',
            required: true,
            options: [
              { sequence: 1, content: 'Option 1' },
              { sequence: 2, content: 'Option 2' },
            ],
          },
        ],
      }

      // POST returns void (no data)
      await expect(api.createForm(TEST_CLUB_ID, request)).resolves.toBeUndefined()
    })

    it('should handle 400 validation error', async () => {
      server.use(
        http.post(`${API_BASE}/clubs/${TEST_CLUB_ID}/forms`, () => {
          return HttpResponse.json(
            {
              exception: 'ValidationException',
              code: 'COM-100',
              message: '유효하지 않은 입력입니다.',
              status: 400,
              error: 'Bad Request',
              additionalData: null,
            },
            { status: 400 }
          )
        })
      )

      const request: CreateFormRequest = {
        description: '',
        questions: [
          {
            sequence: 1,
            type: 'SHORT_TEXT',
            content: 'Q1',
            required: true,
          },
        ],
      }

      await expect(api.createForm(TEST_CLUB_ID, request)).rejects.toThrow()
    })

    it('should handle 404 club not found', async () => {
      server.use(
        http.post(`${API_BASE}/clubs/${TEST_CLUB_ID}/forms`, () => {
          return HttpResponse.json(
            {
              exception: 'ClubException',
              code: 'CLUB-404',
              message: '동아리를 찾을 수 없습니다.',
              status: 404,
              error: 'Not Found',
              additionalData: null,
            },
            { status: 404 }
          )
        })
      )

      const request: CreateFormRequest = {
        description: '',
        questions: [
          {
            sequence: 1,
            type: 'SHORT_TEXT',
            content: 'Q1',
            required: true,
          },
        ],
      }

      await expect(api.createForm(TEST_CLUB_ID, request)).rejects.toThrow()
    })

    it('should handle 500 server error', async () => {
      server.use(
        http.post(`${API_BASE}/clubs/${TEST_CLUB_ID}/forms`, () => {
          return HttpResponse.json(
            {
              exception: 'ServerException',
              code: 'COM-500',
              message: '서버 오류가 발생했습니다.',
              status: 500,
              error: 'Internal Server Error',
              additionalData: null,
            },
            { status: 500 }
          )
        })
      )

      const request: CreateFormRequest = {
        description: '',
        questions: [
          {
            sequence: 1,
            type: 'SHORT_TEXT',
            content: 'Q1',
            required: true,
          },
        ],
      }

      await expect(api.createForm(TEST_CLUB_ID, request)).rejects.toThrow()
    })
  })

  describe('getActiveForm()', () => {
    it('should GET active form for club', async () => {
      server.use(
        http.get(`${API_BASE}/clubs/${TEST_CLUB_ID}/forms`, () => {
          return HttpResponse.json({
            message: '활성 폼 조회 성공',
            data: {
              formId: 101,  // GET returns formId as number
              questions: [
                {
                  questionId: 1,  // questionId is number
                  sequence: 1,
                  type: 'SHORT_TEXT',
                  content: '지원 동기',
                  required: true,
                  options: [],
                },
              ],
            },
          })
        })
      )

      const result = await api.getActiveForm(TEST_CLUB_ID)

      expect(result.formId).toBe(101)
      expect(result.questions).toHaveLength(1)
    })
  })

  describe('getClubApplicationDetail()', () => {
    it('should GET application detail', async () => {
      server.use(
        http.get(`${API_BASE}/clubs/${TEST_CLUB_ID}/applications/${TEST_APPLICATION_ID}`, () => {
          return HttpResponse.json({
            message: '지원서 조회 성공',
            data: {
              applicationId: 'app-uuid-123',
              applicantName: '홍길동',
              applicantEmail: 'hong@example.com',
              status: 'WAIT',
              submittedAt: '2024-01-15T10:00:00Z',
              answers: [
                {
                  answerId: 'answer-1',
                  questionId: 'question-1',
                  optionId: null,
                  answerText: '저는 이 동아리에 관심이 많아 지원하게 되었습니다',
                },
              ],
              questions: [
                {
                  questionId: 'question-1',
                  sequence: 1,
                  type: 'SHORT_TEXT',
                  content: '지원 동기를 작성해주세요',
                  required: true,
                  options: [],
                },
              ],
            },
          })
        })
      )

      const result = await api.getClubApplicationDetail(TEST_CLUB_ID, TEST_APPLICATION_ID)

      expect(result).toBeDefined()
      expect(result.applicationId).toBe('app-uuid-123')
      expect(result.applicantName).toBe('홍길동')
      expect(result.status).toBe('WAIT')
    })
  })
})
