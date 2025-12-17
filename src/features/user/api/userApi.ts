import { apiClient } from '@shared/api/apiClient'
import type { ApiResponse } from '@shared/types/api'
import type {
  ChangePasswordRequest,
  SendAuthCodeRequest,
  VerifyAuthCodeRequest,
  ResetPasswordRequest,
  TemporaryRegisterRequest,
  SignupRequest,
  UserLoginRequest,
  UserLoginResponse,
  ExitAuthCodeRequest,
} from '../domain/userSchemas'

// PATCH /users/userpw - 비밀번호 변경
export async function changePassword(request: ChangePasswordRequest): Promise<ApiResponse<null>> {
  const response = await apiClient.patch<ApiResponse<null>>('/users/userpw', request)
  return response.data
}

// GET /users/find-account/{email} - 아이디 찾기
export async function findAccount(email: string): Promise<ApiResponse<null>> {
  const response = await apiClient.get<ApiResponse<null>>(`/users/find-account/${email}`)
  return response.data
}

// POST /users/auth/send-code - 인증 코드 전송
export async function sendAuthCode(request: SendAuthCodeRequest): Promise<ApiResponse<string>> {
  const response = await apiClient.post<ApiResponse<string>>('/users/auth/send-code', request)
  return response.data
}

// POST /users/auth/verify-token - 인증 코드 검증
export async function verifyAuthCode(request: VerifyAuthCodeRequest): Promise<ApiResponse<null>> {
  const response = await apiClient.post<ApiResponse<null>>('/users/auth/verify-token', request)
  return response.data
}

// PATCH /users/reset-password - 비밀번호 재설정
export async function resetPassword(request: ResetPasswordRequest): Promise<ApiResponse<null>> {
  const response = await apiClient.patch<ApiResponse<null>>('/users/reset-password', request)
  return response.data
}

// POST /users/check/{email}/duplicate - 이메일 중복 확인
export async function checkEmailDuplicate(email: string): Promise<ApiResponse<null>> {
  const response = await apiClient.post<ApiResponse<null>>(`/users/check/${email}/duplicate`, { email })
  return response.data
}

// GET /users/verify-duplicate/{account} - 아이디 중복 체크
export async function checkAccountDuplicate(account: string): Promise<ApiResponse<null>> {
  const response = await apiClient.get<ApiResponse<null>>(`/users/verify-duplicate/${account}`)
  return response.data
}

// POST /users/temporary/register - 신규회원가입 요청 (인증 메일 전송)
export async function temporaryRegister(request: TemporaryRegisterRequest): Promise<ApiResponse<{ emailToken_uuid: string; email: string }>> {
  const response = await apiClient.post<ApiResponse<{ emailToken_uuid: string; email: string }>>('/users/temporary/register', request)
  return response.data
}

// POST /users/email/verification - 인증 확인 버튼 클릭
export async function confirmEmailVerification(email: string): Promise<ApiResponse<{ emailTokenUUID: string; signupUUID: string }>> {
  const response = await apiClient.post<ApiResponse<{ emailTokenUUID: string; signupUUID: string }>>('/users/email/verification', { email })
  return response.data
}

// POST /users/signup - 회원 가입 정보 등록
export async function signup(request: SignupRequest): Promise<ApiResponse<null>> {
  const response = await apiClient.post<ApiResponse<null>>('/users/signup', request)
  return response.data
}

// POST /users/login - 사용자 로그인
export async function userLogin(request: UserLoginRequest): Promise<ApiResponse<UserLoginResponse>> {
  const response = await apiClient.post<ApiResponse<UserLoginResponse>>('/users/login', request)
  return response.data
}

// POST /users/exit/send-code - 회원 탈퇴 요청 및 메일 전송
export async function sendExitCode(): Promise<ApiResponse<null>> {
  const response = await apiClient.post<ApiResponse<null>>('/users/exit/send-code')
  return response.data
}

// DELETE /users/exit - 회원 탈퇴 인증 및 탈퇴 처리
export async function exitUser(request: ExitAuthCodeRequest): Promise<ApiResponse<null>> {
  const response = await apiClient.delete<ApiResponse<null>>('/users/exit', { data: request })
  return response.data
}
