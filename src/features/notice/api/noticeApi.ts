import { apiClient } from '@shared/api/apiClient'
import type { ApiResponse } from '@shared/types/api'
import type {
  NoticeListResponse,
  NoticeDetail,
  CreateNoticeRequest,
  UpdateNoticeRequest,
} from '../domain/noticeSchemas'

export interface GetNoticesParams {
  page?: number
  size?: number
}

// GET /notices - 공지사항 목록 조회
export async function getNotices(params?: GetNoticesParams): Promise<ApiResponse<NoticeListResponse>> {
  const response = await apiClient.get<ApiResponse<NoticeListResponse>>('/notices', { params })
  return response.data
}

// GET /notices/{noticeUUID} - 공지사항 상세 조회
export async function getNotice(noticeUUID: string): Promise<ApiResponse<NoticeDetail>> {
  const response = await apiClient.get<ApiResponse<NoticeDetail>>(`/notices/${noticeUUID}`)
  return response.data
}

// POST /notices - 공지사항 생성
export async function createNotice(
  request: CreateNoticeRequest,
  photos?: File[]
): Promise<ApiResponse<string[]>> {
  // If there are photos, use multipart form data
  if (photos && photos.length > 0) {
    const formData = new FormData()
    formData.append('request', new Blob([JSON.stringify(request)], { type: 'application/json' }))
    photos.forEach((photo) => {
      formData.append('photos', photo)
    })

    const response = await apiClient.post<ApiResponse<string[]>>('/notices', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }

  // Without photos, just send JSON
  const response = await apiClient.post<ApiResponse<string[]>>('/notices', { request })
  return response.data
}

// PUT /notices/{noticeUUID} - 공지사항 수정
export async function updateNotice(
  noticeUUID: string,
  request: UpdateNoticeRequest,
  photos?: File[]
): Promise<ApiResponse<string[]>> {
  // If there are photos, use multipart form data
  if (photos && photos.length > 0) {
    const formData = new FormData()
    formData.append('request', new Blob([JSON.stringify(request)], { type: 'application/json' }))
    photos.forEach((photo) => {
      formData.append('photos', photo)
    })

    const response = await apiClient.put<ApiResponse<string[]>>(`/notices/${noticeUUID}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }

  // Without photos, just send JSON
  const response = await apiClient.put<ApiResponse<string[]>>(`/notices/${noticeUUID}`, { request })
  return response.data
}

// DELETE /notices/{noticeUUID} - 공지사항 삭제
export async function deleteNotice(noticeUUID: string): Promise<ApiResponse<string>> {
  const response = await apiClient.delete<ApiResponse<string>>(`/notices/${noticeUUID}`)
  return response.data
}
