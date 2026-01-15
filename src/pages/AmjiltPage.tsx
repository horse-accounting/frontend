import { useState } from 'react'
import {
  Table,
  Button,
  Select,
  Space,
  Card,
  Row,
  Col,
  Popconfirm,
  Typography,
  Tooltip,
  App,
  Empty,
  Tag,
  Avatar,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TrophyOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  UserOutlined,
  CrownOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useAduunuud, useAmjiltuudByAduu, useDeleteAmjilt, type Amjilt } from '../api'
import { AddEditAmjiltModal } from '../components/AddEditAmjiltModal'

const { Title, Text, Paragraph } = Typography

// Medal configuration based on place
const getMedalConfig = (bair: string) => {
  if (bair.includes('1') || bair.toLowerCase().includes('түрүү')) {
    return { color: '#ffd700', bgColor: '#fffbe6', borderColor: '#ffe58f', icon: '🥇', label: '1-р байр' }
  }
  if (bair.includes('2') || bair.toLowerCase().includes('айраг')) {
    return { color: '#c0c0c0', bgColor: '#f5f5f5', borderColor: '#d9d9d9', icon: '🥈', label: '2-р байр' }
  }
  if (bair.includes('3')) {
    return { color: '#cd7f32', bgColor: '#fff7e6', borderColor: '#ffd591', icon: '🥉', label: '3-р байр' }
  }
  return { color: '#1890ff', bgColor: '#e6f7ff', borderColor: '#91d5ff', icon: '🏅', label: bair }
}

