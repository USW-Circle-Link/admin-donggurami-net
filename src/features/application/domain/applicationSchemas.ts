import { z } from 'zod'

// Application answer schema
export const applicationAnswerSchema = z.object({
  questionId: z.number(),
  optionId: z.number().nullable(),
  answerText: z.string().nullable(),
})

// Submit application request
export const submitApplicationRequestSchema = z.object({
  answers: z.array(applicationAnswerSchema),
});

// QnA item in application detail
export const qnaItemSchema = z.object({
  questionId: z.number(),
  question: z.string(),
  type: z.string(),
  answer: z.string().nullable(),
  optionId: z.number().nullable().optional(),
});

// Application detail response
export const applicationDetailResponseSchema = z.object({
  aplictUUID: z.string(),
  applicantName: z.string(),
  studentNumber: z.string(),
  department: z.string(),
  submittedAt: z.string(),
  status: z.enum(['WAIT', 'PASS', 'FAIL']),
  isRead: z.boolean(),
  qnaList: z.array(qnaItemSchema),
});

// Type inference
export type ApplicationAnswer = z.infer<typeof applicationAnswerSchema>;
export type SubmitApplicationRequest = z.infer<typeof submitApplicationRequestSchema>;
export type QnaItem = z.infer<typeof qnaItemSchema>;
export type ApplicationDetailResponse = z.infer<typeof applicationDetailResponseSchema>;
