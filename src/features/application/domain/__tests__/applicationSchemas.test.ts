import { describe, it, expect } from 'vitest'
import {
  applicationAnswerSchema,
  submitApplicationRequestSchema,
  qnaItemSchema,
  applicationDetailResponseSchema,
} from '../applicationSchemas'

describe('Application Schemas', () => {
  describe('applicationAnswerSchema', () => {
    it('should validate answer with optionId', () => {
      const result = applicationAnswerSchema.safeParse({
        questionId: 1,
        optionId: 5,
        answerText: null,
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.questionId).toBe(1)
        expect(result.data.optionId).toBe(5)
        expect(result.data.answerText).toBeNull()
      }
    })

    it('should validate answer with answerText', () => {
      const result = applicationAnswerSchema.safeParse({
        questionId: 2,
        optionId: null,
        answerText: 'Sample answer text',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.questionId).toBe(2)
        expect(result.data.optionId).toBeNull()
        expect(result.data.answerText).toBe('Sample answer text')
      }
    })

    it('should reject missing required fields', () => {
      const result = applicationAnswerSchema.safeParse({
        questionId: 1,
        optionId: 5,
      })
      expect(result.success).toBe(false)
    })

    it('should reject invalid questionId type', () => {
      const result = applicationAnswerSchema.safeParse({
        questionId: 'not-a-number',
        optionId: 5,
        answerText: null,
      })
      expect(result.success).toBe(false)
    })
  })

  describe('submitApplicationRequestSchema', () => {
    it('should validate valid submit request', () => {
      const result = submitApplicationRequestSchema.safeParse({
        answers: [
          { questionId: 1, optionId: 5, answerText: null },
          { questionId: 2, optionId: null, answerText: 'Text answer' },
        ],
      })
      expect(result.success).toBe(true)
    })

    it('should validate empty answers array', () => {
      const result = submitApplicationRequestSchema.safeParse({
        answers: [],
      })
      expect(result.success).toBe(true)
    })

    it('should reject missing answers field', () => {
      const result = submitApplicationRequestSchema.safeParse({})
      expect(result.success).toBe(false)
    })
  })

  describe('qnaItemSchema', () => {
    it('should validate QnA with answer', () => {
      const result = qnaItemSchema.safeParse({
        questionId: 1,
        question: 'What is your motivation?',
        type: 'TEXT',
        answer: 'I want to learn',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.question).toBe('What is your motivation?')
        expect(result.data.answer).toBe('I want to learn')
      }
    })

    it('should validate QnA with null answer', () => {
      const result = qnaItemSchema.safeParse({
        questionId: 1,
        question: 'What is your motivation?',
        type: 'TEXT',
        answer: null,
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.answer).toBeNull()
      }
    })
  })

  describe('applicationDetailResponseSchema', () => {
    it('should validate complete application detail', () => {
      const result = applicationDetailResponseSchema.safeParse({
        aplictUUID: 'app-uuid-123',
        applicantName: '홍길동',
        studentNumber: '20210001',
        department: '컴퓨터공학과',
        submittedAt: '2024-01-15T10:30:00',
        status: 'WAIT',
        isRead: false,
        qnaList: [
          { questionId: 1, question: '지원 동기', type: 'TEXT', answer: '열정이 있습니다' },
          { questionId: 2, question: '희망 분야', type: 'TEXT', answer: null },
        ],
      })
      expect(result.success).toBe(true)
    })

    it('should reject missing required fields', () => {
      const result = applicationDetailResponseSchema.safeParse({
        aplictUUID: 'app-uuid-123',
        applicantName: '홍길동',
      })
      expect(result.success).toBe(false)
    })

    it('should validate empty qnaList', () => {
      const result = applicationDetailResponseSchema.safeParse({
        aplictUUID: 'app-uuid-123',
        applicantName: '홍길동',
        studentNumber: '20210001',
        department: '컴퓨터공학과',
        submittedAt: '2024-01-15T10:30:00',
        status: 'WAIT',
        isRead: true,
        qnaList: [],
      })
      expect(result.success).toBe(true)
    })
  })
})
