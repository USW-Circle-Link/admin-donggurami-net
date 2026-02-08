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

  // Unified Login
  http.post(`${API_BASE}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as {
      account: string
      password: string
      fcmToken?: string
      clientId?: string
    }

    if (!body.account || !body.password) {
      return HttpResponse.json(
        createErrorResponse('UserException', 'USR-211', '아이디 혹은 비밀번호가 일치하지 않습니다', 401),
        { status: 401 }
      )
    }

    // Admin login (account starts with 'admin')
    if (body.account === 'admin123' && body.password === 'Admin123!') {
      return HttpResponse.json({
        message: '로그인 성공',
        data: {
          accessToken: 'mock_admin_token',
          refreshToken: 'mock_admin_refresh_token',
          role: 'ADMIN',
          clubuuid: null,
          isAgreedTerms: true,
        },
      })
    }

    // Leader login
    if (body.account === 'leader123' && body.password === 'Leader123!') {
      return HttpResponse.json({
        message: '로그인 성공',
        data: {
          accessToken: 'mock_leader_token',
          refreshToken: 'mock_leader_refresh_token',
          role: 'LEADER',
          clubuuid: '550e8400-e29b-41d4-a716-446655440000',
          isAgreedTerms: true,
        },
      })
    }

    // User login
    if (body.account === 'user123' && body.password === 'User123!') {
      return HttpResponse.json({
        message: '로그인 성공',
        data: {
          accessToken: 'mock_user_token',
          refreshToken: 'mock_user_refresh_token',
          role: 'USER',
          clubuuid: null,
          isAgreedTerms: true,
        },
      })
    }

    return HttpResponse.json(
      createErrorResponse('UserException', 'USR-211', '아이디 혹은 비밀번호가 일치하지 않습니다', 401),
      { status: 401 }
    )
  }),

  // Refresh Token (new endpoint)
  http.post(`${API_BASE}/auth/refresh`, () => {
    return HttpResponse.json({
      message: '새로운 엑세스 토큰이 발급됐습니다.',
      data: {
        accessToken: 'new_access_token',
      },
    })
  }),

  // Refresh Token (old endpoint)
  http.post(`${API_BASE}/integration/refresh-token`, () => {
    return HttpResponse.json({
      message: '새로운 엑세스 토큰과 리프레시 토큰이 발급됐습니다. 로그인됐습니다.',
      data: {
        accessToken: 'new_access_token',
        refreshToken: 'new_refresh_token',
      },
    })
  }),

  // Logout (new endpoint)
  http.post(`${API_BASE}/auth/logout`, () => {
    return HttpResponse.json({
      message: '로그아웃 성공',
      data: null,
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

  // Check eligibility
  http.get(`${API_BASE}/clubs/:clubUUID/applications/eligibility`, () => {
    return HttpResponse.json({
      message: '지원 가능 여부 확인 성공',
      data: true,
    })
  }),

  // Submit application
  http.post(`${API_BASE}/clubs/:clubUUID/applications`, () => {
    return HttpResponse.json({
      message: '지원서 제출 성공',
      data: null,
    })
  }),

  // Get application detail
  http.get(`${API_BASE}/clubs/:clubUUID/applications/:aplictUUID`, () => {
    return HttpResponse.json({
      message: '지원서 상세 조회 성공',
      data: {
        aplictUUID: 'test-aplict-uuid',
        applicantName: '홍길동',
        studentNumber: '20210001',
        department: '컴퓨터공학과',
        submittedAt: '2024-01-15T10:30:00',
        status: 'WAIT',
        qnaList: [
          {
            question: '지원 동기',
            answer: '열정적으로 활동하고 싶습니다',
          },
          {
            question: '희망 분야',
            answer: null,
          },
        ],
      },
    })
  }),

  // Check can apply (old endpoint)
  http.get(`${API_BASE}/apply/can-apply/:clubUUID`, () => {
    return HttpResponse.json({
      message: '지원 가능 여부 확인 성공',
      data: true,
    })
  }),

  // Get Google Form URL (old endpoint)
  http.get(`${API_BASE}/apply/:clubUUID`, () => {
    return HttpResponse.json({
      message: '구글 폼 URL 조회 성공',
      data: 'https://forms.google.com/test-form',
    })
  }),

  // Submit application (old endpoint)
  http.post(`${API_BASE}/apply/:clubUUID`, () => {
    return HttpResponse.json({
      message: '지원서 제출 성공',
      data: null,
    })
  }),

  // ===== Club Leader Handlers =====

  // Get club detail (full info including intro, photos, recruitment, etc.)
  http.get(`${API_BASE}/clubs/:clubUUID`, () => {
    return HttpResponse.json({
      message: '동아리 상세 조회 성공',
      data: {
        clubUUID: '550e8400-e29b-41d4-a716-446655440000',
        mainPhoto: null,
        infoPhotos: [],
        clubName: '테스트 동아리',
        leaderName: '홍길동',
        leaderHp: '01012345678',
        clubInsta: '@test_club',
        clubInfo: '테스트 동아리 소개입니다.',
        recruitmentStatus: 'OPEN',
        googleFormUrl: 'https://forms.google.com/test',
        clubHashtags: ['테스트'],
        clubCategoryNames: ['IT'],
        clubRoomNumber: '101호',
        clubRecruitment: '모집 공고 내용',
      },
    })
  }),

  // Get leader categories
  http.get(`${API_BASE}/categories`, () => {
    return HttpResponse.json({
      message: '카테고리 조회 성공',
      data: [
        { clubCategoryUUID: 'cat-1', clubCategoryName: 'IT' },
        { clubCategoryUUID: 'cat-2', clubCategoryName: '학술' },
      ],
    })
  }),

  // Toggle recruitment
  http.patch(`${API_BASE}/clubs/:clubUUID/recruit-status`, () => {
    return HttpResponse.json({
      message: '모집 상태 변경 성공',
      data: null,
    })
  }),

  // Get club members
  http.get(`${API_BASE}/clubs/:clubUUID/members`, () => {
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
  http.delete(`${API_BASE}/clubs/:clubUUID/members`, () => {
    return HttpResponse.json({
      message: '회원 삭제 성공',
      data: null,
    })
  }),

  // Get applicants
  http.get(`${API_BASE}/clubs/:clubUUID/applicants`, () => {
    return HttpResponse.json({
      message: '지원자 목록 조회 성공',
      data: [
        {
          aplictUUID: 'applicant-1',
          userName: '지원자1',
          studentNumber: '20241234',
          major: '소프트웨어학과',
          userHp: '01011112222',
          status: 'WAIT',
        },
      ],
    })
  }),

  // Process applicants
  http.post(`${API_BASE}/clubs/:clubUUID/applicants/notifications`, () => {
    return HttpResponse.json({
      message: '지원자 처리 성공',
      data: null,
    })
  }),

  // Update application status
  http.patch(`${API_BASE}/clubs/:clubUUID/applications/:aplictUUID/status`, () => {
    return HttpResponse.json({
      message: '지원자 상태 변경 성공',
      data: null,
    })
  }),

  // Agree terms
  http.patch(`${API_BASE}/clubs/terms/agreement`, () => {
    return HttpResponse.json({
      message: '약관 동의 성공',
      data: null,
    })
  }),

  // ===== Admin Handlers =====

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

  // Get floor maps (floor-maps endpoint)
  http.get(`${API_BASE}/floor-maps`, ({ request }) => {
    const url = new URL(request.url)
    const floor = url.searchParams.get('floor') || 'B1'
    return HttpResponse.json({
      message: '층 사진 조회 성공',
      data: {
        floor,
        presignedUrl: 'https://example.com/floor-map.jpg',
      },
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
  http.get(`${API_BASE}/users/me/clubs`, () => {
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
  http.get(`${API_BASE}/users/me/applications`, () => {
    return HttpResponse.json({
      message: '지원 동아리 조회 성공',
      data: [],
    })
  }),

  // Get floor photo (mypage)
  http.get(`${API_BASE}/users/clubs/:floor/photo`, () => {
    return HttpResponse.json({
      message: '층 사진 조회 성공',
      data: { photoUrl: null },
    })
  }),

  // ===== Profile Handlers =====

  // Get my profile
  http.get(`${API_BASE}/users/me`, () => {
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
  http.patch(`${API_BASE}/users/me`, () => {
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
  http.post(`${API_BASE}/users/profile/duplication-check`, () => {
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

  // ===== Category Handlers =====

  // Get categories
  http.get(`${API_BASE}/categories`, () => {
    return HttpResponse.json({
      message: '카테고리 리스트 조회 성공',
      data: [
        {
          clubCategoryUUID: '550e8400-e29b-41d4-a716-446655440000',
          clubCategoryName: '학술',
        },
        {
          clubCategoryUUID: '550e8400-e29b-41d4-a716-446655440001',
          clubCategoryName: '체육',
        },
      ],
    })
  }),

  // Create category
  http.post(`${API_BASE}/categories`, async ({ request }) => {
    const body = (await request.json()) as { clubCategoryName: string }
    return HttpResponse.json({
      message: '카테고리 추가 성공',
      data: {
        clubCategoryUUID: '550e8400-e29b-41d4-a716-446655440002',
        clubCategoryName: body.clubCategoryName,
      },
    })
  }),

  // Delete category
  http.delete(`${API_BASE}/categories/:clubCategoryUUID`, ({ params }) => {
    return HttpResponse.json({
      message: '카테고리 삭제 성공',
      data: {
        clubCategoryUUID: params.clubCategoryUUID,
        clubCategoryName: '학술',
      },
    })
  }),

  // ===== Form Management Handlers =====

  // Create form
  http.post(`${API_BASE}/clubs/:clubId/forms`, () => {
    return HttpResponse.json({
      message: '지원서 폼 생성 성공',
      data: {
        formId: '550e8400-e29b-41d4-a716-446655440001',
      },
    })
  }),

  // Update form status
  http.patch(`${API_BASE}/clubs/:clubId/forms/:formId/status`, () => {
    return HttpResponse.json({
      message: '지원서 상태 변경 성공',
      data: null,
    })
  }),

  // Submit application
  http.post(`${API_BASE}/clubs/:clubId/forms/:formId/applications`, () => {
    return HttpResponse.json({
      message: '지원서 제출 성공',
      data: {
        applicationId: '550e8400-e29b-41d4-a716-446655440002',
      },
    })
  }),

  // Get application detail
  http.get(`${API_BASE}/clubs/:clubId/applications/:applicationId`, () => {
    return HttpResponse.json({
      message: '지원서 상세 조회 성공',
      data: {
        applicationId: 'app-uuid-123',
        formId: 'form-uuid-456',
        applicantId: 'user-uuid-789',
        applicantName: '홍길동',
        applicantEmail: 'hong@example.com',
        status: 'WAIT',
        submittedAt: '2024-01-15T10:00:00Z',
        answers: [
          {
            answerId: 'answer-uuid-1',
            questionId: 'question-uuid-1',
            optionId: null,
            answerText: '저는 이 동아리에 관심이 많아 지원하게 되었습니다',
          },
        ],
        questions: [
          {
            questionId: 'question-uuid-1',
            sequence: 1,
            type: 'SHORT_TEXT',
            content: '지원 동기를 작성해주세요',
            required: true,
            options: [],
          },
        ],
      },
    })
  }),
]
