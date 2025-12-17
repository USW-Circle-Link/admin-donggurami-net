import { apiClient } from '@shared/api/apiClient'
import type { ApiResponse } from '@shared/types/api'
import type {
  ClubIntroResponse,
  ClubIntroRequest,
  ClubInfoResponse,
  ClubInfoRequest,
  LeaderUpdatePwRequest,
  ClubSummaryResponse,
  ClubMember,
  ClubMemberDeleteRequest,
  ClubMemberAddFromExcel,
  NonMemberUpdateRequest,
  SignUpRequestItem,
  SignUpAcceptRequest,
  Applicant,
  ApplicantStatusUpdate,
  CategoryItem,
  FcmTokenRequest,
} from '../domain/clubLeaderSchemas'

// ===== Club Intro =====

// GET /club-leader/{clubUUID}/intro
export async function getClubIntro(clubUUID: string): Promise<ApiResponse<ClubIntroResponse>> {
  const response = await apiClient.get<ApiResponse<ClubIntroResponse>>(`/club-leader/${clubUUID}/intro`)
  return response.data
}

// PUT /club-leader/{clubUUID}/intro
export async function updateClubIntro(
  clubUUID: string,
  request: ClubIntroRequest,
  photos?: File[]
): Promise<ApiResponse<null>> {
  if (photos && photos.length > 0) {
    const formData = new FormData()
    formData.append('clubIntroRequest', new Blob([JSON.stringify(request)], { type: 'application/json' }))
    photos.forEach((photo) => formData.append('introPhotos', photo))

    const response = await apiClient.put<ApiResponse<null>>(`/club-leader/${clubUUID}/intro`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  }

  const response = await apiClient.put<ApiResponse<null>>(`/club-leader/${clubUUID}/intro`, { clubIntroRequest: request })
  return response.data
}

// ===== Club Info =====

// GET /club-leader/{clubUUID}/info
export async function getClubInfo(clubUUID: string): Promise<ApiResponse<ClubInfoResponse>> {
  const response = await apiClient.get<ApiResponse<ClubInfoResponse>>(`/club-leader/${clubUUID}/info`)
  return response.data
}

// PUT /club-leader/{clubUUID}/info
export async function updateClubInfo(
  clubUUID: string,
  clubInfoRequest: ClubInfoRequest,
  leaderUpdatePwRequest?: LeaderUpdatePwRequest,
  mainPhoto?: File
): Promise<ApiResponse<null>> {
  if (mainPhoto) {
    const formData = new FormData()
    formData.append('mainPhoto', mainPhoto)
    formData.append('clubInfoRequest', new Blob([JSON.stringify(clubInfoRequest)], { type: 'application/json' }))
    if (leaderUpdatePwRequest) {
      formData.append('leaderUpdatePwRequest', new Blob([JSON.stringify(leaderUpdatePwRequest)], { type: 'application/json' }))
    }

    const response = await apiClient.put<ApiResponse<null>>(`/club-leader/${clubUUID}/info`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  }

  const response = await apiClient.put<ApiResponse<null>>(`/club-leader/${clubUUID}/info`, {
    clubInfoRequest,
    leaderUpdatePwRequest,
  })
  return response.data
}

// GET /club-leader/{clubUUID}/summary
export async function getClubSummary(clubUUID: string): Promise<ApiResponse<ClubSummaryResponse>> {
  const response = await apiClient.get<ApiResponse<ClubSummaryResponse>>(`/club-leader/${clubUUID}/summary`)
  return response.data
}

// GET /club-leader/category
export async function getLeaderCategories(): Promise<ApiResponse<CategoryItem[]>> {
  const response = await apiClient.get<ApiResponse<CategoryItem[]>>('/club-leader/category')
  return response.data
}

// PATCH /club-leader/{clubUUID}/recruitment
export async function toggleRecruitment(clubUUID: string): Promise<ApiResponse<null>> {
  const response = await apiClient.patch<ApiResponse<null>>(`/club-leader/${clubUUID}/recruitment`)
  return response.data
}

// ===== Club Members =====

// GET /club-leader/{clubUUID}/members
export async function getClubMembers(clubUUID: string, sort?: string): Promise<ApiResponse<ClubMember[]>> {
  const response = await apiClient.get<ApiResponse<ClubMember[]>>(`/club-leader/${clubUUID}/members`, {
    params: sort ? { sort } : undefined,
  })
  return response.data
}

// DELETE /club-leader/{clubUUID}/members
export async function deleteClubMembers(clubUUID: string, members: ClubMemberDeleteRequest[]): Promise<ApiResponse<null>> {
  const response = await apiClient.delete<ApiResponse<null>>(`/club-leader/${clubUUID}/members`, { data: members })
  return response.data
}

// GET /club-leader/{clubUUID}/members/export
export async function exportClubMembers(clubUUID: string): Promise<ApiResponse<null>> {
  const response = await apiClient.get<ApiResponse<null>>(`/club-leader/${clubUUID}/members/export`, {
    responseType: 'blob',
  })
  return response.data
}

// POST /club-leader/{clubUUID}/members/import
export async function importClubMembers(clubUUID: string, file: File): Promise<ApiResponse<{
  addClubMembers: ClubMemberAddFromExcel[]
  duplicateClubMembers: ClubMemberAddFromExcel[]
}>> {
  const formData = new FormData()
  formData.append('clubMembersFile', file)

  const response = await apiClient.post<ApiResponse<{
    addClubMembers: ClubMemberAddFromExcel[]
    duplicateClubMembers: ClubMemberAddFromExcel[]
  }>>(`/club-leader/${clubUUID}/members/import`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

// POST /club-leader/{clubUUID}/members
export async function addClubMembersFromExcel(
  clubUUID: string,
  members: ClubMemberAddFromExcel[]
): Promise<ApiResponse<null>> {
  const response = await apiClient.post<ApiResponse<null>>(`/club-leader/${clubUUID}/members`, {
    clubMembersAddFromExcelRequestList: members,
  })
  return response.data
}

// POST /club-leader/{clubUUID}/members/duplicate-profiles
export async function checkDuplicateProfiles(
  clubUUID: string,
  data: { userName: string; studentNumber: string; userHp: string }
): Promise<ApiResponse<null>> {
  const response = await apiClient.post<ApiResponse<null>>(`/club-leader/${clubUUID}/members/duplicate-profiles`, data)
  return response.data
}

// PATCH /club-leader/{clubUUID}/members/{clubMemberUUID}/non-member
export async function updateNonMember(
  clubUUID: string,
  clubMemberUUID: string,
  data: NonMemberUpdateRequest
): Promise<ApiResponse<null>> {
  const response = await apiClient.patch<ApiResponse<null>>(
    `/club-leader/${clubUUID}/members/${clubMemberUUID}/non-member`,
    data
  )
  return response.data
}

// ===== Sign Up Requests =====

// GET /club-leader/{clubUUID}/members/sign-up
export async function getSignUpRequests(clubUUID: string): Promise<ApiResponse<SignUpRequestItem[]>> {
  const response = await apiClient.get<ApiResponse<SignUpRequestItem[]>>(`/club-leader/${clubUUID}/members/sign-up`)
  return response.data
}

// POST /club-leader/{clubUUID}/members/sign-up
export async function acceptSignUpRequest(clubUUID: string, data: SignUpAcceptRequest): Promise<ApiResponse<null>> {
  const response = await apiClient.post<ApiResponse<null>>(`/club-leader/${clubUUID}/members/sign-up`, data)
  return response.data
}

// DELETE /club-leader/{clubUUID}/members/sign-up/{clubMemberAccountStatusUUID}
export async function rejectSignUpRequest(
  clubUUID: string,
  clubMemberAccountStatusUUID: string
): Promise<ApiResponse<null>> {
  const response = await apiClient.delete<ApiResponse<null>>(
    `/club-leader/${clubUUID}/members/sign-up/${clubMemberAccountStatusUUID}`
  )
  return response.data
}

// ===== Applicants =====

// GET /club-leader/{clubUUID}/applicants
export async function getApplicants(clubUUID: string): Promise<ApiResponse<Applicant[]>> {
  const response = await apiClient.get<ApiResponse<Applicant[]>>(`/club-leader/${clubUUID}/applicants`)
  return response.data
}

// POST /club-leader/{clubUUID}/applicants/notifications
export async function processApplicants(clubUUID: string, updates: ApplicantStatusUpdate[]): Promise<ApiResponse<null>> {
  const response = await apiClient.post<ApiResponse<null>>(`/club-leader/${clubUUID}/applicants/notifications`, updates)
  return response.data
}

// GET /club-leader/{clubUUID}/failed-applicants
export async function getFailedApplicants(clubUUID: string): Promise<ApiResponse<Applicant[]>> {
  const response = await apiClient.get<ApiResponse<Applicant[]>>(`/club-leader/${clubUUID}/failed-applicants`)
  return response.data
}

// POST /club-leader/{clubUUID}/failed-applicants/notifications
export async function processFailedApplicants(clubUUID: string, updates: ApplicantStatusUpdate[]): Promise<ApiResponse<null>> {
  const response = await apiClient.post<ApiResponse<null>>(`/club-leader/${clubUUID}/failed-applicants/notifications`, updates)
  return response.data
}

// ===== Others =====

// PATCH /club-leader/terms/agreement
export async function agreeTerms(): Promise<ApiResponse<null>> {
  const response = await apiClient.patch<ApiResponse<null>>('/club-leader/terms/agreement')
  return response.data
}

// PATCH /club-leader/fcmtoken
export async function updateFcmToken(data: FcmTokenRequest): Promise<ApiResponse<null>> {
  const response = await apiClient.patch<ApiResponse<null>>('/club-leader/fcmtoken', data)
  return response.data
}
