import { useQuery } from '@tanstack/react-query'
import { apiClient } from './client'
import type { ApiResponse, StatsResponse } from './types'

// ==================== API Functions ====================

const getStats = async () => {
  const response = await apiClient.get<ApiResponse<StatsResponse>>('/stats')
  return response.data.data
}

// ==================== Query Keys ====================

export const statsKeys = {
  all: ['stats'] as const,
  dashboard: () => [...statsKeys.all, 'dashboard'] as const,
}

// ==================== Hooks ====================

export const useStats = () => {
  return useQuery({
    queryKey: statsKeys.dashboard(),
    queryFn: getStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
