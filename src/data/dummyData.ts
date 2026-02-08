import type { ClubSummaryResponse, ClubMember, Applicant } from '@features/club-leader/domain/clubLeaderSchemas'
import type { NoticeListItem } from '@features/notice/domain/noticeSchemas'

// Club Summary (대시보드에 표시될 동아리 기본 정보)
export const dummyClubSummary: ClubSummaryResponse = {
  clubUUID: '550e8400-e29b-41d4-a716-446655440000',
  clubName: '동구라미',
  leaderName: '김동아리',
  leaderHp: '01012345678',
  clubInsta: '@donggurami_official',
  clubRoomNumber: '301호',
  clubHashtag: ['#IT', '#개발'],
  clubCategories: ['학술', 'IT/프로그래밍'],
  clubIntro: '동구라미는 IT 기술을 사랑하는 학생들이 모인 동아리입니다. 웹 개발, 앱 개발, AI 등 다양한 분야의 프로젝트를 진행하고 있습니다.',
  clubRecruitment: '2024학년도 1학기 신입 부원을 모집합니다! 프로그래밍에 관심 있는 분이라면 전공 상관없이 누구나 환영합니다.',
  recruitmentStatus: 'OPEN',
  googleFormUrl: 'https://forms.google.com/example',
  mainPhoto: null,
  introPhotos: [],
}

// Club Members (동아리 명단)
export const dummyClubMembers: ClubMember[] = [
  {
    clubMemberUUID: '550e8400-e29b-41d4-a716-446655440001',
    userName: '김동아리',
    major: '컴퓨터공학과',
    studentNumber: '20210001',
    userHp: '01012345678',
    memberType: 'REGULARMEMBER',
  },
  {
    clubMemberUUID: '550e8400-e29b-41d4-a716-446655440002',
    userName: '이멤버',
    major: '소프트웨어학과',
    studentNumber: '20220002',
    userHp: '01098765432',
    memberType: 'REGULARMEMBER',
  },
  {
    clubMemberUUID: '550e8400-e29b-41d4-a716-446655440003',
    userName: '박학생',
    major: '정보통신공학과',
    studentNumber: '20230003',
    userHp: '01011112222',
    memberType: 'REGULARMEMBER',
  },
  {
    clubMemberUUID: '550e8400-e29b-41d4-a716-446655440004',
    userName: '최신입',
    major: '데이터사이언스학과',
    studentNumber: '20240004',
    userHp: '01033334444',
    memberType: 'NONMEMBER',
  },
  {
    clubMemberUUID: '550e8400-e29b-41d4-a716-446655440005',
    userName: '정개발',
    major: 'AI융합학과',
    studentNumber: '20210005',
    userHp: '01055556666',
    memberType: 'REGULARMEMBER',
  },
]

// Applicants (지원자) with answers
export interface ApplicantWithStatus extends Applicant {
  answers: { question: string; answer: string }[]
}

