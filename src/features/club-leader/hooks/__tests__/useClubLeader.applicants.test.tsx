import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { toast } from 'sonner'
import { http, HttpResponse } from 'msw'
import { server } from '@test/mocks/server'
import {
  useApplicants,
  useProcessApplicants,
  useFailedApplicants,
  useProcessFailedApplicants,
  clubLeaderKeys,
} from '../useClubLeader'
import type { ApplicantStatus } from '../../domain/clubLeaderSchemas'

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

const API_BASE = 'https://api.donggurami.net'
const TEST_CLUB_UUID = '550e8400-e29b-41d4-a716-446655440000'

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

describe('Club Leader Hooks - Applicants', () => {
  describe('useApplicants()', () => {
    it('should fetch applicants', async () => {
      const { result } = renderHook(() => useApplicants(TEST_CLUB_UUID), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.data).toHaveLength(1)
      expect(result.current.data?.data[0].userName).toBe('지원자1')
    })

    it('should cache results', async () => {
      const { result, rerender } = renderHook(() => useApplicants(TEST_CLUB_UUID), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      const firstData = result.current.data

      rerender()

      expect(result.current.data).toBe(firstData)
    })

    it('should enable/disable based on clubUUID', () => {
      const { result: enabledResult } = renderHook(() => useApplicants(TEST_CLUB_UUID), {
        wrapper: createWrapper(),
      })

      const { result: disabledResult } = renderHook(() => useApplicants(''), {
        wrapper: createWrapper(),
      })

      expect(enabledResult.current.isLoading || enabledResult.current.isSuccess).toBe(true)
      expect(disabledResult.current.isLoading).toBe(false)
      expect(disabledResult.current.data).toBeUndefined()
    })
  })

  describe('useProcessApplicants()', () => {
    it('should update statuses', async () => {
      const { result } = renderHook(() => useProcessApplicants(), {
        wrapper: createWrapper(),
      })

      const updates = [
        {
          aplictUUID: 'applicant-1',
          status: 'PASS' as const,
        },
      ]

      await act(async () => {
        await result.current.mutateAsync({
          clubUUID: TEST_CLUB_UUID,
          updates,
        })
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
    })

    it('should invalidate applicants cache', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
      })
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

      const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      )

      const { result } = renderHook(() => useProcessApplicants(), { wrapper })

      const updates = [
        { aplictUUID: 'applicant-1', status: 'PASS' as const },
      ]

      await act(async () => {
        await result.current.mutateAsync({
          clubUUID: TEST_CLUB_UUID,
          updates,
        })
      })

      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: clubLeaderKeys.applicants(TEST_CLUB_UUID),
      })
    })

    it('should show success toast', async () => {
      const { result } = renderHook(() => useProcessApplicants(), {
        wrapper: createWrapper(),
      })

      const updates = [
        { aplictUUID: 'applicant-1', status: 'PASS' as const },
      ]

      await act(async () => {
        await result.current.mutateAsync({
          clubUUID: TEST_CLUB_UUID,
          updates,
        })
      })

      expect(toast.success).toHaveBeenCalledWith('지원자 상태가 업데이트되었습니다.')
    })

    it('should show error toast on failure', async () => {
      server.use(
        http.patch(`${API_BASE}/clubs/${TEST_CLUB_UUID}/leader/applications/nonexistent/status`, () => {
          return HttpResponse.json(
            {
              exception: 'ApplicantException',
              code: 'APLCT-404',
              message: '지원자를 찾을 수 없습니다.',
              status: 404,
            },
            { status: 404 }
          )
        })
      )

      const { result } = renderHook(() => useProcessApplicants(), {
        wrapper: createWrapper(),
      })

      const updates = [
        { aplictUUID: 'nonexistent', status: 'PASS' as const },
      ]

      await act(async () => {
        try {
          await result.current.mutateAsync({
            clubUUID: TEST_CLUB_UUID,
            updates,
          })
        } catch {
          // Expected to throw
        }
      })

      expect(toast.error).toHaveBeenCalledWith('지원자 상태 업데이트에 실패했습니다.')
    })
  })

  describe('useFailedApplicants()', () => {
    it('should fetch failed applicants', async () => {
      server.use(
        http.get(`${API_BASE}/clubs/${TEST_CLUB_UUID}/applicants`, ({ request }) => {
          const url = new URL(request.url)
          const status = url.searchParams.get('status')

          if (status === 'FAIL') {
            return HttpResponse.json({
              message: '지원자 목록 조회 성공',
              data: [
                {
                  aplictUUID: 'failed-applicant-1',
                  userName: '탈락자1',
                  studentNumber: '20241111',
                  major: '컴퓨터공학과',
                  userHp: '01099998888',
                  status: 'FAIL',
                },
              ],
            })
          }

          return HttpResponse.json({
            message: '지원자 목록 조회 성공',
            data: [],
          })
        })
      )

      const { result } = renderHook(() => useFailedApplicants(TEST_CLUB_UUID), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.data).toHaveLength(1)
      expect(result.current.data?.data[0].userName).toBe('탈락자1')
    })

    it('should separate from main applicants', async () => {
      server.use(
        http.get(`${API_BASE}/clubs/${TEST_CLUB_UUID}/applicants`, ({ request }) => {
          const url = new URL(request.url)
          const status = url.searchParams.get('status')

          if (status === 'FAIL') {
            return HttpResponse.json({
              message: '지원자 목록 조회 성공',
              data: [
                {
                  aplictUUID: 'failed-1',
                  userName: '탈락자',
                  studentNumber: '20241111',
                  major: '컴퓨터공학과',
                  userHp: '01099998888',
                  status: 'FAIL',
                },
              ],
            })
          }

          return HttpResponse.json({
            message: '지원자 목록 조회 성공',
            data: [
              {
                aplictUUID: 'applicant-1',
                userName: '지원자',
                studentNumber: '20241234',
                major: '소프트웨어학과',
                userHp: '01011112222',
                status: 'WAIT',
              },
            ],
          })
        })
      )

      const wrapper = createWrapper()

      const { result: failedResult } = renderHook(() => useFailedApplicants(TEST_CLUB_UUID), {
        wrapper,
      })

      const { result: applicantsResult } = renderHook(() => useApplicants(TEST_CLUB_UUID), {
        wrapper,
      })

      await waitFor(() => {
        expect(failedResult.current.isSuccess).toBe(true)
        expect(applicantsResult.current.isSuccess).toBe(true)
      })

      expect(failedResult.current.data?.data[0].userName).toBe('탈락자')
      expect(applicantsResult.current.data?.data[0].userName).toBe('지원자')
    })
  })

  describe('useProcessFailedApplicants()', () => {
    it('should promote failed applicants', async () => {
      const { result } = renderHook(() => useProcessFailedApplicants(), {
        wrapper: createWrapper(),
      })

      const updates: { aplictUUID: string; status: ApplicantStatus }[] = [
        {
          aplictUUID: 'failed-applicant-1',
          status: 'PASS',
        },
      ]

      await act(async () => {
        await result.current.mutateAsync({
          clubUUID: TEST_CLUB_UUID,
          updates,
        })
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
    })

    it('should invalidate both caches', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
      })
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

      const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      )

      const { result } = renderHook(() => useProcessFailedApplicants(), { wrapper })

      const updates: { aplictUUID: string; status: ApplicantStatus }[] = [
        { aplictUUID: 'failed-applicant-1', status: 'PASS' },
      ]

      await act(async () => {
        await result.current.mutateAsync({
          clubUUID: TEST_CLUB_UUID,
          updates,
        })
      })

      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: clubLeaderKeys.failedApplicants(TEST_CLUB_UUID),
      })
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: clubLeaderKeys.applicants(TEST_CLUB_UUID),
      })
    })

    it('should show success toast', async () => {
      const { result } = renderHook(() => useProcessFailedApplicants(), {
        wrapper: createWrapper(),
      })

      const updates: { aplictUUID: string; status: ApplicantStatus }[] = [
        { aplictUUID: 'failed-applicant-1', status: 'PASS' },
      ]

      await act(async () => {
        await result.current.mutateAsync({
          clubUUID: TEST_CLUB_UUID,
          updates,
        })
      })

      expect(toast.success).toHaveBeenCalledWith('추합 처리가 완료되었습니다.')
    })

    it('should show error toast on failure', async () => {
      server.use(
        http.patch(`${API_BASE}/clubs/${TEST_CLUB_UUID}/leader/applications/nonexistent/status`, () => {
          return HttpResponse.json(
            {
              exception: 'ApplicantException',
              code: 'APLCT-404',
              message: '지원자를 찾을 수 없습니다.',
              status: 404,
            },
            { status: 404 }
          )
        })
      )

      const { result } = renderHook(() => useProcessFailedApplicants(), {
        wrapper: createWrapper(),
      })

      const updates: { aplictUUID: string; status: ApplicantStatus }[] = [
        { aplictUUID: 'nonexistent', status: 'PASS' },
      ]

      await act(async () => {
        try {
          await result.current.mutateAsync({
            clubUUID: TEST_CLUB_UUID,
            updates,
          })
        } catch {
          // Expected to throw
        }
      })

      expect(toast.error).toHaveBeenCalledWith('추합 처리에 실패했습니다.')
    })
  })
})
