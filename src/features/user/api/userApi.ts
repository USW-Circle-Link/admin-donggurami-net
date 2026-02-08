import { apiClient } from '@shared/api/apiClient'
import type { ApiResponse } from '@shared/types/api'
import type {
  UserProfileResponse,
  UpdateMyProfileRequest,
  ChangeMyPasswordRequest,
  WithdrawUserRequest,
  MyClubSummary,
  MyApplicationSummary,
} from '../domain/userSchemas'

// ===== User Profile Endpoints =====

// GET /users/me - 내 프로필 조회
export async function getMyProfile(): Promise<ApiResponse<UserProfileResponse>> {
  const response = await apiClient.get<ApiResponse<UserProfileResponse>>('/users/me')
  return response.data
}

// PATCH /users/me - 내 프로필 수정
export async function updateMyProfile(request: UpdateMyProfileRequest): Promise<ApiResponse<UserProfileResponse>> {
  const response = await apiClient.patch<ApiResponse<UserProfileResponse>>('/users/me', request)
  return response.data
}

// PATCH /users/me/password - 비밀번호 변경
export async function changeMyPassword(request: ChangeMyPasswordRequest): Promise<ApiResponse<null>> {
  const response = await apiClient.patch<ApiResponse<null>>('/users/me/password', request)
  return response.data
}

// DELETE /users/me - 회원 탈퇴
export async function withdrawUser(request: WithdrawUserRequest): Promise<ApiResponse<null>> {
  const response = await apiClient.delete<ApiResponse<null>>('/users/me', { data: request })
  return response.data
}

// GET /users/me/clubs - 내 동아리 목록 조회
export async function getMyClubs(): Promise<ApiResponse<MyClubSummary[]>> {
  const response = await apiClient.get<ApiResponse<MyClubSummary[]>>('/users/me/clubs')
  return response.data
}

// GET /users/me/applications - 내 지원서 목록 조회
export async function getMyApplications(): Promise<ApiResponse<MyApplicationSummary[]>> {
  const response = await apiClient.get<ApiResponse<MyApplicationSummary[]>>('/users/me/applications')
  return response.data
}
