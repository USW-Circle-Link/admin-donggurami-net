import { useMutation } from '@tanstack/react-query'
import { loginClubLeader, loginAdmin } from '../api/authApi'
import { useAuthStore } from '../store/authStore'
import { setAccessToken } from '@shared/api/apiClient'
import { clubLeaderLoginSchema, adminLoginSchema } from '../domain/authSchemas'
import type {
  ClubLeaderLoginInput,
  AdminLoginInput,
} from '../domain/authSchemas'

export function useClubLeaderLogin() {
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: async (credentials: ClubLeaderLoginInput) => {
      // Validate input before API call
      const validatedInput = clubLeaderLoginSchema.parse(credentials)
      return loginClubLeader(validatedInput)
    },
    onSuccess: (response) => {
      const { accessToken, role, clubUUID, isAgreedTerms } = response.data

      // Set token in API client
      setAccessToken(accessToken)

      // Update Zustand store
      setAuth({
        accessToken,
        role,
        clubUUID,
        isAgreedTerms,
      })
    },
  })
}

export function useAdminLogin() {
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: async (credentials: AdminLoginInput) => {
      const validatedInput = adminLoginSchema.parse(credentials)
      return loginAdmin(validatedInput)
    },
    onSuccess: (response) => {
      const { accessToken, role } = response.data

      setAccessToken(accessToken)
      // Admin has no clubUUID or isAgreedTerms
      setAuth({
        accessToken,
        role,
      })
    },
  })
}