export const dummyApplicants: ApplicantWithStatus[] = [
  {
    aplictUUID: '550e8400-e29b-41d4-a716-446655440010',
    userName: '강지원',
    major: '컴퓨터공학과',
    studentNumber: '20240010',
    userHp: '01077778888',
    status: 'WAIT',
    answers: [
      { question: '지원 동기를 알려주세요.', answer: '프로그래밍에 관심이 많아서 실무 경험을 쌓고 싶습니다.' },
      { question: '참여 가능한 시간대가 언제인가요?', answer: '평일 오후 6시 이후, 주말 전일 가능합니다.' },
      { question: '관심 있는 분야는 무엇인가요?', answer: '웹 프론트엔드 개발에 관심이 있습니다.' },
    ],
  },
  {
    aplictUUID: '550e8400-e29b-41d4-a716-446655440011',
    userName: '윤희망',
    major: '경영학과',
    studentNumber: '20230011',
    userHp: '01099990000',
    status: 'WAIT',
    answers: [
      { question: '지원 동기를 알려주세요.', answer: '비전공자이지만 개발을 배워보고 싶습니다.' },
      { question: '참여 가능한 시간대가 언제인가요?', answer: '화목 오후만 가능합니다.' },
      { question: '관심 있는 분야는 무엇인가요?', answer: 'UI/UX 디자인과 기획에 관심이 있습니다.' },
    ],
  },
  {
    aplictUUID: '550e8400-e29b-41d4-a716-446655440012',
    userName: '조열정',
    major: '소프트웨어학과',
    studentNumber: '20240012',
    userHp: '01011223344',
    status: 'PASS',
    answers: [
      { question: '지원 동기를 알려주세요.', answer: '학교 수업만으로는 부족해서 동아리에서 실습하고 싶습니다.' },
      { question: '참여 가능한 시간대가 언제인가요?', answer: '언제든 가능합니다.' },
      { question: '관심 있는 분야는 무엇인가요?', answer: '백엔드 개발, 특히 Spring Boot에 관심 있습니다.' },
    ],
  },
  {
    aplictUUID: '550e8400-e29b-41d4-a716-446655440013',
    userName: '한성장',
    major: '전자공학과',
    studentNumber: '20220013',
    userHp: '01055667788',
    status: 'FAIL',
    answers: [
      { question: '지원 동기를 알려주세요.', answer: '임베디드 시스템 개발에 관심이 있습니다.' },
      { question: '참여 가능한 시간대가 언제인가요?', answer: '월수금 저녁 가능합니다.' },
      { question: '관심 있는 분야는 무엇인가요?', answer: 'IoT와 임베디드 개발입니다.' },
    ],
  },
  {
    aplictUUID: '550e8400-e29b-41d4-a716-446655440014',
    userName: '백도전',
    major: '수학과',
    studentNumber: '20230014',
    userHp: '01099887766',
    status: 'WAIT',
    answers: [
      { question: '지원 동기를 알려주세요.', answer: '데이터 분석과 머신러닝에 관심이 있어서 지원했습니다.' },
      { question: '참여 가능한 시간대가 언제인가요?', answer: '주말에만 가능합니다.' },
      { question: '관심 있는 분야는 무엇인가요?', answer: '데이터 사이언스와 AI입니다.' },
    ],
  },
]

// Notices (공지사항)
export const dummyNotices: NoticeListItem[] = [
  {
    noticeUUID: '550e8400-e29b-41d4-a716-446655440020',
    noticeTitle: '2024년 1학기 정기 모임 안내',
    noticeCreatedAt: '2024-03-15T10:00:00',
    adminName: '관리자',
    thumbnailUrl: null,
  },
  {
    noticeUUID: '550e8400-e29b-41d4-a716-446655440021',
    noticeTitle: '동아리 MT 참가 신청 안내',
    noticeCreatedAt: '2024-03-10T14:30:00',
    adminName: '관리자',
    thumbnailUrl: null,
  },
  {
    noticeUUID: '550e8400-e29b-41d4-a716-446655440022',
    noticeTitle: '신입 부원 환영회 개최',
    noticeCreatedAt: '2024-03-05T09:00:00',
    adminName: '관리자',
    thumbnailUrl: null,
  },
  {
    noticeUUID: '550e8400-e29b-41d4-a716-446655440023',
    noticeTitle: '동아리 회비 납부 안내',
    noticeCreatedAt: '2024-02-28T11:00:00',
    adminName: '관리자',
    thumbnailUrl: null,
  },
  {
    noticeUUID: '550e8400-e29b-41d4-a716-446655440024',
    noticeTitle: '2024년도 동아리 운영 계획',
    noticeCreatedAt: '2024-02-20T15:00:00',
    adminName: '관리자',
    thumbnailUrl: null,
  },
]

// Application Form Questions (지원서 양식)
export type QuestionType = 'text' | 'radio' | 'checkbox' | 'dropdown'

export interface ApplicationQuestion {
  id: number
  question: string
  type: QuestionType
  required: boolean
  options?: string[] // radio, checkbox, dropdown에서 사용
  maxLength?: number // 서술형 글자수 제한 (기본 300)
}

