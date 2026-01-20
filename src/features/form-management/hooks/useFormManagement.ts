import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '../api/formApi'
import type {
  CreateFormRequest,
  UpdateFormStatusRequest,
  SubmitApplicationRequest,
} from '../domain/formSchemas'

export const formManagementKeys = {
  all: ['formManagement'] as const,
  forms: (clubId: string) => [...formManagementKeys.all, 'forms', clubId] as const,
  form: (clubId: string, formId: string) => [...formManagementKeys.all, 'form', clubId, formId] as const,
  applications: (clubId: string) => [...formManagementKeys.all, 'applications', clubId] as const,
  application: (clubId: string, applicationId: string) => [...formManagementKeys.all, 'application', clubId, applicationId] as const,
}

// Create Form
export function useCreateForm() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ clubId, request }: { clubId: string; request: CreateFormRequest }) =>
      api.createForm(clubId, request),
    onSuccess: (_, { clubId }) => {
      queryClient.invalidateQueries({ queryKey: formManagementKeys.forms(clubId) })
    },
  })
}

// Update Form Status
export function useUpdateFormStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ clubId, formId, request }: { clubId: string; formId: string; request: UpdateFormStatusRequest }) =>
      api.updateFormStatus(clubId, formId, request),
    onSuccess: (_, { clubId, formId }) => {
      queryClient.invalidateQueries({ queryKey: formManagementKeys.form(clubId, formId) })
      queryClient.invalidateQueries({ queryKey: formManagementKeys.forms(clubId) })
    },
  })
}

// Submit Application
export function useSubmitApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ clubId, formId, request }: { clubId: string; formId: string; request: SubmitApplicationRequest }) =>
      api.submitApplication(clubId, formId, request),
    onSuccess: (_, { clubId }) => {
      queryClient.invalidateQueries({ queryKey: formManagementKeys.applications(clubId) })
    },
  })
}

// Get Application Detail
export function useApplicationDetail(clubId: string, applicationId: string) {
  return useQuery({
    queryKey: formManagementKeys.application(clubId, applicationId),
    queryFn: () => api.getApplicationDetail(clubId, applicationId),
    enabled: !!clubId && !!applicationId,
  })
}
