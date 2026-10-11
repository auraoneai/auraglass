'use client';

import * as React from 'react';
import { NumberField as Base } from '@base-ui/react/number-field';
import { Field as BaseField } from '@base-ui/react/field';
import { cn } from '../../internal';
import { toChangeDetails } from '../../foundation';
import { materialProps } from '../../material';
import { sizeAttrs } from '../control-shared/size';
import { CONTROL_MESSAGES } from '../control-shared/messages';
import type { NumberFieldProps } from './NumberField.types';

/** NumberField — BU NumberField inside a Field shell (REQ-CMP-75..77). */
export function NumberField({
  onValueChange,
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
  scrub,
  variant,
  refraction,
  className,
  ref,
  ...rest
}: NumberFieldProps) {
  const autoId = React.useId();
  const controlId = id ?? autoId;
  const invalid = error !== undefined && error !== null;

  const labelEl =
    label !== undefined && label !== null ? (
      <BaseField.Label data-ag-part="label" htmlFor={controlId}>
        {label}
      </BaseField.Label>
    ) : null;

  return (
    <BaseField.Root
      data-ag-part="root"
      className={cn('ag-number-field', className)}
      invalid={invalid}
      disabled={disabled}
      name={name}
    >
      <Base.Root
        onValueChange={(v, details) => onValueChange?.(v, toChangeDetails(details))}
        disabled={disabled}
        {...(rest.defaultValue === null ? {} : { defaultValue: rest.defaultValue })}
        /* REQ-CMP-75: null is a valid controlled-empty — only omit value when
           it is undefined so a controlled empty actually clears. */
        {...(rest.value !== undefined ? { value: rest.value } : {})}
        min={rest.min}
        max={rest.max}
        step={rest.step}
        largeStep={rest.largeStep}
        smallStep={rest.smallStep}
        snapOnStep={rest.snapOnStep}
        allowOutOfRange={rest.allowOutOfRange}
        format={rest.format}
        locale={rest.locale}
        allowWheelScrub={rest.allowWheelScrub}
      >
        {scrub && label !== undefined && label !== null ? (
          <Base.ScrubArea data-ag-part="scrub-area">{label}</Base.ScrubArea>
        ) : (
          labelEl
        )}
        <Base.Group
          className="ag-nf-shell"
          data-ag-part="group"
          {...materialProps({
            layer: 'content',
            content: 'content-sunken',
            ...(variant !== undefined ? { variant } : {}),
            ...(refraction === true ? { refraction: true } : {}),
          })}
        >
          <Base.Decrement data-ag-part="decrement" aria-label={CONTROL_MESSAGES.decrease}>
            <span aria-hidden="true">−</span>
          </Base.Decrement>
          <Base.Input
            id={controlId}
            data-ag-part="input"
            {...sizeAttrs(size)}
            placeholder={placeholder}
            required={required}
            readOnly={readOnly}
            ref={ref}
            aria-label={rest['aria-label'] as string | undefined}
          />
          <Base.Increment data-ag-part="increment" aria-label={CONTROL_MESSAGES.increase}>
            <span aria-hidden="true">+</span>
          </Base.Increment>
        </Base.Group>
      </Base.Root>
      {description !== undefined && description !== null ? (
        <BaseField.Description data-ag-part="description">{description}</BaseField.Description>
      ) : null}
      {invalid ? (
        <BaseField.Error data-ag-part="error" match={true}>
          {error}
        </BaseField.Error>
      ) : null}
    </BaseField.Root>
  );
}
