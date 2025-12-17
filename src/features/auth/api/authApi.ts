import { apiClient } from '@shared/api/apiClient'
import type { ApiResponse } from '@shared/types/api'
import type {
  ClubLeaderLoginInput,
  AdminLoginInput,
  ClubLeaderLoginResponse,
  AdminLoginResponse,
  RefreshTokenResponse,
} from '../domain/authSchemas'

export async function loginClubLeader(
  credentials: ClubLeaderLoginInput
): Promise<ApiResponse<ClubLeaderLoginResponse>> {
  const response = await apiClient.post<ApiResponse<ClubLeaderLoginResponse>>(
    '/club-leader/login',
    credentials
  )
  return response.data
}

export async function loginAdmin(
  credentials: AdminLoginInput
): Promise<ApiResponse<AdminLoginResponse>> {
  const response = await apiClient.post<ApiResponse<AdminLoginResponse>>(
    '/admin/login',
    credentials
  )
  return response.data
}

export async function logout(): Promise<void> {
  await apiClient.post('/integration/logout')
}

export async function refreshToken(): Promise<ApiResponse<RefreshTokenResponse>> {
  const response = await apiClient.post<ApiResponse<RefreshTokenResponse>>(
    '/integration/refresh-token'
  )
  return response.data
}
