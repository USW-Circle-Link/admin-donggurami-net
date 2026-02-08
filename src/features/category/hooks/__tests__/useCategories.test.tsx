import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { http, HttpResponse } from 'msw'
import { server } from '@test/mocks/server'
import { useCategories, useCreateCategory, useDeleteCategory, categoryKeys } from '../useCategories'

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

describe('Category Hooks', () => {
  describe('useCategories()', () => {
    it('should fetch categories list successfully', async () => {
      server.use(
        http.get(`${API_BASE}/categories`, () => {
          return HttpResponse.json({
            message: '카테고리 리스트 조회 성공',
            data: [
              {
                clubCategoryUUID: '550e8400-e29b-41d4-a716-446655440000',
                clubCategoryName: '학술',
              },
              {
                clubCategoryUUID: '550e8400-e29b-41d4-a716-446655440001',
                clubCategoryName: '체육',
              },
            ],
          })
        })
      )

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.data).toHaveLength(2)
      expect(result.current.data?.data[0].clubCategoryName).toBe('학술')
    })

    it('should handle empty categories list', async () => {
      server.use(
        http.get(`${API_BASE}/categories`, () => {
          return HttpResponse.json({
            message: '카테고리 리스트 조회 성공',
            data: [],
          })
        })
      )

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.data).toHaveLength(0)
    })

    it('should cache results', async () => {
      const { result, rerender } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      const firstData = result.current.data

      rerender()

      expect(result.current.data).toBe(firstData)
    })
  })

  describe('useCreateCategory()', () => {
    it('should create category successfully', async () => {
      const { result } = renderHook(() => useCreateCategory(), {
        wrapper: createWrapper(),
      })

      await act(async () => {
        await result.current.mutateAsync({
          clubCategoryName: '예술',
        })
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.data.clubCategoryName).toBe('예술')
    })

    it('should invalidate categories query on success', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
      })
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

      const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      )

      const { result } = renderHook(() => useCreateCategory(), { wrapper })

      await act(async () => {
        await result.current.mutateAsync({
          clubCategoryName: '예술',
        })
      })

      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: categoryKeys.list(),
      })
    })

    it('should handle duplicate category error', async () => {
      server.use(
        http.post(`${API_BASE}/categories`, () => {
          return HttpResponse.json(
            {
              exception: 'CategoryException',
              code: 'CTG-203',
              message: '이미 존재하는 카테고리입니다',
              status: 409,
              error: 'Conflict',
              additionalData: null,
            },
            { status: 409 }
          )
        })
      )

      const { result } = renderHook(() => useCreateCategory(), {
        wrapper: createWrapper(),
      })

      await act(async () => {
        try {
          await result.current.mutateAsync({
            clubCategoryName: '학술',
          })
        } catch {
          // Expected to throw
        }
      })

      expect(result.current.isError).toBe(true)
    })
  })

  describe('useDeleteCategory()', () => {
    it('should delete category successfully', async () => {
      const clubCategoryUUID = '550e8400-e29b-41d4-a716-446655440000'

      server.use(
        http.delete(`${API_BASE}/categories/${clubCategoryUUID}`, () => {
          return HttpResponse.json({
            message: '카테고리 삭제 성공',
            data: {
              clubCategoryUUID,
              clubCategoryName: '학술',
            },
          })
        })
      )

      const { result } = renderHook(() => useDeleteCategory(), {
        wrapper: createWrapper(),
      })

      await act(async () => {
        await result.current.mutateAsync(clubCategoryUUID)
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.data.clubCategoryUUID).toBe(clubCategoryUUID)
    })

    it('should invalidate categories query on success', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
      })
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

      const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      )

      const { result } = renderHook(() => useDeleteCategory(), { wrapper })

      await act(async () => {
        await result.current.mutateAsync('550e8400-e29b-41d4-a716-446655440000')
      })

      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: categoryKeys.list(),
      })
    })

    it('should handle non-existent category error', async () => {
      const clubCategoryUUID = '550e8400-e29b-41d4-a716-446655440000'

      server.use(
        http.delete(`${API_BASE}/categories/${clubCategoryUUID}`, () => {
          return HttpResponse.json(
            {
              exception: 'CategoryException',
              code: 'CTG-201',
              message: '존재하지 않는 카테고리입니다',
              status: 404,
              error: 'Not Found',
              additionalData: null,
            },
            { status: 404 }
          )
        })
      )

      const { result } = renderHook(() => useDeleteCategory(), {
        wrapper: createWrapper(),
      })

      await act(async () => {
        try {
          await result.current.mutateAsync(clubCategoryUUID)
        } catch {
          // Expected to throw
        }
      })

      expect(result.current.isError).toBe(true)
    })
  })
})
