import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from './client'
import type {
  ApiResponse,
  Uulder,
  CreateUulderRequest,
  UpdateUulderRequest,
} from './types'

// ==================== API Functions ====================

const getUulders = async () => {
  const response = await apiClient.get<ApiResponse<{ uulders: Uulder[] }>>('/uulder')
  return response.data.data.uulders
}

const getUulderById = async (id: number) => {
  const response = await apiClient.get<ApiResponse<{ uulder: Uulder }>>(`/uulder/${id}`)
  return response.data.data.uulder
}

const createUulder = async (data: CreateUulderRequest) => {
  const response = await apiClient.post<ApiResponse<{ uulder: Uulder }>>('/uulder', data)
  return response.data.data.uulder
}

const updateUulder = async ({ id, data }: { id: number; data: UpdateUulderRequest }) => {
  const response = await apiClient.put<ApiResponse<{ uulder: Uulder }>>(`/uulder/${id}`, data)
  return response.data.data.uulder
}

const deleteUulder = async (id: number) => {
  const response = await apiClient.delete<ApiResponse>(`/uulder/${id}`)
  return response.data
}

// ==================== Query Keys ====================

export const uulderKeys = {
  all: ['uulder'] as const,
  lists: () => [...uulderKeys.all, 'list'] as const,
  list: () => [...uulderKeys.lists()] as const,
  details: () => [...uulderKeys.all, 'detail'] as const,
  detail: (id: number) => [...uulderKeys.details(), id] as const,
}

// ==================== Hooks ====================

export const useUulders = () => {
  return useQuery({
    queryKey: uulderKeys.list(),
    queryFn: getUulders,
  })
}

export const useUulder = (id: number) => {
  return useQuery({
    queryKey: uulderKeys.detail(id),
    queryFn: () => getUulderById(id),
    enabled: !!id,
  })
}

export const useCreateUulder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createUulder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: uulderKeys.lists() })
    },
  })
}

export const useUpdateUulder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateUulder,
    onSuccess: (uulder) => {
      queryClient.invalidateQueries({ queryKey: uulderKeys.lists() })
      queryClient.setQueryData(uulderKeys.detail(uulder.id), uulder)
    },
  })
}

export const useDeleteUulder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteUulder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: uulderKeys.lists() })
    },
  })
}
