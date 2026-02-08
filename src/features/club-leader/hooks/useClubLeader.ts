import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as api from '../api/clubLeaderApi'
import type {
  ClubIntroRequest,
  ClubInfoRequest,
  LeaderUpdatePwRequest,
  ClubMemberDeleteRequest,
  FcmTokenRequest,
  ApplicantStatus,
} from '../domain/clubLeaderSchemas'

export const clubLeaderKeys = {
  all: ['clubLeader'] as const,
  intro: (clubUUID: string) => [...clubLeaderKeys.all, 'intro', clubUUID] as const,
  info: (clubUUID: string) => [...clubLeaderKeys.all, 'info', clubUUID] as const,
  summary: (clubUUID: string) => [...clubLeaderKeys.all, 'summary', clubUUID] as const,
  categories: () => [...clubLeaderKeys.all, 'categories'] as const,
  members: (clubUUID: string) => [...clubLeaderKeys.all, 'members', clubUUID] as const,
  applicants: (clubUUID: string) => [...clubLeaderKeys.all, 'applicants', clubUUID] as const,
  failedApplicants: (clubUUID: string) => [...clubLeaderKeys.all, 'failedApplicants', clubUUID] as const,
}

// Club Intro
export function useClubIntro(clubUUID: string) {
  return useQuery({
    queryKey: clubLeaderKeys.intro(clubUUID),
    queryFn: () => api.getClubIntro(clubUUID),
    enabled: !!clubUUID,
  })
}

export function useUpdateClubIntro() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ clubUUID, request, photos }: { clubUUID: string; request: ClubIntroRequest; photos?: File[] }) =>
      api.updateClubIntro(clubUUID, request, photos),
    onSuccess: (_, { clubUUID }) => {
      queryClient.invalidateQueries({ queryKey: clubLeaderKeys.intro(clubUUID) })
      queryClient.invalidateQueries({ queryKey: clubLeaderKeys.summary(clubUUID) })
    },
  })
}

// Club Info
export function useClubInfo(clubUUID: string) {
  return useQuery({
    queryKey: clubLeaderKeys.info(clubUUID),
    queryFn: () => api.getClubInfo(clubUUID),
    enabled: !!clubUUID,
  })
}

export function useUpdateClubInfo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      clubUUID,
      clubInfoRequest,
      leaderUpdatePwRequest,
      mainPhoto,
    }: {
      clubUUID: string
      clubInfoRequest: ClubInfoRequest
      leaderUpdatePwRequest?: LeaderUpdatePwRequest
      mainPhoto?: File
    }) => api.updateClubInfo(clubUUID, clubInfoRequest, leaderUpdatePwRequest, mainPhoto),
    onSuccess: (_, { clubUUID }) => {
      queryClient.invalidateQueries({ queryKey: clubLeaderKeys.info(clubUUID) })
      queryClient.invalidateQueries({ queryKey: clubLeaderKeys.summary(clubUUID) })
    },
  })
}

// Club Summary
export function useClubSummary(clubUUID: string) {
  return useQuery({
    queryKey: clubLeaderKeys.summary(clubUUID),
    queryFn: () => api.getClubSummary(clubUUID),
    enabled: !!clubUUID,
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
      queryClient.invalidateQueries({ queryKey: clubLeaderKeys.intro(clubUUID) })
      queryClient.invalidateQueries({ queryKey: clubLeaderKeys.summary(clubUUID) })
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
export function useApplicants(clubUUID: string) {
  return useQuery({
    queryKey: clubLeaderKeys.applicants(clubUUID),
    queryFn: () => api.getApplicants(clubUUID),
    enabled: !!clubUUID,
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
    onSuccess: (_, { clubUUID }) => {
      queryClient.invalidateQueries({ queryKey: clubLeaderKeys.applicants(clubUUID) })
      toast.success('지원자 상태가 업데이트되었습니다.')
    },
    onError: (error) => {
      toast.error('지원자 상태 업데이트에 실패했습니다.')
      console.error('Failed to process applicants:', error)
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
  return useMutation({
    mutationFn: ({ clubUUID, aplictUUIDs }: { clubUUID: string; aplictUUIDs: Array<{ aplictUUID: string }> }) =>
      api.sendApplicantNotifications(clubUUID, aplictUUIDs),
    onSuccess: () => {
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
