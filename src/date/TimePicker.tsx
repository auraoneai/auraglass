'use client';
/* TimeField + TimePicker (SURF-214, REQ-SURF-99/104): TimeField segments;
   TimePicker adds a popover with hour/minute listbox columns, minuteStep. */
import * as React from 'react';
import {
  Button as RACButton,
  Dialog as RACDialog,
  FieldError as RACFieldError,
  Group as RACGroup,
  Label as RACLabel,
  ListBox as RACListBox,
  ListBoxItem as RACListBoxItem,
  Popover as RACPopover,
  Text as RACText,
  TimeField as RACTimeField,
  DateInput as RACDateInput,
  DateSegment as RACDateSegment,
} from 'react-aria-components';
import { Time } from '@internationalized/date';
import { DateProvider } from './DateProvider';
import type { DateFieldLikeProps, TimeValue } from './shared';

export interface TimeFieldProps extends DateFieldLikeProps<TimeValue> {
  className?: string | undefined;
}

function TimeInner({
  value,
  defaultValue,
  onValueChange,
  minValue,
  maxValue,
  granularity = 'minute',
  hourCycle,
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
}: TimeFieldProps) {
  return (
    <RACTimeField<TimeValue>
      data-ag-part="time-field"
      data-ag-size={size}
      className={`ag-time-field${className ? ` ${className}` : ''}`}
      {...(value !== undefined ? { value } : {})}
      {...(defaultValue !== undefined ? { defaultValue } : {})}
      {...(onValueChange !== undefined ? { onChange: (v) => onValueChange(v ?? null) } : {})}
      {...(minValue !== undefined ? { minValue } : {})}
      {...(maxValue !== undefined ? { maxValue } : {})}
      {...(granularity !== undefined ? { granularity: granularity === 'day' ? 'minute' : granularity } : {})}
      {...(hourCycle !== undefined ? { hourCycle } : {})}
      {...(isInvalid !== undefined ? { isInvalid } : {})}
      {...(isRequired !== undefined ? { isRequired } : {})}
      {...(isDisabled !== undefined ? { isDisabled } : {})}
      {...(isReadOnly !== undefined ? { isReadOnly } : {})}
      {...(name !== undefined ? { name } : {})}
    >
      {label !== undefined && label !== null ? <RACLabel>{label}</RACLabel> : null}
      <RACDateInput data-ag-part="time-input" className="ag-date-field__input">
        {(segment) => <RACDateSegment segment={segment} className="ag-date-field__segment" />}
      </RACDateInput>
      {description !== undefined && description !== null ? (
        <RACText slot="description">{description}</RACText>
      ) : null}
      <RACFieldError className="ag-date-field__error">{errorMessage}</RACFieldError>
    </RACTimeField>
  );
}

export function TimeField(props: TimeFieldProps) {
  return (
    <DateProvider locale={props.locale}>
      <TimeInner {...props} />
    </DateProvider>
  );
}

export interface TimePickerProps extends TimeFieldProps {
  minuteStep?: 1 | 5 | 10 | 15 | 30 | undefined;
  labels?: { choose?: string | undefined; hour?: string | undefined; minute?: string | undefined } | undefined;
}

export function TimePicker({ minuteStep = 5, labels, ...props }: TimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLDivElement | null>(null);
  const hours = React.useMemo(() => Array.from({ length: 24 }, (_, h) => ({ id: h, label: String(h).padStart(2, '0') })), []);
  const minutes = React.useMemo(
    () => Array.from({ length: 60 / minuteStep }, (_, i) => ({ id: i * minuteStep, label: String(i * minuteStep).padStart(2, '0') })),
    [minuteStep],
  );
  const setPart = (h?: number, m?: number) => {
    const cur = props.value ?? props.defaultValue ?? new Time(0, 0);
    props.onValueChange?.(new Time(h ?? cur.hour, m ?? cur.minute));
  };
  return (
    <DateProvider locale={props.locale}>
      <RACTimeField<TimeValue>
        data-ag-part="time-picker"
        data-ag-size={props.size ?? 'md'}
        className={`ag-time-picker${props.className ? ` ${props.className}` : ''}`}
        {...(props.value !== undefined ? { value: props.value } : {})}
        {...(props.defaultValue !== undefined ? { defaultValue: props.defaultValue } : {})}
        onChange={(v) => props.onValueChange?.(v ?? null)}
        granularity={props.granularity === 'day' ? 'minute' : (props.granularity ?? 'minute')}
        {...(props.hourCycle !== undefined ? { hourCycle: props.hourCycle } : {})}
        {...(props.isDisabled !== undefined ? { isDisabled: props.isDisabled } : {})}
        {...(props.isReadOnly !== undefined ? { isReadOnly: props.isReadOnly } : {})}
        {...(props.isInvalid !== undefined ? { isInvalid: props.isInvalid } : {})}
        {...(props.isRequired !== undefined ? { isRequired: props.isRequired } : {})}
        {...(props.name !== undefined ? { name: props.name } : {})}
      >
        {props.label !== undefined && props.label !== null ? <RACLabel>{props.label}</RACLabel> : null}
        <RACGroup ref={triggerRef} className="ag-date-picker__group">
          <RACDateInput data-ag-part="time-input" className="ag-date-field__input">
            {(segment) => <RACDateSegment segment={segment} className="ag-date-field__segment" />}
          </RACDateInput>
          <RACButton
            data-ag-part="time-picker-trigger"
            className="ag-date-picker__trigger"
            onPress={() => setOpen(true)}
          >
            {labels?.choose ?? 'Choose time'}
          </RACButton>
        </RACGroup>
        {props.description !== undefined && props.description !== null ? (
          <RACText slot="description">{props.description}</RACText>
        ) : null}
        <RACFieldError className="ag-date-field__error">{props.errorMessage}</RACFieldError>
        <RACPopover
          data-ag-part="time-picker-popover"
          className="ag-date-picker__popover"
          isOpen={open}
          onOpenChange={setOpen}
          triggerRef={triggerRef}
          placement="bottom start"
        >
          <RACDialog className="ag-date-picker__dialog ag-time-picker__dialog">
            <div className="ag-time-picker__columns">
              <RACListBox
                aria-label={labels?.hour ?? 'Hour'}
                data-ag-part="time-picker-hours"
                className="ag-time-picker__column"
                selectionMode="single"
                items={hours}
                onAction={(k) => setPart(Number(k), undefined)}
              >
                {(item) => (
                  <RACListBoxItem id={item.id} textValue={item.label} className="ag-time-picker__option">
                    {item.label}
                  </RACListBoxItem>
                )}
              </RACListBox>
              <RACListBox
                aria-label={labels?.minute ?? 'Minute'}
                data-ag-part="time-picker-minutes"
                className="ag-time-picker__column"
                selectionMode="single"
                items={minutes}
                onAction={(k) => setPart(undefined, Number(k))}
              >
                {(item) => (
                  <RACListBoxItem id={item.id} textValue={item.label} className="ag-time-picker__option">
                    {item.label}
                  </RACListBoxItem>
                )}
              </RACListBox>
            </div>
          </RACDialog>
        </RACPopover>
      </RACTimeField>
    </DateProvider>
  );
}
