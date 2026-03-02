import { useRef, useState, useCallback } from 'react'
import { Card, Empty, Button, Tooltip } from 'antd'
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  ExpandOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import type { AncestorNode, DescendantNode, Huis } from '../api'

interface FamilyTreeProps {
  currentHorse: {
    id: number
    ner: string
    huis: Huis
    zurag?: string[]
  }
  ancestors: {
    father?: AncestorNode
    mother?: AncestorNode
  }
  descendants: DescendantNode[]
}

const huisLabels: Record<Huis, string> = {
  er: 'Эр',
  em: 'Эм',
}

// ==================== Horse Node Card ====================

function HorseNode({
  id,
  ner,
  huis,
  isMain,
  currentId,
}: {
  id: number
  ner: string
  huis: Huis
  isMain?: boolean
  currentId: number
}) {
  const navigate = useNavigate()
  const isMale = huis === 'er'

  return (
    <div
      className={`ft-node ${isMale ? 'ft-male' : 'ft-female'} ${isMain ? 'ft-main' : ''}`}
      onClick={() => {
        if (id !== currentId) navigate(`/aduu/${id}`)
      }}
      style={{ cursor: id !== currentId ? 'pointer' : 'default' }}
    >
      <div className="ft-node-emoji">{isMale ? '♂' : '♀'}</div>
      <div className="ft-node-info">
        <div className="ft-node-name">{ner}</div>
        <div className="ft-node-huis">{huisLabels[huis]}</div>
      </div>
    </div>
  )
}

// ==================== Ancestor Tree (bottom-up) ====================

function AncestorBranch({
  node,
  currentId,
}: {
  node?: AncestorNode
  currentId: number
}) {
  if (!node) {
    return (
      <div className="ft-ancestor-branch">
        <div className="ft-node ft-empty">
          <div className="ft-node-emoji">?</div>
          <div className="ft-node-info">
            <div className="ft-node-name">Тодорхойгүй</div>
          </div>
        </div>
      </div>
    )
  }

  const hasParents = node.father || node.mother

  return (
    <div className="ft-ancestor-branch">
      {hasParents && (
        <div className="ft-ancestor-parents">
          <AncestorBranch node={node.father} currentId={currentId} />
          <AncestorBranch node={node.mother} currentId={currentId} />
        </div>
      )}
      <div className="ft-ancestor-self">
        <HorseNode id={node.id} ner={node.ner} huis={node.huis} currentId={currentId} />
      </div>
    </div>
  )
}

// ==================== Descendant Tree (top-down) ====================

function DescendantBranch({
  node,
  currentId,
}: {
  node: DescendantNode
  currentId: number
}) {
  const hasChildren = node.children && node.children.length > 0

  return (
    <div className="ft-descendant-branch">
      <div className="ft-descendant-self">
        <HorseNode id={node.id} ner={node.ner} huis={node.huis} currentId={currentId} />
      </div>
      {hasChildren && (
        <div className="ft-descendant-children">
          {node.children!.map((child) => (
            <DescendantBranch key={child.id} node={child} currentId={currentId} />
          ))}
        </div>
      )}
    </div>
  )
}

// ==================== Main Component ====================

const MIN_ZOOM = 0.3
const MAX_ZOOM = 2
const ZOOM_STEP = 0.15

export function FamilyTree({ currentHorse, ancestors, descendants }: FamilyTreeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(0.85)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 })

  const hasAncestors = ancestors.father || ancestors.mother
  const hasDescendants = descendants.length > 0

  const handleZoomIn = () => setZoom((z) => Math.min(z + ZOOM_STEP, MAX_ZOOM))
  const handleZoomOut = () => setZoom((z) => Math.max(z - ZOOM_STEP, MIN_ZOOM))
  const handleReset = () => {
    setZoom(0.85)
    setPan({ x: 0, y: 0 })
  }

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP
    setZoom((z) => Math.min(Math.max(z + delta, MIN_ZOOM), MAX_ZOOM))
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return
    setDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y }
  }, [pan])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    setPan({ x: dragStart.current.panX + dx, y: dragStart.current.panY + dy })
  }, [dragging])

  const handleMouseUp = useCallback(() => {
    setDragging(false)
  }, [])

  if (!hasAncestors && !hasDescendants) {
    return (
      <Card title="🌳 Ургын мод" size="small">
        <Empty description="Ургын мод бүртгэгдээгүй байна" />
      </Card>
    )
  }

  return (
    <Card
      title="🌳 Ургын мод"
      size="small"
      className="family-tree-card"
      extra={
        <div style={{ display: 'flex', gap: 4 }}>
          <Tooltip title="Томруулах">
            <Button size="small" icon={<ZoomInOutlined />} onClick={handleZoomIn} />
          </Tooltip>
          <Tooltip title="Жижигрүүлэх">
            <Button size="small" icon={<ZoomOutOutlined />} onClick={handleZoomOut} />
          </Tooltip>
          <Tooltip title="Анхны байрлал">
            <Button size="small" icon={<ExpandOutlined />} onClick={handleReset} />
          </Tooltip>
          <span style={{ fontSize: 12, lineHeight: '24px', marginLeft: 4, color: '#999' }}>
            {Math.round(zoom * 100)}%
          </span>
        </div>
      }
    >
      <div
        ref={containerRef}
        className="ft-viewport"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: dragging ? 'grabbing' : 'grab' }}
      >
        <div
          className="ft-canvas"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          }}
        >
          {/* Ancestors section */}
          {hasAncestors && (
            <div className="ft-ancestors">
              <div className="ft-ancestor-parents">
                <AncestorBranch node={ancestors.father} currentId={currentHorse.id} />
                <AncestorBranch node={ancestors.mother} currentId={currentHorse.id} />
              </div>
            </div>
          )}

          {/* Current horse */}
          <div className="ft-current">
            <HorseNode
              id={currentHorse.id}
              ner={currentHorse.ner}
              huis={currentHorse.huis}
              isMain
              currentId={currentHorse.id}
            />
          </div>

          {/* Descendants section */}
          {hasDescendants && (
            <div className="ft-descendants">
              <div className="ft-descendant-children">
                {descendants.map((child) => (
                  <DescendantBranch key={child.id} node={child} currentId={currentHorse.id} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
