import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { checkEligibility, submitApplication, getApplicationDetail } from '../api/applicationApi'
import { mypageKeys } from '@features/mypage/hooks/useMypage'
import type { SubmitApplicationRequest } from '../domain/applicationSchemas'

export const applicationKeys = {
  all: ['application'] as const,
  eligibility: (clubUUID: string) => [...applicationKeys.all, 'eligibility', clubUUID] as const,
  detail: (clubUUID: string, aplictUUID: string) =>
    [...applicationKeys.all, 'detail', clubUUID, aplictUUID] as const,
}

export function useEligibility(clubUUID: string) {
  return useQuery({
    queryKey: applicationKeys.eligibility(clubUUID),
    queryFn: () => checkEligibility(clubUUID),
    enabled: !!clubUUID,
  })
}

export function useApplicationDetail(clubUUID: string, aplictUUID: string) {
  return useQuery({
    queryKey: applicationKeys.detail(clubUUID, aplictUUID),
    queryFn: () => getApplicationDetail(clubUUID, aplictUUID),
    enabled: !!clubUUID && !!aplictUUID,
  })
}

export function useSubmitApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ clubUUID, data }: { clubUUID: string; data: SubmitApplicationRequest }) =>
      submitApplication(clubUUID, data),
    onSuccess: (_, { clubUUID }) => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.eligibility(clubUUID) })
      queryClient.invalidateQueries({ queryKey: mypageKeys.appliedClubs() })
    },
  })
}
