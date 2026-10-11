'use client';
/* KeyValueEditor (SURF-261, REQ-SURF-89): rows of CMP TextField key/value
   fields (Base UI Field.Root + Field.Error inside the CMP seam — SURF never
   imports Base UI directly, REQ-CMP-01), add/remove buttons,
   duplicate-key validation (Field invalid + Field.Error linked through
   aria-describedby), Enter in the last value adds a row and focuses its key
   field. Rows carry stable ids generated on add, so removing a middle row
   never shifts other rows' DOM, values or focus. */
import * as React from 'react';
import { TextField } from '../../components/text-field';

export interface KeyValuePair {
  key: string;
  value: string;
}

export interface KeyValueEditorProps {
  value?: readonly KeyValuePair[] | undefined;
  defaultValue?: readonly KeyValuePair[] | undefined;
  onValueChange?: ((pairs: KeyValuePair[]) => void) | undefined;
  addLabel?: string | undefined;
  labels?: { key?: string | undefined; value?: string | undefined; remove?: string | undefined; add?: string | undefined; duplicate?: string | undefined } | undefined;
  disabled?: boolean | undefined;
  className?: string | undefined;
}

/** Keeps one stable id per row. Edits made through this component splice the
    id list in step with the pairs; a controlled `value` whose length changes
    from outside is reconciled by appending/truncating at the end. */
function useRowIds(length: number) {
  const seq = React.useRef(0);
  const prefix = React.useId();
  const next = () => `${prefix}r${seq.current++}`;
  const ids = React.useRef<string[]>([]);
  while (ids.current.length < length) ids.current.push(next());
  if (ids.current.length > length) ids.current = ids.current.slice(0, length);
  return { ids: ids.current, next, set: (v: string[]) => { ids.current = v; } };
}

export function KeyValueEditor({
  value,
  defaultValue,
  onValueChange,
  addLabel,
  labels,
  disabled = false,
  className,
}: KeyValueEditorProps) {
  const [inner, setInner] = React.useState<readonly KeyValuePair[]>(defaultValue ?? [{ key: '', value: '' }]);
  const pairs = value ?? inner;
  const rows = useRowIds(pairs.length);
  const keyRefs = React.useRef(new Map<string, HTMLInputElement | HTMLTextAreaElement>());
  const removeRefs = React.useRef(new Map<string, HTMLButtonElement>());
  const addRef = React.useRef<HTMLButtonElement>(null);
  const pendingFocus = React.useRef<{ id: string; target: 'key' | 'remove' } | 'add' | null>(null);

  React.useEffect(() => {
    const p = pendingFocus.current;
    if (p === null) return;
    pendingFocus.current = null;
    if (p === 'add') addRef.current?.focus();
    else (p.target === 'key' ? keyRefs.current.get(p.id) : removeRefs.current.get(p.id))?.focus();
  });

  const setPairs = (next: KeyValuePair[], nextIds: string[]) => {
    rows.set(nextIds);
    if (value === undefined) setInner(next);
    onValueChange?.(next);
  };
  const msgs = {
    key: labels?.key ?? 'Key',
    value: labels?.value ?? 'Value',
    remove: labels?.remove ?? 'Remove',
    add: labels?.add ?? addLabel ?? 'Add',
    duplicate: labels?.duplicate ?? 'Duplicate key',
  };
  const seen = new Map<string, number>();
  pairs.forEach((p) => {
    if (p.key !== '') seen.set(p.key, (seen.get(p.key) ?? 0) + 1);
  });
  const isDuplicate = (k: string) => k !== '' && (seen.get(k) ?? 0) > 1;

  const update = (i: number, patch: Partial<KeyValuePair>) =>
    setPairs(pairs.map((p, j) => (j === i ? { ...p, ...patch } : p)), rows.ids);
  const remove = (i: number) => {
    const nextIds = rows.ids.filter((_, j) => j !== i);
    // The clicked button unmounts: hand focus to the row that takes its
    // place (or the previous row, or the add button when none are left).
    const heir = nextIds[i] ?? nextIds[i - 1];
    pendingFocus.current = heir !== undefined ? { id: heir, target: 'remove' } : 'add';
    setPairs(pairs.filter((_, j) => j !== i), nextIds);
  };
  const add = () => {
    const id = rows.next();
    pendingFocus.current = { id, target: 'key' };
    setPairs([...pairs, { key: '', value: '' }], [...rows.ids, id]);
  };

  return (
    <div data-ag-part="key-value-editor" className={`ag-kv${className ? ` ${className}` : ''}`}>
      {pairs.map((p, i) => {
        const id = rows.ids[i]!;
        const dup = isDuplicate(p.key);
        return (
          <div key={id} data-ag-part="key-value-row" data-ag-row-id={id} className="ag-kv__row">
            <div data-ag-part="key-input" className="ag-kv__field">
              <TextField
                aria-label={`${msgs.key} ${i + 1}`}
                value={p.key}
                disabled={disabled}
                error={dup ? `${msgs.duplicate}: ${p.key}` : undefined}
                ref={(el) => {
                  if (el) keyRefs.current.set(id, el);
                  else keyRefs.current.delete(id);
                }}
                onValueChange={(v) => update(i, { key: v })}
              />
            </div>
            <div
              data-ag-part="value-input"
              className="ag-kv__field"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && i === pairs.length - 1 && (e.target as HTMLElement).tagName === 'INPUT') {
                  e.preventDefault();
                  add();
                }
              }}
            >
              <TextField
                aria-label={`${msgs.value} ${i + 1}`}
                value={p.value}
                disabled={disabled}
                onValueChange={(v) => update(i, { value: v })}
              />
            </div>
            <button
              type="button"
              data-ag-part="key-value-remove"
              className="ag-kv__remove"
              aria-label={`${msgs.remove} ${p.key !== '' ? p.key : `row ${i + 1}`}`}
              disabled={disabled}
              ref={(el) => {
                if (el) removeRefs.current.set(id, el);
                else removeRefs.current.delete(id);
              }}
              onClick={() => remove(i)}
            >
              ×
            </button>
          </div>
        );
      })}
      <button
        type="button"
        ref={addRef}
        data-ag-part="key-value-add"
        className="ag-kv__add"
        disabled={disabled}
        onClick={add}
      >
        {msgs.add}
      </button>
    </div>
  );
}
