import { Navigate, useLocation } from 'react-router-dom'
import { useMe } from '../api'
import { Spin } from 'antd'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation()
  const { data: user, isLoading, isError } = useMe()

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (isError || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
