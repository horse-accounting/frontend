import axios, { type AxiosError } from 'axios'
import { useAuthStore } from '../stores'

// Vercel Rewrite (Proxy) ашиглах - production дээр /api нь backend руу proxy хийнэ
// Development дээр (localhost) env файлаас унших
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Custom error class to hold backend error info
export class ApiError extends Error {
  code: string
  status: number

  constructor(message: string, code: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
  }
}

// Request interceptor - add auth token from zustand store
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ success: boolean; error: { code: string; message: string } }>) => {
    // Extract backend error message
    const backendError = error.response?.data?.error
    const status = error.response?.status || 500

    if (status === 401 && !window.location.pathname.includes('/login')) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }

    // Create ApiError with backend message
    if (backendError) {
      return Promise.reject(new ApiError(backendError.message, backendError.code, status))
    }

    // Fallback to generic error
    return Promise.reject(new ApiError(error.message || 'Алдаа гарлаа', 'UNKNOWN_ERROR', status))
  }
)
