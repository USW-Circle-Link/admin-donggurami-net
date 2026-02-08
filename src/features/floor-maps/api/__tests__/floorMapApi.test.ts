import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@test/mocks/server'
import { apiClient } from '@shared/api/apiClient'
import { getFloorMap, uploadFloorMaps, deleteFloorMap } from '../floorMapApi'
import type { ApiResponse } from '@shared/types/api'
import type { FloorMapResponse } from '../../domain/floorMapSchemas'

const API_BASE = 'https://api.donggurami.net'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('floorMapApi', () => {
  describe('getFloorMap', () => {
    it('should fetch floor map without floor parameter', async () => {
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

      const result = await getFloorMap()
      expect(result).toEqual(mockResponse)
    })

    it('should fetch floor map with specific floor parameter', async () => {
      const mockResponse: ApiResponse<FloorMapResponse> = {
        message: '층별 사진 조회 성공',
        data: {
          floor: 'B1',
          presignedUrl: 'https://example.com/b1.jpg',
        },
      }

      server.use(
        http.get(`${API_BASE}/floor-maps`, ({ request }) => {
          const url = new URL(request.url)
          const floor = url.searchParams.get('floor')
          expect(floor).toBe('B1')
          return HttpResponse.json(mockResponse)
        })
      )

      const result = await getFloorMap({ floor: 'B1' })
      expect(result).toEqual(mockResponse)
    })

    it('should handle PHOTO-505 error when photo not found', async () => {
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

      await expect(getFloorMap({ floor: 'F2' })).rejects.toThrow()
    })
  })

  describe('uploadFloorMaps', () => {
    it('should upload single floor photo', async () => {
      // Mock apiClient.put directly for this test due to MSW + FormData + Node.js issue
      const putSpy = vi.spyOn(apiClient, 'put').mockResolvedValueOnce({
        data: {
          message: '층별 사진 업로드 성공',
          data: null,
        },
      } as any)

      const file = new File(['content'], 'f1.jpg', { type: 'image/jpeg' })
      const result = await uploadFloorMaps({ F1: file })

      expect(result.message).toBe('층별 사진 업로드 성공')
      expect(result.data).toBeNull()
      expect(putSpy).toHaveBeenCalledWith(
        '/floor-maps',
        expect.any(FormData),
        expect.objectContaining({
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      )

      putSpy.mockRestore()
    })

    it('should upload multiple floor photos', async () => {
      // Mock apiClient.put directly for this test due to MSW + FormData + Node.js issue
      const putSpy = vi.spyOn(apiClient, 'put').mockResolvedValueOnce({
        data: {
          message: '층별 사진 업로드 성공',
          data: null,
        },
      } as any)

      const fileB1 = new File(['b1'], 'b1.jpg', { type: 'image/jpeg' })
      const fileF1 = new File(['f1'], 'f1.jpg', { type: 'image/jpeg' })
      const fileF2 = new File(['f2'], 'f2.jpg', { type: 'image/jpeg' })

      const result = await uploadFloorMaps({ B1: fileB1, F1: fileF1, F2: fileF2 })

      expect(result.message).toBe('층별 사진 업로드 성공')
      expect(result.data).toBeNull()
      expect(putSpy).toHaveBeenCalledWith(
        '/floor-maps',
        expect.any(FormData),
        expect.objectContaining({
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      )

      putSpy.mockRestore()
    })

    it('should handle PHOTO-504 error when files are empty', async () => {
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

      const file = new File([''], 'empty.jpg', { type: 'image/jpeg' })
      await expect(uploadFloorMaps({ F1: file })).rejects.toThrow()

      putSpy.mockRestore()
    })
  })

  describe('deleteFloorMap', () => {
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

      const result = await deleteFloorMap('F1')
      expect(result).toEqual(mockResponse)
    })

    it('should handle PHOTO-505 error when photo not found', async () => {
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

      await expect(deleteFloorMap('B1')).rejects.toThrow()
    })
  })
})
