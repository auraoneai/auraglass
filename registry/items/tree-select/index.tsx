/* tree-select (REQ-SURF-174): CMP Select-style trigger + TreeView inside a
   popover; selection announced on the trigger. */
'use client';
import * as React from 'react';
import { TreeView } from 'aura-glass/data';

export interface TreeSelectItem { [k: string]: unknown; key: string; label: string; children?: TreeSelectItem[] | undefined }

export interface TreeSelectProps {
  items: readonly TreeSelectItem[];
  label?: string | undefined;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onValueChange?: ((key: string) => void) | undefined;
  placeholder?: string | undefined;
}

function flatten(items: readonly TreeSelectItem[]): Map<string, string> {
  const m = new Map<string, string>();
  const walk = (list: readonly TreeSelectItem[]) => { for (const i of list) { m.set(i.key, i.label); if (i.children) walk(i.children); } };
  walk(items);
  return m;
}

export function TreeSelect({ items, label, value, defaultValue, onValueChange, placeholder = 'Choose…' }: TreeSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [inner, setInner] = React.useState<string | undefined>(defaultValue);
  const selected = value ?? inner;
  const labels = React.useMemo(() => flatten(items), [items]);
  return (
    <span data-ag-part="tree-select" className="ag-tree-select">
      {label !== undefined ? <span className="ag-tree-select__label">{label}</span> : null}
      <button type="button" aria-haspopup="tree" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {(selected !== undefined ? labels.get(selected) : undefined) ?? placeholder}
      </button>
      {open ? (
        <div role="dialog" aria-label={label ?? 'Choose'} className="ag-tree-select__popup">
          <TreeView
            items={items}
            aria-label={label ?? 'Options'}
            selectionMode="single"
            selectedKeys={selected !== undefined ? [selected] : []}
            onSelectionChange={(keys: Iterable<unknown>) => {
              const k = [...keys][0];
              if (k !== undefined) { setInner(String(k)); onValueChange?.(String(k)); setOpen(false); }
            }}
          />
        </div>
      ) : null}
    </span>
  );
}
