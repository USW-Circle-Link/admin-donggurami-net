import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@test/mocks/server'
import {
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
  withdrawUser,
  getMyClubs,
  getMyApplications,
} from '../userApi'

const API_BASE = 'https://api.donggurami.net'

describe('User API', () => {
  describe('getMyProfile', () => {
    it('should get my profile successfully', async () => {
      server.use(
        http.get(`${API_BASE}/users/me`, () => {
          return HttpResponse.json({
            message: '프로필 조회 성공',
            data: {
              userName: '테스트사용자',
              studentNumber: '20231234',
              userHp: '01012345678',
              major: '컴퓨터공학과',
            },
          })
        })
      )

      const result = await getMyProfile()

      expect(result.message).toBe('프로필 조회 성공')
      expect(result.data.userName).toBe('테스트사용자')
      expect(result.data.studentNumber).toBe('20231234')
      expect(result.data.userHp).toBe('01012345678')
      expect(result.data.major).toBe('컴퓨터공학과')
    })
  })

  describe('updateMyProfile', () => {
    it('should update profile successfully', async () => {
      server.use(
        http.patch(`${API_BASE}/users/me`, () => {
          return HttpResponse.json({
            message: '프로필 수정 성공',
            data: {
              userName: '수정된이름',
              studentNumber: '20231234',
              userHp: '01087654321',
              major: '전자공학과',
            },
          })
        })
      )

      const request = {
        userPw: 'currentpassword',
        userName: '수정된이름',
        studentNumber: '20231234',
        userHp: '01087654321',
        major: '전자공학과',
      }

      const result = await updateMyProfile(request)

      expect(result.message).toBe('프로필 수정 성공')
      expect(result.data.userName).toBe('수정된이름')
    })
  })

  describe('changeMyPassword', () => {
    it('should change password successfully', async () => {
      server.use(
        http.patch(`${API_BASE}/users/me/password`, () => {
          return HttpResponse.json({
            message: '비밀번호 변경 성공',
            data: null,
          })
        })
      )

      const request = {
        userPw: 'oldpass123',
        newPw: 'Newpass1!',
        confirmNewPw: 'Newpass1!',
      }

      const result = await changeMyPassword(request)

      expect(result.message).toBe('비밀번호 변경 성공')
      expect(result.data).toBeNull()
    })

    it('should throw error on wrong current password', async () => {
      server.use(
        http.patch(`${API_BASE}/users/me/password`, () => {
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
        }),
        // Add refresh handler to prevent unhandled request error
        http.post(`${API_BASE}/auth/refresh`, () => {
          return HttpResponse.json(
            { message: 'Unauthorized', status: 401 },
            { status: 401 }
          )
        })
      )

      await expect(
        changeMyPassword({ userPw: 'wrong', newPw: 'Newpass1!', confirmNewPw: 'Newpass1!' })
      ).rejects.toThrow()
    })
  })

  describe('withdrawUser', () => {
    it('should withdraw user successfully', async () => {
      server.use(
        http.delete(`${API_BASE}/users/me`, () => {
          return HttpResponse.json({
            message: '회원 탈퇴 성공',
            data: null,
          })
        })
      )

      const request = { authCode: '123456' }

      const result = await withdrawUser(request)

      expect(result.message).toBe('회원 탈퇴 성공')
      expect(result.data).toBeNull()
    })
  })

  describe('getMyClubs', () => {
    it('should get my clubs successfully', async () => {
      server.use(
        http.get(`${API_BASE}/users/me/clubs`, () => {
          return HttpResponse.json({
            message: '내 동아리 목록 조회 성공',
            data: [
              {
                clubUUID: '550e8400-e29b-41d4-a716-446655440000',
                mainPhotoPath: null,
                clubName: '테스트 동아리',
                leaderName: '홍길동',
                leaderHp: '01012345678',
                clubInsta: null,
                clubRoomNumber: 'B101',
              },
            ],
          })
        })
      )

      const result = await getMyClubs()

      expect(result.message).toBe('내 동아리 목록 조회 성공')
      expect(result.data).toHaveLength(1)
      expect(result.data[0].clubName).toBe('테스트 동아리')
      expect(result.data[0].leaderName).toBe('홍길동')
    })
  })

  describe('getMyApplications', () => {
    it('should get my applications successfully', async () => {
      server.use(
        http.get(`${API_BASE}/users/me/applications`, () => {
          return HttpResponse.json({
            message: '내 지원서 목록 조회 성공',
            data: [
              {
                clubUUID: '550e8400-e29b-41d4-a716-446655440000',
                mainPhotoPath: null,
                clubName: '테스트 동아리',
                aplictStatus: 'WAIT',
              },
            ],
          })
        })
      )

      const result = await getMyApplications()

      expect(result.message).toBe('내 지원서 목록 조회 성공')
      expect(result.data).toHaveLength(1)
      expect(result.data[0].aplictStatus).toBe('WAIT')
    })
  })
})
