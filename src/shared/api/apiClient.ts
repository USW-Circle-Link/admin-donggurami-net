import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'

const BASE_URL = 'https://api.donggurami.net'

// In-memory token storage
let accessToken: string | null = null

export const setAccessToken = (token: string) => {
  accessToken = token
}

export const clearAccessToken = () => {
  accessToken = null
}

export const getAccessToken = () => accessToken

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
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
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
          `${BASE_URL}/integration/refresh-token`,
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
