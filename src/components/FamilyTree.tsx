import { useState } from 'react'
import type { ReactElement } from 'react'
import { Card, Empty, Select, Tag, App, Popover, Button, Space, Modal } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import {
  useUpdateAduu,
  useAduunuud,
  aduuKeys,
  type AncestorNode,
  type DescendantNode,
  type Huis,
  type Aduu,
} from '../api'
import { AddEditAduuModal } from './AddEditAduuModal'

interface FamilyTreeProps {
  currentHorse: {
    id: number
    ner: string
    huis: Huis
    zupisnuud?: { id: number; url: string; tailbar?: string }[]
  }
  ancestors: {
    father?: AncestorNode
    mother?: AncestorNode
  }
  descendants: DescendantNode[]
  ancestorDepth: number
  onDepthChange: (depth: number) => void
  descendantDepth: number
  onDescendantDepthChange: (depth: number) => void
}

const huisLabels: Record<Huis, string> = {
  er: 'Эр',
  em: 'Эм',
}

interface FlatCell {
  row: number
  col: number
  rowSpan: number
  node: AncestorNode | null
  childId: number | null
  parentType: 'father' | 'mother'
}

function collectCells(
  node: AncestorNode | undefined,
  generation: number,
  startRow: number,
  depth: number,
  cells: FlatCell[],
  childId: number | null,
  parentType: 'father' | 'mother',
) {
  const rowSpan = Math.pow(2, depth - generation)

  if (!node) {
    cells.push({ row: startRow, col: generation, rowSpan, node: null, childId, parentType })
    return
  }

  cells.push({ row: startRow, col: generation, rowSpan, node, childId, parentType })

  if (generation < depth) {
    collectCells(node.father, generation + 1, startRow, depth, cells, node.id, 'father')
    collectCells(node.mother, generation + 1, startRow + rowSpan / 2, depth, cells, node.id, 'mother')
  }
}

