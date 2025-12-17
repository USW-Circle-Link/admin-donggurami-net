import { z } from 'zod'

// Common recruitment status enum
export const recruitmentStatusSchema = z.enum(['OPEN', 'CLOSED'])

// Club list response (GET /clubs, GET /clubs/open)
export const clubListResponseSchema = z.object({
  clubUUID: z.string().uuid(),
  clubName: z.string().min(1),
  mainPhoto: z.string().nullable(),
  departmentName: z.string(),
  clubHashtags: z.array(z.string()),
})

// Category response (GET /clubs/categories)
export const clubCategoryResponseSchema = z.object({
  clubCategoryUUID: z.string().uuid(),
  clubCategoryName: z.string().min(1),
})

// Club list by category response (GET /clubs/filter, GET /clubs/open/filter)
export const clubListByCategoryResponseSchema = z.object({
  clubCategoryUUID: z.string().uuid(),
  clubCategoryName: z.string().min(1),
  clubs: z.array(clubListResponseSchema),
})

// Club intro response (GET /clubs/intro/{clubUUID})
export const clubIntroResponseSchema = z.object({
  clubUUID: z.string().uuid(),
  mainPhoto: z.string().nullable(),
  introPhotos: z.array(z.string()),
  clubName: z.string().min(1),
  leaderName: z.string().min(1),
  leaderHp: z.string(),
  clubInsta: z.string().nullable(),
  clubIntro: z.string().nullable(),
  recruitmentStatus: recruitmentStatusSchema,
  googleFormUrl: z.string().nullable(),
  clubHashtags: z.array(z.string()),
  clubCategoryNames: z.array(z.string()),
  clubRoomNumber: z.string(),
  clubRecruitment: z.string().nullable(),
})

// Simple club response (GET /clubs/list)
export const clubSimpleResponseSchema = z.object({
  clubUUID: z.string().uuid(),
  clubName: z.string().min(1),
  mainPhoto: z.string().nullable(),
})

// Type inference from schemas
export type RecruitmentStatus = z.infer<typeof recruitmentStatusSchema>
export type ClubListResponse = z.infer<typeof clubListResponseSchema>
export type ClubCategoryResponse = z.infer<typeof clubCategoryResponseSchema>
export type ClubListByCategoryResponse = z.infer<typeof clubListByCategoryResponseSchema>
export type ClubIntroResponse = z.infer<typeof clubIntroResponseSchema>
export type ClubSimpleResponse = z.infer<typeof clubSimpleResponseSchema>
