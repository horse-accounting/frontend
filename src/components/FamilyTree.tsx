import type { ReactElement } from 'react'
import { Card, Empty, Select, Tag } from 'antd'
import { useNavigate } from 'react-router-dom'
import type { AncestorNode, DescendantNode, Huis } from '../api'

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
}

function collectCells(
  node: AncestorNode | undefined,
  generation: number,
  startRow: number,
  depth: number,
  cells: FlatCell[],
) {
  const rowSpan = Math.pow(2, depth - generation)

  if (!node) {
    cells.push({ row: startRow, col: generation, rowSpan, node: null })
    return
  }

  cells.push({ row: startRow, col: generation, rowSpan, node })

  if (generation < depth) {
    collectCells(node.father, generation + 1, startRow, depth, cells)
    collectCells(node.mother, generation + 1, startRow + rowSpan / 2, depth, cells)
  }
}

function PedigreeCell({
  node,
  isCurrent,
  currentId,
}: {
  node: AncestorNode | null
  isCurrent?: boolean
  currentId: number
}) {
  const navigate = useNavigate()

  if (!node) {
    return (
      <div className={`pedigree-cell pedigree-empty${isCurrent ? ' pedigree-current' : ''}`}>
        <div className="pedigree-cell-content">
          <span className="pedigree-name-empty">Тодорхойгүй</span>
        </div>
      </div>
    )
  }

  const isMale = node.huis === 'er'
  const colorClass = isMale ? 'pedigree-male' : 'pedigree-female'

  return (
    <div
      className={`pedigree-cell ${colorClass}${isCurrent ? ' pedigree-current' : ''}`}
      onClick={() => {
        if (node.id !== currentId) navigate(`/aduu/${node.id}`)
      }}
      style={{ cursor: node.id !== currentId ? 'pointer' : 'default' }}
    >
      <div className="pedigree-cell-content">
        <span className="pedigree-name">{node.ner}</span>
        {node.uulder && (
          <span className="pedigree-uulder">{node.uulder.name}</span>
        )}
        {node.tursunOn && (
          <span className="pedigree-year">{node.tursunOn} он</span>
        )}
        <span className="pedigree-huis">{huisLabels[node.huis]}</span>
      </div>
    </div>
  )
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
  collectCells(ancestors.father, 1, 0, depth, cells)
  collectCells(ancestors.mother, 1, totalRows / 2, depth, cells)

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

  // Build current horse as an AncestorNode-like object for the cell renderer
  const currentAsNode: AncestorNode = {
    id: currentHorse.id,
    ner: currentHorse.ner,
    huis: currentHorse.huis,
  }

  const rows: ReactElement[] = []
  for (let r = 0; r < totalRows; r++) {
    const rowCells: ReactElement[] = []

    // Column 0: current horse (only in first row with full rowSpan)
    if (r === 0) {
      rowCells.push(
        <td key={`current-${r}`} rowSpan={totalRows} style={{ verticalAlign: 'middle' }}>
          <PedigreeCell node={currentAsNode} isCurrent currentId={currentHorse.id} />
        </td>,
      )
    }

    // Columns 1..depth: ancestors
    for (let g = 1; g <= depth; g++) {
      const key = `${r}-${g}`
      if (occupied.has(key)) continue

      const cell = cellMap.get(key)
      if (cell) {
        rowCells.push(
          <td key={`cell-${g}-${r}`} rowSpan={cell.rowSpan} style={{ verticalAlign: 'middle' }}>
            <PedigreeCell node={cell.node} currentId={currentHorse.id} />
          </td>,
        )
      }
    }

    rows.push(<tr key={`row-${r}`}>{rowCells}</tr>)
  }

  return (
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
  )
}
