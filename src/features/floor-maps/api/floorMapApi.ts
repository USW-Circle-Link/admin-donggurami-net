import { apiClient } from '@shared/api/apiClient'
import type { ApiResponse } from '@shared/types/api'
import type { FloorMapResponse, FloorEnum, UploadFloorMapsRequest } from '../domain/floorMapSchemas'

export interface GetFloorMapParams {
  floor?: FloorEnum
}

export async function getFloorMap(params?: GetFloorMapParams): Promise<ApiResponse<FloorMapResponse>> {
  const response = await apiClient.get<ApiResponse<FloorMapResponse>>('/floor-maps', { params })
  return response.data
}

export async function uploadFloorMaps(files: UploadFloorMapsRequest): Promise<ApiResponse<null>> {
  const formData = new FormData()
  if (files.B1) formData.append('B1', files.B1)
  if (files.F1) formData.append('F1', files.F1)
  if (files.F2) formData.append('F2', files.F2)

  const response = await apiClient.put<ApiResponse<null>>('/floor-maps', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export async function deleteFloorMap(floor: FloorEnum): Promise<ApiResponse<string>> {
  const response = await apiClient.delete<ApiResponse<string>>(`/floor-maps/${floor}`)
  return response.data
}