// Recursive tree descendant branch
function DescBranch({
  node,
  depth,
  maxDepth,
  navigate,
}: {
  node: DescendantNode
  depth: number
  maxDepth: number
  navigate: (path: string) => void
}) {
  const isMale = node.huis === 'er'
  const hasChildren = depth < maxDepth && node.children && node.children.length > 0

  return (
    <div className="dtree-branch">
      {/* Vertical line up from this node to the horizontal connector */}
      <div className="dtree-vline" />
      <div
        className={`dtree-node ${isMale ? 'dtree-node-male' : 'dtree-node-female'}`}
        onClick={() => navigate(`/aduu/${node.id}`)}
      >
        <div className="dtree-node-name">{node.ner}</div>
        <div className="dtree-node-meta">
          {node.uulder && <>{node.uulder.name} · </>}
          {node.tursunOn && <>{node.tursunOn} · </>}
          {huisLabels[node.huis]}
        </div>
      </div>
      {hasChildren && (
        <>
          {/* Vertical line down from this node to children connector */}
          <div className="dtree-vline" />
          <div className="dtree-children">
            {node.children!.map((child) => (
              <DescBranch
                key={child.id}
                node={child}
                depth={depth + 1}
                maxDepth={maxDepth}
                navigate={navigate}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function FamilyTree({
  currentHorse,
  ancestors,
  descendants,
  ancestorDepth,
  onDepthChange,
  descendantDepth,
  onDescendantDepthChange,
}: FamilyTreeProps) {
  const hasAncestors = ancestors.father || ancestors.mother
  const hasDescendants = descendants.length > 0
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const updateAduu = useUpdateAduu()
  const { message } = App.useApp()

  const { data: aduunuudData } = useAduunuud({ limit: 200 })
  const aduunuud = aduunuudData?.aduunuud || []

  // Modal state for adding a parent
  const [modalOpen, setModalOpen] = useState(false)
  const [selectMode, setSelectMode] = useState(false)
  const [addParentInfo, setAddParentInfo] = useState<{
    childId: number
    parentType: 'father' | 'mother'
    huis: Huis
  } | null>(null)
  const [popoverOpen, setPopoverOpen] = useState<string | null>(null)

  const openAddNew = (childId: number, parentType: 'father' | 'mother') => {
    setAddParentInfo({
      childId,
      parentType,
      huis: parentType === 'father' ? 'er' : 'em',
    })
    setPopoverOpen(null)
    setSelectMode(false)
    setModalOpen(true)
  }

  const openSelectExisting = (childId: number, parentType: 'father' | 'mother') => {
    setAddParentInfo({
      childId,
      parentType,
      huis: parentType === 'father' ? 'er' : 'em',
    })
    setPopoverOpen(null)
    setSelectMode(true)
  }

  const handleSelectParent = async (selectedAduuId: number) => {
    if (!addParentInfo) return
    try {
      const updateData = addParentInfo.parentType === 'father'
        ? { fatherId: selectedAduuId }
        : { motherId: selectedAduuId }
      await updateAduu.mutateAsync({ id: addParentInfo.childId, data: updateData })
      queryClient.invalidateQueries({ queryKey: aduuKeys.familyTrees() })
      message.success('Эцэг/эх амжилттай холбогдлоо')
    } catch {
      message.error('Эцэг/эх холбоход алдаа гарлаа')
    }
    setSelectMode(false)
    setAddParentInfo(null)
  }

  const handleModalSuccess = async (newAduu?: Aduu) => {
    if (addParentInfo && newAduu) {
      try {
        const updateData = addParentInfo.parentType === 'father'
          ? { fatherId: newAduu.id }
          : { motherId: newAduu.id }
        await updateAduu.mutateAsync({ id: addParentInfo.childId, data: updateData })
        queryClient.invalidateQueries({ queryKey: aduuKeys.familyTrees() })
        message.success('Эцэг/эх амжилттай холбогдлоо')
      } catch {
        message.error('Эцэг/эх холбоход алдаа гарлаа')
      }
    }
    setModalOpen(false)
    setAddParentInfo(null)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setAddParentInfo(null)
  }

  if (!hasAncestors && !hasDescendants) {
    return (
      <Card title="Удмын бичиг" size="small">
        <Empty description="Ургын мод бүртгэгдээгүй байна" />
      </Card>
    )
  }

  const depth = ancestorDepth
  const totalRows = Math.pow(2, depth)

  // Collect all ancestor cells
  const cells: FlatCell[] = []
  collectCells(ancestors.father, 1, 0, depth, cells, currentHorse.id, 'father')
  collectCells(ancestors.mother, 1, totalRows / 2, depth, cells, currentHorse.id, 'mother')

  // Group cells by row and col for easy lookup
  const cellMap = new Map<string, FlatCell>()
  for (const cell of cells) {
    cellMap.set(`${cell.row}-${cell.col}`, cell)
  }

  // Track which rows are "occupied" by a rowSpan from a previous row
  const occupied = new Set<string>()
  for (const cell of cells) {
    for (let r = cell.row + 1; r < cell.row + cell.rowSpan; r++) {
      occupied.add(`${r}-${cell.col}`)
    }
  }

  const renderCell = (cell: FlatCell) => {
    if (!cell.node) {
      const cellKey = `${cell.col}-${cell.row}`
      const popoverContent = cell.childId ? (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button
            block
            icon={<PlusOutlined />}
            onClick={() => openAddNew(cell.childId!, cell.parentType)}
          >
            Шинэ нэмэх
          </Button>
          <Button
            block
            icon={<SearchOutlined />}
            onClick={() => openSelectExisting(cell.childId!, cell.parentType)}
          >
            Сонгох
          </Button>
        </Space>
      ) : null

      return (
        <td
          key={`cell-${cellKey}`}
          rowSpan={cell.rowSpan}
          className="pedigree-td"
        >
          <Popover
            content={popoverContent}
            title={cell.parentType === 'father' ? 'Эцэг' : 'Эх'}
            trigger="click"
            open={popoverOpen === cellKey}
            onOpenChange={(open) => setPopoverOpen(open ? cellKey : null)}
          >
            <div className="pedigree-cell pedigree-empty pedigree-empty-clickable">
              <div className="pedigree-cell-content">
                <PlusOutlined className="pedigree-add-icon" />
                <span className="pedigree-name-empty">
                  {cell.parentType === 'father' ? 'Эцэг нэмэх' : 'Эх нэмэх'}
                </span>
              </div>
            </div>
          </Popover>
        </td>
      )
    }

    const isMale = cell.node.huis === 'er'
    const colorClass = isMale ? 'pedigree-male' : 'pedigree-female'
    const isClickable = cell.node.id !== currentHorse.id

    return (
      <td
        key={`cell-${cell.col}-${cell.row}`}
        rowSpan={cell.rowSpan}
        className="pedigree-td"
      >
        <div
          className={`pedigree-cell ${colorClass}`}
          onClick={() => isClickable && navigate(`/aduu/${cell.node!.id}`)}
          style={{ cursor: isClickable ? 'pointer' : 'default' }}
        >
          <div className="pedigree-cell-content">
            <span className="pedigree-name">{cell.node.ner}</span>
            {cell.node.uulder && (
              <span className="pedigree-uulder">{cell.node.uulder.name}</span>
            )}
            {cell.node.tursunOn && (
              <span className="pedigree-year">{cell.node.tursunOn} он</span>
            )}
            <span className="pedigree-huis">{huisLabels[cell.node.huis]}</span>
          </div>
        </div>
      </td>
    )
  }

  const rows: ReactElement[] = []
  for (let r = 0; r < totalRows; r++) {
    const rowCells: ReactElement[] = []

    // Column 0: current horse (only in first row with full rowSpan)
    if (r === 0) {
      rowCells.push(
        <td key={`current-${r}`} rowSpan={totalRows} className="pedigree-td">
          <div className="pedigree-cell pedigree-current">
            <div className="pedigree-cell-content">
              <Tag color={currentHorse.huis === 'er' ? 'blue' : 'magenta'}>
                {currentHorse.huis === 'er' ? '♂' : '♀'}
              </Tag>
              <span className="pedigree-name pedigree-name-main">
                {currentHorse.ner}
              </span>
            </div>
          </div>
        </td>,
      )
    }

    // Columns 1..depth: ancestors
    for (let g = 1; g <= depth; g++) {
      const key = `${r}-${g}`
      if (occupied.has(key)) continue

      const cell = cellMap.get(key)
      if (cell) {
        rowCells.push(renderCell(cell))
      }
    }

    rows.push(<tr key={`row-${r}`}>{rowCells}</tr>)
  }

  return (
    <>
      <Card
        title="Удмын бичиг"
        size="small"
        className="pedigree-card"
        extra={
          <Select
            value={depth}
            onChange={onDepthChange}
            size="small"
            style={{ width: 100 }}
            options={[
              { value: 1, label: '1 үе' },
              { value: 2, label: '2 үе' },
              { value: 3, label: '3 үе' },
              { value: 4, label: '4 үе' },
            ]}
          />
        }
      >
        <div className="pedigree-table-wrapper">
          <table className="pedigree-table">
            <tbody>{rows}</tbody>
          </table>
        </div>

        {hasDescendants && (
          <div className="pedigree-descendants">
            <div className="pedigree-descendants-header">
              <div className="pedigree-descendants-title">
                Үр төл ({descendants.length})
              </div>
              <Select
                value={descendantDepth}
                onChange={onDescendantDepthChange}
                size="small"
                style={{ width: 100 }}
                options={[
                  { value: 1, label: '1 үе' },
                  { value: 2, label: '2 үе' },
                  { value: 3, label: '3 үе' },
                  { value: 4, label: '4 үе' },
                ]}
              />
            </div>
            <div className="dtree-root">
              <div
                className={`dtree-node ${currentHorse.huis === 'er' ? 'dtree-node-male' : 'dtree-node-female'} dtree-node-current`}
              >
                <div className="dtree-node-name">{currentHorse.ner}</div>
              </div>
              <div className="dtree-vline" />
              <div className="dtree-children">
                {descendants.map((d) => (
                  <DescBranch
                    key={d.id}
                    node={d}
                    depth={1}
                    maxDepth={descendantDepth}
                    navigate={navigate}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>

      <AddEditAduuModal
        open={modalOpen}
        aduu={null}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        defaultHuis={addParentInfo?.huis}
      />

      <Modal
        title={addParentInfo?.parentType === 'father' ? 'Эцэг сонгох' : 'Эх сонгох'}
        open={selectMode}
        onCancel={() => { setSelectMode(false); setAddParentInfo(null) }}
        footer={null}
        width={400}
        destroyOnHidden
      >
        <Select
          showSearch
          optionFilterProp="label"
          placeholder="Адуу хайх..."
          style={{ width: '100%' }}
          size="large"
          onChange={handleSelectParent}
          options={aduunuud
            .filter((a) => a.huis === addParentInfo?.huis && a.id !== currentHorse.id)
            .map((a) => ({
              value: a.id,
              label: `${a.ner}${a.tursunOn ? ` (${a.tursunOn})` : ''}`,
            }))}
        />
      </Modal>
    </>
  )
}
