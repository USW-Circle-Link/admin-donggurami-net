import { z } from 'zod'

// Department enum
export const departmentSchema = z.enum(['학술', '종교', '예술', '체육', '공연', '봉사'])

// Floor type enum
export const floorTypeSchema = z.enum(['B1', 'F1', 'F2'])

// ===== Admin Club List =====

// Admin club list item (GET /clubs)
export const adminClubListItemSchema = z.object({
  clubUUID: z.string().uuid(),
  clubName: z.string(),
  mainPhotoUrl: z.string().nullable(),
  department: departmentSchema,
  hashtags: z.array(z.string()),
  leaderName: z.string(),
  leaderHp: z.string(),
  memberCount: z.number(),
  recruitmentStatus: z.enum(['OPEN', 'CLOSE']),
})

// Create club request (POST /clubs)
export const createClubRequestSchema = z.object({
  leaderAccount: z.string()
    .min(5, '아이디는 5자 이상이어야 합니다.')
    .max(20, '아이디는 20자 이하여야 합니다.')
    .regex(/^[a-zA-Z0-9]+$/, '아이디는 영문, 숫자만 가능합니다.'),
  leaderPw: z.string()
    .min(8, '비밀번호는 8자 이상이어야 합니다.')
    .max(20, '비밀번호는 20자 이하여야 합니다.')
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/, '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.'),
  leaderPwConfirm: z.string(),
  clubName: z.string()
    .min(1, '동아리명은 필수입니다.')
    .max(10, '동아리명은 10자 이하여야 합니다.')
    .regex(/^[가-힣a-zA-Z0-9]+$/, '동아리명은 한글, 영문, 숫자만 가능합니다.'),
  department: departmentSchema,
  adminPw: z.string(),
  clubRoomNumber: z.string(),
}).refine((data) => data.leaderPw === data.leaderPwConfirm, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['leaderPwConfirm'],
})

// ===== Admin Club Category =====

// Category item
export const adminCategorySchema = z.object({
  clubCategoryUUID: z.string().uuid(),
  clubCategoryName: z.string(),
})

// Create category request (POST /admin/clubs/category)
export const createCategoryRequestSchema = z.object({
  clubCategoryName: z.string()
    .min(1, '카테고리명은 필수입니다.')
    .max(20, '카테고리명은 20자 이하여야 합니다.'),
})

// ===== Admin Floor Photo =====

// Floor photo response
export const floorPhotoResponseSchema = z.object({
  floor: floorTypeSchema,
  presignedUrl: z.string(),
})

export const mergedClubItemSchema = z.object({
  clubUUID: z.string().uuid(),
  clubName: z.string(),
  leaderName: z.string(),
  department: departmentSchema,
  leaderHp: z.string().optional(),
  numberOfClubMembers: z.number().optional(),
  mainPhoto: z.string().nullable(),
  clubHashtags: z.array(z.string()).optional(),
  isRecruiting: z.boolean().default(false),
})

// Type inference from schemas
export type Department = z.infer<typeof departmentSchema>
export type FloorType = z.infer<typeof floorTypeSchema>
export type AdminClubListItem = z.infer<typeof adminClubListItemSchema>
export type CreateClubRequest = z.infer<typeof createClubRequestSchema>
export type AdminCategory = z.infer<typeof adminCategorySchema>
export type CreateCategoryRequest = z.infer<typeof createCategoryRequestSchema>
export type FloorPhotoResponse = z.infer<typeof floorPhotoResponseSchema>
export type MergedClubItem = z.infer<typeof mergedClubItemSchema>

// Delete club request (DELETE /clubs/{clubUUID})
export const deleteClubRequestSchema = z.object({
  adminPw: z.string().min(1, '관리자 비밀번호는 필수입니다.'),
})

// ===== Admin Club Validation =====

// Validation response (common pattern)
export const validationResponseSchema = z.object({
  message: z.string(),
  data: z.null(),
})

// Type inference
export type DeleteClubRequest = z.infer<typeof deleteClubRequestSchema>
export type ValidationResponse = z.infer<typeof validationResponseSchema>
