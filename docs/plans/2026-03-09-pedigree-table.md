# Pedigree Table Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the current FamilyTree tree visualization with a horizontal pedigree table using rowspan, similar to ugshil.mn.

**Architecture:** Rewrite `FamilyTree.tsx` to render an HTML `<table>` with rowspan-based ancestor layout. Flatten the recursive `AncestorNode` tree into rows. Add a depth selector (1-4) that controls `ancestorDepth` passed to `useFamilyTree`.

**Tech Stack:** React, Ant Design (Card, Select, Tag), react-router-dom (useNavigate), existing `useFamilyTree` hook.

---

### Task 1: Rewrite FamilyTree.tsx — pedigree table component

**Files:**
- Rewrite: `src/components/FamilyTree.tsx`

**Step 1: Replace the entire FamilyTree.tsx with the new pedigree table component**

The component receives the same props but now also accepts `ancestorDepth` and `onDepthChange`. It renders a `<table>` with rowspan-based layout.

```tsx
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

interface PedigreeCell {
  node?: AncestorNode
  rowSpan: number
  generation: number
}

// Flatten the recursive ancestor tree into a grid of cells for the table.
// For depth N, there are 2^N rows. Each cell at generation G gets rowSpan = 2^(depth - G).
// Generation 1 = parents, generation 2 = grandparents, etc.
function buildPedigreeGrid(
  ancestors: { father?: AncestorNode; mother?: AncestorNode },
  depth: number,
): PedigreeCell[][] {
  const totalRows = Math.pow(2, depth)
  const rows: PedigreeCell[][] = Array.from({ length: totalRows }, () => [])

  // Recursively place ancestor nodes into the grid
  function placeNode(node: AncestorNode | undefined, generation: number, startRow: number) {
    const rowSpan = Math.pow(2, depth - generation)
    rows[startRow].push({ node, rowSpan, generation })

    if (generation < depth) {
      placeNode(node?.father, generation + 1, startRow)
      placeNode(node?.mother, generation + 1, startRow + rowSpan / 2)
    }
  }

  // Generation 1: father takes top half, mother takes bottom half
  const halfRows = totalRows / 2
  placeNode(ancestors.father, 1, 0)
  placeNode(ancestors.mother, 1, halfRows)

  return rows
}

const depthOptions = [
  { value: 1, label: '1 үе' },
  { value: 2, label: '2 үе' },
  { value: 3, label: '3 үе' },
  { value: 4, label: '4 үе' },
]

export function FamilyTree({
  currentHorse,
  ancestors,
  descendants,
  ancestorDepth,
  onDepthChange,
}: FamilyTreeProps) {
  const navigate = useNavigate()

  const hasAncestors = ancestors.father || ancestors.mother
  const hasDescendants = descendants.length > 0

  if (!hasAncestors && !hasDescendants) {
    return (
      <Card title="🌳 Ургын мод" size="small">
        <Empty description="Ургын мод бүртгэгдээгүй байна" />
      </Card>
    )
  }

  const grid = hasAncestors ? buildPedigreeGrid(ancestors, ancestorDepth) : []
  const totalRows = Math.pow(2, ancestorDepth)

  const renderCell = (cell: PedigreeCell) => {
    const node = cell.node
    if (!node) {
      return (
        <td
          key={`empty-${cell.generation}-${Math.random()}`}
          rowSpan={cell.rowSpan}
          className="pedigree-cell pedigree-empty"
        >
          <span className="pedigree-name-empty">Тодорхойгүй</span>
        </td>
      )
    }

    const isMale = node.huis === 'er'
    const cellClass = `pedigree-cell ${isMale ? 'pedigree-male' : 'pedigree-female'}`
    const isClickable = node.id !== currentHorse.id

    return (
      <td
        key={`${node.id}-${cell.generation}`}
        rowSpan={cell.rowSpan}
        className={cellClass}
        onClick={() => isClickable && navigate(`/aduu/${node.id}`)}
        style={{ cursor: isClickable ? 'pointer' : 'default' }}
      >
        <div className="pedigree-cell-content">
          <span className="pedigree-name">{node.ner}</span>
          {node.uulder && (
            <span className="pedigree-uulder">{node.uulder.name}</span>
          )}
          {node.tursunOn && (
            <span className="pedigree-year">{node.tursunOn}</span>
          )}
        </div>
      </td>
    )
  }

  return (
    <Card
      title="🌳 Ургын мод"
      size="small"
      className="pedigree-card"
      extra={
        <Select
          value={ancestorDepth}
          onChange={onDepthChange}
          options={depthOptions}
          size="small"
          style={{ width: 90 }}
        />
      }
    >
      {hasAncestors && (
        <div className="pedigree-table-wrapper">
          <table className="pedigree-table">
            <tbody>
              {grid.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {/* First column: current horse, only on first row */}
                  {rowIndex === 0 && (
                    <td
                      rowSpan={totalRows}
                      className="pedigree-cell pedigree-current"
                    >
                      <div className="pedigree-cell-content">
                        <Tag color={currentHorse.huis === 'er' ? 'blue' : 'magenta'}>
                          {currentHorse.huis === 'er' ? '♂' : '♀'}
                        </Tag>
                        <span className="pedigree-name pedigree-name-main">
                          {currentHorse.ner}
                        </span>
                      </div>
                    </td>
                  )}
                  {/* Ancestor columns */}
                  {row.map((cell) => renderCell(cell))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Descendants section - simple list below */}
      {hasDescendants && (
        <div className="pedigree-descendants">
          <div className="pedigree-descendants-title">Үр удам ({descendants.length})</div>
          <div className="pedigree-descendants-list">
            {descendants.map((d) => (
              <Tag
                key={d.id}
                color={d.huis === 'er' ? 'blue' : 'magenta'}
                style={{ cursor: 'pointer', margin: 4 }}
                onClick={() => navigate(`/aduu/${d.id}`)}
              >
                {d.huis === 'er' ? '♂' : '♀'} {d.ner}
              </Tag>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
```

