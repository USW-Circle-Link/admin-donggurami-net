import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@test/mocks/server'
import { getNotices, getNotice, createNotice, updateNotice, deleteNotice } from '../noticeApi'

const API_BASE = 'https://api.donggurami.net'

describe('Notice API', () => {
  describe('getNotices', () => {
    it('should fetch notices list successfully', async () => {
      server.use(
        http.get(`${API_BASE}/notices`, () => {
          return HttpResponse.json({
            message: '공지사항 리스트 조회 성공',
            data: {
              content: [
                {
                  noticeUUID: '550e8400-e29b-41d4-a716-446655440000',
                  noticeTitle: '공지사항 제목',
                  noticeCreatedAt: '2023-01-01T00:00:00',
                  adminName: '관리자',
                  thumbnailUrl: null,
                },
              ],
              totalPages: 1,
              totalElements: 1,
              currentPage: 0,
            },
          })
        })
      )

      const result = await getNotices()
      expect(result.message).toBe('공지사항 리스트 조회 성공')
      expect(result.data.content).toHaveLength(1)
      expect(result.data.totalElements).toBe(1)
    })

    it('should fetch notices with pagination params', async () => {
      server.use(
        http.get(`${API_BASE}/notices`, ({ request }) => {
          const url = new URL(request.url)
          const page = url.searchParams.get('page')
          // size is available but not used in this test
          void url.searchParams.get('size')

          return HttpResponse.json({
            message: '공지사항 리스트 조회 성공',
            data: {
              content: [],
              totalPages: 5,
              totalElements: 50,
              currentPage: Number(page) || 0,
            },
          })
        })
      )

      const result = await getNotices({ page: 2, size: 10 })
      expect(result.data.currentPage).toBe(2)
    })
  })

  describe('getNotice', () => {
    it('should fetch notice detail successfully', async () => {
      const noticeUUID = '550e8400-e29b-41d4-a716-446655440000'

      server.use(
        http.get(`${API_BASE}/notices/${noticeUUID}`, () => {
          return HttpResponse.json({
            message: '공지사항 조회 성공',
            data: {
              noticeUUID,
              noticeTitle: '공지사항 제목',
              noticeContent: '공지사항 내용입니다.',
              noticePhotos: ['https://example.com/photo.jpg'],
              noticeCreatedAt: '2023-01-01T00:00:00',
              adminName: '관리자',
            },
          })
        })
      )

      const result = await getNotice(noticeUUID)
      expect(result.message).toBe('공지사항 조회 성공')
      expect(result.data.noticeTitle).toBe('공지사항 제목')
    })

    it('should throw error for non-existent notice', async () => {
      const noticeUUID = '550e8400-e29b-41d4-a716-446655440000'

      server.use(
        http.get(`${API_BASE}/notices/${noticeUUID}`, () => {
          return HttpResponse.json(
            {
              exception: 'NoticeException',
              code: 'NOT-201',
              message: '공지사항이 존재하지 않습니다.',
              status: 404,
              error: 'Not Found',
              additionalData: null,
            },
            { status: 404 }
          )
        })
      )

      await expect(getNotice(noticeUUID)).rejects.toThrow()
    })
  })

  describe('createNotice', () => {
    it('should create notice successfully', async () => {
      server.use(
        http.post(`${API_BASE}/notices`, () => {
          return HttpResponse.json({
            message: '공지사항 생성 성공',
            data: ['presigned_url1', 'presigned_url2'],
          })
        })
      )

      const result = await createNotice({
        noticeTitle: '새 공지사항',
        noticeContent: '새 공지사항 내용입니다.',
        photoOrders: [1, 2],
      })

      expect(result.message).toBe('공지사항 생성 성공')
      expect(result.data).toHaveLength(2)
    })
  })

  describe('updateNotice', () => {
    it('should update notice successfully', async () => {
      const noticeUUID = '550e8400-e29b-41d4-a716-446655440000'

      server.use(
        http.put(`${API_BASE}/notices/${noticeUUID}`, () => {
          return HttpResponse.json({
            message: '공지사항 수정 성공',
            data: ['presigned_url'],
          })
        })
      )

      const result = await updateNotice(noticeUUID, {
        noticeTitle: '수정된 공지사항',
        noticeContent: '수정된 내용입니다.',
        photoOrders: [1],
      })

      expect(result.message).toBe('공지사항 수정 성공')
    })
  })

  describe('deleteNotice', () => {
    it('should delete notice successfully', async () => {
      const noticeUUID = '550e8400-e29b-41d4-a716-446655440000'

      server.use(
        http.delete(`${API_BASE}/notices/${noticeUUID}`, () => {
          return HttpResponse.json({
            message: '공지사항 삭제 성공',
            data: noticeUUID,
          })
        })
      )

      const result = await deleteNotice(noticeUUID)
      expect(result.message).toBe('공지사항 삭제 성공')
      expect(result.data).toBe(noticeUUID)
    })

    it('should throw error for non-existent notice', async () => {
      const noticeUUID = '550e8400-e29b-41d4-a716-446655440000'

      server.use(
        http.delete(`${API_BASE}/notices/${noticeUUID}`, () => {
          return HttpResponse.json(
            {
              exception: 'NoticeException',
              code: 'NOT-201',
              message: '공지사항이 존재하지 않습니다.',
              status: 404,
              error: 'Not Found',
              additionalData: null,
            },
            { status: 404 }
          )
        })
      )

      await expect(deleteNotice(noticeUUID)).rejects.toThrow()
    })
  })
})
