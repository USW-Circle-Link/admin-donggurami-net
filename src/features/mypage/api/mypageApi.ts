import { apiClient } from '@shared/api/apiClient'
import type { ApiResponse } from '@shared/types/api'
import type { MyClubItem, AppliedClubItem, FloorPhoto } from '../domain/mypageSchemas'

// GET /users/me/clubs - 소속된 동아리 조회
export async function getMyClubs(): Promise<ApiResponse<MyClubItem[]>> {
  const response = await apiClient.get<ApiResponse<MyClubItem[]>>('/users/me/clubs')
  return response.data
}

// GET /users/me/applications - 지원한 동아리 조회
export async function getAppliedClubs(): Promise<ApiResponse<AppliedClubItem[]>> {
  const response = await apiClient.get<ApiResponse<AppliedClubItem[]>>('/users/me/applications')
  return response.data
}

// GET /users/clubs/{floor}/photo - 동아리방 층별 사진 조회
export async function getFloorPhoto(floor: 'B1' | 'F1' | 'F2'): Promise<ApiResponse<FloorPhoto>> {
  const response = await apiClient.get<ApiResponse<FloorPhoto>>(`/users/clubs/${floor}/photo`)
  return response.data
}
