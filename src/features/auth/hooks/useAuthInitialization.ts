import { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router'
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
  const location = useLocation()
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

        // Only redirect if on a public page (login, landing)
        // Otherwise, stay on the current page
        const { role, isAgreedTerms } = useAuthStore.getState()
        const publicPaths = ['/', '/login']
        const isOnPublicPage = publicPaths.includes(location.pathname)

        if (role === 'LEADER' && isAgreedTerms !== true) {
          navigate('/terms', { replace: true })
        } else if (isOnPublicPage) {
          if (role === 'ADMIN') {
            navigate('/union/dashboard', { replace: true })
          } else {
            navigate('/club/dashboard', { replace: true })
          }
        }
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
