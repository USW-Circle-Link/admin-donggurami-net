import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@test/mocks/server'
import * as api from '../clubLeaderApi'
import type { ApplicantStatusUpdate } from '../../domain/clubLeaderSchemas'

const API_BASE = 'https://api.donggurami.net'
const TEST_CLUB_UUID = '550e8400-e29b-41d4-a716-446655440000'

describe('Club Leader API - Applicants', () => {
  describe('getApplicants()', () => {
    it('should GET applicants list', async () => {
      const result = await api.getApplicants(TEST_CLUB_UUID)

      expect(result.data).toHaveLength(1)
      expect(result.data[0].aplictUUID).toBe('applicant-1')
      expect(result.data[0].userName).toBe('지원자1')
    })

    it('should return applicant info fields', async () => {
      const result = await api.getApplicants(TEST_CLUB_UUID)

      const applicant = result.data[0]
      expect(applicant).toHaveProperty('userName')
      expect(applicant).toHaveProperty('studentNumber')
      expect(applicant).toHaveProperty('major')
      expect(applicant).toHaveProperty('userHp')
      expect(applicant.userHp).toBe('01011112222')
    })

    it('should handle 404 club not found', async () => {
      server.use(
        http.get(`${API_BASE}/clubs/${TEST_CLUB_UUID}/applicants`, () => {
          return HttpResponse.json(
            {
              exception: 'ClubException',
              code: 'CLUB-404',
              message: '동아리를 찾을 수 없습니다.',
              status: 404,
              error: 'Not Found',
              additionalData: null,
            },
            { status: 404 }
          )
        })
      )

      await expect(api.getApplicants(TEST_CLUB_UUID)).rejects.toThrow()
    })

    it('should handle empty list', async () => {
      server.use(
        http.get(`${API_BASE}/clubs/${TEST_CLUB_UUID}/applicants`, () => {
          return HttpResponse.json({
            message: '지원자 목록 조회 성공',
            data: [],
          })
        })
      )

      const result = await api.getApplicants(TEST_CLUB_UUID)

      expect(result.data).toHaveLength(0)
    })
  })

  describe('updateApplicationStatus()', () => {
    it('should PATCH single applicant status to PASS', async () => {
      await expect(
        api.updateApplicationStatus(TEST_CLUB_UUID, 'applicant-1', { status: 'PASS' })
      ).resolves.not.toThrow()
    })

    it('should accept WAIT, PASS, FAIL statuses', async () => {
      await expect(
        api.updateApplicationStatus(TEST_CLUB_UUID, 'applicant-1', { status: 'WAIT' })
      ).resolves.not.toThrow()
      await expect(
        api.updateApplicationStatus(TEST_CLUB_UUID, 'applicant-1', { status: 'PASS' })
      ).resolves.not.toThrow()
      await expect(
        api.updateApplicationStatus(TEST_CLUB_UUID, 'applicant-1', { status: 'FAIL' })
      ).resolves.not.toThrow()
    })

    it('should handle 400 validation error', async () => {
      server.use(
        http.patch(`${API_BASE}/clubs/${TEST_CLUB_UUID}/applications/invalid-uuid/status`, () => {
          return HttpResponse.json(
            {
              exception: 'ValidationException',
              code: 'COM-100',
              message: '유효하지 않은 입력입니다.',
              status: 400,
              error: 'Bad Request',
              additionalData: null,
            },
            { status: 400 }
          )
        })
      )

      await expect(
        api.updateApplicationStatus(TEST_CLUB_UUID, 'invalid-uuid', { status: 'PASS' })
      ).rejects.toThrow()
    })

    it('should handle 404 applicant not found', async () => {
      server.use(
        http.patch(`${API_BASE}/clubs/${TEST_CLUB_UUID}/applications/nonexistent/status`, () => {
          return HttpResponse.json(
            {
              exception: 'ApplicantException',
              code: 'APLCT-404',
              message: '지원자를 찾을 수 없습니다.',
              status: 404,
              error: 'Not Found',
              additionalData: null,
            },
            { status: 404 }
          )
        })
      )

      await expect(
        api.updateApplicationStatus(TEST_CLUB_UUID, 'nonexistent', { status: 'PASS' })
      ).rejects.toThrow()
    })
  })

  describe('getApplicants() with status filter', () => {
    it('should GET failed applicants only', async () => {
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

      const result = await api.getApplicants(TEST_CLUB_UUID, 'FAIL')

      expect(result.data).toHaveLength(1)
      expect(result.data[0].userName).toBe('탈락자1')
      expect(result.data[0].status).toBe('FAIL')
    })

    it('should handle empty failed applicants list', async () => {
      server.use(
        http.get(`${API_BASE}/clubs/${TEST_CLUB_UUID}/applicants`, () => {
          return HttpResponse.json({
            message: '지원자 목록 조회 성공',
            data: [],
          })
        })
      )

      const result = await api.getApplicants(TEST_CLUB_UUID, 'FAIL')

      expect(result.data).toHaveLength(0)
    })
  })

  describe('sendApplicantNotifications()', () => {
    it('should send notifications to applicants', async () => {
      const applicants: ApplicantStatusUpdate[] = [
        { aplictUUID: 'applicant-1' },
        { aplictUUID: 'applicant-2' },
      ]

      await expect(api.sendApplicantNotifications(TEST_CLUB_UUID, applicants)).resolves.not.toThrow()
    })

    it('should handle 404 applicant not found', async () => {
      server.use(
        http.post(`${API_BASE}/clubs/${TEST_CLUB_UUID}/applicants/notifications`, () => {
          return HttpResponse.json(
            {
              exception: 'ApplicantException',
              code: 'APLCT-404',
              message: '지원자를 찾을 수 없습니다.',
              status: 404,
              error: 'Not Found',
              additionalData: null,
            },
            { status: 404 }
          )
        })
      )

      const applicants: ApplicantStatusUpdate[] = [{ aplictUUID: 'nonexistent' }]

      await expect(api.sendApplicantNotifications(TEST_CLUB_UUID, applicants)).rejects.toThrow()
    })
  })
})
