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

  // Refresh Token
  http.post(`${API_BASE}/auth/refresh`, () => {
    return HttpResponse.json({
      message: '토큰 갱신 성공',
      data: {
        accessToken: 'new_access_token',
        refreshToken: 'new_refresh_token',
      },
    })
  }),

  // Logout
  http.post(`${API_BASE}/auth/logout`, () => {
    return HttpResponse.json({
      message: '로그아웃 성공',
      data: null,
    })
  }),

  // Send verification mail for signup
  http.post(`${API_BASE}/auth/signup/verification-mail`, async ({ request }) => {
    await request.json()
    return HttpResponse.json({
      message: '인증 메일 전송 완료',
      data: {
        emailToken_uuid: 'email-token-uuid',
        email: 'test@example.com',
      },
    })
  }),

  // Verify email for signup
  http.post(`${API_BASE}/auth/signup/verify`, async ({ request }) => {
    await request.json()
    return HttpResponse.json({
      message: '인증 확인 완료',
      data: {
        emailTokenUUID: 'email-token-uuid',
        signupUUID: 'signup-uuid',
      },
    })
  }),

  // Complete signup
  http.post(`${API_BASE}/auth/signup`, () => {
    return HttpResponse.json({
      message: '회원가입이 정상적으로 완료되었습니다.',
      data: null,
    })
  }),

  // Check ID duplicate
  http.get(`${API_BASE}/auth/check-Id`, () => {
    return HttpResponse.json({
      message: '사용 가능한 ID 입니다.',
      data: null,
    })
  }),

  // Find ID
  http.post(`${API_BASE}/auth/find-id`, () => {
    return HttpResponse.json({
      message: '계정 정보 전송 완료',
      data: null,
    })
  }),

  // Send password reset code
  http.post(`${API_BASE}/auth/password/reset-code`, () => {
    return HttpResponse.json({
      message: '인증코드가 전송되었습니다',
      data: 'reset-code-uuid',
    })
  }),

  // Verify reset code
  http.post(`${API_BASE}/auth/password/verify`, () => {
    return HttpResponse.json({
      message: '인증 코드 검증이 완료되었습니다',
      data: null,
    })
  }),

  // Reset password
  http.patch(`${API_BASE}/auth/password/reset`, () => {
    return HttpResponse.json({
      message: '비밀번호가 변경되었습니다.',
      data: null,
    })
  }),

  // Send withdrawal code
  http.post(`${API_BASE}/auth/withdrawal/code`, () => {
    return HttpResponse.json({
      message: '탈퇴를 위한 인증 메일이 전송 되었습니다',
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


  // ===== Club Leader Handlers =====

  // Get all clubs
  http.get(`${API_BASE}/clubs`, () => {
    return HttpResponse.json({
      message: '전체 동아리 조회 완료',
      data: [
        {
          clubUUID: '550e8400-e29b-41d4-a716-446655440000',
          clubName: '테스트 동아리',
          mainPhotoUrl: null,
          department: '학술',
          hashtags: ['테스트'],
          leaderName: '홍길동',
          leaderHp: '01012345678',
          memberCount: 15,
          recruitmentStatus: 'OPEN',
        },
      ],
    })
  }),

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

  // Create club (admin)
  http.post(`${API_BASE}/clubs`, async () => {
    return HttpResponse.json({
      message: '동아리 생성 성공',
      data: 'new-club-uuid',
    })
  }),

  // Update club
  http.put(`${API_BASE}/clubs/:clubUUID`, () => {
    return HttpResponse.json({
      message: '동아리 정보 수정 성공',
      data: null,
    })
  }),

  // Delete club
  http.delete(`${API_BASE}/clubs/:clubUUID`, () => {
    return HttpResponse.json({
      message: '동아리 삭제 성공',
      data: 1,
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

  // Bulk delete applicants
  http.delete(`${API_BASE}/clubs/:clubUUID/applications`, () => {
    return HttpResponse.json({
      message: '지원자 일괄 삭제 성공',
      data: null,
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
      message: '약관 동의 완료',
      data: null,
    })
  }),

  // Get recruit status
  http.get(`${API_BASE}/clubs/:clubUUID/recruit-status`, () => {
    return HttpResponse.json({
      message: '모집 상태 조회 성공',
      data: {
        recruitmentStatus: 'OPEN',
      },
    })
  }),

  // Update FCM token
  http.patch(`${API_BASE}/clubs/fcmtoken`, () => {
    return HttpResponse.json({
      message: 'fcm token 갱신 완료',
      data: null,
    })
  }),

  // Check duplication
  http.get(`${API_BASE}/clubs/check-duplication`, () => {
    return HttpResponse.json({
      message: '사용 가능합니다.',
      data: null,
    })
  }),

  // ===== Admin Handlers =====

  // Get floor maps
  http.get(`${API_BASE}/floor-maps`, ({ request }) => {
    const url = new URL(request.url)
    const floor = url.searchParams.get('floor') || 'F1'
    return HttpResponse.json({
      message: '층별 사진 조회 성공',
      data: {
        floor,
        presignedUrl: 'https://example.com/floor-map.jpg',
      },
    })
  }),

  // Upload floor maps
  http.put(`${API_BASE}/floor-maps`, () => {
    return HttpResponse.json({
      message: '층별 사진 업로드 성공',
      data: null,
    })
  }),

  // Delete floor map
  http.delete(`${API_BASE}/floor-maps/:floorEnum`, () => {
    return HttpResponse.json({
      message: '층별 사진 삭제 성공',
      data: 'Floor: F1',
    })
  }),

  // ===== User Handlers =====

  // ===== MyPage Handlers =====

  // Get my clubs
  http.get(`${API_BASE}/users/me/clubs`, () => {
    return HttpResponse.json({
      message: '소속된 동아리 목록 조회 성공',
      data: [
        {
          clubUUID: 'club-1',
          mainPhotoPath: null,
          clubName: '테스트 동아리',
          leaderName: '홍길동',
          leaderHp: '01012345678',
          clubInsta: '@test_club',
          clubRoomNumber: '101호',
        },
      ],
    })
  }),

  // Get applied clubs
  http.get(`${API_BASE}/users/me/applications`, () => {
    return HttpResponse.json({
      message: '지원한 동아리 목록 조회 성공',
      data: [
        {
          clubUUID: 'club-1',
          mainPhotoPath: null,
          clubName: '테스트 동아리',
          leaderName: '홍길동',
          leaderHp: '01012345678',
          clubInsta: '@test_club',
          aplictStatus: 'WAIT',
          aplictUUID: 'test-aplict-uuid',
          clubRoomNumber: '101호',
        },
      ],
    })
  }),

  // Get floor photo (mypage)
  http.get(`${API_BASE}/users/clubs/:floor/photo`, () => {
    return HttpResponse.json({
      message: '동아리방 층별 사진 조회 성공',
      data: {
        roomFloor: 'F1',
        floorPhotoPath: null,
      },
    })
  }),

  // ===== Profile Handlers =====

  // Get my profile
  http.get(`${API_BASE}/users/me`, () => {
    return HttpResponse.json({
      message: '프로필 조회 성공',
      data: {
        userName: '테스트 사용자',
        studentNumber: '20231234',
        userHp: '01012345678',
        major: '컴퓨터공학과',
        fcmToken: 'test-fcm-token',
      },
    })
  }),

  // Change profile
  http.patch(`${API_BASE}/users/me`, () => {
    return HttpResponse.json({
      message: '프로필 수정 성공',
      data: {
        userName: '수정된 사용자',
        studentNumber: '20231234',
        userHp: '01012345678',
        major: '컴퓨터공학과',
      },
    })
  }),

  // Change password
  http.patch(`${API_BASE}/users/me/password`, () => {
    return HttpResponse.json({
      message: '비밀번호가 성공적으로 업데이트 되었습니다.',
      data: null,
    })
  }),

  // Delete user (withdrawal)
  http.delete(`${API_BASE}/users/me`, () => {
    return HttpResponse.json({
      message: '회원 탈퇴가 완료되었습니다.',
      data: null,
    })
  }),

  // Check profile duplication
  http.post(`${API_BASE}/users/profile/duplication-check`, () => {
    return HttpResponse.json({
      message: '프로필 중복 확인 성공',
      data: {
        exists: false,
        classification: null,
        inTargetClub: null,
        clubuuids: null,
        targetClubuuid: null,
        profileId: null,
      },
    })
  }),

  // ===== Notice Handlers =====

  // Get notices list
  http.get(`${API_BASE}/notices`, ({ request }) => {
    const url = new URL(request.url)
    const page = url.searchParams.get('page') || '0'

    return HttpResponse.json({
      message: '공지사항 리스트 조회 성공',
      data: {
        content: [
          {
            noticeUUID: 'notice-1',
            noticeTitle: '테스트 공지사항',
            noticeCreatedAt: '2024-01-01T00:00:00',
            authorName: '관리자',
          },
        ],
        totalPages: 1,
        totalElements: 1,
        currentPage: parseInt(page),
      },
    })
  }),

  // Create notice
  http.post(`${API_BASE}/notices`, () => {
    return HttpResponse.json({
      message: '공지사항 생성 성공',
      data: ['presigned_url'],
    })
  }),

  // Get notice detail
  http.get(`${API_BASE}/notices/:noticeUUID`, () => {
    return HttpResponse.json({
      message: '공지사항 조회 성공',
      data: {
        noticeUUID: 'notice-1',
        noticeTitle: '테스트 공지사항',
        noticeContent: '공지사항 내용입니다',
        noticePhotos: [],
        noticeCreatedAt: '2024-01-01T00:00:00',
        authorName: '관리자',
      },
    })
  }),

  // Update notice
  http.put(`${API_BASE}/notices/:noticeUUID`, () => {
    return HttpResponse.json({
      message: '공지사항 수정 성공',
      data: ['presigned_url'],
    })
  }),

  // Delete notice
  http.delete(`${API_BASE}/notices/:noticeUUID`, () => {
    return HttpResponse.json({
      message: '공지사항 삭제 성공',
      data: 'notice-1',
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

  // Create form - POST returns 200 OK with no data
  http.post(`${API_BASE}/clubs/:clubUUID/forms`, () => {
    return HttpResponse.json({
      message: '지원서 폼 생성 성공',
      data: null,
    })
  }),

  // Get forms
  http.get(`${API_BASE}/clubs/:clubUUID/forms`, () => {
    return HttpResponse.json({
      message: '지원서 폼 조회 성공',
      data: {
        formId: 101,
        questions: [
          {
            questionId: 101,
            sequence: 1,
            type: 'RADIO',
            content: '학년을 선택해주세요.',
            required: true,
            options: [
              { optionId: 501, content: '1학년' },
              { optionId: 502, content: '2학년' },
            ],
          },
        ],
      },
    })
  }),

  // Update form status
  http.patch(`${API_BASE}/clubs/:clubUUID/forms/:formId/status`, () => {
    return HttpResponse.json({
      message: '지원서 상태 변경 성공',
      data: null,
    })
  }),
]
