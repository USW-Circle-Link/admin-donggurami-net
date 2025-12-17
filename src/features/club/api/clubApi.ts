import { apiClient } from '@shared/api/apiClient'
import type { ApiResponse } from '@shared/types/api'
import type {
  ClubListResponse,
  ClubSimpleResponse,
  ClubListByCategoryResponse,
  ClubCategoryResponse,
  ClubIntroResponse,
} from '../domain/clubSchemas'

// GET /clubs - 전체 동아리 조회 (모바일)
export async function getAllClubs(): Promise<ApiResponse<ClubListResponse[]>> {
  const response = await apiClient.get<ApiResponse<ClubListResponse[]>>('/clubs')
  return response.data
}

// GET /clubs/list - 모든 동아리 정보 출력 (기존회원가입시)
export async function getClubList(): Promise<ApiResponse<ClubSimpleResponse[]>> {
  const response = await apiClient.get<ApiResponse<ClubSimpleResponse[]>>('/clubs/list')
  return response.data
}

// GET /clubs/filter - 카테고리별 전체 동아리 조회
export async function getClubsByCategory(): Promise<ApiResponse<ClubListByCategoryResponse[]>> {
  const response = await apiClient.get<ApiResponse<ClubListByCategoryResponse[]>>('/clubs/filter')
  return response.data
}

// GET /clubs/open - 모집 중인 전체 동아리 조회
export async function getOpenClubs(): Promise<ApiResponse<ClubListResponse[]>> {
  const response = await apiClient.get<ApiResponse<ClubListResponse[]>>('/clubs/open')
  return response.data
}

// GET /clubs/open/filter - 카테고리별 모집 중인 동아리 조회
export async function getOpenClubsByCategory(): Promise<ApiResponse<ClubListByCategoryResponse[]>> {
  const response = await apiClient.get<ApiResponse<ClubListByCategoryResponse[]>>('/clubs/open/filter')
  return response.data
}

// GET /clubs/categories - 카테고리 리스트 조회
export async function getCategories(): Promise<ApiResponse<ClubCategoryResponse[]>> {
  const response = await apiClient.get<ApiResponse<ClubCategoryResponse[]>>('/clubs/categories')
  return response.data
}

// GET /clubs/intro/{clubUUID} - 동아리 소개글 조회
export async function getClubIntro(clubUUID: string): Promise<ApiResponse<ClubIntroResponse>> {
  const response = await apiClient.get<ApiResponse<ClubIntroResponse>>(`/clubs/intro/${clubUUID}`)
  return response.data
}
