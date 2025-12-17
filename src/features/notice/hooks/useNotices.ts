import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getNotices,
  getNotice,
  createNotice,
  updateNotice,
  deleteNotice,
  type GetNoticesParams,
} from '../api/noticeApi'
import type { CreateNoticeRequest, UpdateNoticeRequest } from '../domain/noticeSchemas'

// Query keys
export const noticeKeys = {
  all: ['notices'] as const,
  lists: () => [...noticeKeys.all, 'list'] as const,
  list: (params?: GetNoticesParams) => [...noticeKeys.lists(), params] as const,
  details: () => [...noticeKeys.all, 'detail'] as const,
  detail: (noticeUUID: string) => [...noticeKeys.details(), noticeUUID] as const,
}

// 공지사항 목록 조회
export function useNotices(params?: GetNoticesParams) {
  return useQuery({
    queryKey: noticeKeys.list(params),
    queryFn: () => getNotices(params),
  })
}

// 공지사항 상세 조회
export function useNotice(noticeUUID: string) {
  return useQuery({
    queryKey: noticeKeys.detail(noticeUUID),
    queryFn: () => getNotice(noticeUUID),
    enabled: !!noticeUUID,
  })
}

// 공지사항 생성
export function useCreateNotice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ request, photos }: { request: CreateNoticeRequest; photos?: File[] }) =>
      createNotice(request, photos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.lists() })
    },
  })
}

// 공지사항 수정
export function useUpdateNotice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      noticeUUID,
      request,
      photos,
    }: {
      noticeUUID: string
      request: UpdateNoticeRequest
      photos?: File[]
    }) => updateNotice(noticeUUID, request, photos),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.detail(variables.noticeUUID) })
      queryClient.invalidateQueries({ queryKey: noticeKeys.lists() })
    },
  })
}

// 공지사항 삭제
export function useDeleteNotice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (noticeUUID: string) => deleteNotice(noticeUUID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.lists() })
    },
  })
}
