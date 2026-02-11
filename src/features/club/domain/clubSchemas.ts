import { z } from 'zod'

// Common recruitment status enum
export const recruitmentStatusSchema = z.enum(['OPEN', 'CLOSE'])

// Club list response (GET /clubs)
export const clubListResponseSchema = z.object({
  clubUUID: z.string().uuid(),
  clubName: z.string(),
  mainPhotoUrl: z.string().nullable(),
  department: z.string(),
  hashtags: z.array(z.string()),
  memberCount: z.number(),
  leaderName: z.string(),
  leaderHp: z.string(),
  recruitmentStatus: recruitmentStatusSchema,
})

// Category response (GET /clubs/categories)
export const clubCategoryResponseSchema = z.object({
  clubCategoryUUID: z.string().uuid(),
  clubCategoryName: z.string().min(1),
})

// Club detail response (GET /clubs/{clubUUID})
export const clubDetailResponseSchema = z.object({
  clubUUID: z.string().uuid(),
  mainPhoto: z.string().nullable(),
  infoPhotos: z.array(z.string()),
  clubName: z.string().min(1),
  leaderName: z.string().min(1),
  leaderHp: z.string(),
  clubInsta: z.string().nullable(),
  clubInfo: z.string().nullable(),
  recruitmentStatus: recruitmentStatusSchema,
  googleFormUrl: z.string().nullable(),
  clubHashtags: z.array(z.string()),
  clubCategoryNames: z.array(z.string()),
  clubRoomNumber: z.string(),
  clubRecruitment: z.string().nullable(),
})

// Recruit status response (GET /clubs/{clubUUID}/recruit-status)
export const recruitStatusResponseSchema = z.object({
  recruitmentStatus: recruitmentStatusSchema,
})

// Club member type enum
export const clubMemberTypeSchema = z.enum(['REGULARMEMBER', 'NONMEMBER'])

// Club member response
export const clubMemberResponseSchema = z.object({
  clubMemberUUID: z.string().uuid(),
  userName: z.string(),
  major: z.string(),
  studentNumber: z.string(),
  userHp: z.string(),
  memberType: clubMemberTypeSchema,
})

// Club member delete request
export const clubMemberDeleteRequestSchema = z.object({
  clubMemberUUID: z.string().uuid(),
})

// Department enum
export const departmentSchema = z.enum(['학술', '종교', '예술', '체육', '공연', '봉사'])

// Club create request (POST /clubs)
export const clubCreateRequestSchema = z.object({
  leaderAccount: z.string().min(5).max(20),
  leaderPw: z.string().min(8).max(20),
  leaderPwConfirm: z.string().min(8).max(20),
  clubName: z.string().min(1).max(10),
  department: departmentSchema,
  adminPw: z.string(),
  clubRoomNumber: z.string(),
})

// Club profile request
export const clubProfileRequestSchema = z.object({
  leaderName: z.string().min(2).max(30),
  leaderHp: z.string().regex(/^01[0-9]{9}$/),
  clubInsta: z.string().regex(/^(https?:\/\/)?(www\.)?instagram\.com\/.+$|^$/).nullable(),
  clubRoomNumber: z.string(),
  clubHashtag: z.array(z.string().min(1).max(6)).max(2).optional(),
  clubCategoryName: z.array(z.string().min(1).max(20)).max(3).optional(),
})

// Leader update password request
export const leaderUpdatePwRequestSchema = z.object({
  leaderPw: z.string(),
  newPw: z.string().min(8).max(20).optional(),
  confirmNewPw: z.string().min(8).max(20).optional(),
})

// Club delete request
export const clubDeleteRequestSchema = z.object({
  adminPw: z.string(),
})

// FCM token request
export const fcmTokenRequestSchema = z.object({
  fcmToken: z.string(),
})

// Form question type enum
export const formQuestionTypeSchema = z.enum([
  'RADIO',
  'CHECKBOX',
  'DROPDOWN',
  'SHORT_TEXT',
  'LONG_TEXT',
])

// Form question response
export const formQuestionResponseSchema = z.object({
  questionId: z.number(),
  sequence: z.number(),
  type: formQuestionTypeSchema,
  content: z.string(),
  required: z.boolean(),
  options: z.array(z.object({
    optionId: z.number(),
    content: z.string(),
  })),
})

// Club form response (GET /clubs/forms/{clubUUID})
export const clubFormResponseSchema = z.object({
  formId: z.number(),
  questions: z.array(formQuestionResponseSchema),
})

// Type inference from schemas
export type RecruitmentStatus = z.infer<typeof recruitmentStatusSchema>
export type ClubListResponse = z.infer<typeof clubListResponseSchema>
export type ClubCategoryResponse = z.infer<typeof clubCategoryResponseSchema>
export type ClubDetailResponse = z.infer<typeof clubDetailResponseSchema>
export type RecruitStatusResponse = z.infer<typeof recruitStatusResponseSchema>
export type ClubMemberType = z.infer<typeof clubMemberTypeSchema>
export type ClubMemberResponse = z.infer<typeof clubMemberResponseSchema>
export type ClubMemberDeleteRequest = z.infer<typeof clubMemberDeleteRequestSchema>
export type Department = z.infer<typeof departmentSchema>
export type ClubCreateRequest = z.infer<typeof clubCreateRequestSchema>
export type ClubProfileRequest = z.infer<typeof clubProfileRequestSchema>
export type LeaderUpdatePwRequest = z.infer<typeof leaderUpdatePwRequestSchema>
export type ClubDeleteRequest = z.infer<typeof clubDeleteRequestSchema>
export type FcmTokenRequest = z.infer<typeof fcmTokenRequestSchema>
export type FormQuestionType = z.infer<typeof formQuestionTypeSchema>
export type FormQuestionResponse = z.infer<typeof formQuestionResponseSchema>
export type ClubFormResponse = z.infer<typeof clubFormResponseSchema>
