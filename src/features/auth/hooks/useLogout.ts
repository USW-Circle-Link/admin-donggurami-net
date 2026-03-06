import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logoutUnified } from '../api/authApi'
import { useAuthStore } from '../store/authStore'
import { clearAccessToken } from '@shared/api/apiClient'
import { clearSentryUser } from '@shared/lib/sentry'

export function useLogout() {
  const queryClient = useQueryClient()
  const clearAuth = useAuthStore((state) => state.clearAuth)

  return useMutation({
    mutationFn: logoutUnified,
    onSuccess: () => {
      // Clear all auth state
      clearAccessToken()
      clearAuth()
      clearSentryUser()

      // Clear all cached queries
      queryClient.clear()
    },
    onError: () => {
      // Even on error, clear local auth state
      clearAccessToken()
      clearAuth()
      clearSentryUser()
      queryClient.clear()
    },
  })
}
