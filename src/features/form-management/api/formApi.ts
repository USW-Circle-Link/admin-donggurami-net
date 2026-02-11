import { apiClient } from '@shared/api/apiClient'
import type { ApiResponse } from '@shared/types/api'
import type {
  CreateFormRequest,
  FormDetailResponse,
  ApplicationDetailResponse,
  ApplicantListResponse,
} from '../domain/formSchemas'
import {
  formDetailResponseSchema,
} from '../domain/formSchemas'

// ===== Form Management API =====

/**
 * POST /clubs/{clubUUID}/forms
 * Create a new application/recruitment form with questions and options
 * Returns: 200 OK with no data (void)
 */
export async function createForm(
  clubUUID: string,
  request: CreateFormRequest
): Promise<void> {
  await apiClient.post<ApiResponse<void>>(
    `/clubs/${clubUUID}/forms`,
    request
  )
}

/**
 * GET /clubs/{clubUUID}/forms
 * Get the active form for a club
 * Returns: formId as number (from GET response)
 */
export async function getActiveForm(clubUUID: string): Promise<FormDetailResponse> {
  const response = await apiClient.get<ApiResponse<FormDetailResponse>>(
    `/clubs/${clubUUID}/forms`
  )
  // Runtime validation: GET returns formId as number
  const parsed = formDetailResponseSchema.safeParse(response.data.data)
  if (!parsed.success) {
    console.error('getActiveForm response validation failed:', parsed.error)
    throw new Error(`API response validation failed: ${parsed.error.message}`)
  }
  return parsed.data
}

/**
 * GET /clubs/{clubUUID}/applications/{aplictUUID}
 * Get application detail for a specific club
 */
export async function getClubApplicationDetail(
  clubUUID: string,
  applicationId: string
): Promise<ApplicationDetailResponse> {
  const response = await apiClient.get<ApiResponse<ApplicationDetailResponse>>(
    `/clubs/${clubUUID}/applications/${applicationId}`
  )
  return response.data.data
}

/**
 * GET /clubs/{clubUUID}/applications/eligibility
 * Check if user is eligible to apply
 */
export async function checkApplicationEligibility(
  clubUUID: string
): Promise<boolean> {
  const response = await apiClient.get<ApiResponse<boolean>>(
    `/clubs/${clubUUID}/applications/eligibility`
  )
  return response.data.data
}

// ===== Club Leader Applicant Management =====

/**
 * GET /clubs/{clubUUID}/applicants
 * Get list of applicants for a club
 */
export async function getApplicants(
  clubUUID: string,
  status?: 'WAIT' | 'PASS' | 'FAIL',
  isResultPublished?: boolean
): Promise<ApplicantListResponse> {
  const params: Record<string, string | boolean> = {}
  if (status) params.status = status
  if (isResultPublished !== undefined) params.isResultPublished = isResultPublished
  const response = await apiClient.get<ApiResponse<ApplicantListResponse>>(
    `/clubs/${clubUUID}/applicants`,
    { params }
  )
  return response.data.data
}

/**
 * GET /clubs/{clubUUID}/applications/{aplictUUID}
 * Get application detail
 */
export async function getLeaderApplicationDetail(
  clubUUID: string,
  aplictUUID: string
): Promise<ApplicationDetailResponse> {
  const response = await apiClient.get<ApiResponse<ApplicationDetailResponse>>(
    `/clubs/${clubUUID}/applications/${aplictUUID}`
  )
  return response.data.data
}

/**
 * PATCH /clubs/{clubUUID}/applications/{aplictUUID}/status
 * Update application status
 */
export async function updateApplicationStatus(
  clubUUID: string,
  aplictUUID: string,
  status: 'WAIT' | 'PASS' | 'FAIL'
): Promise<void> {
  await apiClient.patch<ApiResponse<void>>(
    `/clubs/${clubUUID}/applications/${aplictUUID}/status`,
    { status }
  )
}

/**
 * POST /clubs/{clubUUID}/applicants/notifications
 * Send notification to applicants about results
 */
export async function sendApplicantNotifications(
  clubUUID: string,
  aplictUUIDs: string[]
): Promise<void> {
  await apiClient.post<ApiResponse<void>>(
    `/clubs/${clubUUID}/applicants/notifications`,
    aplictUUIDs.map((aplictUUID) => ({ aplictUUID }))
  )
}
