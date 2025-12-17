import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMyProfile, changeProfile, checkProfileDuplication } from '../api/profileApi'
import type { ProfileChangeRequest, ProfileDuplicationCheckRequest } from '../domain/profileSchemas'

export const profileKeys = {
  all: ['profile'] as const,
  me: () => [...profileKeys.all, 'me'] as const,
}

export function useMyProfile() {
  return useQuery({
    queryKey: profileKeys.me(),
    queryFn: getMyProfile,
  })
}

export function useChangeProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: ProfileChangeRequest) => changeProfile(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.me() })
    },
  })
}

export function useCheckProfileDuplication() {
  return useMutation({
    mutationFn: (request: ProfileDuplicationCheckRequest) => checkProfileDuplication(request),
  })
}
