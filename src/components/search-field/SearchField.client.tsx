'use client';

import * as React from 'react';
import { Field as Base } from '@base-ui/react/field';
import { Input as BaseInput } from '@base-ui/react/input';
import { cn } from '../../internal';
import { toChangeDetails } from '../../foundation';
import { sizeAttrs } from '../control-shared/size';
import { CONTROL_MESSAGES } from '../control-shared/messages';
import { IconButton } from '../icon-button';
import { Kbd } from '../kbd';
import type { SearchFieldProps } from './SearchField.types';

function SearchGlyph() {
  return (
    <svg data-ag-part="icon" aria-hidden="true" viewBox="0 0 16 16" fill="none" width="1em" height="1em">
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" />
      <path d="m10.5 10.5 3 3" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
}

/** SearchField — BU Field + Input type="search" + IconButton clear (REQ-CMP-63/64). */
export function SearchField({
  value,
  defaultValue,
  onValueChange,
  onClear,
  clearLabel,
  shortcut,
  loading,
  label,
  description,
  error,
  size,
  required,
  disabled,
  readOnly,
  name,
  id,
  placeholder,
  autoComplete,
  variant,
  refraction,
  className,
  ref,
  ...rest
}: SearchFieldProps) {
  const autoId = React.useId();
  const controlId = id ?? autoId;
  const innerRef = React.useRef<HTMLInputElement | null>(null);
  const [innerValue, setInnerValue] = React.useState<string>(defaultValue ?? '');
  const current = value !== undefined ? value : innerValue;
  const hasValue = current.length > 0;

  const handleValue = (v: string, details: unknown) => {
    if (value === undefined) setInnerValue(v);
    onValueChange?.(v, toChangeDetails(details));
  };

  const clear = (ev: React.SyntheticEvent | Event) => {
    const details = toChangeDetails(ev);
    if (value === undefined) {
      // Uncontrolled BU Input: mutate the DOM value and dispatch a native
      // input event so BU's internal state follows; that fires handleValue('').
      const el = innerRef.current;
      if (el) {
        // React-safe programmatic set: the prototype setter marks the change
        // as user-originated so the input event reaches BU's onValueChange.
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
        setter?.call(el, '');
        el.dispatchEvent(new window.Event('input', { bubbles: true }));
      }
      setInnerValue('');
    } else {
      onValueChange?.('', details);
    }
    onClear?.(details);
    innerRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && hasValue && !readOnly) {
      e.stopPropagation();
      clear(e.nativeEvent);
    }
    // Escape on an EMPTY field propagates untouched (layer stack).
  };

  const setRefs = (el: HTMLInputElement | null) => {
    innerRef.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
  };

  const invalid = error !== undefined && error !== null;

  return (
    <Base.Root
      data-ag-part="root"
      className={cn('ag-search-field', className)}
      invalid={invalid}
      disabled={disabled}
      name={name}
      aria-busy={loading ? true : undefined}
      {...(variant !== undefined ? { 'data-ag-variant': variant } : {})}
      {...(refraction === true ? { 'data-ag-refraction': true } : {})}
    >
      {label !== undefined && label !== null ? <Base.Label data-ag-part="label">{label}</Base.Label> : null}
      <div data-ag-part="control-shell" className="ag-sf-shell">
        <SearchGlyph />
        <BaseInput
          id={controlId}
          type="search"
          {...(value !== undefined ? { value } : {})}
          {...(defaultValue !== undefined ? { defaultValue } : {})}
          onValueChange={(v, details) => handleValue(v, details)}
          onKeyDown={onKeyDown}
          data-ag-part="control"
          {...sizeAttrs(size)}
          placeholder={placeholder}
          required={required}
          readOnly={readOnly}
          autoComplete={autoComplete}
          ref={setRefs}
          aria-label={rest['aria-label']}
          aria-labelledby={rest['aria-labelledby']}
          aria-describedby={rest['aria-describedby']}
        />
        {loading ? <span data-ag-part="spinner" aria-hidden="true" /> : null}
        {shortcut !== undefined && !hasValue ? (
          <span data-ag-part="shortcut">
            <Kbd>{shortcut}</Kbd>
          </span>
        ) : null}
        {/* REQ-64: clear reachable by Tab only while the field has a value */}
        {hasValue && !readOnly ? (
          <IconButton
            data-ag-part="clear"
            suppressInnerParts
            variant="identity"
            label={clearLabel ?? CONTROL_MESSAGES.clearSearch}
            icon={<span aria-hidden="true">×</span>}
            onClick={clear}
            size="sm"
          />
        ) : null}
      </div>
      {description !== undefined && description !== null ? (
        <Base.Description data-ag-part="description">{description}</Base.Description>
      ) : null}
      {invalid ? <Base.Error data-ag-part="error" match={true}>{error}</Base.Error> : null}
    </Base.Root>
  );
}
