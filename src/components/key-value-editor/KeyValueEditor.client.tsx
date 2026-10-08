'use client';
/* CMP-048: KeyValueEditor — rows of PRD-08 Field key/value inputs.
   value Array<{key,value}> + onValueChange; remove buttons are named
   'Remove row {key}'; duplicate keys mark the row invalid and render a
   Field.Error. Parts [root, list, item, input, actions, error].
   Exported from ./data only (entries contract). */
import * as React from 'react';
import { Field } from '../field';
import { Button } from '../button';
import { cn } from '../../internal/index';

export interface KeyValuePair {
  key: string;
  value: string;
}

export interface KeyValueEditorProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'onChange' | 'defaultValue' | 'ref'> {
  /** Controlled pairs. */
  value?: KeyValuePair[];
  /** Uncontrolled initial pairs. */
  defaultValue?: KeyValuePair[];
  /** Called with the next pairs array after any add/remove/edit. */
  onValueChange?: (value: KeyValuePair[]) => void;
  disabled?: boolean;
  /** Add-row button content; default "Add row". */
  addLabel?: React.ReactNode;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  className?: string;
  children?: undefined;
  ref?: React.Ref<HTMLDivElement>;
}

const DUPLICATE_MESSAGE = 'Duplicate key';

export function KeyValueEditor({
  value,
  defaultValue,
  onValueChange,
  disabled,
  addLabel = 'Add row',
  keyPlaceholder = 'Key',
  valuePlaceholder = 'Value',
  className,
  ref,
  ...rest
}: KeyValueEditorProps) {
  const [uncontrolled, setUncontrolled] = React.useState<KeyValuePair[]>(
    () => defaultValue ?? [{ key: '', value: '' }],
  );
  const rows = value ?? uncontrolled;

  const emit = (next: KeyValuePair[]) => {
    if (value === undefined) setUncontrolled(next);
    onValueChange?.(next);
  };
  const update = (index: number, patch: Partial<KeyValuePair>) => {
    const next = rows.slice();
    const current = next[index];
    if (!current) return;
    next[index] = { ...current, ...patch };
    emit(next);
  };
  const add = () => emit([...rows, { key: '', value: '' }]);
  const remove = (index: number) => emit(rows.filter((_, i) => i !== index));

  const duplicateKeys = new Set<string>();
  const seen = new Set<string>();
  for (const row of rows) {
    if (row.key === '') continue;
    if (seen.has(row.key)) duplicateKeys.add(row.key);
    seen.add(row.key);
  }

  return (
    <div
      {...rest}
      ref={ref}
      data-ag-part="root"
      role="group"
      aria-label={rest['aria-label'] ?? 'Key-value editor'}
      className={cn('ag-kv-editor', className)}
    >
      <div data-ag-part="list" className="ag-kv-editor-list">
        {rows.map((row, index) => {
          const duplicate = duplicateKeys.has(row.key);
          return (
            <Field.Root
              key={index}
              {...(duplicate ? { invalid: true } : {})}
              {...(disabled ? { disabled: true } : {})}
              className="ag-kv-editor-item"
            >
              <div data-ag-part="item" className="ag-kv-editor-row" role="group" aria-label={`Row ${index + 1}`}>
                <Field.Control
                  data-ag-part="input"
                  aria-label={`Key for row ${index + 1}`}
                  placeholder={keyPlaceholder}
                  value={row.key}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    update(index, { key: event.target.value })
                  }
                />
                <Field.Control
                  data-ag-part="input"
                  aria-label={`Value for row ${index + 1}`}
                  placeholder={valuePlaceholder}
                  value={row.value}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    update(index, { value: event.target.value })
                  }
                />
                <Button
                  variant="clear"
                  size="sm"
                  aria-label={`Remove row ${row.key || index + 1}`}
                  disabled={disabled}
                  onClick={() => remove(index)}
                >
                  Remove
                </Button>
              </div>
              {duplicate ? <Field.Error match={true}>{DUPLICATE_MESSAGE}</Field.Error> : null}
            </Field.Root>
          );
        })}
      </div>
      <div data-ag-part="actions" className="ag-kv-editor-actions">
        <Button variant="regular" size="sm" disabled={disabled} onClick={add}>
          {addLabel}
        </Button>
      </div>
    </div>
  );
}