export const dummyApplicationQuestions: ApplicationQuestion[] = [
  {
    id: 1,
    question: '지원 동기를 알려주세요.',
    type: 'text',
    required: true,
    maxLength: 500,
  },
  {
    id: 2,
    question: '참여 가능한 시간대를 선택해주세요.',
    type: 'checkbox',
    required: true,
    options: ['평일 오전', '평일 오후', '평일 저녁', '주말']
  },
  {
    id: 3,
    question: '관심 있는 분야를 선택해주세요.',
    type: 'radio',
    required: false,
    options: ['프론트엔드', '백엔드', '데이터 분석', 'AI/ML', '기타']
  },
]

// ===== 동아리 연합회 데이터 =====

// 동아리 목록 (연합회에서 관리)
export interface ClubListItem {
  clubUUID: string
  clubName: string
  leaderName: string
  leaderHp: string
  clubRoomNumber: string
  memberCount: number
  categories: string[]
  recruitmentStatus: 'OPEN' | 'CLOSE'
}

export const dummyClubList: ClubListItem[] = [
  {
    clubUUID: '550e8400-e29b-41d4-a716-446655440100',
    clubName: '동구라미',
    leaderName: '김동아리',
    leaderHp: '01012345678',
    clubRoomNumber: '301호',
    memberCount: 25,
    categories: ['학술', 'IT/프로그래밍'],
    recruitmentStatus: 'OPEN',
  },
  {
    clubUUID: '550e8400-e29b-41d4-a716-446655440101',
    clubName: '음악사랑',
    leaderName: '이음악',
    leaderHp: '01011112222',
    clubRoomNumber: '302호',
    memberCount: 30,
    categories: ['문화/예술', '음악'],
    recruitmentStatus: 'OPEN',
  },
  {
    clubUUID: '550e8400-e29b-41d4-a716-446655440102',
    clubName: '봉사단',
    leaderName: '박봉사',
    leaderHp: '01033334444',
    clubRoomNumber: '303호',
    memberCount: 40,
    categories: ['봉사'],
    recruitmentStatus: 'CLOSE',
  },
  {
    clubUUID: '550e8400-e29b-41d4-a716-446655440103',
    clubName: '축구동아리',
    leaderName: '최축구',
    leaderHp: '01055556666',
    clubRoomNumber: '201호',
    memberCount: 35,
    categories: ['체육', '축구'],
    recruitmentStatus: 'OPEN',
  },
  {
    clubUUID: '550e8400-e29b-41d4-a716-446655440104',
    clubName: '사진동아리',
    leaderName: '정사진',
    leaderHp: '01077778888',
    clubRoomNumber: '202호',
    memberCount: 20,
    categories: ['문화/예술', '사진'],
    recruitmentStatus: 'CLOSE',
  },
  {
    clubUUID: '550e8400-e29b-41d4-a716-446655440105',
    clubName: '토론동아리',
    leaderName: '한토론',
    leaderHp: '01099990000',
    clubRoomNumber: '203호',
    memberCount: 15,
    categories: ['학술', '토론'],
    recruitmentStatus: 'OPEN',
  },
]

// 동아리방 층별 정보
export interface FloorRoomInfo {
  floor: number
  imageUrl: string | null
  rooms: string[]
}

export const dummyFloorRoomInfo: FloorRoomInfo[] = [
  { floor: 1, imageUrl: null, rooms: ['101호', '102호', '103호'] },
  { floor: 2, imageUrl: null, rooms: ['201호', '202호', '203호', '204호'] },
  { floor: 3, imageUrl: null, rooms: ['301호', '302호', '303호'] },
]

// 동아리 카테고리
export interface ClubCategory {
  categoryUUID: string
  categoryName: string
  clubCount: number
}

export const dummyCategories: ClubCategory[] = [
  { categoryUUID: 'cat-001', categoryName: '학술', clubCount: 5 },
  { categoryUUID: 'cat-002', categoryName: '문화/예술', clubCount: 8 },
  { categoryUUID: 'cat-003', categoryName: '체육', clubCount: 10 },
  { categoryUUID: 'cat-004', categoryName: '봉사', clubCount: 3 },
  { categoryUUID: 'cat-005', categoryName: 'IT/프로그래밍', clubCount: 4 },
  { categoryUUID: 'cat-006', categoryName: '음악', clubCount: 6 },
  { categoryUUID: 'cat-007', categoryName: '사진', clubCount: 2 },
  { categoryUUID: 'cat-008', categoryName: '토론', clubCount: 2 },
]

