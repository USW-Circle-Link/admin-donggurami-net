import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@test/mocks/server'
import {
  loginUnified,
  logoutUnified,
  refreshTokenUnified,
  sendVerificationMail,
  confirmSignup,
  completeSignup,
  checkIdDuplication,
  findId,
  sendPasswordResetCode,
  verifyPasswordResetCode,
  resetPassword,
} from '../authApi'

const API_BASE = 'https://api.donggurami.net'

describe('Auth API', () => {
  describe('loginUnified', () => {
    it('should successfully login club leader', async () => {
      server.use(
        http.post(`${API_BASE}/auth/login`, () => {
          return HttpResponse.json({
            message: '로그인 성공',
            data: {
              accessToken: 'mock_access_token',
              refreshToken: 'mock_refresh_token',
              role: 'LEADER',
              clubuuid: '550e8400-e29b-41d4-a716-446655440000',
              isAgreedTerms: true,
            },
          })
        })
      )

      const result = await loginUnified({
        account: 'testleader',
        password: 'password123',
      })

      expect(result.message).toBe('로그인 성공')
      expect(result.data.accessToken).toBe('mock_access_token')
      expect(result.data.refreshToken).toBe('mock_refresh_token')
      expect(result.data.role).toBe('LEADER')
      expect(result.data.clubuuid).toBe('550e8400-e29b-41d4-a716-446655440000')
      expect(result.data.isAgreedTerms).toBe(true)
    })

    it('should successfully login admin', async () => {
      server.use(
        http.post(`${API_BASE}/auth/login`, () => {
          return HttpResponse.json({
            message: '로그인 성공',
            data: {
              accessToken: 'admin_access_token',
              refreshToken: 'admin_refresh_token',
              role: 'ADMIN',
            },
          })
        })
      )

      const result = await loginUnified({
        account: 'admin',
        password: 'adminpw',
        clientId: 'client123',
      })

      expect(result.message).toBe('로그인 성공')
      expect(result.data.accessToken).toBe('admin_access_token')
      expect(result.data.refreshToken).toBe('admin_refresh_token')
      expect(result.data.role).toBe('ADMIN')
    })

    it('should throw error on invalid credentials', async () => {
      server.use(
        http.post(`${API_BASE}/auth/login`, () => {
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
        loginUnified({
          account: 'wrong',
          password: 'wrong',
        })
      ).rejects.toThrow()
    })
  })

  describe('logoutUnified', () => {
    it('should successfully logout', async () => {
      server.use(
        http.post(`${API_BASE}/auth/logout`, () => {
          return HttpResponse.json({
            message: '로그아웃 성공',
            data: null,
          })
        })
      )

      await expect(logoutUnified()).resolves.not.toThrow()
    })

    it('should handle logout error gracefully', async () => {
      server.use(
        http.post(`${API_BASE}/auth/logout`, () => {
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

      await expect(logoutUnified()).rejects.toThrow()
    })
  })

  describe('refreshTokenUnified', () => {
    it('should refresh tokens and return both accessToken and refreshToken', async () => {
      server.use(
        http.post(`${API_BASE}/auth/refresh`, () => {
          return HttpResponse.json({
            message: '토큰 갱신 성공',
            data: {
              accessToken: 'new_access_token',
              refreshToken: 'new_refresh_token',
            },
          })
        })
      )

      const result = await refreshTokenUnified()
      expect(result.data.accessToken).toBe('new_access_token')
      expect(result.data.refreshToken).toBe('new_refresh_token')
    })

    it('should throw error on refresh failure', async () => {
      server.use(
        http.post(`${API_BASE}/auth/refresh`, () => {
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

      await expect(refreshTokenUnified()).rejects.toThrow()
    })
  })

  describe('sendVerificationMail', () => {
    it('should send verification email successfully', async () => {
      server.use(
        http.post(`${API_BASE}/auth/signup/verification-mail`, () => {
          return HttpResponse.json({
            message: '인증 메일 전송 성공',
            data: {
              emailToken_uuid: '550e8400-e29b-41d4-a716-446655440000',
              email: 'test@naver.com',
            },
          })
        })
      )

      const result = await sendVerificationMail({ email: 'test' })
      expect(result.data.emailToken_uuid).toBe('550e8400-e29b-41d4-a716-446655440000')
      expect(result.data.email).toBe('test@naver.com')
    })
  })

  describe('confirmSignup', () => {
    it('should confirm signup successfully', async () => {
      server.use(
        http.post(`${API_BASE}/auth/signup/verify`, () => {
          return HttpResponse.json({
            message: '이메일 인증 완료',
            data: {
              emailTokenUUID: '550e8400-e29b-41d4-a716-446655440000',
              signupUUID: '660e8400-e29b-41d4-a716-446655440001',
            },
          })
        })
      )

      const result = await confirmSignup({ email: 'test@naver.com' })
      expect(result.data.emailTokenUUID).toBe('550e8400-e29b-41d4-a716-446655440000')
      expect(result.data.signupUUID).toBe('660e8400-e29b-41d4-a716-446655440001')
    })
  })

  describe('completeSignup', () => {
    it('should complete signup successfully', async () => {
      server.use(
        http.post(`${API_BASE}/auth/signup`, () => {
          return HttpResponse.json({
            message: '회원가입 완료',
            data: null,
          })
        })
      )

      await expect(
        completeSignup(
          {
            account: 'testuser',
            password: 'Test123!@#',
            confirmPassword: 'Test123!@#',
            userName: '홍길동',
            telephone: '01012345678',
            studentNumber: '20240001',
            major: '컴퓨터공학',
          },
          {
            emailTokenUUID: '550e8400-e29b-41d4-a716-446655440000',
            signupUUID: '660e8400-e29b-41d4-a716-446655440001',
          }
        )
      ).resolves.not.toThrow()
    })
  })

  describe('checkIdDuplication', () => {
    it('should check ID is available', async () => {
      server.use(
        http.get(`${API_BASE}/auth/check-Id`, () => {
          return HttpResponse.json({
            message: '사용 가능한 아이디입니다',
            data: null,
          })
        })
      )

      await expect(checkIdDuplication('testuser')).resolves.not.toThrow()
    })
  })

  describe('findId', () => {
    it('should send account ID to email', async () => {
      server.use(
        http.post(`${API_BASE}/auth/find-id`, () => {
          return HttpResponse.json({
            message: '아이디가 이메일로 전송되었습니다',
            data: null,
          })
        })
      )

      await expect(findId({ email: 'test@naver.com' })).resolves.not.toThrow()
    })
  })

  describe('sendPasswordResetCode', () => {
    it('should send password reset code and return uuid', async () => {
      server.use(
        http.post(`${API_BASE}/auth/password/reset-code`, () => {
          return HttpResponse.json({
            message: '비밀번호 재설정 코드 전송 완료',
            data: '770e8400-e29b-41d4-a716-446655440002',
          })
        })
      )

      const result = await sendPasswordResetCode({
        userAccount: 'testuser',
        email: 'test@naver.com',
      })
      expect(result.data).toBe('770e8400-e29b-41d4-a716-446655440002')
    })
  })

  describe('verifyPasswordResetCode', () => {
    it('should verify reset code successfully', async () => {
      server.use(
        http.post(`${API_BASE}/auth/password/verify`, () => {
          return HttpResponse.json({
            message: '인증 코드 확인 완료',
            data: null,
          })
        })
      )

      await expect(
        verifyPasswordResetCode(
          { authCode: '123456' },
          '770e8400-e29b-41d4-a716-446655440002'
        )
      ).resolves.not.toThrow()
    })
  })

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      server.use(
        http.patch(`${API_BASE}/auth/password/reset`, () => {
          return HttpResponse.json({
            message: '비밀번호 재설정 완료',
            data: null,
          })
        })
      )

      await expect(
        resetPassword(
          {
            password: 'NewPass123!@#',
            confirmPassword: 'NewPass123!@#',
          },
          '770e8400-e29b-41d4-a716-446655440002'
        )
      ).resolves.not.toThrow()
    })
  })
})
