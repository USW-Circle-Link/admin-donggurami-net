import { z } from 'zod'

// ===== Enums =====

export const questionTypeSchema = z.enum(['RADIO', 'CHECKBOX', 'DROPDOWN', 'SHORT_TEXT', 'LONG_TEXT'])

export const formStatusSchema = z.enum(['DRAFT', 'PUBLISHED', 'CLOSED'])

// ===== Form Option =====

export const formOptionSchema = z.object({
  sequence: z.number(),
  content: z.string(),
  value: z.string(),
})

// ===== Form Question =====

export const formQuestionSchema = z.object({
  sequence: z.number(),
  type: questionTypeSchema,
  content: z.string(),
  required: z.boolean(),
  options: z.array(formOptionSchema).optional(),
})

// ===== Create Form =====

export const createFormRequestSchema = z.object({
  title: z.string().min(1, '제목은 필수입니다.'),
  description: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  questions: z.array(formQuestionSchema),
})

export const createFormResponseSchema = z.object({
  formId: z.string().uuid(),
})

// ===== Update Form Status =====

export const updateFormStatusRequestSchema = z.object({
  status: formStatusSchema,
})

// ===== Form Answer =====

export const formAnswerSchema = z.object({
  questionId: z.union([z.number(), z.string().uuid()]),
  optionId: z.union([z.number(), z.string().uuid()]).nullable(),
  answerText: z.string().nullable(),
})

// ===== Submit Application =====

export const submitApplicationRequestSchema = z.object({
  answers: z.array(formAnswerSchema).min(1, '답변은 최소 1개 이상이어야 합니다.'),
})

export const submitApplicationResponseSchema = z.object({
  applicationId: z.string().uuid(),
})

// ===== Application Applicant =====

export const applicationApplicantSchema = z.object({
  name: z.string(),
  studentId: z.string(),
  department: z.string(),
  phone: z.string(),
})

// ===== Application Answer =====

export const applicationAnswerSchema = z.object({
  questionId: z.union([z.number(), z.string().uuid()]),
  question: z.string(),
  type: questionTypeSchema,
  answer: z.string(),
})

// ===== Application Detail =====

export const applicationDetailSchema = z.object({
  applicationId: z.number(),
  applicant: applicationApplicantSchema,
  status: z.literal('SUBMITTED'),
  isRead: z.boolean(),
  submittedAt: z.string(),
  answers: z.array(applicationAnswerSchema),
})

// ===== Type Inference =====

export type QuestionType = z.infer<typeof questionTypeSchema>
export type FormStatus = z.infer<typeof formStatusSchema>
export type FormOption = z.infer<typeof formOptionSchema>
export type FormQuestion = z.infer<typeof formQuestionSchema>
export type CreateFormRequest = z.infer<typeof createFormRequestSchema>
export type CreateFormResponse = z.infer<typeof createFormResponseSchema>
export type UpdateFormStatusRequest = z.infer<typeof updateFormStatusRequestSchema>
export type FormAnswer = z.infer<typeof formAnswerSchema>
export type SubmitApplicationRequest = z.infer<typeof submitApplicationRequestSchema>
export type SubmitApplicationResponse = z.infer<typeof submitApplicationResponseSchema>
export type ApplicationApplicant = z.infer<typeof applicationApplicantSchema>
export type ApplicationAnswer = z.infer<typeof applicationAnswerSchema>
export type ApplicationDetail = z.infer<typeof applicationDetailSchema>
