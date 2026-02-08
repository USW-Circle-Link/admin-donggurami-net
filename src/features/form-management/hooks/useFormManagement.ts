import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as api from '../api/formApi'
import type {
  CreateFormRequest,
} from '../domain/formSchemas'

/**
 * Query key factory for form management
 * Enables efficient cache invalidation and query management
 */
export const formManagementKeys = {
  all: ['formManagement'] as const,
  forms: (clubId: string) => [...formManagementKeys.all, 'forms', clubId] as const,
  activeForm: (clubId: string) => [...formManagementKeys.all, 'activeForm', clubId] as const,
  applications: (clubId: string) => [...formManagementKeys.all, 'applications', clubId] as const,
  application: (clubId: string, applicationId: string) => [...formManagementKeys.all, 'application', clubId, applicationId] as const,
}

/**
 * Create a new application form with questions
 * @param clubId - The club UUID
 * @returns Mutation hook with success/error handling
 */
export function useCreateForm(clubId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: CreateFormRequest) => api.createForm(clubId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: formManagementKeys.forms(clubId) })
      toast.success('지원서가 성공적으로 생성되었습니다.')
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message
        || (error as { message?: string })?.message
        || '지원서 생성에 실패했습니다.'
      toast.error(message)
    },
  })
}

/**
 * Fetch active form for a club
 * @param clubId - The club UUID
 * @returns Query hook with active form data
 */
export function useActiveForm(clubId: string) {
  return useQuery({
    queryKey: formManagementKeys.activeForm(clubId),
    queryFn: () => api.getActiveForm(clubId),
    enabled: !!clubId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  })
}

/**
 * Fetch application detail for a club
 * @param clubId - The club UUID
 * @param applicationId - The application ID
 * @returns Query hook with application detail data
 */
export function useClubApplicationDetail(clubId: string, applicationId: string) {
  return useQuery({
    queryKey: formManagementKeys.application(clubId, applicationId),
    queryFn: () => api.getClubApplicationDetail(clubId, applicationId),
    enabled: !!clubId && !!applicationId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  })
}
