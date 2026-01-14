import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

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
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
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
