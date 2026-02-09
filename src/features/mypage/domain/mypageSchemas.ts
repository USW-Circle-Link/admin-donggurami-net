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
  aplictUUID: z.string().uuid(),
})

// Floor photo response
export const floorPhotoSchema = z.object({
  roomFloor: z.enum(['B1', 'F1', 'F2']),
  floorPhotoPath: z.string(),
})

// Type inference
export type MyClubItem = z.infer<typeof myClubItemSchema>
export type AppliedClubItem = z.infer<typeof appliedClubItemSchema>
export type FloorPhoto = z.infer<typeof floorPhotoSchema>
