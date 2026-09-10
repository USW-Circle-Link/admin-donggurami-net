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
    send_page_view: false,
  })
}

/**
 * gtag 호출 게이트.
 *
 * GA_ID 만 확인하면 부족하다. initGA() 가 아직 실행되지 않았거나(로그인이 먼저 일어난 경우),
 * 테스트·SSR 처럼 window.gtag 이 존재하지 않는 환경에서는 window.gtag(...) 가 TypeError 를 던진다.
 * 분석은 부가 기능이므로 어떤 경우에도 호출부(로그인·로그아웃 등)를 깨뜨리면 안 된다.
 */
function sendToGA(...args: unknown[]) {
  if (!GA_ID) return
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag(...args)
}

/** 페이지 뷰 추적 */
export function trackPageView(path: string) {
  sendToGA('event', 'page_view', { page_path: path })
}

/** 커스텀 이벤트 추적 */
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number,
) {
  sendToGA('event', action, {
    event_category: category,
    event_label: label,
    value,
  })
}

/** 유저 속성 설정 */
export function setUserProperties(properties: Record<string, string | null>) {
  sendToGA('set', 'user_properties', properties)
}

/** 유저 속성 초기화 (로그아웃 시) */
export function clearUserProperties() {
  sendToGA('set', 'user_properties', {
    role: null,
    club_uuid: null,
  })
}
