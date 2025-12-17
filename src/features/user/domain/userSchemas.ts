import { z } from 'zod'

// ===== Password Change =====
export const changePasswordRequestSchema = z.object({
  userPw: z.string().min(1, '현재 비밀번호는 필수입니다.'),
  newPw: z.string()
    .min(8, '비밀번호는 8자 이상이어야 합니다.')
    .max(20, '비밀번호는 20자 이하여야 합니다.')
    .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.'),
  confirmNewPw: z.string(),
}).refine((data) => data.newPw === data.confirmNewPw, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['confirmNewPw'],
})

// ===== Password Recovery =====
export const sendAuthCodeRequestSchema = z.object({
  userAccount: z.string()
    .min(5, '아이디는 5자 이상이어야 합니다.')
    .max(20, '아이디는 20자 이하여야 합니다.')
    .regex(/^[a-zA-Z0-9]+$/, '아이디는 영문과 숫자만 가능합니다.'),
  email: z.string().min(1).max(30, '이메일은 30자 이하여야 합니다.'),
})

export const verifyAuthCodeRequestSchema = z.object({
  authCode: z.string().min(1, '인증 코드는 필수입니다.'),
})

export const resetPasswordRequestSchema = z.object({
  password: z.string()
    .min(8, '비밀번호는 8자 이상이어야 합니다.')
    .max(20, '비밀번호는 20자 이하여야 합니다.')
    .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['confirmPassword'],
})

// ===== Registration =====
export const temporaryRegisterRequestSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다.'),
})

export const emailVerificationResponseSchema = z.object({
  emailTokenUUID: z.string().uuid(),
  signupUUID: z.string().uuid(),
})

export const signupRequestSchema = z.object({
  account: z.string()
    .min(5, '아이디는 5자 이상이어야 합니다.')
    .max(20, '아이디는 20자 이하여야 합니다.')
    .regex(/^[a-zA-Z0-9]+$/, '아이디는 영문과 숫자만 가능합니다.'),
  password: z.string()
    .min(8, '비밀번호는 8자 이상이어야 합니다.')
    .max(20, '비밀번호는 20자 이하여야 합니다.')
    .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.'),
  confirmPassword: z.string(),
  userName: z.string()
    .min(2, '이름은 2자 이상이어야 합니다.')
    .max(30, '이름은 30자 이하여야 합니다.')
    .regex(/^[가-힣a-zA-Z]+$/, '이름은 한글 또는 영문만 가능합니다.'),
  telephone: z.string().regex(/^01[0-9]{9}$/, '전화번호 형식이 올바르지 않습니다.'),
  studentNumber: z.string().regex(/^\d{8}$/, '학번은 8자리 숫자여야 합니다.'),
  major: z.string().min(1).max(20, '학과는 20자 이하여야 합니다.'),
}).refine((data) => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['confirmPassword'],
})

// ===== User Login =====
export const userLoginRequestSchema = z.object({
  account: z.string()
    .min(5, '아이디는 5자 이상이어야 합니다.')
    .max(20, '아이디는 20자 이하여야 합니다.')
    .regex(/^[a-zA-Z0-9]+$/, '아이디는 영문과 숫자만 가능합니다.'),
  password: z.string().min(1, '비밀번호는 필수입니다.'),
  fcmToken: z.string().optional(),
})

export const userLoginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
})

// ===== User Exit =====
export const exitAuthCodeRequestSchema = z.object({
  authCode: z.string().min(1, '인증 코드는 필수입니다.'),
})

// Type inference
export type ChangePasswordRequest = z.infer<typeof changePasswordRequestSchema>
export type SendAuthCodeRequest = z.infer<typeof sendAuthCodeRequestSchema>
export type VerifyAuthCodeRequest = z.infer<typeof verifyAuthCodeRequestSchema>
export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>
export type TemporaryRegisterRequest = z.infer<typeof temporaryRegisterRequestSchema>
export type EmailVerificationResponse = z.infer<typeof emailVerificationResponseSchema>
export type SignupRequest = z.infer<typeof signupRequestSchema>
export type UserLoginRequest = z.infer<typeof userLoginRequestSchema>
export type UserLoginResponse = z.infer<typeof userLoginResponseSchema>
export type ExitAuthCodeRequest = z.infer<typeof exitAuthCodeRequestSchema>
