import { apiClient } from '@shared/api/apiClient'
import type { ApiResponse } from '@shared/types/api'
import type {
  RefreshTokenResponse,
  LoginUnifiedInput,
  LoginUnifiedResponse,
  SendVerificationMailInput,
  SendVerificationMailResponse,
  ConfirmSignupInput,
  ConfirmSignupResponse,
  CompleteSignupInput,
  FindIdInput,
  SendPasswordResetCodeInput,
  VerifyPasswordResetCodeInput,
  ResetPasswordInput,
} from '../domain/authSchemas'

// ============================================================================
// UNIFIED AUTH ENDPOINTS
// ============================================================================

/**
 * POST /auth/login
 * Unified login for USER, LEADER, ADMIN roles
 */
export async function loginUnified(
  credentials: LoginUnifiedInput
): Promise<ApiResponse<LoginUnifiedResponse>> {
  const response = await apiClient.post<ApiResponse<LoginUnifiedResponse>>(
    '/auth/login',
    credentials
  )
  return response.data
}

/**
 * POST /auth/logout
 * Unified logout
 */
export async function logoutUnified(): Promise<ApiResponse<null>> {
  const response = await apiClient.post<ApiResponse<null>>('/auth/logout')
  return response.data
}

/**
 * POST /auth/refresh
 * Unified token refresh
 */
export async function refreshTokenUnified(): Promise<ApiResponse<RefreshTokenResponse>> {
  const response = await apiClient.post<ApiResponse<RefreshTokenResponse>>('/auth/refresh')
  return response.data
}

// ============================================================================
// SIGNUP FLOW
// ============================================================================

/**
 * POST /auth/signup/verification-mail
 * Send verification email for signup
 */
export async function sendVerificationMail(
  data: SendVerificationMailInput
): Promise<ApiResponse<SendVerificationMailResponse>> {
  const response = await apiClient.post<ApiResponse<SendVerificationMailResponse>>(
    '/auth/signup/verification-mail',
    data
  )
  return response.data
}

/**
 * POST /auth/signup/verify
 * Confirm email verification and get signup token
 */
export async function confirmSignup(
  data: ConfirmSignupInput
): Promise<ApiResponse<ConfirmSignupResponse>> {
  const response = await apiClient.post<ApiResponse<ConfirmSignupResponse>>(
    '/auth/signup/verify',
    data
  )
  return response.data
}

/**
 * POST /auth/signup
 * Complete signup with user details
 * Requires custom headers: emailTokenUUID, signupUUID
 */
export async function completeSignup(
  data: CompleteSignupInput,
  headers: { emailTokenUUID: string; signupUUID: string }
): Promise<ApiResponse<null>> {
  const response = await apiClient.post<ApiResponse<null>>('/auth/signup', data, {
    headers: {
      emailTokenUUID: headers.emailTokenUUID,
      signupUUID: headers.signupUUID,
    },
  })
  return response.data
}

/**
 * GET /auth/check-Id
 * Check if ID is available (duplicate check)
 */
export async function checkIdDuplication(accountId: string): Promise<ApiResponse<null>> {
  const response = await apiClient.get<ApiResponse<null>>('/auth/check-Id', {
    params: { Id: accountId },
  })
  return response.data
}

// ============================================================================
// PASSWORD RECOVERY
// ============================================================================

/**
 * POST /auth/find-id
 * Find account ID by email
 */
export async function findId(data: FindIdInput): Promise<ApiResponse<null>> {
  const response = await apiClient.post<ApiResponse<null>>('/auth/find-id', data)
  return response.data
}

/**
 * POST /auth/password/reset-code
 * Send password reset verification code
 */
export async function sendPasswordResetCode(
  data: SendPasswordResetCodeInput
): Promise<ApiResponse<string>> {
  const response = await apiClient.post<ApiResponse<string>>('/auth/password/reset-code', data)
  return response.data
}

/**
 * POST /auth/password/verify
 * Verify password reset code
 * Requires custom header: uuid (from reset-code response)
 */
export async function verifyPasswordResetCode(
  data: VerifyPasswordResetCodeInput,
  uuid: string
): Promise<ApiResponse<null>> {
  const response = await apiClient.post<ApiResponse<null>>('/auth/password/verify', data, {
    headers: { uuid },
  })
  return response.data
}

/**
 * PATCH /auth/password/reset
 * Reset password with new password
 * Requires custom header: uuid (from reset-code response)
 */
export async function resetPassword(
  data: ResetPasswordInput,
  uuid: string
): Promise<ApiResponse<null>> {
  const response = await apiClient.patch<ApiResponse<null>>('/auth/password/reset', data, {
    headers: { uuid },
  })
  return response.data
}

// ============================================================================
// ACCOUNT DELETION
// ============================================================================

/**
 * POST /auth/withdrawal/code
 * Send withdrawal verification code email
 * Requires authentication (Bearer token)
 */
export async function sendWithdrawalCode(): Promise<ApiResponse<null>> {
  const response = await apiClient.post<ApiResponse<null>>('/auth/withdrawal/code')
  return response.data
}
