import { apiClient } from '@shared/api/apiClient'
import type { ApiResponse } from '@shared/types/api'

// GET /apply/can-apply/{clubUUID} - 지원 가능 여부 확인
export async function checkCanApply(clubUUID: string): Promise<ApiResponse<boolean>> {
  const response = await apiClient.get<ApiResponse<boolean>>(`/apply/can-apply/${clubUUID}`)
  return response.data
}

// GET /apply/{clubUUID} - 구글 폼 URL 조회
export async function getGoogleFormUrl(clubUUID: string): Promise<ApiResponse<string>> {
  const response = await apiClient.get<ApiResponse<string>>(`/apply/${clubUUID}`)
  return response.data
}

// POST /apply/{clubUUID} - 동아리 지원서 제출
export async function submitApplication(clubUUID: string): Promise<ApiResponse<null>> {
  const response = await apiClient.post<ApiResponse<null>>(`/apply/${clubUUID}`)
  return response.data
}
