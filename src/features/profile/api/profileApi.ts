import { apiClient } from '@shared/api/apiClient'
import type { ApiResponse } from '@shared/types/api'
import type {
  ProfileResponse,
  ProfileChangeRequest,
  ProfileDuplicationCheckRequest,
  ProfileDuplicationCheckResponse,
} from '../domain/profileSchemas'

// GET /users/me - 내 프로필 조회
export async function getMyProfile(): Promise<ApiResponse<ProfileResponse>> {
  const response = await apiClient.get<ApiResponse<ProfileResponse>>('/users/me')
  return response.data
}

// PATCH /users/me - 프로필 수정
export async function changeProfile(request: ProfileChangeRequest): Promise<ApiResponse<ProfileResponse>> {
  const response = await apiClient.patch<ApiResponse<ProfileResponse>>('/users/me', request)
  return response.data
}

// POST /users/profile/duplication-check - 프로필 중복 확인
export async function checkProfileDuplication(request: ProfileDuplicationCheckRequest): Promise<ApiResponse<ProfileDuplicationCheckResponse>> {
  const response = await apiClient.post<ApiResponse<ProfileDuplicationCheckResponse>>('/users/profile/duplication-check', request)
  return response.data
}
