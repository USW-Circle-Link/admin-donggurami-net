// Test Data Factories
// 테스트 데이터 생성을 위한 팩토리 함수들

// ===== UUID Generator =====
let uuidCounter = 0
export function createUUID(): string {
  uuidCounter++
  return `test-uuid-${uuidCounter.toString().padStart(8, '0')}`
}

export function resetUUID(): void {
  uuidCounter = 0
}

// ===== Club Factories =====
export function createClubSummary(overrides: Partial<ClubSummaryData> = {}): ClubSummaryData {
  return {
    clubUUID: createUUID(),
    clubName: '테스트 동아리',
    leaderName: '홍길동',
    leaderHp: '01012345678',
    clubRoomNumber: '101호',
    clubInsta: '@test_club',
    clubHashtag: ['#테스트', '#동아리'],
    clubIntro: '테스트 동아리 소개입니다.',
    clubCategories: ['IT', '학술'],
    recruitmentStatus: 'OPEN',
    ...overrides,
  }
}

export function createClubMember(overrides: Partial<ClubMemberData> = {}): ClubMemberData {
  return {
    clubMemberUUID: createUUID(),
    userName: '테스트 회원',
    studentNumber: '20231234',
    major: '컴퓨터공학과',
    userHp: '01098765432',
    ...overrides,
  }
}

export function createApplicant(overrides: Partial<ApplicantData> = {}): ApplicantData {
  return {
    aplictUUID: createUUID(),
    userName: '지원자',
    studentNumber: '20241234',
    major: '소프트웨어학과',
    userHp: '01011112222',
    aplictStatus: 'WAIT',
    ...overrides,
  }
}

// ===== Category Factories =====
export function createCategory(overrides: Partial<CategoryData> = {}): CategoryData {
  return {
    categoryUUID: createUUID(),
    categoryName: '테스트 카테고리',
    ...overrides,
  }
}

// ===== Notice Factories =====
export function createNotice(overrides: Partial<NoticeData> = {}): NoticeData {
  return {
    noticeUUID: createUUID(),
    noticeTitle: '테스트 공지사항',
    noticeContent: '테스트 공지사항 내용입니다.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}

// ===== User Factories =====
export function createUser(overrides: Partial<UserData> = {}): UserData {
  return {
    userUUID: createUUID(),
    userName: '테스트 사용자',
    email: 'test@example.com',
    studentNumber: '20231234',
    major: '컴퓨터공학과',
    userHp: '01012345678',
    ...overrides,
  }
}

// ===== Profile Factories =====
export function createProfile(overrides: Partial<ProfileData> = {}): ProfileData {
  return {
    profileUUID: createUUID(),
    userName: '테스트 사용자',
    email: 'test@example.com',
    studentNumber: '20231234',
    major: '컴퓨터공학과',
    userHp: '01012345678',
    ...overrides,
  }
}

// ===== API Response Factories =====
export function createApiResponse<T>(data: T, message = '성공'): ApiResponseData<T> {
  return {
    message,
    data,
  }
}

export function createApiError(
  code: string,
  message: string,
  status: number
): ApiErrorData {
  return {
    exception: 'TestException',
    code,
    message,
    status,
    error: status === 400 ? 'Bad Request' : status === 401 ? 'Unauthorized' : 'Error',
    additionalData: null,
  }
}

// ===== Types =====
interface ClubSummaryData {
  clubUUID: string
  clubName: string
  leaderName: string
  leaderHp: string
  clubRoomNumber: string
  clubInsta: string
  clubHashtag: string[]
  clubIntro: string
  clubCategories: string[]
  recruitmentStatus: 'OPEN' | 'CLOSE'
}

interface ClubMemberData {
  clubMemberUUID: string
  userName: string
  studentNumber: string
  major: string
  userHp: string
}

interface ApplicantData {
  aplictUUID: string
  userName: string
  studentNumber: string
  major: string
  userHp: string
  aplictStatus: 'WAIT' | 'PASS' | 'FAIL'
}

interface CategoryData {
  categoryUUID: string
  categoryName: string
}

interface NoticeData {
  noticeUUID: string
  noticeTitle: string
  noticeContent: string
  createdAt: string
  updatedAt: string
}

interface UserData {
  userUUID: string
  userName: string
  email: string
  studentNumber: string
  major: string
  userHp: string
}

interface ProfileData {
  profileUUID: string
  userName: string
  email: string
  studentNumber: string
  major: string
  userHp: string
}

interface ApiResponseData<T> {
  message: string
  data: T
}

interface ApiErrorData {
  exception: string
  code: string
  message: string
  status: number
  error: string
  additionalData: null
}
