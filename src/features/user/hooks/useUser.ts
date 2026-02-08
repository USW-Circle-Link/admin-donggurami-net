import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as api from '../api/userApi'
import type {
  UpdateMyProfileRequest,
  ChangeMyPasswordRequest,
  WithdrawUserRequest,
} from '../domain/userSchemas'

/**
 * Query key factory for user data
 */
export const userKeys = {
  all: ['user'] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
  clubs: () => [...userKeys.all, 'clubs'] as const,
  applications: () => [...userKeys.all, 'applications'] as const,
}

/**
 * Get my profile
 */
export function useMyProfile() {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: () => api.getMyProfile(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Update my profile
 */
export function useUpdateMyProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: UpdateMyProfileRequest) => api.updateMyProfile(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() })
      toast.success('프로필이 수정되었습니다.')
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message
        || (error as { message?: string })?.message
        || '프로필 수정에 실패했습니다.'
      toast.error(message)
    },
  })
}

/**
 * Change my password
 */
export function useChangeMyPassword() {
  return useMutation({
    mutationFn: (request: ChangeMyPasswordRequest) => api.changeMyPassword(request),
    onSuccess: () => {
      toast.success('비밀번호가 변경되었습니다.')
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message
        || (error as { message?: string })?.message
        || '비밀번호 변경에 실패했습니다.'
      toast.error(message)
    },
  })
}

/**
 * Withdraw user (회원 탈퇴)
 */
export function useWithdrawUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: WithdrawUserRequest) => api.withdrawUser(request),
    onSuccess: () => {
      queryClient.clear()
      toast.success('회원 탈퇴가 완료되었습니다.')
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message
        || (error as { message?: string })?.message
        || '회원 탈퇴에 실패했습니다.'
      toast.error(message)
    },
  })
}

/**
 * Get my clubs
 */
export function useMyClubs() {
  return useQuery({
    queryKey: userKeys.clubs(),
    queryFn: () => api.getMyClubs(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Get my applications
 */
export function useMyApplications() {
  return useQuery({
    queryKey: userKeys.applications(),
    queryFn: () => api.getMyApplications(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
