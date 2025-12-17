import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '../api/clubLeaderApi'
import type {
  ClubIntroRequest,
  ClubInfoRequest,
  LeaderUpdatePwRequest,
  ClubMemberDeleteRequest,
  ClubMemberAddFromExcel,
  NonMemberUpdateRequest,
  SignUpAcceptRequest,
  ApplicantStatusUpdate,
  FcmTokenRequest,
} from '../domain/clubLeaderSchemas'

export const clubLeaderKeys = {
  all: ['clubLeader'] as const,
  intro: (clubUUID: string) => [...clubLeaderKeys.all, 'intro', clubUUID] as const,
  info: (clubUUID: string) => [...clubLeaderKeys.all, 'info', clubUUID] as const,
  summary: (clubUUID: string) => [...clubLeaderKeys.all, 'summary', clubUUID] as const,
  categories: () => [...clubLeaderKeys.all, 'categories'] as const,
  members: (clubUUID: string) => [...clubLeaderKeys.all, 'members', clubUUID] as const,
  signUpRequests: (clubUUID: string) => [...clubLeaderKeys.all, 'signUp', clubUUID] as const,
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

export function useAddClubMembersFromExcel() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ clubUUID, members }: { clubUUID: string; members: ClubMemberAddFromExcel[] }) =>
      api.addClubMembersFromExcel(clubUUID, members),
    onSuccess: (_, { clubUUID }) => {
      queryClient.invalidateQueries({ queryKey: clubLeaderKeys.members(clubUUID) })
    },
  })
}

export function useUpdateNonMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ clubUUID, clubMemberUUID, data }: { clubUUID: string; clubMemberUUID: string; data: NonMemberUpdateRequest }) =>
      api.updateNonMember(clubUUID, clubMemberUUID, data),
    onSuccess: (_, { clubUUID }) => {
      queryClient.invalidateQueries({ queryKey: clubLeaderKeys.members(clubUUID) })
    },
  })
}

// Sign Up Requests
export function useSignUpRequests(clubUUID: string) {
  return useQuery({
    queryKey: clubLeaderKeys.signUpRequests(clubUUID),
    queryFn: () => api.getSignUpRequests(clubUUID),
    enabled: !!clubUUID,
  })
}

export function useAcceptSignUpRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ clubUUID, data }: { clubUUID: string; data: SignUpAcceptRequest }) =>
      api.acceptSignUpRequest(clubUUID, data),
    onSuccess: (_, { clubUUID }) => {
      queryClient.invalidateQueries({ queryKey: clubLeaderKeys.signUpRequests(clubUUID) })
      queryClient.invalidateQueries({ queryKey: clubLeaderKeys.members(clubUUID) })
    },
  })
}

export function useRejectSignUpRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ clubUUID, clubMemberAccountStatusUUID }: { clubUUID: string; clubMemberAccountStatusUUID: string }) =>
      api.rejectSignUpRequest(clubUUID, clubMemberAccountStatusUUID),
    onSuccess: (_, { clubUUID }) => {
      queryClient.invalidateQueries({ queryKey: clubLeaderKeys.signUpRequests(clubUUID) })
    },
  })
}

// Applicants
export function useApplicants(clubUUID: string) {
  return useQuery({
    queryKey: clubLeaderKeys.applicants(clubUUID),
    queryFn: () => api.getApplicants(clubUUID),
    enabled: !!clubUUID,
  })
}

export function useProcessApplicants() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ clubUUID, updates }: { clubUUID: string; updates: ApplicantStatusUpdate[] }) =>
      api.processApplicants(clubUUID, updates),
    onSuccess: (_, { clubUUID }) => {
      queryClient.invalidateQueries({ queryKey: clubLeaderKeys.applicants(clubUUID) })
      queryClient.invalidateQueries({ queryKey: clubLeaderKeys.failedApplicants(clubUUID) })
    },
  })
}

export function useFailedApplicants(clubUUID: string) {
  return useQuery({
    queryKey: clubLeaderKeys.failedApplicants(clubUUID),
    queryFn: () => api.getFailedApplicants(clubUUID),
    enabled: !!clubUUID,
  })
}

export function useProcessFailedApplicants() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ clubUUID, updates }: { clubUUID: string; updates: ApplicantStatusUpdate[] }) =>
      api.processFailedApplicants(clubUUID, updates),
    onSuccess: (_, { clubUUID }) => {
      queryClient.invalidateQueries({ queryKey: clubLeaderKeys.failedApplicants(clubUUID) })
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
