import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Table,
  Button,
  Input,
  Select,
  InputNumber,
  Space,
  Tag,
  Card,
  Row,
  Col,
  Popconfirm,
  Image,
  Typography,
  Tooltip,
  Avatar,
  App,
} from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  EyeOutlined,
  FileExcelOutlined,
} from '@ant-design/icons'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { useAduunuud, useUulders, useBulegs, useDeleteAduu, useExportAduuExcel, type Aduu, type Huis } from '../api'
import { AddEditAduuModal } from '../components/AddEditAduuModal'

const { Title, Text } = Typography

const huisOptions: { value: Huis; label: string }[] = [
  { value: 'er', label: 'Эр' },
  { value: 'em', label: 'Эм' },
]

const huisLabels: Record<Huis, string> = {
  er: 'Эр',
  em: 'Эм',
}

const huisColors: Record<Huis, string> = {
  er: 'blue',
  em: 'magenta',
}

export function AduunuudPage() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [huis, setHuis] = useState<Huis | undefined>()
  const [uulderId, setUulderId] = useState<number | undefined>()
  const [bulegId, setBulegId] = useState<number | undefined>()
  const [uraldsan, setUraldsan] = useState<boolean | undefined>()
  const [tursunOnMin, setTursunOnMin] = useState<number | undefined>()
  const [tursunOnMax, setTursunOnMax] = useState<number | undefined>()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingAduu, setEditingAduu] = useState<Aduu | null>(null)

  const navigate = useNavigate()
  const { message } = App.useApp()

  const { data, isLoading, refetch } = useAduunuud({
    page,
    limit,
    search: search || undefined,
    huis,
    uulderId,
    bulegId,
    uraldsan,
    tursunOnMin,
    tursunOnMax,
  })

  const { data: uulders } = useUulders()
  const { data: bulegs } = useBulegs()
  const deleteAduu = useDeleteAduu()
  const exportExcel = useExportAduuExcel()

  const handleSearch = () => {
    setSearch(searchInput)
    setPage(1)
  }

  const handleReset = () => {
    setSearchInput('')
    setSearch('')
    setHuis(undefined)
    setUulderId(undefined)
    setBulegId(undefined)
    setUraldsan(undefined)
    setTursunOnMin(undefined)
    setTursunOnMax(undefined)
    setPage(1)
  }

  const handleExportExcel = () => {
    exportExcel.mutate(
      { search: search || undefined, huis, uulderId, bulegId, uraldsan, tursunOnMin, tursunOnMax },
      {
        onSuccess: (blob) => {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = 'aduunuud.xlsx'
          a.click()
          URL.revokeObjectURL(url)
        },
        onError: () => {
          message.error('Excel татахад алдаа гарлаа')
        },
      },
    )
  }

  const handleAdd = () => {
    setEditingAduu(null)
    setModalOpen(true)
  }

  const handleEdit = (aduu: Aduu) => {
    setEditingAduu(aduu)
    setModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteAduu.mutateAsync(id)
      message.success('Адуу амжилттай устгагдлаа')
    } catch {
      message.error('Устгахад алдаа гарлаа')
    }
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setEditingAduu(null)
  }

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPage(pagination.current || 1)
    setLimit(pagination.pageSize || 10)
  }

  const columns: ColumnsType<Aduu> = [
    {
      title: 'Адуу',
      key: 'aduu',
      width: 220,
      fixed: 'left',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {record.zurag && record.zurag.length > 0 ? (
            <Image
              src={record.zurag[0]}
              width={48}
              height={48}
              style={{ objectFit: 'cover', borderRadius: 8 }}
              preview={{ cover: <EyeOutlined /> }}
              fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHJ4PSI4IiBmaWxsPSIjZjBmNWZmIi8+PHRleHQgeD0iNTAlIiB5PSI1NSUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMjQiPvCfkLQ8L3RleHQ+PC9zdmc+"
            />
          ) : (
            <Avatar
              size={48}
              style={{
                backgroundColor: '#f0f5ff',
                color: '#1890ff',
                fontSize: 24,
                borderRadius: 8,
              }}
            >
              🐴
            </Avatar>
          )}
          <div>
            <Text strong style={{ display: 'block' }}>{record.ner}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.zus || ''}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Хүйс',
      dataIndex: 'huis',
      key: 'huis',
      width: 80,
      align: 'center',
      render: (huis: Huis) => (
        <Tag
          color={huisColors[huis]}
          style={{ borderRadius: 12, padding: '2px 12px' }}
        >
          {huisLabels[huis]}
        </Tag>
      ),
    },
    {
      title: 'Үүлдэр',
      key: 'uulder',
      width: 120,
      render: (_, record) => (
        <Text>{record.uulder?.name || <Text type="secondary">—</Text>}</Text>
      ),
    },
    {
      title: 'Бүлэг',
      key: 'buleg',
      width: 120,
      render: (_, record) => (
        <Text>{record.buleg?.name || <Text type="secondary">—</Text>}</Text>
      ),
    },
    {
      title: 'Төрсөн он',
      dataIndex: 'tursunOn',
      key: 'tursunOn',
      width: 100,
      align: 'center',
      render: (tursunOn: number) => (
        <Text>{tursunOn || <Text type="secondary">—</Text>}</Text>
      ),
    },
    {
      title: 'Төрсөн газар',
      dataIndex: 'tursunGazar',
      key: 'tursunGazar',
      width: 130,
      render: (tursunGazar: string) => (
        <Text>{tursunGazar || <Text type="secondary">—</Text>}</Text>
      ),
    },
    {
      title: 'Микрочип',
      dataIndex: 'microchip',
      key: 'microchip',
      width: 130,
      render: (microchip: string) => (
        <Text style={{ fontSize: 12 }}>{microchip || <Text type="secondary">—</Text>}</Text>
      ),
    },
    {
      title: 'DNA код',
      dataIndex: 'dnaCode',
      key: 'dnaCode',
      width: 120,
      render: (dnaCode: string) => (
        <Text style={{ fontSize: 12 }}>{dnaCode || <Text type="secondary">—</Text>}</Text>
      ),
    },
    {
      title: 'Уралдсан',
      dataIndex: 'uraldsan',
      key: 'uraldsan',
      width: 90,
      align: 'center',
      render: (uraldsan: boolean) => (
        <Tag
          color={uraldsan ? 'success' : 'default'}
          style={{ borderRadius: 12 }}
        >
          {uraldsan ? 'Тийм' : 'Үгүй'}
        </Tag>
      ),
    },
    {
      title: 'Эцэг / Эх',
      key: 'parents',
      width: 180,
      render: (_, record) => (
        <div style={{ fontSize: 12 }}>
          {record.father ? (
            <div>
              <Text type="secondary">Эцэг: </Text>
              <Text>{record.father.ner}</Text>
            </div>
          ) : null}
          {record.mother ? (
            <div>
              <Text type="secondary">Эх: </Text>
              <Text>{record.mother.ner}</Text>
            </div>
          ) : null}
          {!record.father && !record.mother && (
            <Text type="secondary">—</Text>
          )}
        </div>
      ),
    },
    {
      title: 'Үйлдэл',
      key: 'action',
      width: 120,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Space size={0}>
          <Tooltip title="Дэлгэрэнгүй">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/aduu/${record.id}`)}
              style={{ color: '#52c41a' }}
            />
          </Tooltip>
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
            description="Энэ адууг устгахдаа итгэлтэй байна уу?"
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
          <div className="page-header-icon">🐴</div>
          <div>
            <Title level={4} style={{ margin: 0 }}>Адуунууд</Title>
            <Text type="secondary">
              Нийт {data?.pagination?.total || 0} адуу бүртгэгдсэн
            </Text>
          </div>
        </div>
        <Space>
          <Button
            icon={<FileExcelOutlined />}
            size="large"
            onClick={handleExportExcel}
            loading={exportExcel.isPending}
          >
            Excel татах
          </Button>
          <Button type="primary" icon={<PlusOutlined />} size="large" onClick={handleAdd}>
            Адуу нэмэх
          </Button>
        </Space>
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
          <Col xs={12} sm={6} md={4} lg={3}>
            <Select
              placeholder="Хүйс"
              allowClear
              style={{ width: '100%' }}
              options={huisOptions}
              value={huis}
              onChange={setHuis}
            />
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <Select
              placeholder="Үүлдэр"
              allowClear
              style={{ width: '100%' }}
              options={uulders?.map((u) => ({ value: u.id, label: u.name }))}
              value={uulderId}
              onChange={setUulderId}
            />
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <Select
              placeholder="Бүлэг"
              allowClear
              style={{ width: '100%' }}
              options={bulegs?.map((b) => ({ value: b.id, label: b.name }))}
              value={bulegId}
              onChange={setBulegId}
            />
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <Select
              placeholder="Уралдсан"
              allowClear
              style={{ width: '100%' }}
              options={[
                { value: true, label: 'Тийм' },
                { value: false, label: 'Үгүй' },
              ]}
              value={uraldsan}
              onChange={setUraldsan}
            />
          </Col>
        </Row>
        <Row gutter={[12, 12]} align="middle" style={{ marginTop: 12 }}>
          <Col xs={12} sm={6} md={4} lg={3}>
            <InputNumber
              placeholder="Он-оос"
              style={{ width: '100%' }}
              min={1900}
              max={new Date().getFullYear()}
              value={tursunOnMin}
              onChange={(v) => setTursunOnMin(v ?? undefined)}
            />
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <InputNumber
              placeholder="Он хүртэл"
              style={{ width: '100%' }}
              min={1900}
              max={new Date().getFullYear()}
              value={tursunOnMax}
              onChange={(v) => setTursunOnMax(v ?? undefined)}
            />
          </Col>
          <Col xs={24} sm={12} md={16} lg={18}>
            <Space wrap style={{ width: '100%', justifyContent: 'flex-start' }}>
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
          dataSource={data?.aduunuud}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: page,
            pageSize: limit,
            total: data?.pagination?.total || 0,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
            style: { marginRight: 16 },
          }}
          onChange={handleTableChange}
          scroll={{ x: 1500 }}
          size="middle"
          rowClassName={() => 'table-row'}
        />
      </Card>

      <AddEditAduuModal
        open={modalOpen}
        aduu={editingAduu}
        onClose={handleModalClose}
        onSuccess={() => {
          handleModalClose()
          refetch()
        }}
      />
    </div>
  )
}
