import { apiClient } from '@shared/api/apiClient'
import type { ApiResponse } from '@shared/types/api'
import type {
  FloorPhotoResponse,
  FloorType,
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
