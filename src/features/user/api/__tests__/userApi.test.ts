import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@test/mocks/server'
import {
  changePassword,
  findAccount,
  sendAuthCode,
  verifyAuthCode,
  resetPassword,
  checkEmailDuplicate,
  checkAccountDuplicate,
  temporaryRegister,
  confirmEmailVerification,
  signup,
  userLogin,
  sendExitCode,
  exitUser,
} from '../userApi'

const API_BASE = 'https://api.donggurami.net'

describe('User API', () => {
  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const request = {
        userPw: 'oldpass123',
        newPw: 'Newpass1!',
        confirmNewPw: 'Newpass1!',
      }

      const result = await changePassword(request)

      expect(result.message).toBe('비밀번호 변경 성공')
      expect(result.data).toBeNull()
    })

    it('should throw error on wrong current password', async () => {
      server.use(
        http.patch(`${API_BASE}/users/userpw`, () => {
          return HttpResponse.json(
            {
              exception: 'PasswordException',
              code: 'PWD-401',
              message: '현재 비밀번호가 일치하지 않습니다',
              status: 401,
              error: 'Unauthorized',
              additionalData: null,
            },
            { status: 401 }
          )
        })
      )

      await expect(
        changePassword({ userPw: 'wrong', newPw: 'Newpass1!', confirmNewPw: 'Newpass1!' })
      ).rejects.toThrow()
    })
  })

  describe('findAccount', () => {
    it('should find account by email', async () => {
      const result = await findAccount('test@example.com')

      expect(result.message).toBe('아이디 찾기 성공')
    })
  })

  describe('sendAuthCode', () => {
    it('should send auth code', async () => {
      const request = { userAccount: 'testuser', email: 'test@example.com' }

      const result = await sendAuthCode(request)

      expect(result.message).toBe('인증 코드 전송 성공')
    })
  })

  describe('verifyAuthCode', () => {
    it('should verify auth code', async () => {
      const request = { authCode: '123456' }

      const result = await verifyAuthCode(request)

      expect(result.message).toBe('인증 코드 검증 성공')
    })
  })

  describe('resetPassword', () => {
    it('should reset password', async () => {
      const request = {
        password: 'Newpass1!',
        confirmPassword: 'Newpass1!',
      }

      const result = await resetPassword(request)

      expect(result.message).toBe('비밀번호 재설정 성공')
    })
  })

  describe('checkEmailDuplicate', () => {
    it('should return success when email is available', async () => {
      const result = await checkEmailDuplicate('new@example.com')

      expect(result.message).toBe('이메일 사용 가능')
    })
  })

  describe('checkAccountDuplicate', () => {
    it('should return success when account is available', async () => {
      const result = await checkAccountDuplicate('newaccount')

      expect(result.message).toBe('아이디 사용 가능')
    })
  })

  describe('temporaryRegister', () => {
    it('should register temporarily', async () => {
      const request = { email: 'test@example.com' }

      const result = await temporaryRegister(request)

      expect(result.message).toBe('임시 회원가입 성공')
    })
  })

  describe('confirmEmailVerification', () => {
    it('should confirm email verification', async () => {
      const result = await confirmEmailVerification('test@example.com')

      expect(result.message).toBe('이메일 인증 확인 성공')
      expect(result.data.signupUUID).toBe('signup-uuid')
    })
  })

  describe('signup', () => {
    it('should complete signup', async () => {
      const request = {
        account: 'testuser123',
        password: 'Password1!',
        confirmPassword: 'Password1!',
        userName: '테스트사용자',
        telephone: '01012345678',
        studentNumber: '20231234',
        major: '컴퓨터공학과',
      }

      const result = await signup(request)

      expect(result.message).toBe('회원가입 성공')
    })
  })

  describe('userLogin', () => {
    it('should login user', async () => {
      const request = {
        account: 'testuser',
        password: 'password123',
      }

      const result = await userLogin(request)

      expect(result.message).toBe('로그인 성공')
      expect(result.data.accessToken).toBe('user_access_token')
    })
  })

  describe('sendExitCode', () => {
    it('should send exit code', async () => {
      const result = await sendExitCode()

      expect(result.message).toBe('탈퇴 인증 코드 전송 성공')
    })
  })

  describe('exitUser', () => {
    it('should exit user', async () => {
      const request = { authCode: '123456' }

      const result = await exitUser(request)

      expect(result.message).toBe('회원 탈퇴 성공')
    })
  })
})
