import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useAuthStore } from '@features/auth/store/authStore'

interface ProtectedRouteProps {
  children: React.ReactNode
}

/**
 * ProtectedRoute component that guards routes requiring authentication.
 * Redirects to /login if user is not authenticated.
 * Redirects to /terms if LEADER has not agreed to terms.
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, accessToken, role, isAgreedTerms } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      navigate('/login', { replace: true })
      return
    }

    // LEADER must agree to terms before accessing the app
    if (role === 'LEADER' && isAgreedTerms !== true && location.pathname !== '/terms') {
      navigate('/terms', { replace: true })
    }
  }, [isAuthenticated, accessToken, role, isAgreedTerms, navigate, location.pathname])

  if (!isAuthenticated || !accessToken) {
    return null
  }

  return <>{children}</>
}
