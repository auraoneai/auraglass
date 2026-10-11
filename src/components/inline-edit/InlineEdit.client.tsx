/* CMP-317: InlineEdit — <button data-ag-part='trigger'> shows the value;
   Enter/click switches to a textbox (BU Input) with focus+select; Enter commits
   onValueChange, Escape cancels back to the old value, blur commits.
   parts [root, trigger, input]. */
'use client';
import * as React from 'react';
import { Input } from '@base-ui/react/input';
import { cn } from '../../internal/index';

export interface InlineEditProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string, details: { committed: boolean }) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Force the editing state (stories, controlled editing). */
  editing?: boolean;
  'aria-label'?: string;
}

export function InlineEdit({
  value,
  defaultValue = '',
  onValueChange,
  placeholder = 'Empty',
  disabled,
  editing: editingProp,
  className,
  ref,
  'aria-label': ariaLabel,
  ...rest
}: InlineEditProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const current = value ?? uncontrolled;
  const [internalEditing, setEditing] = React.useState(false);
  const editing = editingProp ?? internalEditing;
  const [draft, setDraft] = React.useState(current);
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  const pendingFocus = React.useRef(false);

  // REQ-CMP-124: return focus to the trigger once editing ends.
  React.useLayoutEffect(() => {
    if (!editing && pendingFocus.current) {
      pendingFocus.current = false;
      buttonRef.current?.focus();
    }
  }, [editing]);

  const start = () => {
    if (disabled) return;
    setDraft(current);
    setEditing(true);
  };

  const commit = (committed: boolean, next: string) => {
    pendingFocus.current = true;
    setEditing(false);
    if (!committed) { setDraft(current); return; }
    if (next !== current) {
      if (value === undefined) setUncontrolled(next);
      onValueChange?.(next, { committed: true });
    }
  };

  return (
    <div
      {...rest}
      ref={ref}
      data-ag-part="root"
      data-state={editing ? 'active' : 'idle'}
      data-ag-material={editing ? 'content-sunken' : undefined}
      className={cn('ag-inline-edit', className)}
    >
      {editing ? (
        <Input
          data-ag-part="input"
          className="ag-inline-edit-input"
          aria-label={ariaLabel ?? 'Edit value'}
          value={draft}
          autoFocus
          onFocus={(e) => e.currentTarget.select()}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); commit(true, draft); }
            else if (e.key === 'Escape') { e.preventDefault(); commit(false, current); }
          }}
          onBlur={() => commit(true, draft)}
        />
      ) : (
        <button
          type="button"
          ref={buttonRef}
          data-ag-part="trigger"
          className="ag-inline-edit-trigger"
          disabled={disabled}
          aria-label={ariaLabel}
          onClick={start}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); start(); }
          }}
        >
          {current || <span className="ag-inline-edit-placeholder">{placeholder}</span>}
        </button>
      )}
    </div>
  );
}