**Step 2: Verify no TypeScript errors**

Run: `pnpm build`
Expected: Build succeeds (will fail until AduuDetailPage is updated in Task 2)

---

### Task 2: Update AduuDetailPage to manage ancestorDepth state

**Files:**
- Modify: `src/pages/AduuDetailPage.tsx`

**Step 1: Add ancestorDepth state and pass to useFamilyTree and FamilyTree**

Changes needed:
1. Add `useState` for `ancestorDepth` (default 3)
2. Pass `ancestorDepth` to `useFamilyTree` call
3. Pass `ancestorDepth` and `onDepthChange` props to `<FamilyTree>`

In the imports area (around line 31), no changes needed — `useState` already imported.

After `const aduuId = Number(id)` (around line 57), add:
```tsx
const [ancestorDepth, setAncestorDepth] = useState(3)
```

Change the `useFamilyTree` call (line 58) from:
```tsx
const { data: familyTree } = useFamilyTree(aduuId)
```
to:
```tsx
const { data: familyTree } = useFamilyTree(aduuId, { ancestorDepth })
```

Change the `<FamilyTree>` usage (around line 444) from:
```tsx
<FamilyTree
  currentHorse={{
    id: aduu.id,
    ner: aduu.ner,
    huis: aduu.huis,
    zupisnuud: aduu.zupisnuud,
  }}
  ancestors={familyTree.ancestors}
  descendants={familyTree.descendants}
/>
```
to:
```tsx
<FamilyTree
  currentHorse={{
    id: aduu.id,
    ner: aduu.ner,
    huis: aduu.huis,
    zupisnuud: aduu.zupisnuud,
  }}
  ancestors={familyTree.ancestors}
  descendants={familyTree.descendants}
  ancestorDepth={ancestorDepth}
  onDepthChange={setAncestorDepth}
/>
```

