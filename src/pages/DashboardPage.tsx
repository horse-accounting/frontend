import { Card, Descriptions, Tag, Statistic, Row, Col, Typography, Avatar } from 'antd'
import {
  UserOutlined,
  TrophyOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons'
import { useMe } from '../api'

const { Title, Text } = Typography

export function DashboardPage() {
  const { data: user } = useMe()

  return (
    <div>
      {/* Welcome Section */}
      <Card
        style={{
          marginBottom: 24,
          background: 'linear-gradient(135deg, #1a365d 0%, #2d3748 100%)',
          border: 'none',
          borderRadius: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Avatar
            size={72}
            icon={<UserOutlined />}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: '3px solid rgba(255, 255, 255, 0.3)',
            }}
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
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{ borderRadius: 12 }}
            hoverable
          >
            <Statistic
              title="Нийт адуу"
              value={0}
              prefix={
                <span
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    background: '#e6f7ff',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 8,
                  }}
                >
                  🐴
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{ borderRadius: 12 }}
            hoverable
          >
            <Statistic
              title="Нийт үүлдэр"
              value={0}
              prefix={
                <span
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    background: '#fff7e6',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 8,
                  }}
                >
                  📋
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{ borderRadius: 12 }}
            hoverable
          >
            <Statistic
              title="Нийт амжилт"
              value={0}
              prefix={
                <span
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    background: '#fff1f0',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 8,
                  }}
                >
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
        style={{ marginTop: 24, borderRadius: 12 }}
      >
        {user && (
          <Descriptions column={{ xs: 1, sm: 2 }} labelStyle={{ fontWeight: 500 }}>
            <Descriptions.Item
              label={
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <UserOutlined /> Нэр
                </span>
              }
            >
              {user.name}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MailOutlined /> Имэйл
                </span>
              }
            >
              {user.email}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <SafetyCertificateOutlined /> Эрх
                </span>
              }
            >
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
