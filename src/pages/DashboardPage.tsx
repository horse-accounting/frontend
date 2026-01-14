import { Button, Typography, Card, Space } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useMe, useLogout } from '../api'

const { Title, Text } = Typography

export function DashboardPage() {
  const navigate = useNavigate()
  const { data: user, isLoading } = useMe()
  const logout = useLogout()

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        navigate('/login')
      },
    })
  }

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <Card>Уншиж байна...</Card>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <Card className="dashboard-card">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={2} style={{ margin: 0 }}>
              Тавтай морил!
            </Title>
            <Button
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              loading={logout.isPending}
            >
              Гарах
            </Button>
          </div>

          {user && (
            <Card>
              <Space direction="vertical">
                <Text strong>Нэр: </Text>
                <Text>{user.name}</Text>
                <Text strong>Имэйл: </Text>
                <Text>{user.email}</Text>
                <Text strong>Эрх: </Text>
                <Text>{user.role === 'admin' ? 'Админ' : 'Хэрэглэгч'}</Text>
              </Space>
            </Card>
          )}
        </Space>
      </Card>
    </div>
  )
}
