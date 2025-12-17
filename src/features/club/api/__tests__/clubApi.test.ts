import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@test/mocks/server'
import {
  getAllClubs,
  getClubList,
  getClubsByCategory,
  getOpenClubs,
  getOpenClubsByCategory,
  getCategories,
  getClubIntro,
} from '../clubApi'

const API_BASE = 'https://api.donggurami.net'

describe('Club API', () => {
  describe('getAllClubs', () => {
    it('should fetch all clubs successfully', async () => {
      server.use(
        http.get(`${API_BASE}/clubs`, () => {
          return HttpResponse.json({
            message: '전체 동아리 조회 완료',
            data: [
              {
                clubUUID: '550e8400-e29b-41d4-a716-446655440000',
                clubName: '코딩 동아리',
                mainPhoto: 'https://example.com/photo.jpg',
                departmentName: '학술',
                clubHashtags: ['코딩', '개발'],
              },
            ],
          })
        })
      )

      const result = await getAllClubs()
      expect(result.message).toBe('전체 동아리 조회 완료')
      expect(result.data).toHaveLength(1)
      expect(result.data[0].clubName).toBe('코딩 동아리')
    })
  })

  describe('getClubList', () => {
    it('should fetch simple club list successfully', async () => {
      server.use(
        http.get(`${API_BASE}/clubs/list`, () => {
          return HttpResponse.json({
            message: '동아리 리스트 조회 성공',
            data: [
              {
                clubUUID: '550e8400-e29b-41d4-a716-446655440000',
                clubName: '코딩 동아리',
                mainPhoto: 'https://example.com/photo.jpg',
              },
            ],
          })
        })
      )

      const result = await getClubList()
      expect(result.message).toBe('동아리 리스트 조회 성공')
      expect(result.data).toHaveLength(1)
    })
  })

  describe('getClubsByCategory', () => {
    it('should fetch clubs by category successfully', async () => {
      server.use(
        http.get(`${API_BASE}/clubs/filter`, () => {
          return HttpResponse.json({
            message: '카테고리별 전체 동아리 조회 완료',
            data: [
              {
                clubCategoryUUID: '550e8400-e29b-41d4-a716-446655440000',
                clubCategoryName: '학술',
                clubs: [
                  {
                    clubUUID: '550e8400-e29b-41d4-a716-446655440001',
                    clubName: '코딩 동아리',
                    mainPhoto: null,
                    departmentName: '학술',
                    clubHashtags: [],
                  },
                ],
              },
            ],
          })
        })
      )

      const result = await getClubsByCategory()
      expect(result.message).toBe('카테고리별 전체 동아리 조회 완료')
      expect(result.data[0].clubCategoryName).toBe('학술')
    })
  })

  describe('getOpenClubs', () => {
    it('should fetch recruiting clubs successfully', async () => {
      server.use(
        http.get(`${API_BASE}/clubs/open`, () => {
          return HttpResponse.json({
            message: '모집 중인 동아리 조회 완료',
            data: [
              {
                clubUUID: '550e8400-e29b-41d4-a716-446655440000',
                clubName: '모집 중인 동아리',
                mainPhoto: null,
                departmentName: '체육',
                clubHashtags: ['운동'],
              },
            ],
          })
        })
      )

      const result = await getOpenClubs()
      expect(result.message).toBe('모집 중인 동아리 조회 완료')
      expect(result.data).toHaveLength(1)
    })
  })

  describe('getOpenClubsByCategory', () => {
    it('should fetch recruiting clubs by category successfully', async () => {
      server.use(
        http.get(`${API_BASE}/clubs/open/filter`, () => {
          return HttpResponse.json({
            message: '카테고리별 모집 중인 동아리 조회 완료',
            data: [
              {
                clubCategoryUUID: '550e8400-e29b-41d4-a716-446655440000',
                clubCategoryName: '체육',
                clubs: [],
              },
            ],
          })
        })
      )

      const result = await getOpenClubsByCategory()
      expect(result.message).toBe('카테고리별 모집 중인 동아리 조회 완료')
    })
  })

  describe('getCategories', () => {
    it('should fetch categories successfully', async () => {
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

      const result = await getCategories()
      expect(result.message).toBe('카테고리 조회 완료')
      expect(result.data).toHaveLength(2)
    })
  })

  describe('getClubIntro', () => {
    it('should fetch club intro successfully', async () => {
      const clubUUID = '550e8400-e29b-41d4-a716-446655440000'

      server.use(
        http.get(`${API_BASE}/clubs/intro/${clubUUID}`, () => {
          return HttpResponse.json({
            message: '동아리 소개글 조회 성공',
            data: {
              clubUUID,
              mainPhoto: 'https://example.com/photo.jpg',
              introPhotos: [],
              clubName: '코딩 동아리',
              leaderName: '홍길동',
              leaderHp: '01012345678',
              clubInsta: null,
              clubIntro: '동아리 소개입니다.',
              recruitmentStatus: 'OPEN',
              googleFormUrl: null,
              clubHashtags: ['코딩'],
              clubCategoryNames: ['학술'],
              clubRoomNumber: 'B101',
              clubRecruitment: '모집 중입니다.',
            },
          })
        })
      )

      const result = await getClubIntro(clubUUID)
      expect(result.message).toBe('동아리 소개글 조회 성공')
      expect(result.data.clubName).toBe('코딩 동아리')
      expect(result.data.recruitmentStatus).toBe('OPEN')
    })

    it('should throw error for non-existent club', async () => {
      const clubUUID = '550e8400-e29b-41d4-a716-446655440000'

      server.use(
        http.get(`${API_BASE}/clubs/intro/${clubUUID}`, () => {
          return HttpResponse.json(
            {
              exception: 'ClubException',
              code: 'CLUB-201',
              message: '존재하지 않는 동아리입니다.',
              status: 404,
              error: 'Not Found',
              additionalData: null,
            },
            { status: 404 }
          )
        })
      )

      await expect(getClubIntro(clubUUID)).rejects.toThrow()
    })
  })
})
