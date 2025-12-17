import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { checkCanApply, getGoogleFormUrl, submitApplication } from '../api/applicationApi'
import { mypageKeys } from '@features/mypage/hooks/useMypage'

export const applicationKeys = {
  all: ['application'] as const,
  canApply: (clubUUID: string) => [...applicationKeys.all, 'canApply', clubUUID] as const,
  googleFormUrl: (clubUUID: string) => [...applicationKeys.all, 'googleFormUrl', clubUUID] as const,
}

export function useCanApply(clubUUID: string) {
  return useQuery({
    queryKey: applicationKeys.canApply(clubUUID),
    queryFn: () => checkCanApply(clubUUID),
    enabled: !!clubUUID,
  })
}

export function useGoogleFormUrl(clubUUID: string) {
  return useQuery({
    queryKey: applicationKeys.googleFormUrl(clubUUID),
    queryFn: () => getGoogleFormUrl(clubUUID),
    enabled: !!clubUUID,
  })
}

export function useSubmitApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (clubUUID: string) => submitApplication(clubUUID),
    onSuccess: (_, clubUUID) => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.canApply(clubUUID) })
      queryClient.invalidateQueries({ queryKey: mypageKeys.appliedClubs() })
    },
  })
}
