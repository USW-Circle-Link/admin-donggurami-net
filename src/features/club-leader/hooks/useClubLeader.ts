import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as api from '../api/clubLeaderApi'
import type {
  ClubInfoRequest,
  ClubProfileRequest,
  LeaderUpdatePwRequest,
  ClubMemberDeleteRequest,
  FcmTokenRequest,
  ApplicantStatus,
} from '../domain/clubLeaderSchemas'

export const clubLeaderKeys = {
  all: ['clubLeader'] as const,
  detail: (clubUUID: string) => [...clubLeaderKeys.all, 'detail', clubUUID] as const,
  info: (clubUUID: string) => [...clubLeaderKeys.all, 'info', clubUUID] as const,
  categories: () => [...clubLeaderKeys.all, 'categories'] as const,
  members: (clubUUID: string) => [...clubLeaderKeys.all, 'members', clubUUID] as const,
  applicants: (clubUUID: string) => [...clubLeaderKeys.all, 'applicants', clubUUID] as const,
  failedApplicants: (clubUUID: string) => [...clubLeaderKeys.all, 'failedApplicants', clubUUID] as const,
}

// Club Detail (Full info including intro photos, recruitment status, etc.)
export function useClubDetail(clubUUID: string) {
  return useQuery({
    queryKey: clubLeaderKeys.detail(clubUUID),
    queryFn: () => api.getClubDetail(clubUUID),
    enabled: !!clubUUID,
  })
}

export function useUpdateClubInfo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      clubUUID,
      clubProfileRequest,
      leaderUpdatePwRequest,
      mainPhoto,
      clubInfoRequest,
      infoPhotos,
    }: {
      clubUUID: string
      clubProfileRequest?: ClubProfileRequest
      leaderUpdatePwRequest?: LeaderUpdatePwRequest
      mainPhoto?: File
      clubInfoRequest?: ClubInfoRequest
      infoPhotos?: File[]
    }) => api.updateClubInfo(clubUUID, clubProfileRequest, leaderUpdatePwRequest, mainPhoto, clubInfoRequest, infoPhotos),
    onSuccess: (_, { clubUUID }) => {
      queryClient.invalidateQueries({ queryKey: clubLeaderKeys.detail(clubUUID) })
      queryClient.invalidateQueries({ queryKey: clubLeaderKeys.info(clubUUID) })
    },
  })
}

// Categories
export function useLeaderCategories() {
  return useQuery({
    queryKey: clubLeaderKeys.categories(),
    queryFn: api.getLeaderCategories,
  })
}

// Recruitment Toggle
export function useToggleRecruitment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (clubUUID: string) => api.toggleRecruitment(clubUUID),
    onSuccess: (_, clubUUID) => {
      queryClient.invalidateQueries({ queryKey: clubLeaderKeys.info(clubUUID) })
    },
  })
}

// Members
export function useClubMembers(clubUUID: string, sort?: string) {
  return useQuery({
    queryKey: [...clubLeaderKeys.members(clubUUID), sort],
    queryFn: () => api.getClubMembers(clubUUID, sort),
    enabled: !!clubUUID,
  })
}

export function useDeleteClubMembers() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ clubUUID, members }: { clubUUID: string; members: ClubMemberDeleteRequest[] }) =>
      api.deleteClubMembers(clubUUID, members),
    onSuccess: (_, { clubUUID }) => {
      queryClient.invalidateQueries({ queryKey: clubLeaderKeys.members(clubUUID) })
    },
  })
}

// Applicants

/**
 * Fetch all applicants for a club.
 * Returns applicants with status WAIT, PASS, or FAIL.
 */
export function useApplicants(clubUUID: string, isResultPublished?: boolean) {
  return useQuery({
    queryKey: [...clubLeaderKeys.applicants(clubUUID), { isResultPublished }],
    queryFn: () => api.getApplicants(clubUUID, undefined, isResultPublished),
    enabled: !!clubUUID,
  })
}

/**
 * Get applicants by status
 * @param clubUUID - Club UUID
 * @param status - Applicant status filter ('WAIT', 'PASS', 'FAIL')
 * @param isResultPublished - Filter by result published (finalized) status
 */
