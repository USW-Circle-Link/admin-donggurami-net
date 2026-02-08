import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@test/mocks/server'
import { getCategories, createCategory, deleteCategory } from '../categoryApi'

const API_BASE = 'https://api.donggurami.net'

describe('Category API', () => {
  describe('getCategories', () => {
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

      const result = await getCategories()
      expect(result.message).toBe('카테고리 리스트 조회 성공')
      expect(result.data).toHaveLength(2)
      expect(result.data[0].clubCategoryName).toBe('학술')
    })

    it('should fetch empty categories list', async () => {
      server.use(
        http.get(`${API_BASE}/categories`, () => {
          return HttpResponse.json({
            message: '카테고리 리스트 조회 성공',
            data: [],
          })
        })
      )

      const result = await getCategories()
      expect(result.message).toBe('카테고리 리스트 조회 성공')
      expect(result.data).toHaveLength(0)
    })
  })

  describe('createCategory', () => {
    it('should create category successfully', async () => {
      server.use(
        http.post(`${API_BASE}/categories`, () => {
          return HttpResponse.json({
            message: '카테고리 추가 성공',
            data: {
              clubCategoryUUID: '550e8400-e29b-41d4-a716-446655440000',
              clubCategoryName: '예술',
            },
          })
        })
      )

      const result = await createCategory({
        clubCategoryName: '예술',
      })

      expect(result.message).toBe('카테고리 추가 성공')
      expect(result.data.clubCategoryName).toBe('예술')
    })

    it('should throw error for duplicate category', async () => {
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

      await expect(
        createCategory({
          clubCategoryName: '학술',
        })
      ).rejects.toThrow()
    })
  })

  describe('deleteCategory', () => {
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

      const result = await deleteCategory(clubCategoryUUID)
      expect(result.message).toBe('카테고리 삭제 성공')
      expect(result.data.clubCategoryUUID).toBe(clubCategoryUUID)
    })

    it('should throw error for non-existent category', async () => {
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

      await expect(deleteCategory(clubCategoryUUID)).rejects.toThrow()
    })
  })
})
