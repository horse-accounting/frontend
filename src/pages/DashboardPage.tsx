import { Button, Typography, Card, Space, Descriptions, Tag } from 'antd'
import { LogoutOutlined, KeyOutlined } from '@ant-design/icons'
import { useNavigate, Link } from 'react-router-dom'
import { useMe, useLogout } from '../api'

const { Title } = Typography

export function DashboardPage() {
  const navigate = useNavigate()
  const { data: user, isLoading } = useMe()
  const logout = useLogout()

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: (result) => {
        navigate('/login')
        console.log(result.message)
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
              Тавтай морил, {user?.name}!
            </Title>
            <Space>
              <Link to="/change-password">
                <Button icon={<KeyOutlined />}>
                  Нууц үг солих
                </Button>
              </Link>
              <Button
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                loading={logout.isPending}
                danger
              >
                Гарах
              </Button>
            </Space>
          </div>

          {user && (
            <Card title="Хэрэглэгчийн мэдээлэл">
              <Descriptions column={1}>
                <Descriptions.Item label="Нэр">{user.name}</Descriptions.Item>
                <Descriptions.Item label="Имэйл">{user.email}</Descriptions.Item>
                <Descriptions.Item label="Эрх">
                  <Tag color={user.role === 'admin' ? 'red' : 'blue'}>
                    {user.role === 'admin' ? 'Админ' : 'Хэрэглэгч'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Имэйл баталгаажсан">
                  <Tag color={user.isEmailVerified ? 'green' : 'orange'}>
                    {user.isEmailVerified ? 'Тийм' : 'Үгүй'}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          )}
        </Space>
      </Card>
    </div>
  )
}
