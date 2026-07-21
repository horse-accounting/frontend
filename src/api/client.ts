import axios, { type AxiosError } from 'axios'
import { useAuthStore } from '../stores'

const API_BASE_URL = import.meta.env.VITE_API_URL
if (!API_BASE_URL) {
  throw new Error('VITE_API_URL тохируулагдаагүй байна. .env файл эсвэл Vercel environment variable-аас тохируулна уу.')
}

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
  // Талбар тус бүрийн validation алдаа: { email: ['...'], password: ['...'] }
  details?: Record<string, string[]>

  constructor(message: string, code: string, status: number, details?: Record<string, string[]>) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
    this.details = details
  }
}

// Backend-ийн талбар тус бүрийн алдааг antd form дээр шууд харуулна.
// details байсан бол true буцаана — дуудагч ерөнхий message давхар харуулах эсэхээ шийднэ.
// (never[] параметр нь дурын FormInstance<T>-г хүлээн авахын тулд — дотроо нэг cast хийнэ)
export const applyApiErrorToForm = (
  form: { setFields: (fields: never[]) => void },
  error: unknown,
): boolean => {
  if (error instanceof ApiError && error.details && Object.keys(error.details).length > 0) {
    const fields = Object.entries(error.details).map(([name, errors]) => ({ name, errors }))
    form.setFields(fields as never[])
    return true
  }
  return false
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
  (error: AxiosError<{ success: boolean; error: { code: string; message: string; details?: Record<string, string[]> } }>) => {
    // Extract backend error message
    const backendError = error.response?.data?.error
    const status = error.response?.status || 500

    // Бүх API алдаа энэ interceptor-оор дамждаг тул log-г энд төвлөрүүлнэ (dev горимд л)
    if (import.meta.env.DEV) {
      const { method, url, params, data } = error.config ?? {}
      console.groupCollapsed(
        `%cAPI ${status}%c ${method?.toUpperCase() ?? '?'} ${url ?? '?'}`,
        'color:#fff;background:#c00;padding:1px 4px;border-radius:3px',
        '',
      )
      console.log('baseURL:', API_BASE_URL)
      if (params) console.log('params:', params)
      if (data) console.log('request body:', data)
      console.log('code:', backendError?.code ?? 'UNKNOWN_ERROR')
      console.log('message:', backendError?.message ?? error.message)
      if (backendError?.details) console.log('details:', backendError.details)
      console.log('response:', error.response?.data ?? '(хариу ирээгүй — network/CORS/timeout)')
      console.groupEnd()
    }

    if (status === 401 && !window.location.pathname.includes('/login')) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }

    if (status === 403 && backendError?.code === 'EMAIL_NOT_VERIFIED' && !window.location.pathname.includes('/verify-email')) {
      window.location.href = '/verify-email'
    }

    // Create ApiError with backend message
    if (backendError) {
      return Promise.reject(new ApiError(backendError.message, backendError.code, status, backendError.details))
    }

    // Fallback to generic error
    return Promise.reject(new ApiError(error.message || 'Алдаа гарлаа', 'UNKNOWN_ERROR', status))
  }
)
