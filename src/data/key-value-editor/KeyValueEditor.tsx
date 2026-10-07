'use client';
/* KeyValueEditor (SURF-261, REQ-SURF-89): rows of key/value text fields,
   add/remove buttons, duplicate-key validation, Enter-in-last-value adds a
   row. CMP TextField doesn't exist in this worktree yet (CMP lane in
   flight), so inputs are plain <input> styled by the field — the compat
   contract is the prop surface, not the inner field lib. */
import * as React from 'react';

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

export function KeyValueEditor({
  value,
  defaultValue,
  onValueChange,
  labels,
  disabled = false,
  className,
}: KeyValueEditorProps) {
  const [inner, setInner] = React.useState<readonly KeyValuePair[]>(defaultValue ?? [{ key: '', value: '' }]);
  const pairs = value ?? inner;
  const setPairs = (next: KeyValuePair[]) => {
    if (value === undefined) setInner(next);
    onValueChange?.(next);
  };
  const msgs = {
    key: labels?.key ?? 'Key',
    value: labels?.value ?? 'Value',
    remove: labels?.remove ?? 'Remove',
    add: labels?.add ?? 'Add',
    duplicate: labels?.duplicate ?? 'Duplicate key',
  };
  const seen = new Map<string, number>();
  pairs.forEach((p, i) => {
    if (p.key !== '') seen.set(p.key, (seen.get(p.key) ?? 0) + 1);
  });
  const isDuplicate = (k: string) => k !== '' && (seen.get(k) ?? 0) > 1;

  const update = (i: number, patch: Partial<KeyValuePair>) =>
    setPairs(pairs.map((p, j) => (j === i ? { ...p, ...patch } : p)));
  const remove = (i: number) => setPairs(pairs.filter((_, j) => j !== i));
  const add = () => setPairs([...pairs, { key: '', value: '' }]);

  return (
    <div data-ag-part="key-value-editor" className={`ag-kv${className ? ` ${className}` : ''}`}>
      {pairs.map((p, i) => {
        const dup = isDuplicate(p.key);
        return (
          <div key={i} data-ag-part="key-value-row" className="ag-kv__row">
            <input
              type="text"
              aria-label={`${msgs.key} ${i + 1}`}
              value={p.key}
              disabled={disabled}
              aria-invalid={dup || undefined}
              data-ag-part="key-input"
              className="ag-kv__input"
              onChange={(e) => update(i, { key: e.target.value })}
            />
            <input
              type="text"
              aria-label={`${msgs.value} ${i + 1}`}
              value={p.value}
              disabled={disabled}
              data-ag-part="value-input"
              className="ag-kv__input"
              onChange={(e) => update(i, { value: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && i === pairs.length - 1) {
                  e.preventDefault();
                  add();
                }
              }}
            />
            <button
              type="button"
              data-ag-part="key-value-remove"
              className="ag-kv__remove"
              aria-label={`${msgs.remove} ${p.key !== '' ? p.key : `row ${i + 1}`}`}
              disabled={disabled}
              onClick={() => remove(i)}
            >
              ×
            </button>
            {dup ? (
              <p role="alert" data-ag-part="key-value-error" className="ag-kv__error">
                {msgs.duplicate}: {p.key}
              </p>
            ) : null}
          </div>
        );
      })}
      <button type="button" data-ag-part="key-value-add" className="ag-kv__add" disabled={disabled} onClick={add}>
        {msgs.add}
      </button>
    </div>
  );
}
