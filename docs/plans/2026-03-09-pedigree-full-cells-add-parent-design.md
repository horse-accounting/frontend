# Pedigree Table — Full Cells + Add Parent Flow

## Summary

Two improvements to the pedigree table:
1. Make cells fill entire td area (styling fix)
2. Click "Тодорхойгүй" empty cells to add a parent horse

## Full Cell Styling

Set `height: 100%` on `<td>` and `.pedigree-cell` so background colors and click targets span the full cell area.

## Add Parent Flow

When empty ancestor cell is clicked:
1. Open `AddEditAduuModal` with pre-filled `huis` (er for father slots, em for mother slots)
2. User creates new horse
3. On success: call `useUpdateAduu` to set `fatherId` or `motherId` on the **child horse** (the horse one column to the left in the tree)
4. Invalidate family tree query to refresh

### Data per empty cell
- `childId` — which horse's parent is being added
- `parentType` — `'father'` or `'mother'`

### Files to modify
- `src/components/FamilyTree.tsx` — track childId/parentType in collectCells, add modal state, handle create+link flow
- `src/App.css` — height: 100% on td and .pedigree-cell
