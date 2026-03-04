import { useState, useMemo } from 'react'
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
  const [filter, setFilter] = useState<FilterType>('all')

  const { data: aduunuudData, isLoading } = useAduunuud({ limit: 200 })
  const aduunuud = aduunuudData?.aduunuud || []

  const counts = useMemo(() => ({
    all: aduunuud.length,
    er: aduunuud.filter(a => a.huis === 'er').length,
    em: aduunuud.filter(a => a.huis === 'em').length,
  }), [aduunuud])

  const filteredAduunuud = useMemo(() => {
    let result = aduunuud

    if (filter !== 'all') {
      result = result.filter(a => a.huis === filter)
    }

    if (search.trim()) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        (aduu) =>
          aduu.ner.toLowerCase().includes(searchLower) ||
          aduu.uulder?.name.toLowerCase().includes(searchLower) ||
          aduu.zus?.toLowerCase().includes(searchLower)
      )
    }

    return result
  }, [aduunuud, search, filter])

  const handleSelect = (aduu: Aduu) => {
    onSelect(aduu)
    onClose()
    setSearch('')
    setFilter('all')
  }

  const handleClose = () => {
    onClose()
    setSearch('')
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
              src={record.zurag?.[0]}
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
          placeholder="Нэр, үүлдэр, зүсээр хайх..."
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
            { label: `Бүгд (${counts.all})`, value: 'all' },
            { label: `♂ Эр (${counts.er})`, value: 'er' },
            { label: `♀ Эм (${counts.em})`, value: 'em' },
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
