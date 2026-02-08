import { z } from 'zod'

// ===== Common Enums =====
export const memberTypeSchema = z.enum(['REGULARMEMBER', 'NONMEMBER'])
export const applicantStatusSchema = z.enum(['WAIT', 'PASS', 'FAIL'])
export const recruitmentStatusSchema = z.enum(['OPEN', 'CLOSE'])

// ===== Club Intro =====
export const clubIntroResponseSchema = z.object({
  clubUUID: z.string().uuid(),
  clubIntro: z.string().nullable(),
  clubRecruitment: z.string().nullable(),
  recruitmentStatus: recruitmentStatusSchema,
  googleFormUrl: z.string().nullable(),
  introPhotos: z.array(z.string()),
})

export const clubIntroRequestSchema = z.object({
  clubIntro: z.string().max(3000, '소개글은 3000자 이하여야 합니다.').optional(),
  recruitmentStatus: recruitmentStatusSchema,
  clubRecruitment: z.string().max(3000, '모집 공고는 3000자 이하여야 합니다.').optional(),
  googleFormUrl: z.string().url('올바른 URL 형식이 아닙니다.').optional().or(z.literal('')),
  orders: z.array(z.number()).optional(),
  deletedOrders: z.array(z.number()).optional(),
})

// ===== Club Info =====
export const clubInfoResponseSchema = z.object({
  mainPhotoUrl: z.string().nullable(),
  clubName: z.string(),
  leaderName: z.string(),
  leaderHp: z.string(),
  clubInsta: z.string().nullable(),
  clubRoomNumber: z.string(),
  clubHashtag: z.array(z.string()),
  clubCategoryName: z.array(z.string()),
  department: z.string(),
})

export const clubInfoRequestSchema = z.object({
  leaderName: z.string()
    .min(2, '이름은 2자 이상이어야 합니다.')
    .max(30, '이름은 30자 이하여야 합니다.')
    .regex(/^[가-힣a-zA-Z]+$/, '이름은 한글 또는 영문만 가능합니다.'),
  leaderHp: z.string()
    .regex(/^01[0-9]{9}$/, '전화번호 형식이 올바르지 않습니다.'),
  clubInsta: z.string().optional().nullable(),
  clubRoomNumber: z.string().min(1, '동아리방 호수는 필수입니다.'),
  clubHashtag: z.array(z.string().min(1).max(6)).max(2, '해시태그는 최대 2개입니다.').optional(),
  clubCategoryName: z.array(z.string().min(1).max(20)).max(3, '카테고리는 최대 3개입니다.').optional(),
})

export const leaderUpdatePwRequestSchema = z.object({
  leaderPw: z.string().min(1, '현재 비밀번호는 필수입니다.'),
  newPw: z.string()
    .min(8, '비밀번호는 8자 이상이어야 합니다.')
    .max(20, '비밀번호는 20자 이하여야 합니다.')
    .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.')
    .optional(),
  confirmNewPw: z.string().optional(),
}).refine((data) => !data.newPw || data.newPw === data.confirmNewPw, {
  message: '새 비밀번호가 일치하지 않습니다.',
  path: ['confirmNewPw'],
})

// ===== Club Summary =====
export const clubSummaryResponseSchema = z.object({
  clubUUID: z.string().uuid(),
  clubName: z.string(),
  leaderName: z.string(),
  leaderHp: z.string(),
  clubInsta: z.string().nullable(),
  clubRoomNumber: z.string(),
  clubHashtag: z.array(z.string()),
  clubCategories: z.array(z.string()),
  clubIntro: z.string().nullable(),
  clubRecruitment: z.string().nullable(),
  recruitmentStatus: recruitmentStatusSchema,
  googleFormUrl: z.string().nullable(),
  mainPhoto: z.string().nullable(),
  introPhotos: z.array(z.string()),
})

// ===== Club Members =====
export const clubMemberSchema = z.object({
  clubMemberUUID: z.string().uuid(),
  userName: z.string(),
  major: z.string(),
  studentNumber: z.string(),
  userHp: z.string(),
  memberType: memberTypeSchema,
})

export const clubMemberDeleteRequestSchema = z.object({
  clubMemberUUID: z.string().uuid(),
})

// ===== Applicants =====
export const applicantSchema = z.object({
  aplictUUID: z.string().uuid(),
  userName: z.string(),
  major: z.string(),
  studentNumber: z.string(),
  userHp: z.string(),
  status: applicantStatusSchema,
})

export const qnaItemSchema = z.object({
  questionId: z.number(),
  question: z.string(),
  type: z.string(),
  answer: z.string(),
})

export const applicationDetailResponseSchema = z.object({
  aplictUUID: z.string().uuid(),
  applicantName: z.string(),
  studentNumber: z.string(),
  department: z.string(),
  submittedAt: z.string(),
  status: applicantStatusSchema,
  isRead: z.boolean(),
  qnaList: z.array(qnaItemSchema),
})

export const applicationStatusUpdateRequestSchema = z.object({
  status: applicantStatusSchema,
})

export const applicantStatusUpdateSchema = z.object({
  aplictUUID: z.string().uuid(),
})

// ===== Others =====
export const categoryItemSchema = z.object({
  clubCategoryUUID: z.string().uuid(),
  clubCategoryName: z.string(),
})

export const fcmTokenRequestSchema = z.object({
  fcmToken: z.string().min(1, 'FCM 토큰은 필수입니다.'),
})

// Type inference
export type MemberType = z.infer<typeof memberTypeSchema>
export type ApplicantStatus = z.infer<typeof applicantStatusSchema>
export type RecruitmentStatus = z.infer<typeof recruitmentStatusSchema>
export type ClubIntroResponse = z.infer<typeof clubIntroResponseSchema>
export type ClubIntroRequest = z.infer<typeof clubIntroRequestSchema>
export type ClubInfoResponse = z.infer<typeof clubInfoResponseSchema>
export type ClubInfoRequest = z.infer<typeof clubInfoRequestSchema>
export type LeaderUpdatePwRequest = z.infer<typeof leaderUpdatePwRequestSchema>
export type ClubSummaryResponse = z.infer<typeof clubSummaryResponseSchema>
export type ClubMember = z.infer<typeof clubMemberSchema>
export type ClubMemberDeleteRequest = z.infer<typeof clubMemberDeleteRequestSchema>
export type Applicant = z.infer<typeof applicantSchema>
export type ApplicantStatusUpdate = z.infer<typeof applicantStatusUpdateSchema>
export type QnaItem = z.infer<typeof qnaItemSchema>
export type ApplicationDetailResponse = z.infer<typeof applicationDetailResponseSchema>
export type ApplicationStatusUpdateRequest = z.infer<typeof applicationStatusUpdateRequestSchema>
export type CategoryItem = z.infer<typeof categoryItemSchema>
export type FcmTokenRequest = z.infer<typeof fcmTokenRequestSchema>
