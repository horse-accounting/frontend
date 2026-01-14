import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from './client'
import { aduuKeys } from './aduu'
import type {
  ApiResponse,
  Amjilt,
  CreateAmjiltRequest,
  UpdateAmjiltRequest,
} from './types'

// ==================== API Functions ====================

const getAmjiltuudByAduu = async (aduuId: number) => {
  const response = await apiClient.get<ApiResponse<{ amjiltuud: Amjilt[] }>>(`/amjilt/aduu/${aduuId}`)
  return response.data.data.amjiltuud
}

const getAmjiltById = async (id: number) => {
  const response = await apiClient.get<ApiResponse<{ amjilt: Amjilt }>>(`/amjilt/${id}`)
  return response.data.data.amjilt
}

const createAmjilt = async (data: CreateAmjiltRequest) => {
  const response = await apiClient.post<ApiResponse<{ amjilt: Amjilt }>>('/amjilt', data)
  return response.data.data.amjilt
}

const updateAmjilt = async ({ id, data }: { id: number; data: UpdateAmjiltRequest }) => {
  const response = await apiClient.put<ApiResponse<{ amjilt: Amjilt }>>(`/amjilt/${id}`, data)
  return response.data.data.amjilt
}

const deleteAmjilt = async (id: number) => {
  const response = await apiClient.delete<ApiResponse>(`/amjilt/${id}`)
  return response.data
}

// ==================== Query Keys ====================

export const amjiltKeys = {
  all: ['amjilt'] as const,
  lists: () => [...amjiltKeys.all, 'list'] as const,
  listByAduu: (aduuId: number) => [...amjiltKeys.lists(), 'aduu', aduuId] as const,
  details: () => [...amjiltKeys.all, 'detail'] as const,
  detail: (id: number) => [...amjiltKeys.details(), id] as const,
}

// ==================== Hooks ====================

export const useAmjiltuudByAduu = (aduuId: number) => {
  return useQuery({
    queryKey: amjiltKeys.listByAduu(aduuId),
    queryFn: () => getAmjiltuudByAduu(aduuId),
    enabled: !!aduuId,
  })
}

export const useAmjilt = (id: number) => {
  return useQuery({
    queryKey: amjiltKeys.detail(id),
    queryFn: () => getAmjiltById(id),
    enabled: !!id,
  })
}

export const useCreateAmjilt = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createAmjilt,
    onSuccess: (amjilt) => {
      queryClient.invalidateQueries({ queryKey: amjiltKeys.listByAduu(amjilt.aduuId) })
      queryClient.invalidateQueries({ queryKey: aduuKeys.detail(amjilt.aduuId) })
    },
  })
}

export const useUpdateAmjilt = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateAmjilt,
    onSuccess: (amjilt) => {
      queryClient.invalidateQueries({ queryKey: amjiltKeys.listByAduu(amjilt.aduuId) })
      queryClient.setQueryData(amjiltKeys.detail(amjilt.id), amjilt)
    },
  })
}

export const useDeleteAmjilt = (aduuId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAmjilt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: amjiltKeys.listByAduu(aduuId) })
      queryClient.invalidateQueries({ queryKey: aduuKeys.detail(aduuId) })
    },
  })
}
