import { Navigate, useLocation } from 'react-router-dom'
import { useMe } from '../api'
import { useAccessToken } from '../stores'
import { Spin } from 'antd'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation()
  const accessToken = useAccessToken()
  const { data: user, isLoading, isError } = useMe()

  // No token in store - redirect to login immediately
  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Token exists but still loading user data
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    )
  }

  // Token invalid or user fetch failed
  if (isError || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
