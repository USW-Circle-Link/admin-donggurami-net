import type { UserRole } from '@shared/types/api'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthState {
  isAuthenticated: boolean
  accessToken: string | null
  role: UserRole | null
  clubUUID: string | null
  isAgreedTerms: boolean
}

export interface ClubLeaderLoginRequest {
  leaderAccount: string
  leaderPw: string
  loginType: 'LEADER'
}

export interface AdminLoginRequest {
  adminAccount: string
  adminPw: string
  clientId: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  role: UserRole
  clubUUID: string
  isAgreedTerms: boolean
}
