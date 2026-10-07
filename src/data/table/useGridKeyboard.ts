'use client';
// useGridKeyboard (SURF-160): keyboard model for mode='grid'.
// Arrow keys move the active cell; Home/End row edges, Ctrl+Home/End table
// edges, PageUp/Down scrolls by viewport. Cells get tabIndex -1; the grid
// keeps one roving focus.
import * as React from 'react';

export interface GridKeyboardOptions {
  onActiveCellChange?: ((rowId: string, columnId: string) => void) | undefined;
}

export function useGridKeyboard(
  scroller: React.RefObject<HTMLElement | null>,
  _options: GridKeyboardOptions = {},
) {
  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      const root = scroller.current;
      if (root === null) return;
      const cell = (e.target as HTMLElement).closest('[data-ag-cell]') as HTMLElement | null;
      const row = (cell?.closest('[data-row-id]') ?? null) as Element | null;
      if (cell === null || row === null) {
        // Focus inside the grid but not on a cell: move to first cell.
        if ((e.key === 'ArrowDown' || e.key === 'ArrowRight') && root.contains(e.target as Node)) {
          root.querySelector<HTMLElement>('[data-ag-cell]')?.focus();
          e.preventDefault();
        }
        return;
      }
      const colId = cell.getAttribute('data-ag-cell')!;
      const rowId = row.getAttribute('data-row-id')!;
      const cellsOfRow = (r: Element) => Array.from(r.querySelectorAll<HTMLElement>('[data-ag-cell]'));
      const idx = cellsOfRow(row).findIndex((c) => c === cell);
      const cellFrom = (r: Element | null | undefined, i: number) =>
        r == null ? undefined : cellsOfRow(r)[Math.max(0, Math.min(i, cellsOfRow(r).length - 1))];
      const focusAt = (r: Element | null, i: number) => {
        const cells = r === null ? [] : cellsOfRow(r);
        const target = cells[Math.max(0, Math.min(i, cells.length - 1))];
        if (target !== undefined) {
          target.focus();
          _options.onActiveCellChange?.(
            r!.getAttribute('data-row-id')!,
            target.getAttribute('data-ag-cell')!,
          );
        }
      };
      switch (e.key) {
        case 'ArrowRight':
          focusAt(row, idx + 1);
          break;
        case 'ArrowLeft':
          focusAt(row, idx - 1);
          break;
        case 'ArrowDown':
          focusAt(row.nextElementSibling ?? null, idx);
          break;
        case 'ArrowUp':
          focusAt(row.previousElementSibling ?? null, idx);
          break;
        case 'Home':
          focusAt(e.ctrlKey || e.metaKey ? root.querySelector('[data-row-id]') : row, e.ctrlKey || e.metaKey ? 0 : 0);
          break;
        case 'End': {
          const r = e.ctrlKey || e.metaKey ? root.querySelectorAll('[data-row-id]') : null;
          const targetRow = r ? r[r.length - 1]! : row;
          focusAt(targetRow, e.ctrlKey || e.metaKey ? 1e9 : 1e9);
          break;
        }
        case 'PageDown':
          root.scrollTop += root.clientHeight;
          break;
        case 'PageUp':
          root.scrollTop -= root.clientHeight;
          break;
        default:
          return;
      }
      e.preventDefault();
    },
    [scroller, _options],
  );
  return { onKeyDown };
}