**Step 2: Verify build**

Run: `pnpm build`
Expected: Build succeeds with no errors

---

### Task 3: Replace CSS — remove old .ft-* styles, add pedigree table styles

**Files:**
- Modify: `src/App.css` — replace lines 773-1146

**Step 1: Replace the entire Family Tree CSS section (lines 773-end) with new pedigree table styles**

Remove everything from `/* ==================== Family Tree ==================== */` to end of file, replace with:

```css
/* ==================== Pedigree Table ==================== */
.pedigree-card {
  margin-bottom: 24px;
}

.pedigree-table-wrapper {
  overflow-x: auto;
  padding: 16px;
}

.pedigree-table {
  border-collapse: collapse;
  width: 100%;
  min-width: 600px;
}

.pedigree-table td {
  border: 1px solid #e8e8e8;
  vertical-align: middle;
}

[data-theme='dark'] .pedigree-table td {
  border-color: #303030;
}

.pedigree-cell {
  padding: 8px 12px;
  transition: background-color 0.2s;
}

.pedigree-cell:hover:not(.pedigree-empty):not(.pedigree-current) {
  filter: brightness(0.95);
}

.pedigree-cell-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: center;
  text-align: center;
  min-width: 100px;
}

.pedigree-name {
  font-weight: 600;
  font-size: 13px;
  color: inherit;
}

.pedigree-name-main {
  font-size: 15px;
}

.pedigree-name-empty {
  color: #adb5bd;
  font-style: italic;
  font-size: 12px;
}

.pedigree-uulder {
  font-size: 11px;
  opacity: 0.75;
}

.pedigree-year {
  font-size: 11px;
  opacity: 0.6;
}

/* Male cell */
.pedigree-male {
  background-color: #f0f5ff;
  color: #1d39c4;
}

[data-theme='dark'] .pedigree-male {
  background-color: #111d2c;
  color: #69b1ff;
}

/* Female cell */
.pedigree-female {
  background-color: #fff0f6;
  color: #c41d7f;
}

[data-theme='dark'] .pedigree-female {
  background-color: #291321;
  color: #f759ab;
}

/* Empty cell */
.pedigree-empty {
  background-color: #fafafa;
  text-align: center;
}

[data-theme='dark'] .pedigree-empty {
  background-color: #1f1f1f;
}

/* Current horse cell */
.pedigree-current {
  background-color: #e6f4ff;
  border-right: 3px solid #1677ff !important;
}

[data-theme='dark'] .pedigree-current {
  background-color: #111d2c;
  border-right-color: #1668dc !important;
}

/* Descendants section */
.pedigree-descendants {
  padding: 16px;
  border-top: 1px solid #f0f0f0;
}

[data-theme='dark'] .pedigree-descendants {
  border-top-color: #303030;
}

.pedigree-descendants-title {
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 8px;
  color: #595959;
}

[data-theme='dark'] .pedigree-descendants-title {
  color: #a6a6a6;
}

.pedigree-descendants-list {
  display: flex;
  flex-wrap: wrap;
}
```

**Step 2: Verify build**

Run: `pnpm build`
Expected: Build succeeds

---

### Task 4: Build verification and commit

**Step 1: Run full build**

Run: `pnpm build`
Expected: No errors

**Step 2: Test in dev server**

Run: `pnpm dev`
Check: Navigate to any horse detail page, verify pedigree table renders correctly

**Step 3: Commit**

```bash
git add src/components/FamilyTree.tsx src/pages/AduuDetailPage.tsx src/App.css
git commit -m "feat: replace family tree visualization with pedigree table

Rewrite FamilyTree component to use horizontal table layout with
rowspan-based ancestor cells. Add configurable depth selector (1-4).
Male cells blue, female cells pink, with dark mode support."
```
