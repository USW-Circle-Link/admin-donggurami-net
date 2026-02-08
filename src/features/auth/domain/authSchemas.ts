import { z } from 'zod'

// ============================================================================
// AUTH SCHEMAS
// ============================================================================

// Refresh Token Response
export const refreshTokenResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
})

// Role enum
export const roleEnum = z.enum(['USER', 'LEADER', 'ADMIN'])
export type Role = z.infer<typeof roleEnum>

// Unified Login Request
export const loginUnifiedSchema = z.object({
  account: z.string().min(5).max(20).regex(/^[a-zA-Z0-9]+$/, 'Account must be alphanumeric'),
  password: z.string().min(8).max(20),
  fcmToken: z.string().optional(),
  clientId: z.string().optional(),
})

// Unified Login Response
export const loginUnifiedResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  role: roleEnum,
  clubuuid: z.string().uuid().optional(),
  isAgreedTerms: z.boolean().optional(),
})

// Send Verification Mail Request
export const sendVerificationMailSchema = z.object({
  email: z.string().regex(/^[a-zA-Z0-9._-]+$/, 'Invalid email format'),
})

// Send Verification Mail Response
export const sendVerificationMailResponseSchema = z.object({
  emailToken_uuid: z.string().uuid(),
  email: z.string(),
})

// Confirm Signup Request
export const confirmSignupSchema = z.object({
  email: z.string(),
})

// Confirm Signup Response
export const confirmSignupResponseSchema = z.object({
  emailTokenUUID: z.string().uuid(),
  signupUUID: z.string().uuid(),
})

// Complete Signup Request
export const completeSignupSchema = z.object({
  account: z.string().min(5).max(20).regex(/^[a-zA-Z0-9]+$/, 'Account must be alphanumeric'),
  password: z.string().min(8).max(20).regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).+$/, 'Password must contain letters, numbers, and special characters'),
  confirmPassword: z.string(),
  userName: z.string().min(2).max(30).regex(/^[가-힣a-zA-Z]+$/, 'Name must be Korean or English letters only'),
  telephone: z.string().regex(/^\d{11}$/, 'Phone number must be 11 digits'),
  studentNumber: z.string().regex(/^\d{8}$/, 'Student number must be 8 digits'),
  major: z.string().min(1).max(20),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

// Find Id Request
export const findIdSchema = z.object({
  email: z.string(),
})

// Send Password Reset Code Request
export const sendPasswordResetCodeSchema = z.object({
  userAccount: z.string().min(5).max(20).regex(/^[a-zA-Z0-9]+$/, 'Account must be alphanumeric'),
  email: z.string(),
})

// Verify Password Reset Code Request
export const verifyPasswordResetCodeSchema = z.object({
  authCode: z.string(),
})

// Reset Password Request
export const resetPasswordSchema = z.object({
  password: z.string().min(8).max(20).regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).+$/, 'Password must contain letters, numbers, and special characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

// ============================================================================
// TYPE INFERENCE
// ============================================================================

export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>
export type LoginUnifiedInput = z.infer<typeof loginUnifiedSchema>
export type LoginUnifiedResponse = z.infer<typeof loginUnifiedResponseSchema>
export type SendVerificationMailInput = z.infer<typeof sendVerificationMailSchema>
export type SendVerificationMailResponse = z.infer<typeof sendVerificationMailResponseSchema>
export type ConfirmSignupInput = z.infer<typeof confirmSignupSchema>
export type ConfirmSignupResponse = z.infer<typeof confirmSignupResponseSchema>
export type CompleteSignupInput = z.infer<typeof completeSignupSchema>
export type FindIdInput = z.infer<typeof findIdSchema>
export type SendPasswordResetCodeInput = z.infer<typeof sendPasswordResetCodeSchema>
export type VerifyPasswordResetCodeInput = z.infer<typeof verifyPasswordResetCodeSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
