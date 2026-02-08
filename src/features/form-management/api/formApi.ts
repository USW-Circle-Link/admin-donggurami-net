import { apiClient } from '@shared/api/apiClient'
import type { ApiResponse } from '@shared/types/api'
import type {
  CreateFormRequest,
  CreateFormResponse,
  FormDetailResponse,
  ApplicationDetailResponse,
  ApplicantListResponse,
} from '../domain/formSchemas'

// ===== Form Management API =====

/**
 * POST /clubs/{clubUUID}/forms
 * Create a new application/recruitment form with questions and options
 */
export async function createForm(
  clubUUID: string,
  request: CreateFormRequest
): Promise<CreateFormResponse> {
  const response = await apiClient.post<ApiResponse<CreateFormResponse>>(
    `/clubs/${clubUUID}/forms`,
    request
  )
  return response.data.data
}

/**
 * GET /clubs/forms/{clubUUID}
 * Get the active form for a club
 */
export async function getActiveForm(clubUUID: string): Promise<FormDetailResponse> {
  const response = await apiClient.get<ApiResponse<FormDetailResponse>>(
    `/clubs/forms/${clubUUID}`
  )
  return response.data.data
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
  status?: 'WAIT' | 'PASS' | 'FAIL'
): Promise<ApplicantListResponse> {
  const params = status ? { status } : {}
  const response = await apiClient.get<ApiResponse<ApplicantListResponse>>(
    `/clubs/${clubUUID}/applicants`,
    { params }
  )
  return response.data.data
}

/**
 * GET /clubs/{clubUUID}/leader/applications/{applicationUUID}
 * Get application detail (includes read status)
 */
export async function getLeaderApplicationDetail(
  clubUUID: string,
  applicationUUID: string
): Promise<ApplicationDetailResponse> {
  const response = await apiClient.get<ApiResponse<ApplicationDetailResponse>>(
    `/clubs/${clubUUID}/leader/applications/${applicationUUID}`
  )
  return response.data.data
}

/**
 * PATCH /clubs/{clubUUID}/leader/applications/{applicationUUID}/status
 * Update application status
 */
export async function updateApplicationStatus(
  clubUUID: string,
  applicationUUID: string,
  status: 'WAIT' | 'PASS' | 'FAIL'
): Promise<void> {
  await apiClient.patch<ApiResponse<void>>(
    `/clubs/${clubUUID}/leader/applications/${applicationUUID}/status`,
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
