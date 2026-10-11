'use client';
/* DateRangePicker (SURF-213, REQ-SURF-102): two DateInputs + presets listbox
   + RangeCalendar; visibleMonths default 2 (1 below 768px container). */
import * as React from 'react';
import {
  Button as RACButton,
  DateInput as RACDateInput,
  DateRangePicker as RACDateRangePicker,
  DateSegment as RACDateSegment,
  Dialog as RACDialog,
  FieldError as RACFieldError,
  Group as RACGroup,
  Label as RACLabel,
  ListBox as RACListBox,
  ListBoxItem as RACListBoxItem,
  Popover as RACPopover,
  Text as RACText,
} from 'react-aria-components';
import { DateProvider } from './DateProvider';
import { RangeCalendar } from './Calendar';
import { raChangeDetails } from './shared';
import type { DateFieldLikeProps, DateValue } from './shared';
import type { toChangeDetails } from '../foundation';
/** S-30 ChangeDetails, via the CMP foundation seam (no contracts/ specifier in src). */
type ChangeDetails = ReturnType<typeof toChangeDetails>;

export interface DateRangeValue {
  start: DateValue;
  end: DateValue;
}

export interface DateRangePreset {
  label: string;
  value: DateRangeValue;
}

export interface DateRangePickerProps extends Omit<DateFieldLikeProps<DateValue>, 'value' | 'defaultValue' | 'onValueChange'> {
  value?: DateRangeValue | null | undefined;
  defaultValue?: DateRangeValue | undefined;
  onValueChange?: ((v: DateRangeValue | null, details: ChangeDetails) => void) | undefined;
  presets?: readonly DateRangePreset[] | undefined;
  visibleMonths?: 1 | 2 | undefined;
  className?: string | undefined;
  labels?: { choose?: string | undefined; start?: string | undefined; end?: string | undefined; presets?: string | undefined } | undefined;
}

function Inner({
  value,
  defaultValue,
  onValueChange,
  minValue,
  maxValue,
  isDateUnavailable,
  firstDayOfWeek,
  presets,
  visibleMonths = 2,
  label,
  description,
  errorMessage,
  isInvalid,
  isRequired,
  isDisabled,
  isReadOnly,
  size = 'md',
  className,
  labels,
}: DateRangePickerProps) {
  return (
    <RACDateRangePicker
      data-ag-part="date-range-picker"
      data-ag-size={size}
      className={`ag-date-range-picker${className ? ` ${className}` : ''}`}
      {...(value !== undefined ? { value: value as never } : {})}
      {...(defaultValue !== undefined ? { defaultValue: defaultValue as never } : {})}
      {...(onValueChange !== undefined ? { onChange: (v) => onValueChange(v ?? null, raChangeDetails()) } : {})}
      {...(minValue !== undefined ? { minValue: minValue as never } : {})}
      {...(maxValue !== undefined ? { maxValue: maxValue as never } : {})}
      {...(isDateUnavailable !== undefined ? { isDateUnavailable } : {})}
      {...(firstDayOfWeek !== undefined ? { firstDayOfWeek } : {})}
      {...(isInvalid !== undefined ? { isInvalid } : {})}
      {...(isRequired !== undefined ? { isRequired } : {})}
      {...(isDisabled !== undefined ? { isDisabled } : {})}
      {...(isReadOnly !== undefined ? { isReadOnly } : {})}
    >
      {label !== undefined && label !== null ? <RACLabel>{label}</RACLabel> : null}
      <RACGroup className="ag-date-range-picker__group">
        <RACDateInput slot="start" aria-label={labels?.start ?? 'Start date'} data-ag-part="date-input-start" className="ag-date-field__input">
          {(segment) => <RACDateSegment segment={segment} className="ag-date-field__segment" />}
        </RACDateInput>
        <span aria-hidden="true" className="ag-date-range-picker__sep">–</span>
        <RACDateInput slot="end" aria-label={labels?.end ?? 'End date'} data-ag-part="date-input-end" className="ag-date-field__input">
          {(segment) => <RACDateSegment segment={segment} className="ag-date-field__segment" />}
        </RACDateInput>
        <RACButton data-ag-part="date-range-picker-trigger" className="ag-date-picker__trigger">
          {labels?.choose ?? 'Choose dates'}
        </RACButton>
      </RACGroup>
      {description !== undefined && description !== null ? (
        <RACText slot="description">{description}</RACText>
      ) : null}
      <RACFieldError className="ag-date-field__error">{errorMessage}</RACFieldError>
      <RACPopover data-ag-part="date-range-picker-popover" className="ag-date-picker__popover" placement="bottom start">
        <RACDialog className="ag-date-picker__dialog ag-date-range-picker__dialog">
          {presets !== undefined && presets.length > 0 ? (
            <RACListBox
              aria-label={labels?.presets ?? 'Presets'}
              data-ag-part="date-range-presets"
              className="ag-date-range-picker__presets"
              selectionMode="single"
              onAction={(i) => {
                const p = presets[Number(i)];
                if (p !== undefined) onValueChange?.(p.value, { event: undefined, reason: 'preset' });
              }}
              items={presets.map((p, i) => ({ id: i, label: p.label }))}
            >
              {(item) => (
                <RACListBoxItem id={item.id} textValue={item.label} className="ag-date-range-picker__preset">
                  {item.label}
                </RACListBoxItem>
              )}
            </RACListBox>
          ) : null}
          <RangeCalendar
            {...(value !== undefined && value !== null ? { value: value as never } : {})}
            {...(defaultValue !== undefined ? { defaultValue: defaultValue as never } : {})}
            {...(onValueChange !== undefined ? { onValueChange: (v, d) => onValueChange(v, d) } : {})}
            {...(minValue !== undefined ? { minValue: minValue as never } : {})}
            {...(maxValue !== undefined ? { maxValue: maxValue as never } : {})}
            {...(isDateUnavailable !== undefined ? { isDateUnavailable } : {})}
            {...(firstDayOfWeek !== undefined ? { firstDayOfWeek } : {})}
            visibleMonths={visibleMonths}
            size={size}
          />
        </RACDialog>
      </RACPopover>
    </RACDateRangePicker>
  );
}

export function DateRangePicker(props: DateRangePickerProps) {
  return (
    <DateProvider locale={props.locale}>
      <Inner {...props} />
    </DateProvider>
  );
}
