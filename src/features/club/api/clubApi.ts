import { apiClient } from '@shared/api/apiClient'
import type { ApiResponse } from '@shared/types/api'
import type {
  ClubListResponse,
  ClubCategoryResponse,
  ClubDetailResponse,
  RecruitStatusResponse,
  ClubFormResponse,
  ClubMemberResponse,
  ClubMemberDeleteRequest,
  ClubCreateRequest,
  ClubProfileRequest,
  LeaderUpdatePwRequest,
  ClubDeleteRequest,
  FcmTokenRequest,
} from '../domain/clubSchemas'

// GET /clubs - 전체 동아리 조회 (모바일)
export async function getAllClubs(condition?: Record<string, unknown>): Promise<ApiResponse<ClubListResponse[]>> {
  const response = await apiClient.get<ApiResponse<ClubListResponse[]>>('/clubs', {
    params: condition ? { condition: JSON.stringify(condition) } : undefined,
  })
  return response.data
}

// GET /categories - 카테고리 리스트 조회
export async function getCategories(): Promise<ApiResponse<ClubCategoryResponse[]>> {
  const response = await apiClient.get<ApiResponse<ClubCategoryResponse[]>>('/categories')
  return response.data
}

// GET /clubs/{clubUUID} - 동아리 상세 조회 (소개글 포함)
export async function getClubDetail(clubUUID: string): Promise<ApiResponse<ClubDetailResponse>> {
  const response = await apiClient.get<ApiResponse<ClubDetailResponse>>(`/clubs/${clubUUID}`)
  return response.data
}

// GET /clubs/{clubUUID}/recruit-status - 모집 상태 조회
export async function getRecruitStatus(clubUUID: string): Promise<ApiResponse<RecruitStatusResponse>> {
  const response = await apiClient.get<ApiResponse<RecruitStatusResponse>>(`/clubs/${clubUUID}/recruit-status`)
  return response.data
}

// PATCH /clubs/{clubUUID}/recruit-status - 모집 상태 토글
export async function toggleRecruitStatus(clubUUID: string): Promise<ApiResponse<RecruitStatusResponse>> {
  const response = await apiClient.patch<ApiResponse<RecruitStatusResponse>>(`/clubs/${clubUUID}/recruit-status`)
  return response.data
}

// GET /clubs/{clubUUID}/forms - 동아리 신청서 조회
export async function getClubForm(clubUUID: string): Promise<ApiResponse<ClubFormResponse>> {
  const response = await apiClient.get<ApiResponse<ClubFormResponse>>(`/clubs/${clubUUID}/forms`)
  return response.data
}

// GET /clubs/check-duplication - 중복 체크
export async function checkDuplication(type: 'name' | 'leader', val: string): Promise<ApiResponse<null>> {
  const response = await apiClient.get<ApiResponse<null>>('/clubs/check-duplication', {
    params: { type, val },
  })
  return response.data
}

// ===== Club Members =====

// GET /clubs/{clubUUID}/members - 동아리 회원 목록 조회
export async function getClubMembersList(
  clubUUID: string,
  sort?: string
): Promise<ApiResponse<ClubMemberResponse[]>> {
  const response = await apiClient.get<ApiResponse<ClubMemberResponse[]>>(`/clubs/${clubUUID}/members`, {
    params: sort ? { sort } : undefined,
  })
  return response.data
}

// DELETE /clubs/{clubUUID}/members - 동아리 회원 삭제
export async function deleteClubMembersList(
  clubUUID: string,
  members: ClubMemberDeleteRequest[]
): Promise<ApiResponse<null>> {
  const response = await apiClient.delete<ApiResponse<null>>(`/clubs/${clubUUID}/members`, { data: members })
  return response.data
}

// ===== Club Management (Admin) =====

// POST /clubs - 동아리 생성 (Admin)
export async function createClub(request: ClubCreateRequest): Promise<ApiResponse<string>> {
  const response = await apiClient.post<ApiResponse<string>>('/clubs', request)
  return response.data
}

// PUT /clubs/{clubUUID} - 동아리 정보 수정
export async function updateClubInfo(
  clubUUID: string,
  clubProfileRequest: ClubProfileRequest,
  leaderUpdatePwRequest?: LeaderUpdatePwRequest,
  mainPhoto?: File
): Promise<ApiResponse<null>> {
  const formData = new FormData()
  formData.append('clubProfileRequest', new Blob([JSON.stringify(clubProfileRequest)], { type: 'application/json' }))

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

// DELETE /clubs/{clubUUID} - 동아리 삭제
export async function deleteClub(clubUUID: string, request: ClubDeleteRequest): Promise<ApiResponse<number>> {
  const response = await apiClient.delete<ApiResponse<number>>(`/clubs/${clubUUID}`, { data: request })
  return response.data
}

// ===== Terms & FCM =====

// PATCH /clubs/terms/agreement - 약관 동의
export async function agreeToTerms(): Promise<ApiResponse<null>> {
  const response = await apiClient.patch<ApiResponse<null>>('/clubs/terms/agreement')
  return response.data
}

// PATCH /clubs/fcmtoken - FCM 토큰 갱신
export async function updateFcmToken(request: FcmTokenRequest): Promise<ApiResponse<null>> {
  const response = await apiClient.patch<ApiResponse<null>>('/clubs/fcmtoken', request)
  return response.data
}
