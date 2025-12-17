import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logout } from '../api/authApi'
import { useAuthStore } from '../store/authStore'
import { clearAccessToken } from '@shared/api/apiClient'

export function useLogout() {
  const queryClient = useQueryClient()
  const clearAuth = useAuthStore((state) => state.clearAuth)

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Clear all auth state
      clearAccessToken()
      clearAuth()

      // Clear all cached queries
      queryClient.clear()
    },
    onError: () => {
      // Even on error, clear local auth state
      clearAccessToken()
      clearAuth()
      queryClient.clear()
    },
  })
}
