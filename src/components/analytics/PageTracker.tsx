import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { trackPageView } from '@/shared/lib/analytics'

export function PageTracker() {
  const location = useLocation()

  useEffect(() => {
    trackPageView(location.pathname)
  }, [location.pathname])

  return null
}
