import { useState, useEffect } from 'react'
import {
  Modal,
  Input,
  Typography,
  Tag,
  Flex,
  Segmented,
  Table,
  Avatar,
} from 'antd'
import { SearchOutlined, CheckCircleFilled, TrophyFilled } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useAduunuud, type Aduu, type Huis } from '../api'
import { cloudinaryThumb } from '../utils/zurag'

const { Text } = Typography

interface HorseSelectModalProps {
  open: boolean
  selectedId?: number
  onSelect: (aduu: Aduu) => void
  onClose: () => void
}

const huisConfig: Record<string, { label: string; color: string; emoji: string }> = {
  er: { label: 'Эр', color: 'blue', emoji: '♂' },
  em: { label: 'Эм', color: 'magenta', emoji: '♀' },
}

type FilterType = 'all' | Huis

export function HorseSelectModal({ open, selectedId, onSelect, onClose }: HorseSelectModalProps) {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')

  // Хайлтыг server тал руу 300мс debounce-тэй явуулна — адууны тоо
  // хэдэн зуунаас хэтэрсэн ч бүх адуунаас хайж чадна (limit-д баригдахгүй)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(t)
  }, [search])

  const { data: aduunuudData, isLoading } = useAduunuud({
    limit: 100,
    include: 'zurag,amjilt',
    search: debouncedSearch.trim() || undefined,
    huis: filter !== 'all' ? filter : undefined,
  })
  const filteredAduunuud = aduunuudData?.aduunuud || []
  const total = aduunuudData?.pagination?.total ?? 0

  const handleSelect = (aduu: Aduu) => {
    onSelect(aduu)
    onClose()
    setSearch('')
    setDebouncedSearch('')
    setFilter('all')
  }

  const handleClose = () => {
    onClose()
    setSearch('')
    setDebouncedSearch('')
    setFilter('all')
  }

  const columns: ColumnsType<Aduu> = [
    {
      title: 'Адуу',
      key: 'horse',
      render: (_, record) => {
        const isSelected = record.id === selectedId

        return (
          <Flex gap={12} align="center">
            <Avatar
              src={cloudinaryThumb(record.zuragnuud?.[0]?.url, 48)}
              size={48}
              shape="square"
              style={{ borderRadius: 8, flexShrink: 0 }}
            >
              🐴
            </Avatar>
            <div style={{ minWidth: 0 }}>
              <Flex align="center" gap={6}>
                <Text strong>{record.ner}</Text>
                {isSelected && <CheckCircleFilled style={{ color: '#1890ff' }} />}
              </Flex>
              {record.zus && (
                <Text type="secondary" style={{ fontSize: 12 }}>{record.zus}</Text>
              )}
            </div>
          </Flex>
        )
      },
    },
    {
      title: 'Хүйс',
      key: 'huis',
      width: 100,
      render: (_, record) => {
        const huis = huisConfig[record.huis]
        return (
          <Tag color={huis?.color}>
            {huis?.emoji} {huis?.label}
          </Tag>
        )
      },
    },
    {
      title: 'Үүлдэр',
      dataIndex: ['uulder', 'name'],
      key: 'uulder',
      width: 120,
      render: (name: string) => name || <Text type="secondary">—</Text>,
    },
    {
      title: 'Он',
      dataIndex: 'tursunOn',
      key: 'tursunOn',
      width: 80,
      render: (year: number) => year || <Text type="secondary">—</Text>,
    },
    {
      title: 'Амжилт',
      key: 'amjilt',
      width: 80,
      align: 'center',
      render: (_, record) => {
        const count = record.amjiltuud?.length || 0
        return count > 0 ? (
          <Tag color="gold" style={{ margin: 0 }}>
            <TrophyFilled style={{ marginRight: 4 }} />
            {count}
          </Tag>
        ) : (
          <Text type="secondary">—</Text>
        )
      },
    },
  ]

  return (
    <Modal
      title={
        <Flex align="center" gap={10}>
          <span style={{ fontSize: 20 }}>🐴</span>
          <span>Адуу сонгох</span>
        </Flex>
      }
      open={open}
      onCancel={handleClose}
      footer={null}
      width={800}
      styles={{ body: { padding: 0 } }}
    >
      {/* Search & Filter */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
        <Input
          placeholder="Нэр, зүс, тамга, микрочипээр хайх..."
          prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
          size="large"
          allowClear
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: 12 }}
        />
        <Segmented
          value={filter}
          onChange={(val) => setFilter(val as FilterType)}
          block
          options={[
            { label: filter === 'all' ? `Бүгд (${total})` : 'Бүгд', value: 'all' },
            { label: filter === 'er' ? `♂ Эр (${total})` : '♂ Эр', value: 'er' },
            { label: filter === 'em' ? `♀ Эм (${total})` : '♀ Эм', value: 'em' },
          ]}
        />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredAduunuud}
        rowKey="id"
        loading={isLoading}
        size="middle"
        pagination={filteredAduunuud.length > 10 ? { pageSize: 10, showSizeChanger: false } : false}
        scroll={{ y: 400 }}
        onRow={(record) => ({
          onClick: () => handleSelect(record),
          style: {
            cursor: 'pointer',
            background: record.id === selectedId ? '#e6f7ff' : undefined,
          },
        })}
        locale={{
          emptyText: search ? `"${search}" хайлтад тохирох адуу олдсонгүй` : 'Адуу бүртгэгдээгүй',
        }}
      />
    </Modal>
  )
}
