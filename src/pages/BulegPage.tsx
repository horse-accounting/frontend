import { useState } from 'react'
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
import { useBulegs, useDeleteBuleg, type Buleg } from '../api'
import { AddEditBulegModal } from '../components/AddEditBulegModal'

const { Title, Text } = Typography

export function BulegPage() {
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingBuleg, setEditingBuleg] = useState<Buleg | null>(null)

  const { message } = App.useApp()

  const { data: bulegs, isLoading, refetch } = useBulegs()
  const deleteBuleg = useDeleteBuleg()

  // Filter bulegs by search
  const filteredBulegs = bulegs?.filter((b) =>
    search ? b.name.toLowerCase().includes(search.toLowerCase()) : true
  )

  const handleSearch = () => {
    setSearch(searchInput)
  }

  const handleReset = () => {
    setSearchInput('')
    setSearch('')
  }

  const handleAdd = () => {
    setEditingBuleg(null)
    setModalOpen(true)
  }

  const handleEdit = (buleg: Buleg) => {
    setEditingBuleg(buleg)
    setModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteBuleg.mutateAsync(id)
      message.success('Бүлэг амжилттай устгагдлаа')
    } catch {
      message.error('Устгахад алдаа гарлаа')
    }
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setEditingBuleg(null)
  }

  const columns: ColumnsType<Buleg> = [
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
      render: (name: string) => <Text strong>{name}</Text>,
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
            description="Энэ бүлгийг устгахдаа итгэлтэй байна уу?"
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
          <div className="page-header-icon">👥</div>
          <div>
            <Title level={4} style={{ margin: 0 }}>Бүлэг</Title>
            <Text type="secondary">
              Нийт {filteredBulegs?.length || 0} бүлэг бүртгэгдсэн
            </Text>
          </div>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={handleAdd}>
          Бүлэг нэмэх
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
          dataSource={filteredBulegs}
          rowKey="id"
          loading={isLoading}
          pagination={{
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
            style: { marginRight: 16 },
          }}
          size="middle"
          rowClassName={() => 'table-row'}
        />
      </Card>

      <AddEditBulegModal
        open={modalOpen}
        buleg={editingBuleg}
        onClose={handleModalClose}
        onSuccess={() => {
          handleModalClose()
          refetch()
        }}
      />
    </div>
  )
}
