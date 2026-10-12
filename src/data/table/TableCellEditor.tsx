'use client';
/* TableCellEditor (REQ-SURF-79, 5.1 C-E): the inline editor a grid cell
   opens on Enter/F2 when its column declares `meta.editor`. It renders the
   CMP control for the kind — TextField ('text'), NumberField ('number'),
   Select ('select', items from `meta.options`) — and owns the editing
   keyboard: Enter (text/number) or choosing an option (select) commits and
   returns focus to the cell; Tab commits and lets focus move on; Escape
   cancels and returns focus to the cell. Leaving a text/number editor by
   pointer commits too. Table guards each edit session so a value commits
   exactly once. The editor never writes to `data`: it reports the value
   through `onCommit` (Table's `onCellEditCommit`).

   Every key event inside the editor stops at the wrapper, so the grid's
   roving keyboard, row Enter (onRowAction) and Space (selection) never see
   editing keys; events bubbling out of a portaled Select popup are stopped
   too but otherwise ignored (the popup owns them).

   Loaded lazily by Table (React.lazy), so a consumer bundle with code
   splitting fetches the CMP field controls only when a table can edit. */
import * as React from 'react';
import { TextField } from '../../components/text-field';
import { NumberField } from '../../components/number-field';
import { Select } from '../../components/select';
import type { TableDensity } from './types';

export type TableEditorKind = 'text' | 'number' | 'select';
export type TableEditValue = string | number | null;
export type TableEditCommitVia = 'enter' | 'tab' | 'select' | 'blur';

export interface TableCellEditorProps {
  kind: TableEditorKind;
  /** The cell's current value (cell.getValue()). */
  initialValue: unknown;
  options?: readonly { value: string; label: string }[] | undefined;
  /** Accessible name of the control (the column's headerLabel). */
  label: string;
  size: TableDensity;
  onCommit: (value: TableEditValue, via: TableEditCommitVia) => void;
  onCancel: () => void;
}

const toText = (v: unknown): string => (v === null || v === undefined ? '' : String(v));
const toNumber = (v: unknown): number | null => {
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  if (typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v))) return Number(v);
  return null;
};

const SelectTrigger = Select.Trigger as React.FC<Record<string, unknown>>;

export default function TableCellEditor({ kind, initialValue, options, label, size, onCommit, onCancel }: TableCellEditorProps) {
  const initial: TableEditValue = kind === 'number' ? toNumber(initialValue) : toText(initialValue);
  const draft = React.useRef<TableEditValue>(initial);
  const wrapper = React.useRef<HTMLDivElement | null>(null);

  // Opening moves focus into the control (and selects text for typing over).
  React.useLayoutEffect(() => {
    const control = wrapper.current?.querySelector<HTMLElement>('input, textarea, button, [role="combobox"]');
    control?.focus();
    if (control instanceof HTMLInputElement) control.select();
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!e.currentTarget.contains(e.target as Node) || e.nativeEvent.isComposing) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    } else if (e.key === 'Enter' && kind !== 'select') {
      e.preventDefault();
      onCommit(draft.current, 'enter');
    } else if (e.key === 'Tab') {
      // No preventDefault: Table puts focus back on the cell synchronously,
      // so the browser's Tab continues from the cell and leaves the grid.
      onCommit(draft.current, 'tab');
    }
  };

  const onBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (kind === 'select') return; // the popup takes focus while choosing
    const next = e.relatedTarget as Node | null;
    if (next !== null && e.currentTarget.contains(next)) return;
    onCommit(draft.current, 'blur');
  };

  let control: React.ReactNode;
  if (kind === 'number') {
    control = (
      <NumberField
        aria-label={label}
        size={size}
        defaultValue={initial as number | null}
        onValueChange={(v: number | null) => {
          draft.current = v;
        }}
      />
    );
  } else if (kind === 'select') {
    const items = Object.fromEntries((options ?? []).map((o) => [o.value, o.label]));
    control = (
      <Select.Root
        size={size}
        items={items}
        defaultValue={initial as string}
        onValueChange={(v) => {
          draft.current = (Array.isArray(v) ? v[0] : v) ?? null;
          onCommit(draft.current, 'select');
        }}
      >
        <SelectTrigger aria-label={label} />
        <Select.Content>
          {(options ?? []).map((o) => (
            <Select.Item key={o.value} value={o.value} label={o.label} />
          ))}
        </Select.Content>
      </Select.Root>
    );
  } else {
    control = (
      <TextField
        aria-label={label}
        size={size}
        defaultValue={initial as string}
        onValueChange={(v: string) => {
          draft.current = v;
        }}
      />
    );
  }

  return (
    <div
      ref={wrapper}
      className="ag-table__editor"
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      onClick={(e) => e.stopPropagation()}
    >
      {control}
    </div>
  );
}