// 공지사항 상세 정보
export interface NoticeDetail {
  noticeUUID: string
  noticeTitle: string
  noticeContent: string
  noticePhotos: string[]
  noticeCreatedAt: string
  adminName: string
}

export const dummyNoticeDetails: NoticeDetail[] = [
  {
    noticeUUID: '550e8400-e29b-41d4-a716-446655440020',
    noticeTitle: '2024년 1학기 정기 모임 안내',
    noticeContent: `안녕하세요, 동아리 연합회입니다.

2024년 1학기 정기 모임을 아래와 같이 안내드립니다.

■ 일시: 2024년 3월 20일 (수) 오후 6시
■ 장소: 학생회관 대강당
■ 대상: 모든 동아리 회장 및 임원

주요 안건:
1. 2024년도 동아리 활동 계획 공유
2. 동아리방 배정 관련 안내
3. 신입생 모집 일정 조율
4. 기타 건의사항

많은 참석 부탁드립니다.`,
    noticePhotos: [],
    noticeCreatedAt: '2024-03-15T10:00:00',
    adminName: '관리자',
  },
  {
    noticeUUID: '550e8400-e29b-41d4-a716-446655440021',
    noticeTitle: '동아리 MT 참가 신청 안내',
    noticeContent: `안녕하세요!

동아리 연합회에서 주관하는 연합 MT에 대해 안내드립니다.

■ 일시: 2024년 4월 5일 ~ 6일 (1박 2일)
■ 장소: 경기도 가평 펜션
■ 참가비: 1인당 30,000원 (교통비, 숙박비, 식비 포함)

신청 마감: 2024년 3월 25일까지

각 동아리별 최소 2명 이상 참가해주시면 감사하겠습니다.`,
    noticePhotos: [],
    noticeCreatedAt: '2024-03-10T14:30:00',
    adminName: '관리자',
  },
  {
    noticeUUID: '550e8400-e29b-41d4-a716-446655440022',
    noticeTitle: '신입 부원 환영회 개최',
    noticeContent: `2024학년도 신입 부원 환영회를 개최합니다!

■ 일시: 2024년 3월 15일 (금) 오후 5시
■ 장소: 학생회관 2층 동아리 라운지

간단한 다과와 함께 신입 부원들을 환영하는 자리를 마련했습니다.
많은 참석 부탁드립니다.`,
    noticePhotos: [],
    noticeCreatedAt: '2024-03-05T09:00:00',
    adminName: '관리자',
  },
  {
    noticeUUID: '550e8400-e29b-41d4-a716-446655440023',
    noticeTitle: '동아리 회비 납부 안내',
    noticeContent: `2024년도 동아리 연합회비 납부 안내입니다.

■ 납부 금액: 동아리당 50,000원
■ 납부 기한: 2024년 3월 31일까지
■ 납부 계좌: 신한은행 110-XXX-XXXXXX (동아리연합회)

기한 내 납부 부탁드립니다.`,
    noticePhotos: [],
    noticeCreatedAt: '2024-02-28T11:00:00',
    adminName: '관리자',
  },
  {
    noticeUUID: '550e8400-e29b-41d4-a716-446655440024',
    noticeTitle: '2024년도 동아리 운영 계획',
    noticeContent: `2024년도 동아리 연합회 운영 계획을 공유드립니다.

1분기 (3월~5월):
- 신입생 모집 기간
- 연합 MT 개최
- 정기 모임

2분기 (6월~8월):
- 동아리 박람회 개최
- 여름 방학 활동 지원

3분기 (9월~11월):
- 2학기 활동 시작
- 축제 참가 지원

4분기 (12월~2월):
- 연말 시상식
- 차기 임원진 선출

자세한 일정은 추후 공지하겠습니다.`,
    noticePhotos: [],
    noticeCreatedAt: '2024-02-20T15:00:00',
    adminName: '관리자',
  },
]
