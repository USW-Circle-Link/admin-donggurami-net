import { z } from 'zod'

// Profile response
export const profileResponseSchema = z.object({
  userName: z.string(),
  studentNumber: z.string(),
  userHp: z.string(),
  major: z.string(),
})

// Profile change request
export const profileChangeRequestSchema = z.object({
  userPw: z.string().min(1, '비밀번호는 필수입니다.'),
  userName: z.string()
    .min(2, '이름은 2자 이상이어야 합니다.')
    .max(30, '이름은 30자 이하여야 합니다.')
    .regex(/^[가-힣a-zA-Z]+$/, '이름은 한글 또는 영문만 가능합니다.'),
  studentNumber: z.string().regex(/^\d{8}$/, '학번은 8자리 숫자여야 합니다.'),
  userHp: z.string().regex(/^01[0-9]{9}$/, '전화번호 형식이 올바르지 않습니다.'),
  major: z.string().min(1).max(20, '학과는 20자 이하여야 합니다.'),
})

// Profile duplication check request
export const profileDuplicationCheckRequestSchema = z.object({
  userName: z.string()
    .min(2, '이름은 2자 이상이어야 합니다.')
    .max(30, '이름은 30자 이하여야 합니다.')
    .regex(/^[가-힣a-zA-Z]+$/, '이름은 한글 또는 영문만 가능합니다.'),
  studentNumber: z.string().regex(/^\d{8}$/, '학번은 8자리 숫자여야 합니다.'),
  userHp: z.string().regex(/^01[0-9]{9}$/, '전화번호 형식이 올바르지 않습니다.'),
  clubUUID: z.string().uuid().optional(),
})

// Profile duplication check response
export const profileDuplicationCheckResponseSchema = z.object({
  exists: z.boolean(),
  classification: z.string().nullable(),
  inTargetClub: z.boolean().nullable(),
  clubUUIDs: z.array(z.string()).nullable(),
  targetClubUUID: z.string().nullable(),
  profileId: z.number().nullable(),
})

// Type inference
export type ProfileResponse = z.infer<typeof profileResponseSchema>
export type ProfileChangeRequest = z.infer<typeof profileChangeRequestSchema>
export type ProfileDuplicationCheckRequest = z.infer<typeof profileDuplicationCheckRequestSchema>
export type ProfileDuplicationCheckResponse = z.infer<typeof profileDuplicationCheckResponseSchema>