export function useApplicantsByStatus(clubUUID: string, status: 'WAIT' | 'PASS' | 'FAIL', isResultPublished?: boolean) {
  return useQuery({
    queryKey: [...clubLeaderKeys.applicants(clubUUID), status, { isResultPublished }],
    queryFn: () => api.getApplicants(clubUUID, status, isResultPublished),
    enabled: !!clubUUID && !!status,
  })
}

/**
 * Update applicant statuses (bulk operation).
 * Calls updateApplicationStatus for each applicant individually.
 * Invalidates applicants cache on success.
 */
export function useProcessApplicants() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ clubUUID, updates }: { clubUUID: string; updates: { aplictUUID: string; status: ApplicantStatus }[] }) => {
      await Promise.all(
        updates.map((update) =>
          api.updateApplicationStatus(clubUUID, update.aplictUUID, { status: update.status })
        )
      )
    },
    onSuccess: (_, { clubUUID, updates }) => {
      queryClient.invalidateQueries({ queryKey: clubLeaderKeys.applicants(clubUUID) })
      updates.forEach((update) => {
        queryClient.invalidateQueries({ queryKey: ['application', 'detail', clubUUID, update.aplictUUID] })
      })
      toast.success('지원자 상태가 업데이트되었습니다.')
    },
    onError: (error) => {
      toast.error('지원자 상태 업데이트에 실패했습니다.')
      console.error('Failed to process applicants:', error)
    },
  })
}

/**
 * Delete applicants (bulk operation).
 * Calls DELETE /clubs/{clubUUID}/applications with UUID array.
 * Invalidates applicants cache on success.
 */
export function useDeleteApplicants() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ clubUUID, aplictUUIDs }: { clubUUID: string; aplictUUIDs: string[] }) =>
      api.deleteApplicants(clubUUID, aplictUUIDs),
    onSuccess: (_, { clubUUID }) => {
      queryClient.invalidateQueries({ queryKey: clubLeaderKeys.applicants(clubUUID) })
      toast.success('선택한 지원서가 삭제되었습니다.')
    },
    onError: (error) => {
      toast.error('지원서 삭제에 실패했습니다.')
      console.error('Failed to delete applicants:', error)
    },
  })
}

/**
 * Fetch applicants who failed the initial selection (status: FAIL).
 * Used for additional selection (추합) process.
 */
export function useFailedApplicants(clubUUID: string) {
  return useQuery({
    queryKey: clubLeaderKeys.failedApplicants(clubUUID),
    queryFn: () => api.getApplicants(clubUUID, 'FAIL'),
    enabled: !!clubUUID,
  })
}

/**
 * Process failed applicants status changes (추합 - additional selection).
 * Invalidates applicants cache on success.
 */
export function useProcessFailedApplicants() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ clubUUID, updates }: { clubUUID: string; updates: { aplictUUID: string; status: ApplicantStatus }[] }) => {
      await Promise.all(
        updates.map((update) =>
          api.updateApplicationStatus(clubUUID, update.aplictUUID, { status: update.status })
        )
      )
    },
    onSuccess: (_, { clubUUID }) => {
      queryClient.invalidateQueries({ queryKey: clubLeaderKeys.failedApplicants(clubUUID) })
      queryClient.invalidateQueries({ queryKey: clubLeaderKeys.applicants(clubUUID) })
      toast.success('추합 처리가 완료되었습니다.')
    },
    onError: (error) => {
      toast.error('추합 처리에 실패했습니다.')
      console.error('Failed to process failed applicants:', error)
    },
  })
}

/**
 * Send notifications to applicants about their application results.
 * Used in the finalization page to notify pass/fail results.
 */
export function useSendApplicantNotifications() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ clubUUID, aplictUUIDs }: { clubUUID: string; aplictUUIDs: Array<{ aplictUUID: string }> }) =>
      api.sendApplicantNotifications(clubUUID, aplictUUIDs),
    onSuccess: (_, { clubUUID }) => {
      queryClient.invalidateQueries({ queryKey: clubLeaderKeys.applicants(clubUUID) })
      toast.success('알림이 발송되었습니다.')
    },
    onError: (error) => {
      toast.error('알림 발송에 실패했습니다.')
      console.error('Failed to send notifications:', error)
    },
  })
}

// Others
export function useAgreeTerms() {
  return useMutation({
    mutationFn: api.agreeTerms,
  })
}

export function useUpdateFcmToken() {
  return useMutation({
    mutationFn: (data: FcmTokenRequest) => api.updateFcmToken(data),
  })
}
