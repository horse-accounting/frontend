import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from './client'
import { useAuthStore } from '../stores'
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  User,
} from './types'

// ==================== Response with message ====================

interface AuthResult<T> {
  data: T
  message: string
}

// ==================== API Functions ====================

const login = async (data: LoginRequest): Promise<AuthResult<LoginResponse>> => {
  const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', data)
  return { data: response.data.data, message: response.data.message }
}

const register = async (data: RegisterRequest): Promise<AuthResult<RegisterResponse>> => {
  const response = await apiClient.post<ApiResponse<RegisterResponse>>('/auth/register', data)
  return { data: response.data.data, message: response.data.message }
}

const logoutApi = async (): Promise<{ message: string }> => {
  const response = await apiClient.post<ApiResponse>('/auth/logout')
  return { message: response.data.message }
}

const forgotPassword = async (data: ForgotPasswordRequest): Promise<{ message: string }> => {
  const response = await apiClient.post<ApiResponse>('/auth/forgot-password', data)
  return { message: response.data.message }
}

const resetPassword = async (data: ResetPasswordRequest): Promise<{ message: string }> => {
  const response = await apiClient.post<ApiResponse>('/auth/reset-password', data)
  return { message: response.data.message }
}

const getMe = async () => {
  const response = await apiClient.get<ApiResponse<{ user: User }>>('/auth/me')
  return response.data.data.user
}

const changePassword = async (data: ChangePasswordRequest): Promise<{ message: string }> => {
  const response = await apiClient.post<ApiResponse>('/auth/change-password', data)
  return { message: response.data.message }
}

// ==================== Query Keys ====================

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
}

// ==================== Hooks ====================

export const useLogin = () => {
  const queryClient = useQueryClient()
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: login,
    onSuccess: (result) => {
      setAuth(result.data.user, result.data.accessToken)
      queryClient.setQueryData(authKeys.me(), result.data.user)
    },
  })
}

export const useRegister = () => {
  const queryClient = useQueryClient()
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: register,
    onSuccess: (result) => {
      setAuth(result.data.user, result.data.accessToken)
      queryClient.setQueryData(authKeys.me(), result.data.user)
    },
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()
  const logout = useAuthStore((state) => state.logout)

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      logout()
      queryClient.clear()
    },
  })
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
  })
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
  })
}

export const useMe = () => {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: getMe,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
  })
}
