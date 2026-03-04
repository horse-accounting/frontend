import { Card, Tag, Row, Col, Typography, Avatar, Spin, Button, List, Space, Progress } from 'antd'
import {
  UserOutlined,
  TrophyOutlined,
  PlusOutlined,
  RightOutlined,
  ClockCircleOutlined,
  ManOutlined,
  WomanOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useMe, useAduunuud, useUulders, type Huis } from '../api'

const { Title, Text } = Typography

// Get greeting based on time
const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Өглөөний мэнд'
  if (hour < 18) return 'Өдрийн мэнд'
  return 'Оройн мэнд'
}

const huisLabels: Record<Huis, string> = {
  er: 'Эр',
  em: 'Эм',
}

const huisColors: Record<Huis, string> = {
  er: 'blue',
  em: 'magenta',
}

export function DashboardPage() {
  const navigate = useNavigate()
  const { data: user } = useMe()
  const { data: aduuData, isLoading: aduuLoading } = useAduunuud({ limit: 100 })
  const { data: uulders, isLoading: uulderLoading } = useUulders()

  const aduunuud = aduuData?.aduunuud ?? []
  const totalAduu = aduuData?.pagination?.total ?? 0
  const totalUulder = uulders?.length ?? 0
  const totalAmjilt = aduunuud.reduce((sum, aduu) => sum + (aduu.amjiltuud?.length ?? 0), 0)

  // Statistics by huis
  const erCount = aduunuud.filter(a => a.huis === 'er').length
  const emCount = aduunuud.filter(a => a.huis === 'em').length

  // Recent horses (last 5)
  const recentHorses = [...aduunuud]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  // Horses with achievements
  const horsesWithAchievements = aduunuud
    .filter(a => a.amjiltuud && a.amjiltuud.length > 0)
    .sort((a, b) => (b.amjiltuud?.length ?? 0) - (a.amjiltuud?.length ?? 0))
    .slice(0, 5)

  return (
    <div className="page-container">
      {/* Welcome Section */}
      <Card className="dashboard-welcome" style={{ marginBottom: 24 }}>
        <Row gutter={[24, 24]} align="middle" justify="space-between">
          <Col xs={24} md={16}>
            <div className="dashboard-welcome-inner">
              <Avatar
                size={72}
                icon={<UserOutlined />}
                className="dashboard-welcome-avatar"
              />
              <div>
                <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 14 }}>
                  {getGreeting()}
                </Text>
                <Title level={3} style={{ color: '#fff', margin: '4px 0' }}>
                  {user?.name}
                </Title>
                <Space size={8}>
                  <Tag color={user?.role === 'admin' ? 'red' : 'blue'}>
                    {user?.role === 'admin' ? 'Админ' : 'Хэрэглэгч'}
                  </Tag>
                  <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 13 }}>
                    {user?.email}
                  </Text>
                </Space>
              </div>
            </div>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: 'right' }}>
            <Space wrap>
              <Button
                type="primary"
                ghost
                icon={<PlusOutlined />}
                onClick={() => navigate('/aduu')}
                style={{ borderColor: 'rgba(255,255,255,0.5)', color: '#fff' }}
              >
                Адуу нэмэх
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Main Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={12} lg={6}>
          <Card hoverable onClick={() => navigate('/aduu')} style={{ cursor: 'pointer' }}>
            <Spin spinning={aduuLoading}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                  }}
                >
                  🐴
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 13 }}>Нийт адуу</Text>
                  <Title level={2} style={{ margin: 0 }}>{totalAduu}</Title>
                </div>
              </div>
            </Spin>
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card hoverable onClick={() => navigate('/uulder')} style={{ cursor: 'pointer' }}>
            <Spin spinning={uulderLoading}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #fff7e6 0%, #ffe7ba 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                  }}
                >
                  🏷️
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 13 }}>Нийт үүлдэр</Text>
                  <Title level={2} style={{ margin: 0 }}>{totalUulder}</Title>
                </div>
              </div>
            </Spin>
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card hoverable onClick={() => navigate('/amjilt')} style={{ cursor: 'pointer' }}>
            <Spin spinning={aduuLoading}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #fffbe6 0%, #ffe58f 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                  }}
                >
                  🏆
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 13 }}>Нийт амжилт</Text>
                  <Title level={2} style={{ margin: 0 }}>{totalAmjilt}</Title>
                </div>
              </div>
            </Spin>
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card>
            <Spin spinning={aduuLoading}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #f6ffed 0%, #b7eb8f 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                  }}
                >
                  🏇
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 13 }}>Уралдсан</Text>
                  <Title level={2} style={{ margin: 0 }}>
                    {aduunuud.filter(a => a.uraldsan).length}
                  </Title>
                </div>
              </div>
            </Spin>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Horse Distribution */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>📊</span>
                <span>Хүйсээр</span>
              </div>
            }
            style={{ height: '100%' }}
          >
            <Spin spinning={aduuLoading}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Space>
                      <ManOutlined style={{ color: '#1890ff' }} />
                      <Text>Эр</Text>
                    </Space>
                    <Text strong>{erCount}</Text>
                  </div>
                  <Progress
                    percent={totalAduu ? Math.round((erCount / totalAduu) * 100) : 0}
                    strokeColor="#1890ff"
                    showInfo={false}
                  />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Space>
                      <WomanOutlined style={{ color: '#eb2f96' }} />
                      <Text>Эм</Text>
                    </Space>
                    <Text strong>{emCount}</Text>
                  </div>
                  <Progress
                    percent={totalAduu ? Math.round((emCount / totalAduu) * 100) : 0}
                    strokeColor="#eb2f96"
                    showInfo={false}
                  />
                </div>
              </div>
            </Spin>
          </Card>
        </Col>

        {/* Recent Horses */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ClockCircleOutlined />
                <span>Сүүлд нэмэгдсэн</span>
              </div>
            }
            extra={
              <Button type="link" size="small" onClick={() => navigate('/aduu')}>
                Бүгд <RightOutlined />
              </Button>
            }
            style={{ height: '100%' }}
          >
            <Spin spinning={aduuLoading}>
              <List
                dataSource={recentHorses}
                locale={{ emptyText: 'Адуу бүртгэгдээгүй' }}
                renderItem={(item) => (
                  <List.Item
                    style={{ cursor: 'pointer', padding: '8px 0' }}
                    onClick={() => navigate(`/aduu/${item.id}`)}
                  >
                    <List.Item.Meta
                      avatar={
                        item.zurag?.[0] ? (
                          <Avatar src={item.zurag[0]} shape="square" size={40} />
                        ) : (
                          <Avatar
                            shape="square"
                            size={40}
                            style={{ backgroundColor: '#f0f5ff', fontSize: 20 }}
                          >
                            🐴
                          </Avatar>
                        )
                      }
                      title={<Text strong>{item.ner}</Text>}
                      description={
                        <Space size={4}>
                          <Tag color={huisColors[item.huis]} style={{ margin: 0 }}>
                            {huisLabels[item.huis]}
                          </Tag>
                          {item.tursunOn && (
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {item.tursunOn} он
                            </Text>
                          )}
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Spin>
          </Card>
        </Col>

        {/* Top Achievers */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <TrophyOutlined style={{ color: '#faad14' }} />
                <span>Шилдэг адуунууд</span>
              </div>
            }
            extra={
              <Button type="link" size="small" onClick={() => navigate('/amjilt')}>
                Бүгд <RightOutlined />
              </Button>
            }
            style={{ height: '100%' }}
          >
            <Spin spinning={aduuLoading}>
              <List
                dataSource={horsesWithAchievements}
                locale={{ emptyText: 'Амжилт бүртгэгдээгүй' }}
                renderItem={(item, index) => (
                  <List.Item
                    style={{ cursor: 'pointer', padding: '8px 0' }}
                    onClick={() => navigate(`/aduu/${item.id}`)}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          style={{
                            backgroundColor: index === 0 ? '#fffbe6' : index === 1 ? '#f5f5f5' : index === 2 ? '#fff7e6' : '#f0f5ff',
                            color: index === 0 ? '#d4a00a' : index === 1 ? '#8c8c8c' : index === 2 ? '#cd7f32' : '#1890ff',
                            fontWeight: 'bold',
                          }}
                        >
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                        </Avatar>
                      }
                      title={<Text strong>{item.ner}</Text>}
                      description={
                        <Space size={4}>
                          <TrophyOutlined style={{ color: '#faad14', fontSize: 12 }} />
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {item.amjiltuud?.length} амжилт
                          </Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Spin>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
