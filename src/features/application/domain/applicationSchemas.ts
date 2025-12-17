import { z } from 'zod'

// Can apply response
export const canApplyResponseSchema = z.boolean()

// Google form URL response (just a string)
export const googleFormUrlResponseSchema = z.string()

// Type inference
export type CanApplyResponse = z.infer<typeof canApplyResponseSchema>
export type GoogleFormUrlResponse = z.infer<typeof googleFormUrlResponseSchema>
