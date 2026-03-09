import { useState } from 'react'
import type { ReactElement } from 'react'
import { Card, Empty, Select, Tag, App } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import {
  useUpdateAduu,
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

export function FamilyTree({
  currentHorse,
  ancestors,
  descendants,
  ancestorDepth,
  onDepthChange,
}: FamilyTreeProps) {
  const hasAncestors = ancestors.father || ancestors.mother
  const hasDescendants = descendants.length > 0
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const updateAduu = useUpdateAduu()
  const { message } = App.useApp()

  // Modal state for adding a parent
  const [modalOpen, setModalOpen] = useState(false)
  const [addParentInfo, setAddParentInfo] = useState<{
    childId: number
    parentType: 'father' | 'mother'
    huis: Huis
  } | null>(null)

  const handleEmptyCellClick = (childId: number | null, parentType: 'father' | 'mother') => {
    if (!childId) return
    setAddParentInfo({
      childId,
      parentType,
      huis: parentType === 'father' ? 'er' : 'em',
    })
    setModalOpen(true)
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
      return (
        <td
          key={`cell-${cell.col}-${cell.row}`}
          rowSpan={cell.rowSpan}
          className="pedigree-td"
        >
          <div
            className="pedigree-cell pedigree-empty pedigree-empty-clickable"
            onClick={() => handleEmptyCellClick(cell.childId, cell.parentType)}
          >
            <div className="pedigree-cell-content">
              <PlusOutlined className="pedigree-add-icon" />
              <span className="pedigree-name-empty">
                {cell.parentType === 'father' ? 'Эцэг нэмэх' : 'Эх нэмэх'}
              </span>
            </div>
          </div>
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
            <div className="pedigree-descendants-title">
              Үр төл ({descendants.length})
            </div>
            <div className="pedigree-descendants-list">
              {descendants.map((d) => (
                <Tag
                  key={d.id}
                  color={d.huis === 'er' ? 'blue' : 'magenta'}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/aduu/${d.id}`)}
                >
                  {d.ner}
                  {d.tursunOn ? ` (${d.tursunOn})` : ''}
                </Tag>
              ))}
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
    </>
  )
}
