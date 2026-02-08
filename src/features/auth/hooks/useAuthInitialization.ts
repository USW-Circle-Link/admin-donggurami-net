import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { useAuthStore } from '../store/authStore'
import { clearAccessToken, setAccessToken } from '@shared/api/apiClient'
import { refreshTokenUnified } from '../api/authApi'

/**
 * Authentication initialization hook
 *
 * Runs on app startup to validate stored authentication state.
 * If an accessToken exists in the store, it validates the token
 * with the backend using the refresh token mechanism.
 *
 * If the token is invalid or expired, clears auth and redirects to login.
 *
 * @example
 * ```tsx
 * function App() {
 *   useAuthInitialization()
 *   return <RouterProvider router={router} />
 * }
 * ```
 */
export function useAuthInitialization() {
  const navigate = useNavigate()
  const hasInitialized = useRef(false)
  const accessToken = useAuthStore((state) => state.accessToken)
  const clearAuth = useAuthStore((state) => state.clearAuth)

  useEffect(() => {
    // Prevent multiple initializations
    if (hasInitialized.current) {
      return
    }
    hasInitialized.current = true

    const initializeAuth = async () => {
      // No token stored, nothing to validate
      if (!accessToken) {
        return
      }

      try {
        // Set the token in apiClient for the validation request
        setAccessToken(accessToken)

        // Validate token by attempting to refresh it
        // This also updates the token if successful
        const response = await refreshTokenUnified()
        const newAccessToken = response.data.accessToken

        // Update the token in apiClient and store
        setAccessToken(newAccessToken)
      } catch {
        // Token is invalid or refresh failed
        // Clear auth state and redirect to login
        clearAccessToken()
        clearAuth()
        navigate('/login', { replace: true })
      }
    }

    void initializeAuth()
  }, [accessToken, clearAuth, navigate])
}
