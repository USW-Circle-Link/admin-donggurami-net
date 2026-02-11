import { describe, it, expect } from 'vitest'
import {
  questionTypeSchema,
  formStatusSchema,
  formOptionSchema,
  formQuestionSchema,
  createFormRequestSchema,
  updateFormStatusRequestSchema,
  formAnswerSchema,
  submitApplicationRequestSchema,
  submitApplicationResponseSchema,
  applicationApplicantSchema,
  applicationAnswerSchema,
  applicationDetailSchema,
  type QuestionType,
  type FormStatus,
} from '../formSchemas'

describe('Form Management Schemas', () => {
  describe('questionTypeSchema', () => {
    it('should accept valid question types', () => {
      const validTypes: QuestionType[] = ['RADIO', 'CHECKBOX', 'DROPDOWN', 'SHORT_TEXT', 'LONG_TEXT']
      validTypes.forEach((type) => {
        expect(() => questionTypeSchema.parse(type)).not.toThrow()
      })
    })

    it('should reject invalid question types', () => {
      expect(() => questionTypeSchema.parse('INVALID')).toThrow()
    })
  })

  describe('formStatusSchema', () => {
    it('should accept valid form statuses', () => {
      const validStatuses: FormStatus[] = ['DRAFT', 'PUBLISHED', 'CLOSED']
      validStatuses.forEach((status) => {
        expect(() => formStatusSchema.parse(status)).not.toThrow()
      })
    })

    it('should reject invalid form statuses', () => {
      expect(() => formStatusSchema.parse('INVALID')).toThrow()
      })
  })

  describe('formOptionSchema', () => {
    it('should parse valid form option', () => {
      const validOption = {
        sequence: 1,
        content: '옵션 1',
      }
      expect(() => formOptionSchema.parse(validOption)).not.toThrow()
    })

    it('should reject option with missing required fields', () => {
      const invalidOption = {
        sequence: 1,
        // missing content
      }
      expect(() => formOptionSchema.parse(invalidOption)).toThrow()
    })

    it('should reject option with invalid sequence type', () => {
      const invalidOption = {
        sequence: '1', // should be number
        content: '옵션 1',
      }
      expect(() => formOptionSchema.parse(invalidOption)).toThrow()
    })
  })

  describe('formQuestionSchema', () => {
    it('should parse valid question with options', () => {
      const validQuestion = {
        sequence: 1,
        type: 'RADIO' as const,
        content: '질문 내용',
        required: true,
        options: [
          { sequence: 1, content: '옵션 1' },
          { sequence: 2, content: '옵션 2' },
        ],
      }
      expect(() => formQuestionSchema.parse(validQuestion)).not.toThrow()
    })

    it('should parse valid question without options', () => {
      const validQuestion = {
        sequence: 1,
        type: 'SHORT_TEXT' as const,
        content: '질문 내용',
        required: false,
      }
      expect(() => formQuestionSchema.parse(validQuestion)).not.toThrow()
    })

    it('should reject question with missing required fields', () => {
      const invalidQuestion = {
        sequence: 1,
        type: 'RADIO' as const,
        // missing content
        required: true,
      }
      expect(() => formQuestionSchema.parse(invalidQuestion)).toThrow()
    })
  })

  describe('createFormRequestSchema', () => {
    it('should parse valid create form request', () => {
      const validRequest = {
        title: '2024 동아리 신입 모집',
        description: '신입 회원을 모집합니다',
        startDate: '2024-03-01T00:00:00Z',
        endDate: '2024-03-31T23:59:59Z',
        questions: [
          {
            sequence: 1,
            type: 'SHORT_TEXT' as const,
            content: '이름을 입력하세요',
            required: true,
          },
          {
            sequence: 2,
            type: 'RADIO' as const,
            content: '선호하는 활동은?',
            required: true,
            options: [
              { sequence: 1, content: '프로그래밍' },
              { sequence: 2, content: '디자인' },
            ],
          },
        ],
      }
      expect(() => createFormRequestSchema.parse(validRequest)).not.toThrow()
    })

    it('should reject request with empty title', () => {
      const invalidRequest = {
        title: '',
        description: '신입 회원을 모집합니다',
        startDate: '2024-03-01T00:00:00Z',
        endDate: '2024-03-31T23:59:59Z',
        questions: [],
      }
      expect(() => createFormRequestSchema.parse(invalidRequest)).toThrow()
    })

    it('should reject request with missing required fields', () => {
      const invalidRequest = {
        title: '2024 동아리 신입 모집',
        // missing description, dates, questions
      }
      expect(() => createFormRequestSchema.parse(invalidRequest)).toThrow()
    })
  })

  // createFormResponseSchema removed: POST /clubs/{clubUUID}/forms returns void

  describe('updateFormStatusRequestSchema', () => {
    it('should parse valid update status request', () => {
      const validRequest = {
        status: 'PUBLISHED' as const,
      }
      expect(() => updateFormStatusRequestSchema.parse(validRequest)).not.toThrow()
    })

    it('should reject request with invalid status', () => {
      const invalidRequest = {
        status: 'INVALID',
      }
      expect(() => updateFormStatusRequestSchema.parse(invalidRequest)).toThrow()
    })
  })

  describe('formAnswerSchema', () => {
    it('should parse valid answer with optionId', () => {
      const validAnswer = {
        questionId: 101,
        optionId: 501,
        answerText: null,
      }
      expect(() => formAnswerSchema.parse(validAnswer)).not.toThrow()
    })

    it('should parse valid answer with answerText', () => {
      const validAnswer = {
        questionId: 102,
        optionId: null,
        answerText: '자유 텍스트 답변',
      }
      expect(() => formAnswerSchema.parse(validAnswer)).not.toThrow()
    })

    it('should parse valid answer with number questionId', () => {
      const validAnswer = {
        questionId: 123,
        optionId: null,
        answerText: '답변',
      }
      expect(() => formAnswerSchema.parse(validAnswer)).not.toThrow()
    })
  })

  describe('submitApplicationRequestSchema', () => {
    it('should parse valid submit application request', () => {
      const validRequest = {
        answers: [
          {
            questionId: 1,
            optionId: null,
            answerText: '홍길동',
          },
          {
            questionId: 2,
            optionId: 501,
            answerText: null,
          },
        ],
      }
      expect(() => submitApplicationRequestSchema.parse(validRequest)).not.toThrow()
    })

    it('should reject request with empty answers array', () => {
      const invalidRequest = {
        answers: [],
      }
      expect(() => submitApplicationRequestSchema.parse(invalidRequest)).toThrow()
    })

    it('should reject request with missing answers field', () => {
      const invalidRequest = {}
      expect(() => submitApplicationRequestSchema.parse(invalidRequest)).toThrow()
    })
  })

  describe('submitApplicationResponseSchema', () => {
    it('should parse valid submit application response', () => {
      const validResponse = {
        applicationId: '550e8400-e29b-41d4-a716-446655440000',
      }
      expect(() => submitApplicationResponseSchema.parse(validResponse)).not.toThrow()
    })

    it('should reject response with invalid UUID', () => {
      const invalidResponse = {
        applicationId: 'not-a-uuid',
      }
      expect(() => submitApplicationResponseSchema.parse(invalidResponse)).toThrow()
    })
  })

  describe('applicationApplicantSchema', () => {
    it('should parse valid applicant info', () => {
      const validApplicant = {
        name: '홍길동',
        studentId: '20241234',
        department: '컴퓨터공학과',
        phone: '01012345678',
      }
      expect(() => applicationApplicantSchema.parse(validApplicant)).not.toThrow()
    })

    it('should reject applicant with missing required fields', () => {
      const invalidApplicant = {
        name: '홍길동',
        // missing studentId, department, phone
      }
      expect(() => applicationApplicantSchema.parse(invalidApplicant)).toThrow()
    })
  })

  describe('applicationAnswerSchema', () => {
    it('should parse valid application answer', () => {
      const validAnswer = {
        questionId: '550e8400-e29b-41d4-a716-446655440000',
        question: '이름을 입력하세요',
        type: 'SHORT_TEXT' as const,
        answer: '홍길동',
      }
      expect(() => applicationAnswerSchema.parse(validAnswer)).not.toThrow()
    })

    it('should reject answer with invalid question type', () => {
      const invalidAnswer = {
        questionId: '550e8400-e29b-41d4-a716-446655440000',
        question: '이름을 입력하세요',
        type: 'INVALID',
        answer: '홍길동',
      }
      expect(() => applicationAnswerSchema.parse(invalidAnswer)).toThrow()
    })
  })

  describe('applicationDetailSchema', () => {
    it('should parse valid application detail', () => {
      const validDetail = {
        applicationId: 123,
        applicant: {
          name: '홍길동',
          studentId: '20241234',
          department: '컴퓨터공학과',
          phone: '01012345678',
        },
        status: 'SUBMITTED' as const,
        isRead: false,
        submittedAt: '2024-03-15T10:30:00Z',
        answers: [
          {
            questionId: '550e8400-e29b-41d4-a716-446655440000',
            question: '이름을 입력하세요',
            type: 'SHORT_TEXT' as const,
            answer: '홍길동',
          },
        ],
      }
      expect(() => applicationDetailSchema.parse(validDetail)).not.toThrow()
    })

    it('should reject detail with invalid status', () => {
      const invalidDetail = {
        applicationId: 123,
        applicant: {
          name: '홍길동',
          studentId: '20241234',
          department: '컴퓨터공학과',
          phone: '01012345678',
        },
        status: 'INVALID',
        isRead: false,
        submittedAt: '2024-03-15T10:30:00Z',
        answers: [],
      }
      expect(() => applicationDetailSchema.parse(invalidDetail)).toThrow()
    })

    it('should reject detail with missing required fields', () => {
      const invalidDetail = {
        applicationId: 123,
        // missing applicant, status, isRead, submittedAt, answers
      }
      expect(() => applicationDetailSchema.parse(invalidDetail)).toThrow()
    })
  })
})
