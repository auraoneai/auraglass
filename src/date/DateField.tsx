'use client';
/* DateField (SURF-210, REQ-SURF-99): RAC DateField + DateInput segments.
   onValueChange maps RA's onChange; `name` serializes the ISO value. */
import * as React from 'react';
import {
  DateField as RACDateField,
  DateInput as RACDateInput,
  DateSegment as RACDateSegment,
  FieldError as RACFieldError,
  Label as RACLabel,
  Text as RACText,
} from 'react-aria-components';
import { DateProvider } from './DateProvider';
import { raChangeDetails } from './shared';
import type { DateFieldLikeProps, DateValue } from './shared';

export interface DateFieldProps extends DateFieldLikeProps<DateValue> {
  className?: string | undefined;
}

function Inner({ value, defaultValue, onValueChange, minValue, maxValue, isDateUnavailable, granularity, hourCycle, label, description, errorMessage, isInvalid, isRequired, isDisabled, isReadOnly, name, size = 'md', className }: DateFieldProps) {
  return (
    <RACDateField
      data-ag-part="date-field"
      data-ag-size={size}
      className={`ag-date-field${className ? ` ${className}` : ''}`}
      {...(value !== undefined ? { value: value as never } : {})}
      {...(defaultValue !== undefined ? { defaultValue: defaultValue as never } : {})}
      {...(onValueChange !== undefined ? { onChange: (v) => onValueChange(v ?? null, raChangeDetails()) } : {})}
      {...(minValue !== undefined ? { minValue: minValue as never } : {})}
      {...(maxValue !== undefined ? { maxValue: maxValue as never } : {})}
      {...(isDateUnavailable !== undefined ? { isDateUnavailable } : {})}
      {...(granularity !== undefined ? { granularity } : {})}
      {...(hourCycle !== undefined ? { hourCycle } : {})}
      {...(isInvalid !== undefined ? { isInvalid } : {})}
      {...(isRequired !== undefined ? { isRequired } : {})}
      {...(isDisabled !== undefined ? { isDisabled } : {})}
      {...(isReadOnly !== undefined ? { isReadOnly } : {})}
      {...(name !== undefined ? { name } : {})}
    >
      {label !== undefined && label !== null ? <RACLabel>{label}</RACLabel> : null}
      <RACDateInput data-ag-part="date-input" className="ag-date-field__input">
        {(segment) => <RACDateSegment segment={segment} className="ag-date-field__segment" />}
      </RACDateInput>
      {description !== undefined && description !== null ? (
        <RACText slot="description" className="ag-date-field__description">
          {description}
        </RACText>
      ) : null}
      <RACFieldError className="ag-date-field__error">{errorMessage}</RACFieldError>
    </RACDateField>
  );
}

export function DateField(props: DateFieldProps) {
  const { locale } = props;
  return (
    <DateProvider locale={locale}>
      <Inner {...props} />
    </DateProvider>
  );
}
