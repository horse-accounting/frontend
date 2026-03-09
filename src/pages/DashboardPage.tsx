import { Card, Tag, Row, Col, Typography, Avatar, Spin, Button, List, Space, Progress, Table } from 'antd'
import {
  UserOutlined,
  TrophyOutlined,
  PlusOutlined,
  RightOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import { Pie } from '@ant-design/charts'
import { useNavigate } from 'react-router-dom'
import { useMe, useStats, type Huis } from '../api'
import type { UulderAngilal, BulegAngilal } from '../api/types'
import dayjs from 'dayjs'

const { Title, Text } = Typography

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
  const { data: stats, isLoading } = useStats()

  const niit = stats?.niitToo
  const totalAduu = niit?.aduu ?? 0
  const erCount = niit?.er ?? 0
  const emCount = niit?.em ?? 0

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
            <Spin spinning={isLoading}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: 12, background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
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
            <Spin spinning={isLoading}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: 12, background: 'linear-gradient(135deg, #fff7e6 0%, #ffe7ba 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                  🏷️
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 13 }}>Нийт үүлдэр</Text>
                  <Title level={2} style={{ margin: 0 }}>{niit?.uulder ?? 0}</Title>
                </div>
              </div>
            </Spin>
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card hoverable onClick={() => navigate('/buleg')} style={{ cursor: 'pointer' }}>
            <Spin spinning={isLoading}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: 12, background: 'linear-gradient(135deg, #f9f0ff 0%, #d3adf7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                  📂
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 13 }}>Нийт бүлэг</Text>
                  <Title level={2} style={{ margin: 0 }}>{niit?.buleg ?? 0}</Title>
                </div>
              </div>
            </Spin>
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card>
            <Spin spinning={isLoading}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: 12, background: 'linear-gradient(135deg, #f6ffed 0%, #b7eb8f 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                  🏇
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 13 }}>Уралдсан</Text>
                  <Title level={2} style={{ margin: 0 }}>{niit?.uraldsan ?? 0}</Title>
                </div>
              </div>
            </Spin>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* Sex Distribution */}
        <Col xs={24} lg={8}>
          <Card
            title={<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span>📊</span><span>Хүйсээр</span></div>}
            style={{ height: '100%' }}
          >
            <Spin spinning={isLoading}>
              {totalAduu === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <Text type="secondary">Мэдээлэл байхгүй</Text>
                </div>
              ) : (
                <>
                  <Pie
                    data={[
                      { type: 'Эр', value: erCount },
                      { type: 'Эм', value: emCount },
                    ]}
                    angleField="value"
                    colorField="type"
                    innerRadius={0.6}
                    height={220}
                    scale={{ color: { range: ['#1890ff', '#eb2f96'] } }}
                    legend={{ color: { position: 'bottom', layout: { justifyContent: 'center' } } }}
                    annotations={[
                      {
                        type: 'text',
                        style: {
                          text: `${totalAduu}`,
                          x: '50%',
                          y: '50%',
                          textAlign: 'center',
                          fontSize: 24,
                          fontWeight: 'bold',
                        },
                      },
                    ]}
                  />
                  {(niit?.zarlagaToo ?? 0) > 0 && (
                    <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 12, marginTop: 4 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>Зарлага: </Text>
                      <Text type="warning" strong>{niit?.zarlagaToo}</Text>
                    </div>
                  )}
                </>
              )}
            </Spin>
          </Card>
        </Col>

        {/* Recent Horses */}
        <Col xs={24} lg={8}>
          <Card
            title={<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><ClockCircleOutlined /><span>Сүүлд нэмэгдсэн</span></div>}
            extra={<Button type="link" size="small" onClick={() => navigate('/aduu')}>Бүгд <RightOutlined /></Button>}
            style={{ height: '100%' }}
          >
            <Spin spinning={isLoading}>
              <List
                dataSource={stats?.suulchiiNemegsed ?? []}
                locale={{ emptyText: 'Адуу бүртгэгдээгүй' }}
                renderItem={(item) => (
                  <List.Item
                    style={{ cursor: 'pointer', padding: '8px 0' }}
                    onClick={() => navigate(`/aduu/${item.id}`)}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar shape="square" size={40} style={{ backgroundColor: '#f0f5ff', fontSize: 20 }}>
                          🐴
                        </Avatar>
                      }
                      title={<Text strong>{item.ner}</Text>}
                      description={
                        <Space size={4}>
                          <Tag color={huisColors[item.huis]} style={{ margin: 0 }}>
                            {huisLabels[item.huis]}
                          </Tag>
                          {item.tursunOn && (
                            <Text type="secondary" style={{ fontSize: 12 }}>{item.tursunOn} он</Text>
                          )}
                          <Text type="secondary" style={{ fontSize: 11 }}>
                            {dayjs(item.createdAt).format('MM/DD')}
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

        {/* Top Achievers */}
        <Col xs={24} lg={8}>
          <Card
            title={<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><TrophyOutlined style={{ color: '#faad14' }} /><span>Шилдэг адуунууд</span></div>}
            extra={<Button type="link" size="small" onClick={() => navigate('/amjilt')}>Бүгд <RightOutlined /></Button>}
            style={{ height: '100%' }}
          >
            <Spin spinning={isLoading}>
              <List
                dataSource={stats?.topAmjilttaiAduu ?? []}
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
                            {item.amjiltToo} амжилт
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

      {/* Age Distribution */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24}>
          <Card
            title={<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span>📈</span><span>Насаар ангилал</span></div>}
          >
            <Spin spinning={isLoading}>
              {(() => {
                const nasData = stats?.nasaarAngilal ?? []
                const maxNasVal = Math.max(...nasData.flatMap(d => [d.erToo, d.emToo]), 1)
                return (
                  <Table
                    dataSource={nasData}
                    rowKey="nasZereg"
                    size="small"
                    pagination={false}
                    columns={[
                      {
                        title: 'Нас зэрэг',
                        dataIndex: 'nasZereg',
                        key: 'nasZereg',
                        render: (text: string) => <Text strong>{text}</Text>,
                      },
                      {
                        title: 'Эр',
                        dataIndex: 'erToo',
                        key: 'erToo',
                        width: 180,
                        render: (v: number) => (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ minWidth: 24 }}>{v}</span>
                            <Progress percent={Math.round((v / maxNasVal) * 100)} strokeColor="#1890ff" showInfo={false} size="small" style={{ flex: 1, margin: 0 }} />
                          </div>
                        ),
                      },
                      {
                        title: 'Эм',
                        dataIndex: 'emToo',
                        key: 'emToo',
                        width: 180,
                        render: (v: number) => (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ minWidth: 24 }}>{v}</span>
                            <Progress percent={Math.round((v / maxNasVal) * 100)} strokeColor="#eb2f96" showInfo={false} size="small" style={{ flex: 1, margin: 0 }} />
                          </div>
                        ),
                      },
                      {
                        title: 'Нийт',
                        dataIndex: 'niit',
                        key: 'niit',
                        width: 80,
                        align: 'center' as const,
                        render: (v: number) => <Tag color="blue">{v}</Tag>,
                      },
                    ]}
                  />
                )
              })()}
            </Spin>
          </Card>
        </Col>
      </Row>

      {/* Breed & Group Distribution Tables */}
      {(() => {
        const uulderData = stats?.uulderaarAngilal ?? []
        const maxUulder = Math.max(...uulderData.flatMap(d => [d.erToo, d.emToo]), 1)
        const bulegData = stats?.bulegaarAngilal ?? []
        const maxBuleg = Math.max(...bulegData.flatMap(d => [d.erToo, d.emToo]), 1)
        return (
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card
                title={<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span>🏷️</span><span>Үүлдрээр</span></div>}
              >
                <Spin spinning={isLoading}>
                  <Table
                    dataSource={uulderData}
                    rowKey="uulderNer"
                    size="small"
                    pagination={false}
                    columns={[
                      {
                        title: 'Үүлдэр',
                        dataIndex: 'uulderNer',
                        key: 'uulderNer',
                        render: (text: string, record: UulderAngilal) =>
                          record.uulderId === null ? (
                            <Text type="secondary" italic>{text}</Text>
                          ) : (
                            <Button
                              type="link"
                              size="small"
                              style={{ padding: 0 }}
                              onClick={() => navigate(`/aduu?uulderId=${record.uulderId}`)}
                            >
                              {text}
                            </Button>
                          ),
                      },
                      {
                        title: 'Эр',
                        dataIndex: 'erToo',
                        key: 'erToo',
                        width: 140,
                        render: (v: number) => (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ minWidth: 24 }}>{v}</span>
                            <Progress percent={Math.round((v / maxUulder) * 100)} strokeColor="#1890ff" showInfo={false} size="small" style={{ flex: 1, margin: 0 }} />
                          </div>
                        ),
                      },
                      {
                        title: 'Эм',
                        dataIndex: 'emToo',
                        key: 'emToo',
                        width: 140,
                        render: (v: number) => (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ minWidth: 24 }}>{v}</span>
                            <Progress percent={Math.round((v / maxUulder) * 100)} strokeColor="#eb2f96" showInfo={false} size="small" style={{ flex: 1, margin: 0 }} />
                          </div>
                        ),
                      },
                      {
                        title: 'Нийт',
                        dataIndex: 'niit',
                        key: 'niit',
                        width: 80,
                        align: 'center' as const,
                        render: (v: number) => <Tag color="blue">{v}</Tag>,
                      },
                    ]}
                  />
                </Spin>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card
                title={<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span>📂</span><span>Бүлгээр</span></div>}
              >
                <Spin spinning={isLoading}>
                  <Table
                    dataSource={bulegData}
                    rowKey="bulegNer"
                    size="small"
                    pagination={false}
                    columns={[
                      {
                        title: 'Бүлэг',
                        dataIndex: 'bulegNer',
                        key: 'bulegNer',
                        render: (text: string, record: BulegAngilal) =>
                          record.bulegId === null ? (
                            <Text type="secondary" italic>{text}</Text>
                          ) : (
                            <Button
                              type="link"
                              size="small"
                              style={{ padding: 0 }}
                              onClick={() => navigate(`/aduu?bulegId=${record.bulegId}`)}
                            >
                              {text}
                            </Button>
                          ),
                      },
                      {
                        title: 'Эр',
                        dataIndex: 'erToo',
                        key: 'erToo',
                        width: 140,
                        render: (v: number) => (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ minWidth: 24 }}>{v}</span>
                            <Progress percent={Math.round((v / maxBuleg) * 100)} strokeColor="#1890ff" showInfo={false} size="small" style={{ flex: 1, margin: 0 }} />
                          </div>
                        ),
                      },
                      {
                        title: 'Эм',
                        dataIndex: 'emToo',
                        key: 'emToo',
                        width: 140,
                        render: (v: number) => (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ minWidth: 24 }}>{v}</span>
                            <Progress percent={Math.round((v / maxBuleg) * 100)} strokeColor="#eb2f96" showInfo={false} size="small" style={{ flex: 1, margin: 0 }} />
                          </div>
                        ),
                      },
                      {
                        title: 'Нийт',
                        dataIndex: 'niit',
                        key: 'niit',
                        width: 80,
                        align: 'center' as const,
                        render: (v: number) => <Tag color="blue">{v}</Tag>,
                      },
                    ]}
                  />
                </Spin>
              </Card>
            </Col>
          </Row>
        )
      })()}
    </div>
  )
}
