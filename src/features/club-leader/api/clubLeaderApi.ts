import { apiClient } from '@shared/api/apiClient'
import type { ApiResponse } from '@shared/types/api'
import type { ApplicantStatus } from '../domain/clubLeaderSchemas'
import type {
  ClubInfoRequest,
  ClubProfileRequest,
  LeaderUpdatePwRequest,
  ClubMember,
  ClubMemberDeleteRequest,
  Applicant,
  ApplicationDetailResponse,
  ApplicationStatusUpdateRequest,
  CategoryItem,
  FcmTokenRequest,
  ClubSummaryResponse,
} from '../domain/clubLeaderSchemas'

// ===== Club Detail (Full Info) =====

// GET /clubs/{clubUUID} - Returns full club info (AdminClubInfoResponse)
export async function getClubDetail(clubUUID: string): Promise<ApiResponse<ClubSummaryResponse>> {
  const response = await apiClient.get<ApiResponse<ClubSummaryResponse>>(`/clubs/${clubUUID}`)
  return response.data
}

// PUT /clubs/{clubUUID} - Club profile and main photo update
export async function updateClubInfo(
  clubUUID: string,
  clubProfileRequest?: ClubProfileRequest,
  leaderUpdatePwRequest?: LeaderUpdatePwRequest,
  mainPhoto?: File,
  clubInfoRequest?: ClubInfoRequest,
  infoPhotos?: File[]
): Promise<ApiResponse<null>> {
  const formData = new FormData()

  if (clubProfileRequest) {
    formData.append('clubProfileRequest', new Blob([JSON.stringify(clubProfileRequest)], { type: 'application/json' }))
  }

  if (leaderUpdatePwRequest) {
    formData.append('leaderUpdatePwRequest', new Blob([JSON.stringify(leaderUpdatePwRequest)], { type: 'application/json' }))
  }

  if (mainPhoto) {
    formData.append('mainPhoto', mainPhoto)
  }

  if (clubInfoRequest) {
    formData.append('clubInfoRequest', new Blob([JSON.stringify(clubInfoRequest)], { type: 'application/json' }))
  }

  if (infoPhotos && infoPhotos.length > 0) {
    infoPhotos.forEach((photo) => formData.append('infoPhotos', photo))
  }

  const response = await apiClient.put<ApiResponse<null>>(`/clubs/${clubUUID}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

// GET /categories
export async function getLeaderCategories(): Promise<ApiResponse<CategoryItem[]>> {
  const response = await apiClient.get<ApiResponse<CategoryItem[]>>('/categories')
  return response.data
}

// PATCH /clubs/{clubUUID}/recruit-status
export async function toggleRecruitment(clubUUID: string): Promise<ApiResponse<null>> {
  const response = await apiClient.patch<ApiResponse<null>>(`/clubs/${clubUUID}/recruit-status`)
  return response.data
}

// ===== Club Members =====

// GET /clubs/{clubUUID}/members
export async function getClubMembers(clubUUID: string, sort?: string): Promise<ApiResponse<ClubMember[]>> {
  const response = await apiClient.get<ApiResponse<ClubMember[]>>(`/clubs/${clubUUID}/members`, {
    params: sort ? { sort } : undefined,
  })
  return response.data
}

// DELETE /clubs/{clubUUID}/members
export async function deleteClubMembers(clubUUID: string, members: ClubMemberDeleteRequest[]): Promise<ApiResponse<null>> {
  const response = await apiClient.delete<ApiResponse<null>>(`/clubs/${clubUUID}/members`, { data: members })
  return response.data
}

// ===== Applicants =====

// GET /clubs/{clubUUID}/applicants
export async function getApplicants(clubUUID: string, status?: ApplicantStatus): Promise<ApiResponse<Applicant[]>> {
  const response = await apiClient.get<ApiResponse<Applicant[]>>(`/clubs/${clubUUID}/applicants`, {
    params: status ? { status } : undefined,
  })
  return response.data
}

// GET /clubs/{clubUUID}/applications/{aplictUUID}
export async function getApplicationDetail(
  clubUUID: string,
  aplictUUID: string
): Promise<ApiResponse<ApplicationDetailResponse>> {
  const response = await apiClient.get<ApiResponse<ApplicationDetailResponse>>(
    `/clubs/${clubUUID}/applications/${aplictUUID}`
  )
  return response.data
}

// PATCH /clubs/{clubUUID}/applications/{aplictUUID}/status
export async function updateApplicationStatus(
  clubUUID: string,
  aplictUUID: string,
  data: ApplicationStatusUpdateRequest
): Promise<ApiResponse<null>> {
  const response = await apiClient.patch<ApiResponse<null>>(
    `/clubs/${clubUUID}/applications/${aplictUUID}/status`,
    data
  )
  return response.data
}

// DELETE /clubs/{clubUUID}/applications
export async function deleteApplicants(clubUUID: string, aplictUUIDs: string[]): Promise<ApiResponse<null>> {
  const response = await apiClient.delete<ApiResponse<null>>(`/clubs/${clubUUID}/applications`, { data: aplictUUIDs })
  return response.data
}

// POST /clubs/{clubUUID}/applicants/notifications
export async function sendApplicantNotifications(clubUUID: string, aplictUUIDs: Array<{ aplictUUID: string }>): Promise<ApiResponse<null>> {
  const response = await apiClient.post<ApiResponse<null>>(`/clubs/${clubUUID}/applicants/notifications`, aplictUUIDs)
  return response.data
}

// ===== Others =====

// PATCH /clubs/terms/agreement
export async function agreeTerms(): Promise<ApiResponse<null>> {
  const response = await apiClient.patch<ApiResponse<null>>('/clubs/terms/agreement')
  return response.data
}

// PATCH /clubs/fcmtoken
export async function updateFcmToken(data: FcmTokenRequest): Promise<ApiResponse<null>> {
  const response = await apiClient.patch<ApiResponse<null>>('/clubs/fcmtoken', data)
  return response.data
}
