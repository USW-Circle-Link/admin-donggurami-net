import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { toast } from 'sonner'
import { http, HttpResponse } from 'msw'
import { server } from '@test/mocks/server'
import {
  useCreateForm,
  useActiveForm,
  useClubApplicationDetail,
  formManagementKeys,
} from '../useFormManagement'
import type { CreateFormRequest } from '../../domain/formSchemas'

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

const API_BASE = 'https://api.donggurami.net'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('Form Management Hooks', () => {
  describe('useCreateForm()', () => {
    it('should call API with correct payload', async () => {
      const { result } = renderHook(() => useCreateForm('club-uuid-123'), {
        wrapper: createWrapper(),
      })

      const request: CreateFormRequest = {
        description: '2024년 신입 회원을 모집합니다',
        questions: [
          {
            sequence: 1,
            type: 'SHORT_TEXT',
            content: '질문',
            required: true,
          },
        ],
      }

      await act(async () => {
        await result.current.mutateAsync(request)
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.formId).toBeDefined()
    })

    it('should show success toast on success', async () => {
      const { result } = renderHook(() => useCreateForm('club-uuid-123'), {
        wrapper: createWrapper(),
      })

      const request: CreateFormRequest = {
        description: '설명',
        questions: [
          {
            sequence: 1,
            type: 'SHORT_TEXT',
            content: '질문',
            required: true,
          },
        ],
      }

      await act(async () => {
        await result.current.mutateAsync(request)
      })

      expect(toast.success).toHaveBeenCalledWith('지원서가 성공적으로 생성되었습니다.')
    })

    it('should invalidate queries on success', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
      })
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

      const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      )

      const { result } = renderHook(() => useCreateForm('club-uuid-123'), { wrapper })

      const request: CreateFormRequest = {
        description: '설명',
        questions: [
          {
            sequence: 1,
            type: 'SHORT_TEXT',
            content: '질문',
            required: true,
          },
        ],
      }

      await act(async () => {
        await result.current.mutateAsync(request)
      })

      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: formManagementKeys.forms('club-uuid-123'),
      })
    })

    it('should handle error with error toast', async () => {
      server.use(
        http.post(`${API_BASE}/clubs/club-uuid-123/forms`, () => {
          return HttpResponse.json(
            {
              exception: 'ValidationException',
              code: 'COM-100',
              message: '유효하지 않은 입력입니다.',
              status: 400,
            },
            { status: 400 }
          )
        })
      )

      const { result } = renderHook(() => useCreateForm('club-uuid-123'), {
        wrapper: createWrapper(),
      })

      const request: CreateFormRequest = {
        description: '설명',
        questions: [
          {
            sequence: 1,
            type: 'SHORT_TEXT',
            content: '질문',
            required: true,
          },
        ],
      }

      await act(async () => {
        try {
          await result.current.mutateAsync(request)
        } catch {
          // Expected to throw
        }
      })

      expect(toast.error).toHaveBeenCalled()
    })

    it('should update loading state', async () => {
      const { result } = renderHook(() => useCreateForm('club-uuid-123'), {
        wrapper: createWrapper(),
      })

      expect(result.current.isPending).toBe(false)

      const request: CreateFormRequest = {
        description: '설명',
        questions: [
          {
            sequence: 1,
            type: 'SHORT_TEXT',
            content: '질문',
            required: true,
          },
        ],
      }

      act(() => {
        result.current.mutate(request)
      })

      await waitFor(() => {
        expect(result.current.isPending).toBe(false)
      })
    })
  })

  describe('useActiveForm()', () => {
    it('should fetch active form for club', async () => {
      server.use(
        http.get(`${API_BASE}/clubs/club-uuid-123/forms`, () => {
          return HttpResponse.json({
            message: '활성 폼 조회 성공',
            data: {
              formId: '550e8400-e29b-41d4-a716-446655440001',
              questions: [
                {
                  questionId: 1,
                  sequence: 1,
                  type: 'SHORT_TEXT',
                  content: '지원 동기',
                  required: true,
                  options: [],
                },
              ],
            },
          })
        })
      )

      const { result } = renderHook(() => useActiveForm('club-uuid-123'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.formId).toBe('550e8400-e29b-41d4-a716-446655440001')
      expect(result.current.data?.questions).toHaveLength(1)
    })

    it('should not fetch when clubId is empty', async () => {
      const { result } = renderHook(() => useActiveForm(''), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.data).toBeUndefined()
    })
  })

  describe('useClubApplicationDetail()', () => {
    it('should not fetch when clubId is empty', async () => {
      const { result } = renderHook(() => useClubApplicationDetail('', 'app-1'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.data).toBeUndefined()
    })

    it('should not fetch when applicationId is empty', async () => {
      const { result } = renderHook(() => useClubApplicationDetail('club-1', ''), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.data).toBeUndefined()
    })

    it('should fetch when both clubId and applicationId are provided', async () => {
      server.use(
        http.get(`${API_BASE}/clubs/club-1/applications/app-1`, () => {
          return HttpResponse.json({
            message: '지원서 조회 성공',
            data: {
              applicationId: 'app-uuid-123',
              formId: 'form-uuid-123',
              applicantName: '홍길동',
              submittedAt: '2024-01-15T10:00:00Z',
              answers: [],
              questions: [],
            },
          })
        })
      )

      const { result } = renderHook(() => useClubApplicationDetail('club-1', 'app-1'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.applicationId).toBe('app-uuid-123')
      expect(result.current.data?.applicantName).toBe('홍길동')
    })

    it('should cache results', async () => {
      server.use(
        http.get(`${API_BASE}/clubs/club-1/applications/app-1`, () => {
          return HttpResponse.json({
            message: '지원서 조회 성공',
            data: {
              applicationId: 'app-uuid-123',
              formId: 'form-uuid-123',
              applicantName: '홍길동',
              submittedAt: '2024-01-15T10:00:00Z',
              answers: [],
              questions: [],
            },
          })
        })
      )

      const { result, rerender } = renderHook(() => useClubApplicationDetail('club-1', 'app-1'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      const firstData = result.current.data

      rerender()

      expect(result.current.data).toBe(firstData)
    })

    it('should update on refetch', async () => {
      server.use(
        http.get(`${API_BASE}/clubs/club-1/applications/app-1`, () => {
          return HttpResponse.json({
            message: '지원서 조회 성공',
            data: {
              applicationId: 'app-uuid-123',
              formId: 'form-uuid-123',
              applicantName: '홍길동',
              submittedAt: '2024-01-15T10:00:00Z',
              answers: [],
              questions: [],
            },
          })
        })
      )

      const { result } = renderHook(() => useClubApplicationDetail('club-1', 'app-1'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      await act(async () => {
        await result.current.refetch()
      })

      expect(result.current.isSuccess).toBe(true)
    })
  })
})
