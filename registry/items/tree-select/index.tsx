/* tree-select (REQ-SURF-174): CMP Select (Select.Root / Trigger / Content
   popup) from 'aura-glass' with a TreeView from 'aura-glass/data' inside the
   popup. Picking a tree node commits it as the Select value, so the trigger's
   Select.Value renders that node's label and the popup closes. */
'use client';
import * as React from 'react';
import { Select } from 'aura-glass';
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

/** key -> label for every node (Select.Value resolves the trigger label from it). */
function flatten(items: readonly TreeSelectItem[]): Record<string, string> {
  const m: Record<string, string> = {};
  const walk = (list: readonly TreeSelectItem[]) => { for (const i of list) { m[i.key] = i.label; if (i.children) walk(i.children); } };
  walk(items);
  return m;
}

export function TreeSelect({ items, label, value, defaultValue, onValueChange, placeholder = 'Choose…' }: TreeSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [inner, setInner] = React.useState<string | undefined>(defaultValue);
  const selected = value ?? inner;
  const labels = React.useMemo(() => flatten(items), [items]);
  const labelId = React.useId();
  const commit = (key: string) => {
    if (value === undefined) setInner(key);
    onValueChange?.(key);
    setOpen(false);
  };
  return (
    <span data-ag-part="tree-select" className="ag-tree-select">
      {label !== undefined ? <span id={labelId} className="ag-tree-select__label">{label}</span> : null}
      <Select.Root<string>
        items={labels}
        value={selected ?? null}
        open={open}
        onOpenChange={(o) => setOpen(o)}
        onValueChange={(v) => { if (typeof v === 'string') commit(v); }}
      >
        <Select.Trigger
          placeholder={placeholder}
          {...(label !== undefined ? { 'aria-labelledby': labelId } : { 'aria-label': 'Choose' })}
        />
        <Select.Content className="ag-tree-select__popup">
          <TreeView
            items={items}
            {...(label !== undefined ? { 'aria-labelledby': labelId } : { 'aria-label': 'Options' })}
            selectionMode="single"
            selectedKeys={selected !== undefined ? [selected] : []}
            onSelectionChange={(keys) => {
              const k = [...keys][0];
              if (k !== undefined) commit(String(k));
            }}
          />
        </Select.Content>
      </Select.Root>
    </span>
  );
}
