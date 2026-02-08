import { useMutation } from '@tanstack/react-query'
import { loginUnified } from '../api/authApi'
import { useAuthStore } from '../store/authStore'
import { setAccessToken } from '@shared/api/apiClient'
import { loginUnifiedSchema } from '../domain/authSchemas'
import type { LoginUnifiedInput } from '../domain/authSchemas'

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: async (credentials: LoginUnifiedInput) => {
      const validatedInput = loginUnifiedSchema.parse(credentials)
      return loginUnified(validatedInput)
    },
    onSuccess: (response) => {
      const { accessToken, role, clubuuid, isAgreedTerms } = response.data

      setAccessToken(accessToken)

      setAuth({
        accessToken,
        role,
        clubUUID: clubuuid,
        isAgreedTerms,
      })
    },
  })
}
