import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@test/mocks/server'
import { createQueryWrapper } from '@test/utils/testUtils'
import { useAllClubs, useClubIntro, useCategories } from '../useClubs'

const API_BASE = 'https://api.donggurami.net'

describe('Club Hooks', () => {
  describe('useAllClubs', () => {
    it('should fetch all clubs', async () => {
      server.use(
        http.get(`${API_BASE}/clubs`, () => {
          return HttpResponse.json({
            message: '전체 동아리 조회 완료',
            data: [
              {
                clubUUID: '550e8400-e29b-41d4-a716-446655440000',
                clubName: '테스트 동아리',
                mainPhoto: null,
                departmentName: '학술',
                clubHashtags: [],
              },
            ],
          })
        })
      )

      const { result } = renderHook(() => useAllClubs(), {
        wrapper: createQueryWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.data).toHaveLength(1)
      expect(result.current.data?.data[0].clubName).toBe('테스트 동아리')
    })
  })

  describe('useClubIntro', () => {
    it('should fetch club intro by UUID', async () => {
      const clubUUID = '550e8400-e29b-41d4-a716-446655440000'

      server.use(
        http.get(`${API_BASE}/clubs/intro/${clubUUID}`, () => {
          return HttpResponse.json({
            message: '동아리 소개글 조회 성공',
            data: {
              clubUUID,
              mainPhoto: null,
              introPhotos: [],
              clubName: '코딩 동아리',
              leaderName: '홍길동',
              leaderHp: '01012345678',
              clubInsta: null,
              clubIntro: '소개글',
              recruitmentStatus: 'OPEN',
              googleFormUrl: null,
              clubHashtags: [],
              clubCategoryNames: [],
              clubRoomNumber: 'B101',
              clubRecruitment: null,
            },
          })
        })
      )

      const { result } = renderHook(() => useClubIntro(clubUUID), {
        wrapper: createQueryWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.data.clubName).toBe('코딩 동아리')
      expect(result.current.data?.data.recruitmentStatus).toBe('OPEN')
    })

    it('should not fetch when clubUUID is empty', async () => {
      const { result } = renderHook(() => useClubIntro(''), {
        wrapper: createQueryWrapper(),
      })

      expect(result.current.isFetching).toBe(false)
    })
  })

  describe('useCategories', () => {
    it('should fetch categories', async () => {
      server.use(
        http.get(`${API_BASE}/clubs/categories`, () => {
          return HttpResponse.json({
            message: '카테고리 조회 완료',
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
        wrapper: createQueryWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.data).toHaveLength(2)
    })
  })
})
