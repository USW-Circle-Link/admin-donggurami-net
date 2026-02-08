import { apiClient } from '@shared/api/apiClient'
import type { ApiResponse } from '@shared/types/api'
import type {
  FloorPhotoResponse,
  FloorType,
  AdminClubPageList,
  CreateClubRequest,
  DeleteClubRequest,
  MergedClubItem,
  ValidationResponse,
} from '../domain/adminSchemas'

// ===== Floor Maps API =====

// GET /floor-maps - 층별 사진 조회
export async function getFloorPhoto(floor?: FloorType): Promise<ApiResponse<FloorPhotoResponse>> {
  const response = await apiClient.get<ApiResponse<FloorPhotoResponse>>('/floor-maps', {
    params: floor ? { floor } : undefined,
  })
  return response.data
}

// PUT /floor-maps - 층별 사진 업로드 (multipart with B1, F1, F2 file fields)
export async function uploadFloorPhotos(files: { B1?: File; F1?: File; F2?: File }): Promise<ApiResponse<null>> {
  const formData = new FormData()
  if (files.B1) formData.append('B1', files.B1)
  if (files.F1) formData.append('F1', files.F1)
  if (files.F2) formData.append('F2', files.F2)

  const response = await apiClient.put<ApiResponse<null>>('/floor-maps', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

// DELETE /floor-maps/{floorEnum} - 층별 사진 삭제
export async function deleteFloorPhoto(floor: FloorType): Promise<ApiResponse<string>> {
  const response = await apiClient.delete<ApiResponse<string>>(`/floor-maps/${floor}`)
  return response.data
}

// ===== Admin Clubs API =====

export interface GetAdminClubsParams {
  page?: number
  size?: number
}

// GET /clubs - 전체 동아리 조회 (페이지네이션)
export async function getAdminClubs(
  params?: GetAdminClubsParams
): Promise<ApiResponse<AdminClubPageList>> {
  const response = await apiClient.get<ApiResponse<AdminClubPageList>>('/clubs', { params })
  return response.data
}

// POST /clubs - 동아리 생성
export async function createClub(request: CreateClubRequest): Promise<ApiResponse<string>> {
  const response = await apiClient.post<ApiResponse<string>>('/clubs', request)
  return response.data
}

// GET /clubs/{clubUUID} - 동아리 상세 조회
export async function getAdminClub(clubUUID: string): Promise<ApiResponse<MergedClubItem>> {
  const response = await apiClient.get<ApiResponse<MergedClubItem>>(`/clubs/${clubUUID}`)
  return response.data
}

// DELETE /clubs/{clubUUID} - 동아리 삭제
export async function deleteAdminClub(
  clubUUID: string,
  request: DeleteClubRequest
): Promise<ApiResponse<number>> {
  const response = await apiClient.delete<ApiResponse<number>>(`/clubs/${clubUUID}`, {
    data: request,
  })
  return response.data
}

// GET /clubs/check-duplication?type=name - 동아리명 중복 확인
export async function checkClubNameDuplicate(clubName: string): Promise<ValidationResponse> {
  const response = await apiClient.get<ValidationResponse>('/clubs/check-duplication', {
    params: { type: 'name', val: clubName },
  })
  return response.data
}

// GET /clubs/check-duplication?type=leader - 회장 계정 중복 확인
export async function checkLeaderAccountDuplicate(leaderAccount: string): Promise<ValidationResponse> {
  const response = await apiClient.get<ValidationResponse>('/clubs/check-duplication', {
    params: { type: 'leader', val: leaderAccount },
  })
  return response.data
}
