import { z } from 'zod'

// Notice list item (GET /notices)
export const noticeListItemSchema = z.object({
  noticeUUID: z.string().uuid(),
  noticeTitle: z.string().min(1),
  noticeCreatedAt: z.string(),
  authorName: z.string(),
})

// Paginated notice list response
export const noticeListResponseSchema = z.object({
  content: z.array(noticeListItemSchema),
  totalPages: z.number(),
  totalElements: z.number(),
  currentPage: z.number(),
})

// Notice detail (GET /notices/{noticeUUID})
export const noticeDetailSchema = z.object({
  noticeUUID: z.string().uuid(),
  noticeTitle: z.string().min(1),
  noticeContent: z.string().min(1),
  noticePhotos: z.array(z.string()),
  noticeCreatedAt: z.string(),
  authorName: z.string(),
})

// Create notice request (POST /notices)
export const createNoticeRequestSchema = z.object({
  noticeTitle: z.string().min(1, '제목은 필수입니다.').max(200, '제목은 200자 이하여야 합니다.'),
  noticeContent: z.string().min(1, '내용은 필수입니다.').max(3000, '내용은 3000자 이하여야 합니다.'),
  photoOrders: z.array(z.number().min(1).max(5)).max(5, '사진은 최대 5개까지 가능합니다.').optional().default([]),
})

// Update notice request (PUT /notices/{noticeUUID})
export const updateNoticeRequestSchema = z.object({
  noticeTitle: z.string().min(1, '제목은 필수입니다.').max(200, '제목은 200자 이하여야 합니다.'),
  noticeContent: z.string().min(1, '내용은 필수입니다.').max(3000, '내용은 3000자 이하여야 합니다.'),
  photoOrders: z.array(z.number().min(1).max(5)).max(5, '사진은 최대 5개까지 가능합니다.').optional().default([]),
})

// Type inference from schemas
export type NoticeListItem = z.infer<typeof noticeListItemSchema>
export type NoticeListResponse = z.infer<typeof noticeListResponseSchema>
export type NoticeDetail = z.infer<typeof noticeDetailSchema>
export type CreateNoticeRequest = z.infer<typeof createNoticeRequestSchema>
export type UpdateNoticeRequest = z.infer<typeof updateNoticeRequestSchema>
