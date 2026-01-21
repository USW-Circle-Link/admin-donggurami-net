import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuthStore } from '@features/auth/store/authStore'

interface ProtectedRouteProps {
  children: React.ReactNode
}

/**
 * ProtectedRoute component that guards routes requiring authentication.
 * Redirects to /login if user is not authenticated.
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate()
  const { isAuthenticated, accessToken } = useAuthStore()

  useEffect(() => {
    // Redirect to login if not authenticated or no access token
    if (!isAuthenticated || !accessToken) {
      navigate('/login', { replace: true })
    }
  }, [isAuthenticated, accessToken, navigate])

  // Only render children if authenticated
  if (!isAuthenticated || !accessToken) {
    return null
  }

  return <>{children}</>
}
