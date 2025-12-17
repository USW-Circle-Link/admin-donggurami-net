import { apiClient } from '@shared/api/apiClient'
import type { ApiResponse } from '@shared/types/api'
import type {
  AdminClubListResponse,
  AdminClubDetail,
  CreateClubRequest,
  DeleteClubRequest,
  AdminCategory,
  CreateCategoryRequest,
  FloorPhotoResponse,
  FloorType,
} from '../domain/adminSchemas'

// ===== Admin Club API =====

export interface GetAdminClubsParams {
  page?: number
  size?: number
}

// GET /admin/clubs - 모든 동아리 목록 조회
export async function getAdminClubs(params?: GetAdminClubsParams): Promise<ApiResponse<AdminClubListResponse>> {
  const response = await apiClient.get<ApiResponse<AdminClubListResponse>>('/admin/clubs', { params })
  return response.data
}

// GET /admin/clubs/{clubUUID} - 동아리 상세 조회
export async function getAdminClub(clubUUID: string): Promise<ApiResponse<AdminClubDetail>> {
  const response = await apiClient.get<ApiResponse<AdminClubDetail>>(`/admin/clubs/${clubUUID}`)
  return response.data
}

// POST /admin/clubs - 동아리 추가
export async function createClub(request: CreateClubRequest): Promise<ApiResponse<string>> {
  const response = await apiClient.post<ApiResponse<string>>('/admin/clubs', request)
  return response.data
}

// DELETE /admin/clubs/{clubUUID} - 동아리 삭제
export async function deleteClub(clubUUID: string, request: DeleteClubRequest): Promise<ApiResponse<null>> {
  const response = await apiClient.delete<ApiResponse<null>>(`/admin/clubs/${clubUUID}`, { data: request })
  return response.data
}

// GET /admin/clubs/leader/check - 동아리 회장 아이디 중복 확인
export async function checkLeaderAccount(leaderAccount: string): Promise<ApiResponse<null>> {
  const response = await apiClient.get<ApiResponse<null>>('/admin/clubs/leader/check', {
    params: { leaderAccount },
  })
  return response.data
}

// GET /admin/clubs/name/check - 동아리 이름 중복 확인
export async function checkClubName(clubName: string): Promise<ApiResponse<null>> {
  const response = await apiClient.get<ApiResponse<null>>('/admin/clubs/name/check', {
    params: { clubName },
  })
  return response.data
}

// ===== Admin Club Category API =====

// GET /admin/clubs/category - 카테고리 조회
export async function getAdminCategories(): Promise<ApiResponse<AdminCategory[]>> {
  const response = await apiClient.get<ApiResponse<AdminCategory[]>>('/admin/clubs/category')
  return response.data
}

// POST /admin/clubs/category - 카테고리 추가
export async function createCategory(request: CreateCategoryRequest): Promise<ApiResponse<AdminCategory>> {
  const response = await apiClient.post<ApiResponse<AdminCategory>>('/admin/clubs/category', request)
  return response.data
}

// DELETE /admin/clubs/category/{clubCategoryUUID} - 카테고리 삭제
export async function deleteCategory(clubCategoryUUID: string): Promise<ApiResponse<AdminCategory>> {
  const response = await apiClient.delete<ApiResponse<AdminCategory>>(`/admin/clubs/category/${clubCategoryUUID}`)
  return response.data
}

// ===== Admin Floor Photo API =====

// GET /admin/floor/photo/{floor} - 층별 사진 조회
export async function getFloorPhoto(floor: FloorType): Promise<ApiResponse<FloorPhotoResponse>> {
  const response = await apiClient.get<ApiResponse<FloorPhotoResponse>>(`/admin/floor/photo/${floor}`)
  return response.data
}

// PUT /admin/floor/photo/{floor} - 층별 사진 업로드
export async function uploadFloorPhoto(floor: FloorType, photo: File): Promise<ApiResponse<FloorPhotoResponse>> {
  const formData = new FormData()
  formData.append('photo', photo)

  const response = await apiClient.put<ApiResponse<FloorPhotoResponse>>(`/admin/floor/photo/${floor}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

// DELETE /admin/floor/photo/{floor} - 층별 사진 삭제
export async function deleteFloorPhoto(floor: FloorType): Promise<ApiResponse<string>> {
  const response = await apiClient.delete<ApiResponse<string>>(`/admin/floor/photo/${floor}`)
  return response.data
}
