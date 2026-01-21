import { z } from 'zod'

// Department enum
export const departmentSchema = z.enum(['학술', '체육', '문화예술', '종교', '사회봉사'])

// Floor type enum
export const floorTypeSchema = z.enum(['B1', 'F1', 'F2'])

// ===== Admin Club =====

// Club list item (GET /admin/clubs)
export const adminClubListItemSchema = z.object({
  clubUUID: z.string().uuid(),
  clubName: z.string(),
  leaderName: z.string(),
  department: departmentSchema,
  leaderHp: z.string().optional(),
  numberOfClubMembers: z.number().optional(),
  mainPhoto: z.string().nullable().optional(),
})

// Paginated club list response
export const adminClubListResponseSchema = z.object({
  content: z.array(adminClubListItemSchema),
  totalPages: z.number(),
  totalElements: z.number(),
  currentPage: z.number(),
})

// Club detail (GET /admin/clubs/{clubUUID})
export const adminClubDetailSchema = z.object({
  clubUUID: z.string().uuid(),
  mainPhoto: z.string().nullable(),
  introPhotos: z.array(z.string()),
  clubName: z.string(),
  leaderName: z.string(),
  leaderHp: z.string(),
  clubInsta: z.string().nullable(),
  clubIntro: z.string().nullable(),
  recruitmentStatus: z.enum(['OPEN', 'CLOSED']),
  googleFormUrl: z.string().nullable(),
  clubHashtags: z.array(z.string()),
  clubCategoryNames: z.array(z.string()),
  clubRoomNumber: z.string(),
  clubRecruitment: z.string().nullable(),
})

// Create club request (POST /admin/clubs)
export const createClubRequestSchema = z.object({
  leaderAccount: z.string()
    .min(5, '아이디는 5자 이상이어야 합니다.')
    .max(20, '아이디는 20자 이하여야 합니다.')
    .regex(/^[a-zA-Z0-9]+$/, '아이디는 영문과 숫자만 가능합니다.'),
  leaderPw: z.string()
    .min(8, '비밀번호는 8자 이상이어야 합니다.')
    .max(20, '비밀번호는 20자 이하여야 합니다.')
    .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.'),
  leaderPwConfirm: z.string(),
  clubName: z.string()
    .min(1, '동아리명은 필수입니다.')
    .max(10, '동아리명은 10자 이하여야 합니다.'),
  department: departmentSchema,
  adminPw: z.string().min(1, '관리자 비밀번호는 필수입니다.'),
  clubRoomNumber: z.string().min(1, '동아리방 호수는 필수입니다.'),
}).refine((data) => data.leaderPw === data.leaderPwConfirm, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['leaderPwConfirm'],
})

// Delete club request (DELETE /admin/clubs/{clubUUID})
export const deleteClubRequestSchema = z.object({
  adminPw: z.string().min(1, '관리자 비밀번호는 필수입니다.'),
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

// Type inference from schemas
export type Department = z.infer<typeof departmentSchema>
export type FloorType = z.infer<typeof floorTypeSchema>
export type AdminClubListItem = z.infer<typeof adminClubListItemSchema>
export type AdminClubListResponse = z.infer<typeof adminClubListResponseSchema>
export type AdminClubDetail = z.infer<typeof adminClubDetailSchema>
export type CreateClubRequest = z.infer<typeof createClubRequestSchema>
export type DeleteClubRequest = z.infer<typeof deleteClubRequestSchema>
export type AdminCategory = z.infer<typeof adminCategorySchema>
export type CreateCategoryRequest = z.infer<typeof createCategoryRequestSchema>
export type FloorPhotoResponse = z.infer<typeof floorPhotoResponseSchema>
