'use client';
/* DatePicker (SURF-212, REQ-SURF-101): RAC DatePicker — DateInput trigger +
   "Choose date" button opening a dialog with the Calendar. Below 640px the
   container collapses the popover to a bottom sheet (responsive CSS). */
import * as React from 'react';
import {
  Button as RACButton,
  DatePicker as RACDatePicker,
  DateInput as RACDateInput,
  DateSegment as RACDateSegment,
  Dialog as RACDialog,
  FieldError as RACFieldError,
  Group as RACGroup,
  Label as RACLabel,
  Popover as RACPopover,
  Text as RACText,
} from 'react-aria-components';
import { DateProvider } from './DateProvider';
import { Calendar } from './Calendar';
import type { DateFieldLikeProps, DateValue } from './shared';

export interface DatePickerProps extends DateFieldLikeProps<DateValue> {
  className?: string | undefined;
  labels?: { choose?: string | undefined } | undefined;
}

function Inner({
  value,
  defaultValue,
  onValueChange,
  minValue,
  maxValue,
  isDateUnavailable,
  granularity,
  hourCycle,
  firstDayOfWeek,
  label,
  description,
  errorMessage,
  isInvalid,
  isRequired,
  isDisabled,
  isReadOnly,
  name,
  size = 'md',
  className,
  labels,
}: DatePickerProps) {
  return (
    <RACDatePicker
      data-ag-part="date-picker"
      data-ag-size={size}
      className={`ag-date-picker${className ? ` ${className}` : ''}`}
      {...(value !== undefined ? { value } : {})}
      {...(defaultValue !== undefined ? { defaultValue } : {})}
      {...(onValueChange !== undefined ? { onChange: (v) => onValueChange(v ?? null) } : {})}
      {...(minValue !== undefined ? { minValue } : {})}
      {...(maxValue !== undefined ? { maxValue } : {})}
      {...(isDateUnavailable !== undefined ? { isDateUnavailable } : {})}
      {...(granularity !== undefined ? { granularity } : {})}
      {...(hourCycle !== undefined ? { hourCycle } : {})}
      {...(firstDayOfWeek !== undefined ? { firstDayOfWeek } : {})}
      {...(isInvalid !== undefined ? { isInvalid } : {})}
      {...(isRequired !== undefined ? { isRequired } : {})}
      {...(isDisabled !== undefined ? { isDisabled } : {})}
      {...(isReadOnly !== undefined ? { isReadOnly } : {})}
      {...(name !== undefined ? { name } : {})}
    >
      {label !== undefined && label !== null ? <RACLabel>{label}</RACLabel> : null}
      <RACGroup className="ag-date-picker__group">
        <RACDateInput data-ag-part="date-input" className="ag-date-field__input">
          {(segment) => <RACDateSegment segment={segment} className="ag-date-field__segment" />}
        </RACDateInput>
        <RACButton data-ag-part="date-picker-trigger" className="ag-date-picker__trigger">
          {labels?.choose ?? 'Choose date'}
        </RACButton>
      </RACGroup>
      {description !== undefined && description !== null ? (
        <RACText slot="description">{description}</RACText>
      ) : null}
      <RACFieldError className="ag-date-field__error">{errorMessage}</RACFieldError>
      <RACPopover data-ag-part="date-picker-popover" className="ag-date-picker__popover" placement="bottom start">
        <RACDialog className="ag-date-picker__dialog">
          <Calendar
            {...(value !== undefined ? { value } : {})}
            {...(defaultValue !== undefined ? { defaultValue } : {})}
            {...(onValueChange !== undefined ? { onValueChange: (v) => onValueChange(v) } : {})}
            {...(minValue !== undefined ? { minValue } : {})}
            {...(maxValue !== undefined ? { maxValue } : {})}
            {...(isDateUnavailable !== undefined ? { isDateUnavailable } : {})}
            {...(firstDayOfWeek !== undefined ? { firstDayOfWeek } : {})}
            size={size}
          />
        </RACDialog>
      </RACPopover>
    </RACDatePicker>
  );
}

export function DatePicker(props: DatePickerProps) {
  return (
    <DateProvider locale={props.locale}>
      <Inner {...props} />
    </DateProvider>
  );
}
