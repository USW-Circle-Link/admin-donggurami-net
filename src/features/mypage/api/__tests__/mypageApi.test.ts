import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@test/mocks/server'
import {
  getMyClubs,
  getAppliedClubs,
  getFloorPhoto,
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

})
