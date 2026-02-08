import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@features/auth/store/authStore'

const BASE_URL = 'https://api.donggurami.net'

// In-memory token storage (synced with authStore)
let accessToken: string | null = null

// Initialize from authStore on module load
const initializeToken = () => {
  const storedToken = useAuthStore.getState().accessToken
  if (storedToken) {
    accessToken = storedToken
  }
}

// Sync token from authStore
const getTokenFromStore = (): string | null => {
  return useAuthStore.getState().accessToken
}

export const setAccessToken = (token: string) => {
  accessToken = token
  // Sync with authStore
  useAuthStore.getState().updateAccessToken(token)
}

export const clearAccessToken = () => {
  accessToken = null
  // Sync with authStore
  useAuthStore.getState().clearAuth()
}

export const getAccessToken = () => accessToken

// Initialize token on module load
initializeToken()

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For httpOnly cookies (refresh token)
})

// Request interceptor - attach access token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Always read from authStore to ensure sync
    const token = getTokenFromStore() || accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      try {
        // Attempt token refresh
        const response = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        )

        const newAccessToken = response.data.data.accessToken
        setAccessToken(newAccessToken)

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        clearAccessToken()
        // Trigger logout/redirect logic here
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)
