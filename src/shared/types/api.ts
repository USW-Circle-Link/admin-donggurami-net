// Standard API Response wrapper
export interface ApiResponse<T> {
  message: string
  data: T
}

// Error response structure (서버 에러 응답 형식)
export interface ApiError {
  exception: string
  code: string
  message: string
  status: number
  error: string
  additionalData: Record<string, string[]> | null
}

// Login types for different user roles
export type LoginType = 'LEADER' | 'ADMIN'

// User roles
export type UserRole = 'USER' | 'LEADER' | 'ADMIN'

// Recruitment status
export type RecruitmentStatus = 'OPEN' | 'CLOSE'

// Applicant status
export type ApplicantStatus = 'WAIT' | 'PASS' | 'FAIL'

// Member type
export type MemberType = 'REGULARMEMBER' | 'NONMEMBER'

// Floor type
export type FloorType = 'B1' | 'F1' | 'F2'

// Department type
export type Department = '학술' | '종교' | '예술' | '체육' | '공연' | '봉사'
