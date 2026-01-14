import axios, { AxiosError } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

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

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
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
      localStorage.removeItem('accessToken')
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

// Helper to set token
export const setAuthToken = (token: string) => {
  localStorage.setItem('accessToken', token)
}

// Helper to clear token
export const clearAuthToken = () => {
  localStorage.removeItem('accessToken')
}

// Helper to get token
export const getAuthToken = () => {
  return localStorage.getItem('accessToken')
}
