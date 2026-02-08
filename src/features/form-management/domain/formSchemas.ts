import { z } from 'zod'

// ===== Enums =====

export const questionTypeSchema = z.enum(['RADIO', 'CHECKBOX', 'DROPDOWN', 'SHORT_TEXT', 'LONG_TEXT'])

export const formStatusSchema = z.enum(['DRAFT', 'PUBLISHED', 'CLOSED'])

export const applicantStatusSchema = z.enum(['WAIT', 'PASS', 'FAIL'])

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
  description: z.string().max(500, '폼 설명은 500자 이하여야 합니다.').optional(),
  questions: z.array(formQuestionSchema).min(1, '질문은 최소 1개 이상이어야 합니다.'),
})

export const createFormResponseSchema = z.object({
  formId: z.string().uuid(),
})

// ===== Update Form Status =====

export const updateFormStatusRequestSchema = z.object({
  status: formStatusSchema,
})

// ===== Form Answer (for submission) =====

export const formAnswerSchema = z.object({
  questionId: z.number(),
  optionId: z.number().nullish(),
  answerText: z.string().nullish(),
})

// ===== Submit Application =====

export const submitApplicationRequestSchema = z.object({
  answers: z.array(formAnswerSchema).min(1, '답변은 최소 1개 이상이어야 합니다.'),
})

export const submitApplicationResponseSchema = z.object({
  applicationId: z.string().uuid(),
})

// ===== Question Detail (for responses) =====

export const questionDetailSchema = z.object({
  questionId: z.number(),
  sequence: z.number(),
  type: questionTypeSchema,
  content: z.string(),
  required: z.boolean(),
  options: z.array(
    z.object({
      optionId: z.number(),
      sequence: z.number(),
      content: z.string(),
      value: z.string(),
    })
  ),
})

// ===== Answer Detail (for responses) =====

export const answerDetailSchema = z.object({
  answerId: z.string(),
  questionId: z.string(),
  optionId: z.string().nullable(),
  answerText: z.string().nullable(),
})

// ===== Application Detail Response =====

export const applicationDetailResponseSchema = z.object({
  applicationId: z.string(),
  formId: z.string(),
  applicantId: z.string().optional(),
  applicantName: z.string(),
  applicantEmail: z.string().optional(),
  status: applicantStatusSchema.optional(),
  submittedAt: z.string(),
  answers: z.array(answerDetailSchema),
  questions: z.array(questionDetailSchema),
  formTitle: z.string().optional(),
  clubName: z.string().optional(),
})

// ===== Applicant List Response (for club leader) =====

export const applicantSummarySchema = z.object({
  aplictUUID: z.string().uuid(),
  userName: z.string(),
  major: z.string(),
  studentNumber: z.string(),
  userHp: z.string(),
  status: applicantStatusSchema,
})

export const applicantListResponseSchema = z.array(applicantSummarySchema)

// ===== User Application Response (user view) =====

export const userApplicationResponseSchema = z.object({
  applicationId: z.string(),
  formId: z.string(),
  formTitle: z.string(),
  clubName: z.string(),
  status: applicantStatusSchema,
  submittedAt: z.string(),
  answers: z.array(answerDetailSchema),
  questions: z.array(questionDetailSchema),
})

// ===== Form Detail Response =====

export const formDetailResponseSchema = z.object({
  formId: z.string().uuid(),
  questions: z.array(questionDetailSchema),
})

// ===== Forms List Response =====

export const formSummarySchema = z.object({
  formId: z.string().uuid(),
  title: z.string().optional(),
  status: formStatusSchema,
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  totalApplications: z.number().optional(),
  createdAt: z.string(),
})

export const formsListResponseSchema = z.object({
  forms: z.array(formSummarySchema),
})

// ===== Legacy Schemas (deprecated, kept for backward compatibility) =====

export const applicationApplicantSchema = z.object({
  name: z.string(),
  studentId: z.string(),
  department: z.string(),
  phone: z.string(),
})

export const applicationAnswerSchema = z.object({
  questionId: z.union([z.number(), z.string().uuid()]),
  question: z.string(),
  type: questionTypeSchema,
  answer: z.string(),
})

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
export type ApplicantStatus = z.infer<typeof applicantStatusSchema>
export type FormOption = z.infer<typeof formOptionSchema>
export type FormQuestion = z.infer<typeof formQuestionSchema>
export type CreateFormRequest = z.infer<typeof createFormRequestSchema>
export type CreateFormResponse = z.infer<typeof createFormResponseSchema>
export type UpdateFormStatusRequest = z.infer<typeof updateFormStatusRequestSchema>
export type FormAnswer = z.infer<typeof formAnswerSchema>
export type SubmitApplicationRequest = z.infer<typeof submitApplicationRequestSchema>
export type SubmitApplicationResponse = z.infer<typeof submitApplicationResponseSchema>
export type QuestionDetail = z.infer<typeof questionDetailSchema>
export type AnswerDetail = z.infer<typeof answerDetailSchema>
export type ApplicationDetailResponse = z.infer<typeof applicationDetailResponseSchema>
export type ApplicantSummary = z.infer<typeof applicantSummarySchema>
export type ApplicantListResponse = z.infer<typeof applicantListResponseSchema>
export type UserApplicationResponse = z.infer<typeof userApplicationResponseSchema>
export type FormDetailResponse = z.infer<typeof formDetailResponseSchema>
export type FormSummary = z.infer<typeof formSummarySchema>
export type FormsListResponse = z.infer<typeof formsListResponseSchema>

// Legacy types
export type ApplicationApplicant = z.infer<typeof applicationApplicantSchema>
export type ApplicationAnswer = z.infer<typeof applicationAnswerSchema>
export type ApplicationDetail = z.infer<typeof applicationDetailSchema>
