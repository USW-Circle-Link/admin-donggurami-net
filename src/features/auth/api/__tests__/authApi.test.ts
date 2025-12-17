import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@test/mocks/server'
import {
  loginClubLeader,
  loginAdmin,
  logout,
  refreshToken,
} from '../authApi'

const API_BASE = 'https://api.donggurami.net'

describe('Auth API', () => {
  describe('loginClubLeader', () => {
    it('should successfully login club leader', async () => {
      const result = await loginClubLeader({
        leaderAccount: 'testleader',
        leaderPw: 'password123',
        loginType: 'LEADER',
      })

      expect(result.message).toBe('동아리 회장 로그인 성공')
      expect(result.data.accessToken).toBe('mock_access_token')
      expect(result.data.refreshToken).toBe('mock_refresh_token')
      expect(result.data.role).toBe('LEADER')
      expect(result.data.clubUUID).toBe('550e8400-e29b-41d4-a716-446655440000')
      expect(result.data.isAgreedTerms).toBe(true)
    })

    it('should throw error on invalid credentials', async () => {
      server.use(
        http.post(`${API_BASE}/club-leader/login`, () => {
          return HttpResponse.json(
            {
              exception: 'UserException',
              code: 'USR-211',
              message: '아이디 혹은 비밀번호가 일치하지 않습니다',
              status: 401,
              error: 'Unauthorized',
              additionalData: null,
            },
            { status: 401 }
          )
        })
      )

      await expect(
        loginClubLeader({
          leaderAccount: 'wrong',
          leaderPw: 'wrong',
          loginType: 'LEADER',
        })
      ).rejects.toThrow()
    })
  })

  describe('loginAdmin', () => {
    it('should successfully login admin', async () => {
      const result = await loginAdmin({
        adminAccount: 'admin',
        adminPw: 'adminpw',
      })

      expect(result.message).toBe('운영팀 로그인 성공')
      expect(result.data.accessToken).toBe('admin_access_token')
      expect(result.data.refreshToken).toBe('admin_refresh_token')
      expect(result.data.role).toBe('ADMIN')
    })

    it('should login admin with clientId', async () => {
      const result = await loginAdmin({
        adminAccount: 'admin',
        adminPw: 'adminpw',
        clientId: 'client123',
      })

      expect(result.message).toBe('운영팀 로그인 성공')
      expect(result.data.role).toBe('ADMIN')
    })

    it('should throw error on invalid admin credentials', async () => {
      server.use(
        http.post(`${API_BASE}/admin/login`, () => {
          return HttpResponse.json(
            {
              exception: 'UserException',
              code: 'USR-211',
              message: '아이디 혹은 비밀번호가 일치하지 않습니다',
              status: 401,
              error: 'Unauthorized',
              additionalData: null,
            },
            { status: 401 }
          )
        })
      )

      await expect(
        loginAdmin({
          adminAccount: '',
          adminPw: '',
        })
      ).rejects.toThrow()
    })
  })

  describe('logout', () => {
    it('should successfully logout', async () => {
      await expect(logout()).resolves.not.toThrow()
    })

    it('should handle logout error gracefully', async () => {
      server.use(
        http.post(`${API_BASE}/integration/logout`, () => {
          return HttpResponse.json(
            {
              exception: 'ServerException',
              code: 'SRV-500',
              message: '서버 오류',
              status: 500,
              error: 'Internal Server Error',
              additionalData: null,
            },
            { status: 500 }
          )
        })
      )

      await expect(logout()).rejects.toThrow()
    })
  })

  describe('refreshToken', () => {
    it('should refresh tokens and return both accessToken and refreshToken', async () => {
      const result = await refreshToken()
      expect(result.data.accessToken).toBe('new_access_token')
      expect(result.data.refreshToken).toBe('new_refresh_token')
    })

    it('should throw error on refresh failure', async () => {
      server.use(
        http.post(`${API_BASE}/integration/refresh-token`, () => {
          return HttpResponse.json(
            {
              exception: 'TokenException',
              code: 'TKN-401',
              message: '토큰이 만료되었습니다',
              status: 401,
              error: 'Unauthorized',
              additionalData: null,
            },
            { status: 401 }
          )
        })
      )

      await expect(refreshToken()).rejects.toThrow()
    })
  })
})
