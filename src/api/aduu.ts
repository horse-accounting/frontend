import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from './client'
import type {
  ApiResponse,
  PaginatedResponse,
  Aduu,
  AduuQueryParams,
  CreateAduuRequest,
  UpdateAduuRequest,
  FamilyTreeParams,
  FamilyTreeResponse,
} from './types'

// ==================== API Functions ====================

const getAduunuud = async (params?: AduuQueryParams) => {
  const response = await apiClient.get<ApiResponse<PaginatedResponse<Aduu>>>('/aduu', { params })
  return response.data.data
}

const getAduuById = async (id: number) => {
  const response = await apiClient.get<ApiResponse<{ aduu: Aduu }>>(`/aduu/${id}`)
  return response.data.data.aduu
}

const getFamilyTree = async (id: number, params?: FamilyTreeParams) => {
  const response = await apiClient.get<ApiResponse<FamilyTreeResponse>>(`/aduu/${id}/family-tree`, { params })
  return response.data.data
}

const createAduu = async (data: CreateAduuRequest) => {
  const response = await apiClient.post<ApiResponse<{ aduu: Aduu }>>('/aduu', data)
  return response.data.data.aduu
}

const updateAduu = async ({ id, data }: { id: number; data: UpdateAduuRequest }) => {
  const response = await apiClient.put<ApiResponse<{ aduu: Aduu }>>(`/aduu/${id}`, data)
  return response.data.data.aduu
}

const deleteAduu = async (id: number) => {
  const response = await apiClient.delete<ApiResponse>(`/aduu/${id}`)
  return response.data
}

// ==================== Query Keys ====================

export const aduuKeys = {
  all: ['aduu'] as const,
  lists: () => [...aduuKeys.all, 'list'] as const,
  list: (params?: AduuQueryParams) => [...aduuKeys.lists(), params] as const,
  details: () => [...aduuKeys.all, 'detail'] as const,
  detail: (id: number) => [...aduuKeys.details(), id] as const,
  familyTrees: () => [...aduuKeys.all, 'family-tree'] as const,
  familyTree: (id: number, params?: FamilyTreeParams) => [...aduuKeys.familyTrees(), id, params] as const,
}

// ==================== Hooks ====================

export const useAduunuud = (params?: AduuQueryParams) => {
  return useQuery({
    queryKey: aduuKeys.list(params),
    queryFn: () => getAduunuud(params),
  })
}

export const useAduu = (id: number) => {
  return useQuery({
    queryKey: aduuKeys.detail(id),
    queryFn: () => getAduuById(id),
    enabled: !!id,
  })
}

export const useFamilyTree = (id: number, params?: FamilyTreeParams) => {
  return useQuery({
    queryKey: aduuKeys.familyTree(id, params),
    queryFn: () => getFamilyTree(id, params),
    enabled: !!id,
  })
}

export const useCreateAduu = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createAduu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aduuKeys.lists() })
    },
  })
}

export const useUpdateAduu = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateAduu,
    onSuccess: (aduu) => {
      queryClient.invalidateQueries({ queryKey: aduuKeys.lists() })
      queryClient.setQueryData(aduuKeys.detail(aduu.id), aduu)
      queryClient.invalidateQueries({ queryKey: aduuKeys.familyTrees() })
    },
  })
}

export const useDeleteAduu = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAduu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aduuKeys.lists() })
      queryClient.invalidateQueries({ queryKey: aduuKeys.familyTrees() })
    },
  })
}
