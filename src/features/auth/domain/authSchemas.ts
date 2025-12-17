import { z } from 'zod'

// Club Leader Login Request
export const clubLeaderLoginSchema = z.object({
  leaderAccount: z.string().min(1, 'Account is required'),
  leaderPw: z.string().min(1, 'Password is required'),
  loginType: z.literal('LEADER').optional().default('LEADER'),
})

// Admin Login Request
export const adminLoginSchema = z.object({
  adminAccount: z.string().min(1, 'Account is required'),
  adminPw: z.string().min(1, 'Password is required'),
  clientId: z.string().optional(),
})

// Club Leader Login Response (includes clubUUID, isAgreedTerms)
export const clubLeaderLoginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  role: z.literal('LEADER'),
  clubUUID: z.string().uuid(),
  isAgreedTerms: z.boolean(),
})

// Admin Login Response (no clubUUID, isAgreedTerms)
export const adminLoginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  role: z.literal('ADMIN'),
})

// Refresh Token Response (returns both tokens)
export const refreshTokenResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
})

// Type inference from schemas
export type ClubLeaderLoginInput = z.infer<typeof clubLeaderLoginSchema>
export type AdminLoginInput = z.infer<typeof adminLoginSchema>
export type ClubLeaderLoginResponse = z.infer<typeof clubLeaderLoginResponseSchema>
export type AdminLoginResponse = z.infer<typeof adminLoginResponseSchema>
export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>

// Union type for backward compatibility
export type LoginResponseData = ClubLeaderLoginResponse | AdminLoginResponse
