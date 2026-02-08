import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@test/mocks/server'
import {
  getMyClubs,
  getAppliedClubs,
  getFloorPhoto,
  getMyNotices,
  getMyNoticeDetail,
} from '../mypageApi'

const API_BASE = 'https://api.donggurami.net'

describe('MyPage API', () => {
  describe('getMyClubs', () => {
    it('should return my clubs', async () => {
      const result = await getMyClubs()

      expect(result.message).toBe('소속 동아리 조회 성공')
      expect(result.data).toHaveLength(1)
      expect(result.data[0].clubName).toBe('테스트 동아리')
    })

    it('should return empty array when no clubs', async () => {
      server.use(
        http.get(`${API_BASE}/users/me/clubs`, () => {
          return HttpResponse.json({
            message: '소속 동아리 조회 성공',
            data: [],
          })
        })
      )

      const result = await getMyClubs()
      expect(result.data).toHaveLength(0)
    })
  })

  describe('getAppliedClubs', () => {
    it('should return applied clubs', async () => {
      const result = await getAppliedClubs()

      expect(result.message).toBe('지원 동아리 조회 성공')
      expect(result.data).toHaveLength(0)
    })
  })

  describe('getFloorPhoto', () => {
    it('should return floor photo for B1', async () => {
      const result = await getFloorPhoto('B1')

      expect(result.message).toBe('층 사진 조회 성공')
    })

    it('should return floor photo for F1', async () => {
      const result = await getFloorPhoto('F1')

      expect(result.message).toBe('층 사진 조회 성공')
    })

    it('should return floor photo for F2', async () => {
      const result = await getFloorPhoto('F2')

      expect(result.message).toBe('층 사진 조회 성공')
    })
  })

  describe('getMyNotices', () => {
    it('should return my notices', async () => {
      const result = await getMyNotices()

      expect(result.message).toBe('내 공지사항 조회 성공')
      expect(Array.isArray(result.data)).toBe(true)
    })
  })

  describe('getMyNoticeDetail', () => {
    it('should return notice detail', async () => {
      const result = await getMyNoticeDetail('notice-1')

      expect(result.message).toBe('공지사항 상세 조회 성공')
      expect(result.data.noticeTitle).toBe('테스트 공지')
      expect(result.data.noticeContent).toBe('테스트 내용')
    })

    it('should throw error when notice not found', async () => {
      server.use(
        http.get(`${API_BASE}/my-notices/:noticeUUID/details`, () => {
          return HttpResponse.json(
            {
              exception: 'NoticeException',
              code: 'NTC-404',
              message: '공지사항을 찾을 수 없습니다',
              status: 404,
              error: 'Not Found',
              additionalData: null,
            },
            { status: 404 }
          )
        })
      )

      await expect(getMyNoticeDetail('invalid-uuid')).rejects.toThrow()
    })
  })
})
