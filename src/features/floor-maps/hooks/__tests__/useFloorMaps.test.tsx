import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import { server } from '@test/mocks/server'
import { apiClient } from '@shared/api/apiClient'
import { useFloorMap, useUploadFloorMaps, useDeleteFloorMap, floorMapKeys } from '../useFloorMaps'
import type { ApiResponse } from '@shared/types/api'
import type { FloorMapResponse } from '../../domain/floorMapSchemas'

const API_BASE = 'https://api.donggurami.net'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('useFloorMaps', () => {
  describe('floorMapKeys', () => {
    it('should generate correct query keys', () => {
      expect(floorMapKeys.all).toEqual(['floor-maps'])
      expect(floorMapKeys.detail('F1')).toEqual(['floor-maps', 'F1'])
      expect(floorMapKeys.detail()).toEqual(['floor-maps', undefined])
    })
  })

  describe('useFloorMap', () => {
    it('should fetch floor map successfully', async () => {
      const mockResponse: ApiResponse<FloorMapResponse> = {
        message: '층별 사진 조회 성공',
        data: {
          floor: 'F1',
          presignedUrl: 'https://example.com/f1.jpg',
        },
      }

      server.use(
        http.get(`${API_BASE}/floor-maps`, () => {
          return HttpResponse.json(mockResponse)
        })
      )

      const { result } = renderHook(() => useFloorMap({ floor: 'F1' }), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data).toEqual(mockResponse)
    })

    it('should fetch floor map without params', async () => {
      const mockResponse: ApiResponse<FloorMapResponse> = {
        message: '층별 사진 조회 성공',
        data: {
          floor: 'B1',
          presignedUrl: 'https://example.com/b1.jpg',
        },
      }

      server.use(
        http.get(`${API_BASE}/floor-maps`, () => {
          return HttpResponse.json(mockResponse)
        })
      )

      const { result } = renderHook(() => useFloorMap(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data).toEqual(mockResponse)
    })

    it('should handle error when photo not found', async () => {
      server.use(
        http.get(`${API_BASE}/floor-maps`, () => {
          return HttpResponse.json(
            {
              message: '해당 사진이 존재하지 않습니다',
              errorCode: 'PHOTO-505',
            },
            { status: 404 }
          )
        })
      )

      const { result } = renderHook(() => useFloorMap({ floor: 'F2' }), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isError).toBe(true))
    })
  })

  describe('useUploadFloorMaps', () => {
    it('should upload floor photos successfully', async () => {
      // Mock apiClient.put directly for this test due to MSW + FormData + Node.js issue
      const putSpy = vi.spyOn(apiClient, 'put').mockResolvedValueOnce({
        data: {
          message: '층별 사진 업로드 성공',
          data: null,
        },
      } as any)

      const { result } = renderHook(() => useUploadFloorMaps(), {
        wrapper: createWrapper(),
      })

      const file = new File(['content'], 'f1.jpg', { type: 'image/jpeg' })
      result.current.mutate({ F1: file })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data?.message).toBe('층별 사진 업로드 성공')

      putSpy.mockRestore()
    })

    it('should handle upload error', async () => {
      // Mock apiClient.put to reject with error
      const putSpy = vi.spyOn(apiClient, 'put').mockRejectedValueOnce({
        response: {
          data: {
            message: '사진 파일이 비어있습니다',
            errorCode: 'PHOTO-504',
          },
          status: 400,
        },
      })

      const { result } = renderHook(() => useUploadFloorMaps(), {
        wrapper: createWrapper(),
      })

      const file = new File([''], 'empty.jpg', { type: 'image/jpeg' })
      result.current.mutate({ F1: file })

      await waitFor(() => expect(result.current.isError).toBe(true))

      putSpy.mockRestore()
    })
  })

  describe('useDeleteFloorMap', () => {
    it('should delete floor photo successfully', async () => {
      const mockResponse: ApiResponse<string> = {
        message: '층별 사진 삭제 성공',
        data: 'Floor: F1',
      }

      server.use(
        http.delete(`${API_BASE}/floor-maps/F1`, () => {
          return HttpResponse.json(mockResponse)
        })
      )

      const { result } = renderHook(() => useDeleteFloorMap(), {
        wrapper: createWrapper(),
      })

      result.current.mutate('F1')

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data).toEqual(mockResponse)
    })

    it('should handle delete error when photo not found', async () => {
      server.use(
        http.delete(`${API_BASE}/floor-maps/B1`, () => {
          return HttpResponse.json(
            {
              message: '해당 사진이 존재하지 않습니다',
              errorCode: 'PHOTO-505',
            },
            { status: 404 }
          )
        })
      )

      const { result } = renderHook(() => useDeleteFloorMap(), {
        wrapper: createWrapper(),
      })

      result.current.mutate('B1')

      await waitFor(() => expect(result.current.isError).toBe(true))
    })
  })
})
