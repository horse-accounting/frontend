import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Table,
  Button,
  Input,
  Space,
  Card,
  Row,
  Col,
  Popconfirm,
  Typography,
  Tooltip,
  App,
} from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useUulders, useDeleteUulder, type Uulder } from '../api'
import { AddEditUulderModal } from '../components/AddEditUulderModal'

const { Title, Text } = Typography

export function UulderPage() {
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingUulder, setEditingUulder] = useState<Uulder | null>(null)

  const { message } = App.useApp()
  const navigate = useNavigate()

  const { data: uulders, isLoading, refetch } = useUulders()
  const deleteUulder = useDeleteUulder()

  // Filter uulders by search
  const filteredUulders = uulders?.filter((u) =>
    search ? u.name.toLowerCase().includes(search.toLowerCase()) : true
  )

  const handleSearch = () => {
    setSearch(searchInput)
  }

  const handleReset = () => {
    setSearchInput('')
    setSearch('')
  }

  const handleAdd = () => {
    setEditingUulder(null)
    setModalOpen(true)
  }

  const handleEdit = (uulder: Uulder) => {
    setEditingUulder(uulder)
    setModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteUulder.mutateAsync(id)
      message.success('Үүлдэр амжилттай устгагдлаа')
    } catch {
      message.error('Устгахад алдаа гарлаа')
    }
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setEditingUulder(null)
  }

  const columns: ColumnsType<Uulder> = [
    {
      title: '#',
      key: 'index',
      width: 60,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Нэр',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <Text strong style={{ color: '#1890ff' }}>
          {name}
        </Text>
      ),
    },
    {
      title: 'Адууны тоо',
      key: 'aduuCount',
      width: 110,
      align: 'center',
      render: (_, record) => (
        <Text strong>{record.aduuToo ?? '—'}</Text>
      ),
    },
    {
      title: 'Тайлбар',
      dataIndex: 'description',
      key: 'description',
      render: (description: string) => (
        <Text>{description || <Text type="secondary">—</Text>}</Text>
      ),
    },
    {
      title: 'Бүртгэгдсэн',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: string) => (
        <Text type="secondary">
          {new Date(date).toLocaleDateString('mn-MN')}
        </Text>
      ),
    },
    {
      title: 'Үйлдэл',
      key: 'action',
      width: 100,
      align: 'center',
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
            description="Энэ үүлдрийг устгахдаа итгэлтэй байна уу?"
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

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-icon">🏷️</div>
          <div>
            <Title level={4} style={{ margin: 0 }}>Үүлдэр</Title>
            <Text type="secondary">
              Нийт {filteredUulders?.length || 0} үүлдэр бүртгэгдсэн
            </Text>
          </div>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={handleAdd}>
          Үүлдэр нэмэх
        </Button>
      </div>

      {/* Filters */}
      <Card className="filter-card" size="small">
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Input
              placeholder="Нэрээр хайх..."
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onPressEnter={handleSearch}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={16} lg={18}>
            <Space wrap>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                Хайх
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                Цэвэрлэх
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Card className="table-card" styles={{ body: { padding: 0 } }}>
        <Table
          columns={columns}
          dataSource={filteredUulders}
          rowKey="id"
          loading={isLoading}
          pagination={{
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
            style: { marginRight: 16 },
          }}
          size="middle"
          rowClassName={() => 'table-row'}
          onRow={(record) => ({
            style: { cursor: 'pointer' },
            onClick: (e) => {
              if ((e.target as HTMLElement).closest('button, .ant-popover')) return
              navigate(`/aduu?uulderId=${record.id}`)
            },
          })}
        />
      </Card>

      <AddEditUulderModal
        open={modalOpen}
        uulder={editingUulder}
        onClose={handleModalClose}
        onSuccess={() => {
          handleModalClose()
          refetch()
        }}
      />
    </div>
  )
}
