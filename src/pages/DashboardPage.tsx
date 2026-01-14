import { Card, Descriptions, Tag, Statistic, Row, Col, Typography, Avatar, Spin } from 'antd'
import { UserOutlined, TrophyOutlined } from '@ant-design/icons'
import { useMe, useAduunuud, useUulders } from '../api'

const { Title, Text } = Typography

export function DashboardPage() {
  const { data: user } = useMe()
  const { data: aduuData, isLoading: aduuLoading } = useAduunuud({ limit: 1 })
  const { data: uulders, isLoading: uulderLoading } = useUulders()

  const totalAduu = aduuData?.pagination?.total ?? 0
  const totalUulder = uulders?.length ?? 0

  return (
    <div>
      {/* Welcome Section */}
      <Card className="dashboard-welcome">
        <div className="dashboard-welcome-inner">
          <Avatar
            size={72}
            icon={<UserOutlined />}
            className="dashboard-welcome-avatar"
          />
          <div>
            <Title level={3} style={{ color: '#fff', marginBottom: 4 }}>
              Тавтай морил, {user?.name}!
            </Title>
            <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              {user?.email}
            </Text>
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={12} lg={6}>
          <Card className="dashboard-stat-card" hoverable>
            <Spin spinning={aduuLoading}>
              <Statistic
                title="Нийт адуу"
                value={totalAduu}
                prefix={
                  <span className="dashboard-stat-icon" style={{ background: '#e6f7ff' }}>
                    🐴
                  </span>
                }
              />
            </Spin>
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card className="dashboard-stat-card" hoverable>
            <Spin spinning={uulderLoading}>
              <Statistic
                title="Нийт үүлдэр"
                value={totalUulder}
                prefix={
                  <span className="dashboard-stat-icon" style={{ background: '#fff7e6' }}>
                    📋
                  </span>
                }
              />
            </Spin>
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card className="dashboard-stat-card" hoverable>
            <Statistic
              title="Нийт амжилт"
              value={0}
              prefix={
                <span className="dashboard-stat-icon" style={{ background: '#fff1f0' }}>
                  <TrophyOutlined style={{ fontSize: 20, color: '#cf1322' }} />
                </span>
              }
            />
          </Card>
        </Col>
      </Row>

      {/* User Info Card */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <UserOutlined />
            <span>Хэрэглэгчийн мэдээлэл</span>
          </div>
        }
        className="dashboard-user-card"
      >
        {user && (
          <Descriptions column={{ xs: 1, sm: 2 }} styles={{ label: { fontWeight: 500 } }}>
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
        )}
      </Card>
    </div>
  )
}
