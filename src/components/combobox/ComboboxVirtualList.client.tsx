'use client';

/* CMP-185 (REQ-CMP-72): virtual list for >200-item Combobox. Loaded via dynamic
   import() by Combobox.Content so @tanstack/react-virtual stays out of the base
   chunk. Each row keeps aria-setsize = total and aria-posinset = 1-based index;
   DOM option count <= visible + 2 x overscan. */
import * as React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Combobox as Base } from '@base-ui/react/combobox';

export const VIRTUAL_OVERSCAN = 5;

export interface ComboboxVirtualListProps<Item> {
  items: readonly Item[];
  /** Estimated row block-size in px. */
  estimateSize?: number;
  children: (item: Item, index: number) => React.ReactNode;
}

export function ComboboxVirtualList<Item>({ items, estimateSize = 32, children }: ComboboxVirtualListProps<Item>) {
  const parentRef = React.useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: items.length,
    initialRect: { width: 320, height: 288 },
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan: VIRTUAL_OVERSCAN,
  });
  return (
    <div ref={parentRef} className="ag-combobox-vscroll" style={{ overflowY: 'auto', maxBlockSize: 'inherit' }}>
      <div style={{ blockSize: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map((row) => {
          const node = children(items[row.index] as Item, row.index);
          const rendered = React.isValidElement(node)
            ? React.cloneElement(node as React.ReactElement<Record<string, unknown>>, {
                'aria-setsize': items.length,
                'aria-posinset': row.index + 1,
              })
            : node;
          return (
            <div
              key={row.key}
              style={{
                position: 'absolute',
                insetInlineStart: 0,
                insetBlockStart: 0,
                inlineSize: '100%',
                transform: `translateY(${row.start}px)`,
              }}
            >
              {rendered}
            </div>
          );
        })}
      </div>
    </div>
  );
}
