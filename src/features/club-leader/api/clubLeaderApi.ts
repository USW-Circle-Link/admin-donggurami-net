import { apiClient } from '@shared/api/apiClient'
import type { ApiResponse } from '@shared/types/api'
import type { ApplicantStatus } from '../domain/clubLeaderSchemas'
import type {
  ClubIntroResponse,
  ClubIntroRequest,
  ClubInfoResponse,
  ClubInfoRequest,
  LeaderUpdatePwRequest,
  ClubSummaryResponse,
  ClubMember,
  ClubMemberDeleteRequest,
  Applicant,
  ApplicationDetailResponse,
  ApplicationStatusUpdateRequest,
  CategoryItem,
  FcmTokenRequest,
} from '../domain/clubLeaderSchemas'

// ===== Club Intro =====

// GET /clubs/{clubUUID}/leader/intro
export async function getClubIntro(clubUUID: string): Promise<ApiResponse<ClubIntroResponse>> {
  const response = await apiClient.get<ApiResponse<ClubIntroResponse>>(`/clubs/${clubUUID}/leader/intro`)
  return response.data
}

// PUT /clubs/{clubUUID}/leader/intro
export async function updateClubIntro(
  clubUUID: string,
  request: ClubIntroRequest,
  photos?: File[]
): Promise<ApiResponse<null>> {
  const formData = new FormData()
  formData.append('clubIntroRequest', new Blob([JSON.stringify(request)], { type: 'application/json' }))

  if (photos && photos.length > 0) {
    photos.forEach((photo) => formData.append('introPhotos', photo))
  }

  const response = await apiClient.put<ApiResponse<null>>(`/clubs/${clubUUID}/leader/intro`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

// ===== Club Info =====

// GET /clubs/{clubUUID}/info
export async function getClubInfo(clubUUID: string): Promise<ApiResponse<ClubInfoResponse>> {
  const response = await apiClient.get<ApiResponse<ClubInfoResponse>>(`/clubs/${clubUUID}/info`)
  return response.data
}

// PUT /clubs/{clubUUID}
export async function updateClubInfo(
  clubUUID: string,
  clubInfoRequest: ClubInfoRequest,
  leaderUpdatePwRequest?: LeaderUpdatePwRequest,
  mainPhoto?: File
): Promise<ApiResponse<null>> {
  const formData = new FormData()
  formData.append('clubInfoRequest', new Blob([JSON.stringify(clubInfoRequest)], { type: 'application/json' }))

  if (leaderUpdatePwRequest) {
    formData.append('leaderUpdatePwRequest', new Blob([JSON.stringify(leaderUpdatePwRequest)], { type: 'application/json' }))
  }

  if (mainPhoto) {
    formData.append('mainPhoto', mainPhoto)
  }

  const response = await apiClient.put<ApiResponse<null>>(`/clubs/${clubUUID}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

// GET /clubs/{clubUUID}/leader/summary
export async function getClubSummary(clubUUID: string): Promise<ApiResponse<ClubSummaryResponse>> {
  const response = await apiClient.get<ApiResponse<ClubSummaryResponse>>(`/clubs/${clubUUID}/leader/summary`)
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

// GET /clubs/{clubUUID}/leader/applications/{applicationUUID}
export async function getApplicationDetail(
  clubUUID: string,
  applicationUUID: string
): Promise<ApiResponse<ApplicationDetailResponse>> {
  const response = await apiClient.get<ApiResponse<ApplicationDetailResponse>>(
    `/clubs/${clubUUID}/leader/applications/${applicationUUID}`
  )
  return response.data
}

// PATCH /clubs/{clubUUID}/leader/applications/{applicationUUID}/status
export async function updateApplicationStatus(
  clubUUID: string,
  applicationUUID: string,
  data: ApplicationStatusUpdateRequest
): Promise<ApiResponse<null>> {
  const response = await apiClient.patch<ApiResponse<null>>(
    `/clubs/${clubUUID}/leader/applications/${applicationUUID}/status`,
    data
  )
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
