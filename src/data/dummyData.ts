import type { ClubSummaryResponse, ClubMember, Applicant, ApplicantStatus } from '@features/club-leader/domain/clubLeaderSchemas'
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

// Applicants (지원자) with status
export interface ApplicantWithStatus extends Applicant {
  aplictStatus: ApplicantStatus
  answers: { question: string; answer: string }[]
}

export const dummyApplicants: ApplicantWithStatus[] = [
  {
    aplictUUID: '550e8400-e29b-41d4-a716-446655440010',
    userName: '강지원',
    major: '컴퓨터공학과',
    studentNumber: '20240010',
    userHp: '01077778888',
    aplictStatus: 'WAIT',
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
    aplictStatus: 'WAIT',
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
    aplictStatus: 'PASS',
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
    aplictStatus: 'FAIL',
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
    aplictStatus: 'WAIT',
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
export const dummyApplicationQuestions = [
  { id: 1, question: '지원 동기를 알려주세요.', required: true },
  { id: 2, question: '참여 가능한 시간대가 언제인가요?', required: true },
  { id: 3, question: '관심 있는 분야는 무엇인가요?', required: false },
]
