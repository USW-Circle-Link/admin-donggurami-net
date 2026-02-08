import { z } from 'zod'

export const floorEnumSchema = z.enum(['B1', 'F1', 'F2'])
export type FloorEnum = z.infer<typeof floorEnumSchema>

export const floorMapResponseSchema = z.object({
  floor: floorEnumSchema,
  presignedUrl: z.string(),
})

export type FloorMapResponse = z.infer<typeof floorMapResponseSchema>

// For upload - just type definition, files handled separately
export interface UploadFloorMapsRequest {
  B1?: File
  F1?: File
  F2?: File
}
