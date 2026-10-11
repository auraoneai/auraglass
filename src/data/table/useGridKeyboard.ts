'use client';
// useGridKeyboard (SURF-160, REQ-SURF-73): APG data-grid navigation for
// mode='grid'. Works on the FULL row model by id (not on the rendered DOM),
// so PageUp/PageDown and Ctrl+Home/End reach rows that virtualization has
// not mounted yet: the hook resolves the target {rowId, columnId} and hands
// it to `moveTo`, which scrolls the virtual row in first and then focuses
// it. Enter/Space are cell-level (Table owns selection + onRowAction).
// Size budget: SB-SURF-W2-USEGRIDKEYBOARD (≤2.5 KB gz).
import * as React from 'react';

export interface GridKeyboardOptions {
  /** Row ids of the full (sorted, pre-virtualization) row model. */
  rowIds: () => readonly string[];
  /** Visible leaf column ids in display order. */
  columnIds: () => readonly string[];
  /** Rows per page for PageUp/PageDown: floor(viewport / rowHeight). */
  pageRows: () => number;
  /** Activate + focus the target cell (scrolling it in first if needed). */
  moveTo: (rowId: string, columnId: string, rowIndex: number) => void;
}

export function useGridKeyboard(options: GridKeyboardOptions) {
  const opts = React.useRef(options);
  opts.current = options;
  const onKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    const cell = (e.target as HTMLElement).closest('[data-ag-cell]');
    const rowEl = cell?.closest('[data-row-id]');
    if (!cell || !rowEl) return;
    const { rowIds, columnIds, pageRows, moveTo } = opts.current;
    const rows = rowIds();
    const cols = columnIds();
    const r = rows.indexOf(rowEl.getAttribute('data-row-id')!);
    const c = cols.indexOf(cell.getAttribute('data-ag-cell')!);
    if (r < 0 || c < 0) return;
    const mod = e.ctrlKey || e.metaKey;
    let nr = r;
    let nc = c;
    switch (e.key) {
      case 'ArrowRight': nc = c + 1; break;
      case 'ArrowLeft': nc = c - 1; break;
      case 'ArrowDown': nr = r + 1; break;
      case 'ArrowUp': nr = r - 1; break;
      case 'Home': nc = 0; if (mod) nr = 0; break;
      case 'End': nc = cols.length - 1; if (mod) nr = rows.length - 1; break;
      case 'PageDown': nr = r + Math.max(1, pageRows()); break;
      case 'PageUp': nr = r - Math.max(1, pageRows()); break;
      default: return;
    }
    e.preventDefault();
    nr = Math.max(0, Math.min(nr, rows.length - 1));
    nc = Math.max(0, Math.min(nc, cols.length - 1));
    moveTo(rows[nr]!, cols[nc]!, nr);
  }, []);
  return { onKeyDown };
}
