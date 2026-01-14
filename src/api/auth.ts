import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient, setAuthToken, clearAuthToken } from './client'
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

// ==================== API Functions ====================

const login = async (data: LoginRequest) => {
  const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', data)
  return response.data.data
}

const register = async (data: RegisterRequest) => {
  const response = await apiClient.post<ApiResponse<RegisterResponse>>('/auth/register', data)
  return response.data.data
}

const logout = async () => {
  const response = await apiClient.post<ApiResponse>('/auth/logout')
  return response.data
}

const forgotPassword = async (data: ForgotPasswordRequest) => {
  const response = await apiClient.post<ApiResponse>('/auth/forgot-password', data)
  return response.data
}

const resetPassword = async (data: ResetPasswordRequest) => {
  const response = await apiClient.post<ApiResponse>('/auth/reset-password', data)
  return response.data
}

const getMe = async () => {
  const response = await apiClient.get<ApiResponse<{ user: User }>>('/auth/me')
  return response.data.data.user
}

const changePassword = async (data: ChangePasswordRequest) => {
  const response = await apiClient.post<ApiResponse>('/auth/change-password', data)
  return response.data
}

// ==================== Query Keys ====================

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
}

// ==================== Hooks ====================

export const useLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuthToken(data.accessToken)
      queryClient.setQueryData(authKeys.me(), data.user)
    },
  })
}

export const useRegister = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      setAuthToken(data.accessToken)
      queryClient.setQueryData(authKeys.me(), data.user)
    },
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAuthToken()
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
