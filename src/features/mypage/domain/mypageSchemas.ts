import { z } from 'zod'

// My club item
export const myClubItemSchema = z.object({
  clubUUID: z.string().uuid(),
  mainPhotoPath: z.string().nullable(),
  clubName: z.string(),
  leaderName: z.string(),
  leaderHp: z.string(),
  clubInsta: z.string().nullable(),
  clubRoomNumber: z.string(),
})

// Applied club item (includes application status)
export const appliedClubItemSchema = z.object({
  clubUUID: z.string().uuid(),
  mainPhotoPath: z.string().nullable(),
  clubName: z.string(),
  leaderName: z.string(),
  leaderHp: z.string(),
  clubInsta: z.string().nullable(),
  clubRoomNumber: z.string(),
  aplictStatus: z.enum(['WAIT', 'PASS', 'FAIL']),
})

// Floor photo response
export const floorPhotoSchema = z.object({
  roomFloor: z.enum(['B1', 'F1', 'F2']),
  floorPhotoPath: z.string(),
})

// My notice item
export const myNoticeItemSchema = z.object({
  noticeUUID: z.string().uuid(),
  noticeTitle: z.string(),
  adminName: z.string(),
  noticeCreatedAt: z.string(),
})

// My notice detail
export const myNoticeDetailSchema = z.object({
  noticeUUID: z.string().uuid(),
  noticeTitle: z.string(),
  noticeContent: z.string(),
  noticePhotos: z.array(z.string()),
  noticeCreatedAt: z.string(),
  adminName: z.string(),
})

// Type inference
export type MyClubItem = z.infer<typeof myClubItemSchema>
export type AppliedClubItem = z.infer<typeof appliedClubItemSchema>
export type FloorPhoto = z.infer<typeof floorPhotoSchema>
export type MyNoticeItem = z.infer<typeof myNoticeItemSchema>
export type MyNoticeDetail = z.infer<typeof myNoticeDetailSchema>
