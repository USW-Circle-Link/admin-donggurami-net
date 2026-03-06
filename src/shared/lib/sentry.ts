import * as Sentry from '@sentry/react'

export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN

  if (!dsn) {
    return
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    release: `admin-donggurami@${import.meta.env.VITE_APP_VERSION ?? '0.0.0'}`,
    sendDefaultPii: true,
    enabled: import.meta.env.PROD,
  })
}

export function setSentryUser(role: string | null, clubUUID: string | null) {
  Sentry.setUser({
    role: role ?? undefined,
    clubUUID: clubUUID ?? undefined,
  })
}

export function clearSentryUser() {
  Sentry.setUser(null)
}
