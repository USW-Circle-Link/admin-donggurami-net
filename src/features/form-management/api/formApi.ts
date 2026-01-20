import { apiClient } from '@shared/api/apiClient'
import type { ApiResponse } from '@shared/types/api'
import type {
  CreateFormRequest,
  CreateFormResponse,
  UpdateFormStatusRequest,
  SubmitApplicationRequest,
  SubmitApplicationResponse,
  ApplicationDetail,
} from '../domain/formSchemas'

// ===== Form Management =====

// POST /api/clubs/{clubId}/forms - Create form
export async function createForm(clubId: string, request: CreateFormRequest): Promise<ApiResponse<CreateFormResponse>> {
  const response = await apiClient.post<ApiResponse<CreateFormResponse>>(`/api/clubs/${clubId}/forms`, request)
  return response.data
}

// PATCH /api/clubs/{clubId}/forms/{formId}/status - Update form status
export async function updateFormStatus(
  clubId: string,
  formId: string,
  request: UpdateFormStatusRequest
): Promise<ApiResponse<null>> {
  const response = await apiClient.patch<ApiResponse<null>>(`/api/clubs/${clubId}/forms/${formId}/status`, request)
  return response.data
}

// POST /api/clubs/{clubId}/forms/{formId}/applications - Submit application
export async function submitApplication(
  clubId: string,
  formId: string,
  request: SubmitApplicationRequest
): Promise<ApiResponse<SubmitApplicationResponse>> {
  const response = await apiClient.post<ApiResponse<SubmitApplicationResponse>>(
    `/api/clubs/${clubId}/forms/${formId}/applications`,
    request
  )
  return response.data
}

// GET /api/clubs/{clubId}/applications/{applicationId} - Get application detail
export async function getApplicationDetail(
  clubId: string,
  applicationId: string
): Promise<ApiResponse<ApplicationDetail>> {
  const response = await apiClient.get<ApiResponse<ApplicationDetail>>(
    `/api/clubs/${clubId}/applications/${applicationId}`
  )
  return response.data
}
