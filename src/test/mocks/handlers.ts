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
  // ===== Auth Handlers =====

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

  // ===== Application Handlers =====

  // Check can apply
  http.get(`${API_BASE}/apply/can-apply/:clubUUID`, () => {
    return HttpResponse.json({
      message: '지원 가능 여부 확인 성공',
      data: true,
    })
  }),

  // Get Google Form URL
  http.get(`${API_BASE}/apply/:clubUUID`, () => {
    return HttpResponse.json({
      message: '구글 폼 URL 조회 성공',
      data: 'https://forms.google.com/test-form',
    })
  }),

  // Submit application
  http.post(`${API_BASE}/apply/:clubUUID`, () => {
    return HttpResponse.json({
      message: '지원서 제출 성공',
      data: null,
    })
  }),

  // ===== Club Leader Handlers =====

  // Get club intro
  http.get(`${API_BASE}/club-leader/:clubUUID/intro`, ({ params }) => {
    return HttpResponse.json({
      message: '동아리 소개 조회 성공',
      data: {
        clubUUID: params.clubUUID,
        clubIntro: '테스트 동아리 소개입니다.',
        clubRecruitment: '모집 공고 내용',
        recruitmentStatus: 'OPEN',
        googleFormUrl: 'https://forms.google.com/test',
        introPhotos: [],
      },
    })
  }),

  // Update club intro
  http.put(`${API_BASE}/club-leader/:clubUUID/intro`, () => {
    return HttpResponse.json({
      message: '동아리 소개 수정 성공',
      data: null,
    })
  }),

  // Get club info
  http.get(`${API_BASE}/club-leader/:clubUUID/info`, () => {
    return HttpResponse.json({
      message: '동아리 정보 조회 성공',
      data: {
        clubName: '테스트 동아리',
        leaderName: '홍길동',
        leaderHp: '01012345678',
        clubRoomNumber: '101호',
        clubInsta: '@test_club',
        clubHashtag: ['테스트'],
        clubCategories: [{ categoryUUID: 'cat-1', categoryName: 'IT' }],
        mainPhoto: null,
      },
    })
  }),

  // Update club info
  http.put(`${API_BASE}/club-leader/:clubUUID/info`, () => {
    return HttpResponse.json({
      message: '동아리 정보 수정 성공',
      data: null,
    })
  }),

  // Get club summary
  http.get(`${API_BASE}/club-leader/:clubUUID/summary`, () => {
    return HttpResponse.json({
      message: '동아리 요약 조회 성공',
      data: {
        clubUUID: '550e8400-e29b-41d4-a716-446655440000',
        clubName: '테스트 동아리',
        leaderName: '홍길동',
        leaderHp: '01012345678',
        clubRoomNumber: '101호',
        clubInsta: '@test_club',
        clubHashtag: ['테스트'],
        clubIntro: '테스트 동아리 소개입니다.',
        clubCategories: ['IT'],
        recruitmentStatus: 'OPEN',
      },
    })
  }),

  // Get leader categories
  http.get(`${API_BASE}/club-leader/category`, () => {
    return HttpResponse.json({
      message: '카테고리 조회 성공',
      data: [
        { clubCategoryUUID: 'cat-1', clubCategoryName: 'IT' },
        { clubCategoryUUID: 'cat-2', clubCategoryName: '학술' },
      ],
    })
  }),

  // Toggle recruitment
  http.patch(`${API_BASE}/club-leader/:clubUUID/recruitment`, () => {
    return HttpResponse.json({
      message: '모집 상태 변경 성공',
      data: null,
    })
  }),

  // Get club members
  http.get(`${API_BASE}/club-leader/:clubUUID/members`, () => {
    return HttpResponse.json({
      message: '회원 목록 조회 성공',
      data: [
        {
          clubMemberUUID: 'member-1',
          userName: '테스트 회원',
          studentNumber: '20231234',
          major: '컴퓨터공학과',
          userHp: '01098765432',
        },
      ],
    })
  }),

  // Delete club members
  http.delete(`${API_BASE}/club-leader/:clubUUID/members`, () => {
    return HttpResponse.json({
      message: '회원 삭제 성공',
      data: null,
    })
  }),

  // Get applicants
  http.get(`${API_BASE}/club-leader/:clubUUID/applicants`, () => {
    return HttpResponse.json({
      message: '지원자 목록 조회 성공',
      data: [
        {
          aplictUUID: 'applicant-1',
          userName: '지원자1',
          studentNumber: '20241234',
          major: '소프트웨어학과',
          userHp: '01011112222',
          aplictStatus: 'WAIT',
        },
      ],
    })
  }),

  // Process applicants
  http.post(`${API_BASE}/club-leader/:clubUUID/applicants/notifications`, () => {
    return HttpResponse.json({
      message: '지원자 처리 성공',
      data: null,
    })
  }),

  // Get sign up requests
  http.get(`${API_BASE}/club-leader/:clubUUID/members/sign-up`, () => {
    return HttpResponse.json({
      message: '가입 요청 조회 성공',
      data: [],
    })
  }),

  // Agree terms
  http.patch(`${API_BASE}/club-leader/terms/agreement`, () => {
    return HttpResponse.json({
      message: '약관 동의 성공',
      data: null,
    })
  }),

  // ===== Admin Handlers =====
  // NOTE: More specific routes must come before parameterized routes

  // Check leader account (must be before /admin/clubs/:clubUUID)
  http.get(`${API_BASE}/admin/clubs/leader/check`, () => {
    return HttpResponse.json({
      message: '아이디 사용 가능',
      data: null,
    })
  }),

  // Check club name (must be before /admin/clubs/:clubUUID)
  http.get(`${API_BASE}/admin/clubs/name/check`, () => {
    return HttpResponse.json({
      message: '이름 사용 가능',
      data: null,
    })
  }),

  // Get admin categories (must be before /admin/clubs/:clubUUID)
  http.get(`${API_BASE}/admin/clubs/category`, () => {
    return HttpResponse.json({
      message: '카테고리 조회 성공',
      data: [
        { clubCategoryUUID: 'cat-1', clubCategoryName: 'IT' },
        { clubCategoryUUID: 'cat-2', clubCategoryName: '학술' },
      ],
    })
  }),

  // Create category
  http.post(`${API_BASE}/admin/clubs/category`, () => {
    return HttpResponse.json({
      message: '카테고리 생성 성공',
      data: { clubCategoryUUID: 'new-cat', clubCategoryName: '새 카테고리' },
    })
  }),

  // Delete category
  http.delete(`${API_BASE}/admin/clubs/category/:clubCategoryUUID`, () => {
    return HttpResponse.json({
      message: '카테고리 삭제 성공',
      data: { clubCategoryUUID: 'cat-1', clubCategoryName: 'IT' },
    })
  }),

  // Get admin clubs
  http.get(`${API_BASE}/admin/clubs`, () => {
    return HttpResponse.json({
      message: '동아리 목록 조회 성공',
      data: {
        content: [
          {
            clubUUID: 'club-1',
            clubName: '테스트 동아리',
            leaderName: '홍길동',
            department: '학술',
            leaderHp: '01012345678',
          },
        ],
        totalPages: 1,
        totalElements: 1,
        currentPage: 0,
      },
    })
  }),

  // Get admin club detail (parameterized route - must be after specific routes)
  http.get(`${API_BASE}/admin/clubs/:clubUUID`, () => {
    return HttpResponse.json({
      message: '동아리 상세 조회 성공',
      data: {
        clubUUID: 'club-1',
        clubName: '테스트 동아리',
        leaderName: '홍길동',
        leaderAccount: 'leader1',
        leaderHp: '01012345678',
        clubRoomNumber: '101호',
        clubCategories: [{ categoryUUID: 'cat-1', categoryName: 'IT' }],
      },
    })
  }),

  // Create club
  http.post(`${API_BASE}/admin/clubs`, () => {
    return HttpResponse.json({
      message: '동아리 생성 성공',
      data: 'new-club-uuid',
    })
  }),

  // Delete club
  http.delete(`${API_BASE}/admin/clubs/:clubUUID`, () => {
    return HttpResponse.json({
      message: '동아리 삭제 성공',
      data: null,
    })
  }),

  // Get floor photo
  http.get(`${API_BASE}/admin/floor/photo/:floor`, ({ params }) => {
    return HttpResponse.json({
      message: '층 사진 조회 성공',
      data: { floor: params.floor, presignedUrl: '' },
    })
  }),

  // Upload floor photo
  http.put(`${API_BASE}/admin/floor/photo/:floor`, ({ params }) => {
    return HttpResponse.json({
      message: '층 사진 업로드 성공',
      data: { floor: params.floor, presignedUrl: 'https://example.com/photo.jpg' },
    })
  }),

  // ===== User Handlers =====

  // Change password
  http.patch(`${API_BASE}/users/userpw`, () => {
    return HttpResponse.json({
      message: '비밀번호 변경 성공',
      data: null,
    })
  }),

  // Find account
  http.get(`${API_BASE}/users/find-account/:email`, () => {
    return HttpResponse.json({
      message: '아이디 찾기 성공',
      data: null,
    })
  }),

  // Send auth code
  http.post(`${API_BASE}/users/auth/send-code`, () => {
    return HttpResponse.json({
      message: '인증 코드 전송 성공',
      data: 'auth-token-uuid',
    })
  }),

  // Verify auth code
  http.post(`${API_BASE}/users/auth/verify-token`, () => {
    return HttpResponse.json({
      message: '인증 코드 검증 성공',
      data: null,
    })
  }),

  // Reset password
  http.patch(`${API_BASE}/users/reset-password`, () => {
    return HttpResponse.json({
      message: '비밀번호 재설정 성공',
      data: null,
    })
  }),

  // Check email duplicate
  http.post(`${API_BASE}/users/check/:email/duplicate`, () => {
    return HttpResponse.json({
      message: '이메일 사용 가능',
      data: null,
    })
  }),

  // Check account duplicate
  http.get(`${API_BASE}/users/verify-duplicate/:account`, () => {
    return HttpResponse.json({
      message: '아이디 사용 가능',
      data: null,
    })
  }),

  // Temporary register
  http.post(`${API_BASE}/users/temporary/register`, () => {
    return HttpResponse.json({
      message: '임시 회원가입 성공',
      data: {
        emailToken_uuid: 'email-token-uuid',
        email: 'test@example.com',
      },
    })
  }),

  // Confirm email verification
  http.post(`${API_BASE}/users/email/verification`, () => {
    return HttpResponse.json({
      message: '이메일 인증 확인 성공',
      data: {
        emailTokenUUID: 'email-token-uuid',
        signupUUID: 'signup-uuid',
      },
    })
  }),

  // Signup
  http.post(`${API_BASE}/users/signup`, () => {
    return HttpResponse.json({
      message: '회원가입 성공',
      data: null,
    })
  }),

  // User login
  http.post(`${API_BASE}/users/login`, () => {
    return HttpResponse.json({
      message: '로그인 성공',
      data: {
        accessToken: 'user_access_token',
        refreshToken: 'user_refresh_token',
        role: 'USER',
      },
    })
  }),

  // Send exit code
  http.post(`${API_BASE}/users/exit/send-code`, () => {
    return HttpResponse.json({
      message: '탈퇴 인증 코드 전송 성공',
      data: null,
    })
  }),

  // Exit user
  http.delete(`${API_BASE}/users/exit`, () => {
    return HttpResponse.json({
      message: '회원 탈퇴 성공',
      data: null,
    })
  }),

  // ===== MyPage Handlers =====

  // Get my clubs
  http.get(`${API_BASE}/mypages/my-clubs`, () => {
    return HttpResponse.json({
      message: '소속 동아리 조회 성공',
      data: [
        {
          clubUUID: 'club-1',
          clubName: '테스트 동아리',
          mainPhoto: null,
        },
      ],
    })
  }),

  // Get applied clubs
  http.get(`${API_BASE}/mypages/aplict-clubs`, () => {
    return HttpResponse.json({
      message: '지원 동아리 조회 성공',
      data: [],
    })
  }),

  // Get floor photo (mypage)
  http.get(`${API_BASE}/mypages/clubs/:floor/photo`, () => {
    return HttpResponse.json({
      message: '층 사진 조회 성공',
      data: { photoUrl: null },
    })
  }),

  // Get my notices
  http.get(`${API_BASE}/my-notices`, () => {
    return HttpResponse.json({
      message: '내 공지사항 조회 성공',
      data: [],
    })
  }),

  // Get my notice detail
  http.get(`${API_BASE}/my-notices/:noticeUUID/details`, () => {
    return HttpResponse.json({
      message: '공지사항 상세 조회 성공',
      data: {
        noticeUUID: 'notice-1',
        noticeTitle: '테스트 공지',
        noticeContent: '테스트 내용',
        createdAt: new Date().toISOString(),
      },
    })
  }),

  // ===== Profile Handlers =====

  // Get my profile
  http.get(`${API_BASE}/profiles/me`, () => {
    return HttpResponse.json({
      message: '프로필 조회 성공',
      data: {
        userName: '테스트 사용자',
        email: 'test@example.com',
        studentNumber: '20231234',
        major: '컴퓨터공학과',
        userHp: '01012345678',
      },
    })
  }),

  // Change profile
  http.patch(`${API_BASE}/profiles/change`, () => {
    return HttpResponse.json({
      message: '프로필 수정 성공',
      data: {
        userName: '수정된 사용자',
        email: 'test@example.com',
        studentNumber: '20231234',
        major: '컴퓨터공학과',
        userHp: '01012345678',
      },
    })
  }),

  // Check profile duplication
  http.post(`${API_BASE}/profiles/duplication-check`, () => {
    return HttpResponse.json({
      message: '중복 확인 성공',
      data: {
        exists: false,
        classification: null,
        inTargetClub: null,
        clubUUIDs: null,
        targetClubUUID: null,
        profileId: null,
      },
    })
  }),
]