export function AmjiltPage() {
  const [selectedAduuId, setSelectedAduuId] = useState<number | undefined>()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingAmjilt, setEditingAmjilt] = useState<Amjilt | null>(null)

  const { message } = App.useApp()

  const { data: aduunuudData, isLoading: aduunuudLoading } = useAduunuud({ limit: 100 })
  const { data: amjiltuud, isLoading: amjiltuudLoading, refetch } = useAmjiltuudByAduu(selectedAduuId || 0)
  const deleteAmjilt = useDeleteAmjilt(selectedAduuId || 0)

  const aduunuud = aduunuudData?.aduunuud || []

  const handleAdd = () => {
    if (!selectedAduuId) {
      message.warning('Эхлээд адуу сонгоно уу')
      return
    }
    setEditingAmjilt(null)
    setModalOpen(true)
  }

  const handleEdit = (amjilt: Amjilt) => {
    setEditingAmjilt(amjilt)
    setModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteAmjilt.mutateAsync(id)
      message.success('Амжилт амжилттай устгагдлаа')
    } catch {
      message.error('Устгахад алдаа гарлаа')
    }
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setEditingAmjilt(null)
  }

  const columns: ColumnsType<Amjilt> = [
    {
      title: 'Тэмцээн & Байр',
      key: 'competition',
      render: (_, record) => {
        const medal = getMedalConfig(record.ezelsenBair)
        return (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: medal.bgColor,
                border: `2px solid ${medal.borderColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                flexShrink: 0,
              }}
            >
              {medal.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Text strong style={{ display: 'block', marginBottom: 4 }}>
                {record.temtseen}
              </Text>
              <Space size={8} wrap>
                <Tag
                  color={medal.color === '#ffd700' ? 'gold' : medal.color === '#c0c0c0' ? 'default' : medal.color === '#cd7f32' ? 'orange' : 'blue'}
                  style={{ margin: 0, borderRadius: 12 }}
                >
                  <CrownOutlined style={{ marginRight: 4 }} />
                  {record.ezelsenBair}
                </Tag>
                {record.uraldsanOgnoo && (
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    <CalendarOutlined style={{ marginRight: 4 }} />
                    {new Date(record.uraldsanOgnoo).toLocaleDateString('mn-MN')}
                  </Text>
                )}
              </Space>
            </div>
          </div>
        )
      },
    },
    {
      title: 'Дэлгэрэнгүй',
      key: 'details',
      width: 280,
      responsive: ['md'],
      render: (_, record) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {record.unaach && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar size={20} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
              <Text style={{ fontSize: 13 }}>{record.unaach}</Text>
            </div>
          )}
          {record.gazarBairshil && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar size={20} icon={<EnvironmentOutlined />} style={{ backgroundColor: '#52c41a' }} />
              <Text style={{ fontSize: 13 }}>{record.gazarBairshil}</Text>
            </div>
          )}
          {!record.unaach && !record.gazarBairshil && (
            <Text type="secondary" style={{ fontSize: 13 }}>—</Text>
          )}
        </div>
      ),
    },
    {
      title: 'Тайлбар',
      dataIndex: 'tailbar',
      key: 'tailbar',
      width: 200,
      responsive: ['lg'],
      render: (tailbar: string) => (
        tailbar ? (
          <Paragraph
            ellipsis={{ rows: 2, tooltip: tailbar }}
            style={{ margin: 0, fontSize: 13 }}
          >
            {tailbar}
          </Paragraph>
        ) : (
          <Text type="secondary">—</Text>
        )
      ),
    },
    {
      title: '',
      key: 'action',
      width: 80,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Space size={0}>
          <Tooltip title="Засах">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
          <Popconfirm
            title="Устгах уу?"
            description="Энэ амжилтыг устгахдаа итгэлтэй байна уу?"
            onConfirm={() => handleDelete(record.id)}
            okText="Тийм"
            cancelText="Үгүй"
            placement="topRight"
          >
            <Tooltip title="Устгах">
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const selectedAduu = aduunuud.find(a => a.id === selectedAduuId)

  // Statistics
  const stats = amjiltuud ? {
    total: amjiltuud.length,
    gold: amjiltuud.filter(a => a.ezelsenBair.includes('1') || a.ezelsenBair.toLowerCase().includes('түрүү')).length,
    silver: amjiltuud.filter(a => a.ezelsenBair.includes('2') || a.ezelsenBair.toLowerCase().includes('айраг')).length,
    bronze: amjiltuud.filter(a => a.ezelsenBair.includes('3')).length,
  } : null

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-icon">🏆</div>
          <div>
            <Title level={4} style={{ margin: 0 }}>Амжилтууд</Title>
            <Text type="secondary">
              Адууны тэмцээний амжилтуудыг удирдах
            </Text>
          </div>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={handleAdd}
          disabled={!selectedAduuId}
        >
          Амжилт нэмэх
        </Button>
      </div>

      {/* Horse Selection */}
      <Card className="filter-card" size="small">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={16} md={10} lg={8}>
            <Select
              placeholder="Адуу сонгох..."
              allowClear
              showSearch
              optionFilterProp="label"
              style={{ width: '100%' }}
              size="large"
              loading={aduunuudLoading}
              value={selectedAduuId}
              onChange={setSelectedAduuId}
              options={aduunuud.map((aduu) => ({
                value: aduu.id,
                label: `${aduu.ner} (${aduu.huis === 'azarga' ? 'Азарга' : aduu.huis === 'guu' ? 'Гүү' : 'Морь'})`,
              }))}
            />
          </Col>
          {stats && stats.total > 0 && (
            <Col xs={24} sm={24} md={14} lg={16}>
              <Space size={16} wrap>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <TrophyOutlined style={{ color: '#faad14', fontSize: 18 }} />
                  <Text strong>{stats.total}</Text>
                  <Text type="secondary">нийт</Text>
                </div>
                {stats.gold > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span>🥇</span>
                    <Text strong style={{ color: '#d4a00a' }}>{stats.gold}</Text>
                  </div>
                )}
                {stats.silver > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span>🥈</span>
                    <Text strong style={{ color: '#8c8c8c' }}>{stats.silver}</Text>
                  </div>
                )}
                {stats.bronze > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span>🥉</span>
                    <Text strong style={{ color: '#cd7f32' }}>{stats.bronze}</Text>
                  </div>
                )}
              </Space>
            </Col>
          )}
        </Row>
      </Card>

      {/* Table */}
      <Card className="table-card" styles={{ body: { padding: 0 } }}>
        {!selectedAduuId ? (
          <div style={{ padding: '64px 24px', textAlign: 'center' }}>
            <TrophyOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
            <Title level={5} type="secondary" style={{ margin: 0, marginBottom: 8 }}>
              Адуу сонгоно уу
            </Title>
            <Text type="secondary">
              Амжилтуудыг харахын тулд дээрх жагсаалтаас адуугаа сонгоно уу
            </Text>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={amjiltuud}
            rowKey="id"
            loading={amjiltuudLoading}
            pagination={
              amjiltuud && amjiltuud.length > 10
                ? {
                    showSizeChanger: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
                    style: { marginRight: 16 },
                  }
                : false
            }
            scroll={{ x: 600 }}
            size="middle"
            rowClassName={() => 'table-row'}
            locale={{
              emptyText: (
                <div style={{ padding: '32px 0' }}>
                  <TrophyOutlined style={{ fontSize: 40, color: '#d9d9d9', marginBottom: 12 }} />
                  <div>
                    <Text type="secondary">Амжилт бүртгэгдээгүй байна</Text>
                  </div>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    style={{ marginTop: 16 }}
                    onClick={handleAdd}
                  >
                    Анхны амжилт нэмэх
                  </Button>
                </div>
              ),
            }}
          />
        )}
      </Card>

      {selectedAduuId && (
        <AddEditAmjiltModal
          open={modalOpen}
          amjilt={editingAmjilt}
          aduuId={selectedAduuId}
          onClose={handleModalClose}
          onSuccess={() => {
            handleModalClose()
            refetch()
          }}
        />
      )}
    </div>
  )
}
