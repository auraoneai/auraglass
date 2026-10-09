'use client';

import * as React from 'react';
import { Field as Base } from '@base-ui/react/field';
import { Input as BaseInput } from '@base-ui/react/input';
import { cn } from '../../internal';
import { toChangeDetails } from '../../foundation';
import { sizeAttrs } from '../control-shared/size';
import { warnControlledSwitch } from '../control-shared/value';
import type { TextFieldProps } from './TextField.types';

/** TextField — 'use client' leaf on BU Field + Input (REQ-CMP-60..62).
 * Single-line uses BU Input; multiline uses Field.Control rendering a textarea
 * (absorbs GlassTextarea). No onChange prop by contract. */
export function TextField({
  value,
  defaultValue,
  onValueChange,
  label,
  description,
  error,
  multiline,
  rows = 3,
  autoResize,
  maxRows = 8,
  startAdornment,
  endAdornment,
  size,
  required,
  disabled,
  readOnly,
  name,
  id,
  type = 'text',
  placeholder,
  autoComplete,
  maxLength,
  showCount,
  validate,
  validationMode,
  className,
  ref,
  ...rest
}: TextFieldProps) {
  const wasControlled = React.useRef(value !== undefined);
  const autoId = React.useId();
  const controlId = id ?? autoId;
  const [count, setCount] = React.useState(() => (value ?? defaultValue ?? '').length);
  const taRef = React.useRef<HTMLTextAreaElement | null>(null);

  /* REQ-CMP-60: when field-sizing is unsupported, grow the textarea on input
     via scrollHeight capped at maxRows * line-height. */
  const autoResizeViaScroll = React.useCallback(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    const lh = parseFloat(getComputedStyle(ta).lineHeight) || 20;
    const max = lh * maxRows;
    ta.style.height = `${Math.min(ta.scrollHeight, max)}px`;
    ta.style.overflowY = ta.scrollHeight > max ? 'auto' : 'hidden';
  }, [maxRows]);

  if (process.env.NODE_ENV !== 'production') {
    warnControlledSwitch('TextField', 'value', wasControlled.current, value !== undefined);
    wasControlled.current = value !== undefined;
  }

  const invalid = error !== undefined && error !== null;
  const controlProps = {
    'data-ag-part': 'control',
    ...sizeAttrs(size),
    placeholder,
    required,
    readOnly,
    maxLength,
    'aria-label': rest['aria-label'],
    'aria-labelledby': rest['aria-labelledby'],
    'aria-describedby': rest['aria-describedby'],
  } as const;

  const fieldSizingSupported =
    typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('field-sizing', 'content');
  const manualResize = !!autoResize && !fieldSizingSupported;
  React.useEffect(() => {
    if (manualResize) autoResizeViaScroll();
  }, [manualResize, autoResizeViaScroll, value]);

  const handleValue = (v: string, details: unknown) => {
    setCount(v.length);
    if (manualResize) autoResizeViaScroll();
    onValueChange?.(v, toChangeDetails(details));
  };

  /* controlled counter derives from `value` */
  const shownCount = value !== undefined ? value.length : count;

  return (
    <Base.Root
      data-ag-part="root"
      className={cn('ag-text-field', className)}
      invalid={invalid}
      disabled={disabled}
      name={name}
      validate={validate}
      validationMode={validationMode}
    >
      {label !== undefined && label !== null ? <Base.Label data-ag-part="label">{label}</Base.Label> : null}
      <div data-ag-part="control-shell" className="ag-tf-shell">
        {startAdornment !== undefined && startAdornment !== null ? (
          <span data-ag-part="adornment-start">{startAdornment}</span>
        ) : null}
        {multiline ? (
          <Base.Control
            id={controlId}
            render={
              <textarea
                id={controlId}
                rows={rows}
                {...(value !== undefined ? { value } : {})}
                {...(defaultValue !== undefined ? { defaultValue } : {})}
                ref={taRef}
                onChange={(e) => handleValue(e.target.value, e.nativeEvent)}
                style={
                  autoResize
                    ? ({
                        ...(fieldSizingSupported ? { fieldSizing: 'content' } : { overflowY: 'hidden' }),
                        maxBlockSize: `calc(var(--ag-type-body-leading) * ${maxRows})`,
                      } as React.CSSProperties)
                    : undefined
                }
              />
            }
            ref={ref as React.Ref<HTMLElement>}
            {...controlProps}
          />
        ) : (
          <BaseInput
            id={controlId}
            type={type}
            {...(value !== undefined ? { value } : {})}
            {...(defaultValue !== undefined ? { defaultValue } : {})}
            onValueChange={(v, details) => handleValue(v, details)}
            autoComplete={autoComplete}
            ref={ref as React.Ref<HTMLInputElement>}
            {...controlProps}
          />
        )}
        {endAdornment !== undefined && endAdornment !== null ? (
          <span data-ag-part="adornment-end">{endAdornment}</span>
        ) : null}
      </div>
      {description !== undefined && description !== null ? (
        <Base.Description data-ag-part="description">{description}</Base.Description>
      ) : null}
      {invalid ? <Base.Error data-ag-part="error" match={true}>{error}</Base.Error> : null}
      {showCount ? (
        <span data-ag-part="counter">
          {shownCount}
          {maxLength !== undefined ? `/${maxLength}` : ''}
        </span>
      ) : null}
    </Base.Root>
  );
}
