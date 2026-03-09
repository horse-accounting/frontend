# Ургын мод - Pedigree Table Design

## Summary

Replace the current tree visualization (FamilyTree.tsx) with a horizontal pedigree table using rowspan to merge ancestor cells, similar to ugshil.mn.

## Layout

- Columns go left-to-right: Current horse → Parents → Grandparents → Great-grandparents (etc.)
- Each cell shows: name (clickable link to `/aduu/:id`), gender icon (♂/♀)
- Male cells: blue-tinted background (`#f0f5ff`), Female cells: pink-tinted background (`#fff0f6`)
- Empty ancestors show "Тодорхойгүй" in gray
- Default `ancestorDepth: 3`, user can adjust with a selector (1-4)

## Data Flow

- Uses existing `useFamilyTree(id, { ancestorDepth })` hook
- Flatten the recursive `AncestorNode` tree into table rows with rowspan calculations
- No descendants in the pedigree table

## Component

- Rewrite `FamilyTree.tsx` — same props interface, table-based rendering
- Remove zoom/pan controls (not needed for a table)
- Add generation depth selector (1-4)
- Responsive: horizontal scroll on mobile
