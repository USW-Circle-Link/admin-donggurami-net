const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

// gtag type declarations
declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

export function initGA() {
  if (!GA_ID) return

  // Load gtag.js script
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function (...args: unknown[]) {
    window.dataLayer.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID, {
    debug_mode: !import.meta.env.PROD,
  })
}

/** 페이지 뷰 추적 */
export function trackPageView(path: string) {
  if (!GA_ID) return
  window.gtag('event', 'page_view', { page_path: path })
}

/** 커스텀 이벤트 추적 */
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number,
) {
  if (!GA_ID) return
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  })
}

/** 유저 속성 설정 */
export function setUserProperties(properties: Record<string, string | null>) {
  if (!GA_ID) return
  window.gtag('set', 'user_properties', properties)
}
