import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from './client'
import type {
  ApiResponse,
  PaginatedResponse,
  User,
  UsersQueryParams,
  CreateUserRequest,
  UpdateUserRequest,
  ChangeRoleRequest,
} from './types'

// ==================== API Functions ====================

const getUsers = async (params?: UsersQueryParams) => {
  const response = await apiClient.get<ApiResponse<PaginatedResponse<User>>>('/users', { params })
  return response.data.data
}

const getUserById = async (id: number) => {
  const response = await apiClient.get<ApiResponse<{ user: User }>>(`/users/${id}`)
  return response.data.data.user
}

const createUser = async (data: CreateUserRequest) => {
  const response = await apiClient.post<ApiResponse<{ user: User }>>('/users', data)
  return response.data.data.user
}

const updateUser = async ({ id, data }: { id: number; data: UpdateUserRequest }) => {
  const response = await apiClient.put<ApiResponse<{ user: User }>>(`/users/${id}`, data)
  return response.data.data.user
}

const deleteUser = async (id: number) => {
  const response = await apiClient.delete<ApiResponse>(`/users/${id}`)
  return response.data
}

const toggleUserActive = async (id: number) => {
  const response = await apiClient.patch<ApiResponse<{ user: User }>>(`/users/${id}/toggle-active`)
  return response.data.data.user
}

const changeUserRole = async ({ id, data }: { id: number; data: ChangeRoleRequest }) => {
  const response = await apiClient.patch<ApiResponse<{ user: User }>>(`/users/${id}/role`, data)
  return response.data.data.user
}

// ==================== Query Keys ====================

export const usersKeys = {
  all: ['users'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
  list: (params?: UsersQueryParams) => [...usersKeys.lists(), params] as const,
  details: () => [...usersKeys.all, 'detail'] as const,
  detail: (id: number) => [...usersKeys.details(), id] as const,
}

// ==================== Hooks ====================

export const useUsers = (params?: UsersQueryParams) => {
  return useQuery({
    queryKey: usersKeys.list(params),
    queryFn: () => getUsers(params),
  })
}

export const useUser = (id: number) => {
  return useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: () => getUserById(id),
    enabled: !!id,
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() })
    },
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() })
      queryClient.setQueryData(usersKeys.detail(user.id), user)
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() })
    },
  })
}

export const useToggleUserActive = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleUserActive,
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() })
      queryClient.setQueryData(usersKeys.detail(user.id), user)
    },
  })
}

export const useChangeUserRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: changeUserRole,
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() })
      queryClient.setQueryData(usersKeys.detail(user.id), user)
    },
  })
}
