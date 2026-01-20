import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import {
  useCreateForm,
  useUpdateFormStatus,
  useSubmitApplication,
  useApplicationDetail,
} from '../useFormManagement'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('Form Management Hooks', () => {
  describe('useCreateForm', () => {
    it('should return mutation function', () => {
      const { result } = renderHook(() => useCreateForm(), {
        wrapper: createWrapper(),
      })

      expect(result.current.mutate).toBeDefined()
      expect(result.current.mutateAsync).toBeDefined()
    })
  })

  describe('useUpdateFormStatus', () => {
    it('should return mutation function', () => {
      const { result } = renderHook(() => useUpdateFormStatus(), {
        wrapper: createWrapper(),
      })

      expect(result.current.mutate).toBeDefined()
      expect(result.current.mutateAsync).toBeDefined()
    })
  })

  describe('useSubmitApplication', () => {
    it('should return mutation function', () => {
      const { result } = renderHook(() => useSubmitApplication(), {
        wrapper: createWrapper(),
      })

      expect(result.current.mutate).toBeDefined()
      expect(result.current.mutateAsync).toBeDefined()
    })
  })

  describe('useApplicationDetail', () => {
    it('should not fetch when clubId is empty', async () => {
      const { result } = renderHook(() => useApplicationDetail('', 'app-1'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.data).toBeUndefined()
    })

    it('should not fetch when applicationId is empty', async () => {
      const { result } = renderHook(() => useApplicationDetail('club-1', ''), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.data).toBeUndefined()
    })

    it('should fetch when both clubId and applicationId are provided', async () => {
      const { result } = renderHook(() => useApplicationDetail('club-1', 'app-1'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.data.applicationId).toBe(15)
      expect(result.current.data?.data.applicant.name).toBe('홍길동')
    })
  })
})
