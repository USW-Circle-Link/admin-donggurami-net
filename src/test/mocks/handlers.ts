import { http, HttpResponse } from 'msw'

const API_BASE = 'https://api.donggurami.net'

// Helper to create error response matching API spec
function createErrorResponse(
  exception: string,
  code: string,
  message: string,
  status: number
) {
  return {
    exception,
    code,
    message,
    status,
    error: status === 400 ? 'Bad Request' : status === 401 ? 'Unauthorized' : 'Error',
    additionalData: null,
  }
}

export const handlers = [
  // Club Leader Login
  http.post(`${API_BASE}/club-leader/login`, async ({ request }) => {
    const body = (await request.json()) as {
      leaderAccount: string
      leaderPw: string
      loginType?: string
    }

    if (body.leaderAccount && body.leaderPw) {
      return HttpResponse.json({
        message: '동아리 회장 로그인 성공',
        data: {
          accessToken: 'mock_access_token',
          refreshToken: 'mock_refresh_token',
          role: 'LEADER',
          clubUUID: '550e8400-e29b-41d4-a716-446655440000',
          isAgreedTerms: true,
        },
      })
    }

    return HttpResponse.json(
      createErrorResponse('UserException', 'USR-211', '아이디 혹은 비밀번호가 일치하지 않습니다', 401),
      { status: 401 }
    )
  }),

  // Admin Login
  http.post(`${API_BASE}/admin/login`, async ({ request }) => {
    const body = (await request.json()) as {
      adminAccount: string
      adminPw: string
      clientId?: string
    }

    if (body.adminAccount && body.adminPw) {
      return HttpResponse.json({
        message: '운영팀 로그인 성공',
        data: {
          accessToken: 'admin_access_token',
          refreshToken: 'admin_refresh_token',
          role: 'ADMIN',
        },
      })
    }

    return HttpResponse.json(
      createErrorResponse('UserException', 'USR-211', '아이디 혹은 비밀번호가 일치하지 않습니다', 401),
      { status: 401 }
    )
  }),

  // Refresh Token
  http.post(`${API_BASE}/integration/refresh-token`, () => {
    return HttpResponse.json({
      message: '새로운 엑세스 토큰과 리프레시 토큰이 발급됐습니다. 로그인됐습니다.',
      data: {
        accessToken: 'new_access_token',
        refreshToken: 'new_refresh_token',
      },
    })
  }),

  // Logout
  http.post(`${API_BASE}/integration/logout`, () => {
    return HttpResponse.json({
      message: '로그아웃 성공',
      data: null,
    })
  }),
]
