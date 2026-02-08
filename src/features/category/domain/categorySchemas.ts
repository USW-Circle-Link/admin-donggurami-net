import { z } from 'zod'

export const categorySchema = z.object({
  clubCategoryUUID: z.string().uuid(),
  clubCategoryName: z.string().min(1).max(20),
})

export const createCategoryRequestSchema = z.object({
  clubCategoryName: z
    .string()
    .min(1, '카테고리명은 필수입니다.')
    .max(20, '카테고리명은 20자 이하여야 합니다.'),
})

export type Category = z.infer<typeof categorySchema>
export type CreateCategoryRequest = z.infer<typeof createCategoryRequestSchema>
