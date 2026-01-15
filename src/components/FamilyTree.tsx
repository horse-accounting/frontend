import { useEffect, useRef, useMemo } from 'react'
import { Card, Empty } from 'antd'
import * as f3 from 'family-chart'
import 'family-chart/styles/family-chart.css'
import type { AncestorNode, DescendantNode, Huis } from '../api'
import type { Datum } from 'family-chart'
import { useNavigate } from 'react-router-dom'

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

// Huis labels
const huisLabels: Record<Huis, string> = {
  azarga: 'Азарга',
  guu: 'Гүү',
  mori: 'Морь',
}

// Gender-based colors (эр = male, эм = female)
const genderConfig = {
  male: {
    emoji: '♂',
    color: '#3498db',
    bgColor: 'linear-gradient(135deg, #2980b9 0%, #3498db 100%)'
  },
  female: {
    emoji: '♀',
    color: '#e84393',
    bgColor: 'linear-gradient(135deg, #c44569 0%, #e84393 100%)'
  },
}

// Get gender config based on huis
function getGenderConfig(huis: Huis) {
  return huis === 'guu' ? genderConfig.female : genderConfig.male
}

// Convert huis to gender for family-chart
function huisToGender(huis: Huis): 'M' | 'F' {
  return huis === 'guu' ? 'F' : 'M'
}

// Build flat data array from tree structure
function buildFamilyData(
  currentHorse: FamilyTreeProps['currentHorse'],
  ancestors: FamilyTreeProps['ancestors'],
  descendants: DescendantNode[]
): Datum[] {
  const nodes: Map<string, Datum> = new Map()

  // Add current horse
  const currentId = String(currentHorse.id)
  const currentNode: Datum = {
    id: currentId,
    data: {
      'first name': currentHorse.ner,
      gender: huisToGender(currentHorse.huis),
      huis: currentHorse.huis,
      zurag: currentHorse.zurag?.[0] || '',
    },
    rels: {
      spouses: [],
      children: [],
      parents: [],
    },
  }
  nodes.set(currentId, currentNode)

  // Process ancestors recursively
  function processAncestor(ancestor: AncestorNode | undefined, childId: string): void {
    if (!ancestor) return

    const ancestorId = String(ancestor.id)

    if (!nodes.has(ancestorId)) {
      nodes.set(ancestorId, {
        id: ancestorId,
        data: {
          'first name': ancestor.ner,
          gender: huisToGender(ancestor.huis),
          huis: ancestor.huis,
        },
        rels: {
          spouses: [],
          children: [childId],
          parents: [],
        },
      })
    } else {
      const existingNode = nodes.get(ancestorId)!
      if (!existingNode.rels.children.includes(childId)) {
        existingNode.rels.children.push(childId)
      }
    }

    // Add parent reference to child
    const childNode = nodes.get(childId)
    if (childNode && !childNode.rels.parents.includes(ancestorId)) {
      childNode.rels.parents.push(ancestorId)
    }

    // Process grandparents
    if (ancestor.father || ancestor.mother) {
      processAncestor(ancestor.father, ancestorId)
      processAncestor(ancestor.mother, ancestorId)
    }
  }

  // Process father and mother lines
  processAncestor(ancestors.father, currentId)
  processAncestor(ancestors.mother, currentId)

  // Process descendants recursively
  function processDescendant(descendant: DescendantNode, parentId: string): void {
    const descendantId = String(descendant.id)

    if (!nodes.has(descendantId)) {
      nodes.set(descendantId, {
        id: descendantId,
        data: {
          'first name': descendant.ner,
          gender: huisToGender(descendant.huis),
          huis: descendant.huis,
        },
        rels: {
          spouses: [],
          children: [],
          parents: [parentId],
        },
      })
    }

    // Add child reference to parent
    const parentNode = nodes.get(parentId)
    if (parentNode && !parentNode.rels.children.includes(descendantId)) {
      parentNode.rels.children.push(descendantId)
    }

    // Process grandchildren
    if (descendant.children && descendant.children.length > 0) {
      descendant.children.forEach((child) => {
        processDescendant(child, descendantId)
      })
    }
  }

  descendants.forEach((child) => {
    processDescendant(child, currentId)
  })

  return Array.from(nodes.values())
}

export function FamilyTree({ currentHorse, ancestors, descendants }: FamilyTreeProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const hasAncestors = ancestors.father || ancestors.mother
  const hasDescendants = descendants.length > 0

  // Build family data
  const familyData = useMemo(() => {
    if (!hasAncestors && !hasDescendants) return []
    return buildFamilyData(currentHorse, ancestors, descendants)
  }, [currentHorse, ancestors, descendants, hasAncestors, hasDescendants])

  useEffect(() => {
    const container = chartRef.current
    if (!container || familyData.length === 0) return

    // Clear previous chart
    container.innerHTML = ''

    // Create chart
    const chart = f3.createChart(container, familyData)

    // Set up HTML card with custom template
    chart.setCardHtml()
      .setCardDisplay([['first name']])
      .setMiniTree(true)
      .setStyle('rect')
      .setCardDim({
        w: 180,
        h: 80,
        text_x: 90,
        text_y: 20,
        img_w: 0,
        img_h: 0,
        img_x: 0,
        img_y: 0,
      })
      .setCardInnerHtmlCreator((d) => {
        // d.data contains the full node, d.data.data contains our custom data
        const nodeData = d.data.data || d.data
        const huis = (nodeData.huis as Huis) || 'mori'
        const name = nodeData['first name'] || 'Нэргүй'
        const gender = getGenderConfig(huis)
        const label = huisLabels[huis]
        const isMain = d.data.id === String(currentHorse.id)
        const zurag = nodeData.zurag as string | undefined
        const genderClass = huis === 'guu' ? 'female' : 'male'

        // Image or emoji
        const imageContent = zurag
          ? `<img src="${zurag}" alt="${name}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" /><span style="display:none;width:100%;height:100%;align-items:center;justify-content:center;font-size:24px;">🐴</span>`
          : `<span style="font-size:28px;">${gender.emoji}</span>`

        return `
          <div class="f3-horse-card ${isMain ? 'is-main' : ''}" data-gender="${genderClass}">
            <div class="f3-horse-avatar">
              ${imageContent}
            </div>
            <div class="f3-horse-info">
              <div class="f3-horse-name">${name}</div>
              <div class="f3-horse-type">${label}</div>
            </div>
          </div>
        `
      })
      .setOnCardClick((_e: MouseEvent, d: { data: { id?: string } }) => {
        const nodeId = d.data?.id
        if (nodeId && nodeId !== String(currentHorse.id)) {
          navigate(`/aduu/${nodeId}`)
        }
      })

    // Update main person and render tree
    chart.updateMainId(String(currentHorse.id))
    chart.setTransitionTime(400)
    chart.updateTree({ initial: true })

    return () => {
      if (container) {
        container.innerHTML = ''
      }
    }
  }, [familyData, currentHorse.id, navigate])

  if (!hasAncestors && !hasDescendants) {
    return (
      <Card title="🌳 Ургын мод" size="small">
        <Empty description="Ургын мод бүртгэгдээгүй байна" />
      </Card>
    )
  }

  return (
    <Card title="🌳 Ургын мод" size="small" className="family-tree-card">
      <div
        ref={chartRef}
        className="f3"
        style={{
          width: '100%',
          height: '500px',
          minHeight: '400px',
        }}
      />
    </Card>
  )
}
