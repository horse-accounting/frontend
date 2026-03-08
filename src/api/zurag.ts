import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from './client'
import { aduuKeys } from './aduu'
import type {
  ApiResponse,
  Zurag,
  AddZuragRequest,
  UpdateZuragRequest,
} from './types'

// ==================== API Functions ====================

const getZuragnuud = async (aduuId: number) => {
  const response = await apiClient.get<ApiResponse<{ zuragnuud: Zurag[] }>>(`/aduu/${aduuId}/zurag`)
  return response.data.data.zuragnuud
}

const addZurag = async ({ aduuId, data }: { aduuId: number; data: AddZuragRequest }) => {
  const response = await apiClient.post<ApiResponse<{ zurag: Zurag }>>(`/aduu/${aduuId}/zurag`, data)
  return response.data.data.zurag
}

const updateZurag = async ({ id, data }: { id: number; data: UpdateZuragRequest }) => {
  const response = await apiClient.put<ApiResponse<{ zurag: Zurag }>>(`/zurag/${id}`, data)
  return response.data.data.zurag
}

const deleteZurag = async (id: number) => {
  const response = await apiClient.delete<ApiResponse>(`/zurag/${id}`)
  return response.data
}

// ==================== Query Keys ====================

export const zuragKeys = {
  all: ['zurag'] as const,
  lists: () => [...zuragKeys.all, 'list'] as const,
  listByAduu: (aduuId: number) => [...zuragKeys.lists(), 'aduu', aduuId] as const,
}

// ==================== Hooks ====================

export const useZuragnuud = (aduuId: number) => {
  return useQuery({
    queryKey: zuragKeys.listByAduu(aduuId),
    queryFn: () => getZuragnuud(aduuId),
    enabled: !!aduuId,
  })
}

export const useAddZurag = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addZurag,
    onSuccess: (_zurag, variables) => {
      queryClient.invalidateQueries({ queryKey: zuragKeys.listByAduu(variables.aduuId) })
      queryClient.invalidateQueries({ queryKey: aduuKeys.detail(variables.aduuId) })
    },
  })
}

export const useUpdateZurag = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateZurag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: zuragKeys.all })
    },
  })
}

export const useDeleteZurag = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteZurag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: zuragKeys.all })
      queryClient.invalidateQueries({ queryKey: aduuKeys.all })
    },
  })
}
