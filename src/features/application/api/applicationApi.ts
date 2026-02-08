import { apiClient } from '@shared/api/apiClient'
import type { ApiResponse } from '@shared/types/api'
import type { SubmitApplicationRequest, ApplicationDetailResponse } from '../domain/applicationSchemas'

// GET /clubs/{clubUUID}/applications/eligibility - 지원 가능 여부 확인
export async function checkEligibility(clubUUID: string): Promise<ApiResponse<boolean>> {
  const response = await apiClient.get<ApiResponse<boolean>>(`/clubs/${clubUUID}/applications/eligibility`)
  return response.data
}

// POST /clubs/{clubUUID}/applications - 동아리 지원서 제출
export async function submitApplication(
  clubUUID: string,
  data: SubmitApplicationRequest
): Promise<ApiResponse<null>> {
  const response = await apiClient.post<ApiResponse<null>>(`/clubs/${clubUUID}/applications`, data)
  return response.data
}

// GET /clubs/{clubUUID}/applications/{aplictUUID} - 지원서 상세 조회
export async function getApplicationDetail(
  clubUUID: string,
  aplictUUID: string
): Promise<ApiResponse<ApplicationDetailResponse>> {
  const response = await apiClient.get<ApiResponse<ApplicationDetailResponse>>(
    `/clubs/${clubUUID}/applications/${aplictUUID}`
  )
  return response.data
}
