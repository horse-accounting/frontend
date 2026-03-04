import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from './client'
import type {
  ApiResponse,
  Buleg,
  CreateBulegRequest,
  UpdateBulegRequest,
} from './types'

// ==================== API Functions ====================

const getBulegs = async () => {
  const response = await apiClient.get<ApiResponse<{ bulegs: Buleg[] }>>('/buleg')
  return response.data.data.bulegs
}

const getBulegById = async (id: number) => {
  const response = await apiClient.get<ApiResponse<{ buleg: Buleg }>>(`/buleg/${id}`)
  return response.data.data.buleg
}

const createBuleg = async (data: CreateBulegRequest) => {
  const response = await apiClient.post<ApiResponse<{ buleg: Buleg }>>('/buleg', data)
  return response.data.data.buleg
}

const updateBuleg = async ({ id, data }: { id: number; data: UpdateBulegRequest }) => {
  const response = await apiClient.put<ApiResponse<{ buleg: Buleg }>>(`/buleg/${id}`, data)
  return response.data.data.buleg
}

const deleteBuleg = async (id: number) => {
  const response = await apiClient.delete<ApiResponse>(`/buleg/${id}`)
  return response.data
}

// ==================== Query Keys ====================

export const bulegKeys = {
  all: ['buleg'] as const,
  lists: () => [...bulegKeys.all, 'list'] as const,
  list: () => [...bulegKeys.lists()] as const,
  details: () => [...bulegKeys.all, 'detail'] as const,
  detail: (id: number) => [...bulegKeys.details(), id] as const,
}

// ==================== Hooks ====================

export const useBulegs = () => {
  return useQuery({
    queryKey: bulegKeys.list(),
    queryFn: getBulegs,
  })
}

export const useBuleg = (id: number) => {
  return useQuery({
    queryKey: bulegKeys.detail(id),
    queryFn: () => getBulegById(id),
    enabled: !!id,
  })
}

export const useCreateBuleg = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createBuleg,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bulegKeys.lists() })
    },
  })
}

export const useUpdateBuleg = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateBuleg,
    onSuccess: (buleg) => {
      queryClient.invalidateQueries({ queryKey: bulegKeys.lists() })
      queryClient.setQueryData(bulegKeys.detail(buleg.id), buleg)
    },
  })
}

export const useDeleteBuleg = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteBuleg,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bulegKeys.lists() })
    },
  })
}
