'use client';
/* TimeField + TimePicker (SURF-214, REQ-SURF-98/99/104).
   TimeField: RAC TimeField segments.
   TimePicker: one controllable value (useControllableValue) shared by the RAC
   TimeField segments and the hour / minute (/ AM-PM) listbox columns, so an
   uncontrolled pick updates the segments and a typed value updates the
   columns' selectedKeys. hourCycle 12 renders hours 1–12 plus an AM/PM column.
   The popup is a DatePopup: CMP Popover anchored at >=640px container,
   bottom-sheet presentation below, CMP Button trigger, LayerStack Escape/focus return. */
import * as React from 'react';
import {
  FieldError as RACFieldError,
  Group as RACGroup,
  Label as RACLabel,
  LabelContext,
  ListBox as RACListBox,
  ListBoxItem as RACListBoxItem,
  Text as RACText,
  TimeField as RACTimeField,
  DateInput as RACDateInput,
  DateSegment as RACDateSegment,
  useSlottedContext,
} from 'react-aria-components';
import type { Key, Selection, TimeValue as RACTimeValue } from 'react-aria-components';
import { Time as IntlTime } from '@internationalized/date';
import { DateProvider, useDateLocale } from './DateProvider';
import { DatePopup } from './DatePopup';
import { SHEET_BELOW_PX, useContainerWidth } from './useContainerWidth';
import { useControllableValue } from './useControllableValue';
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
  const { anchorRef, dir } = useDateLocale();
  return (
    <RACTimeField<RACTimeValue>
      ref={anchorRef as React.Ref<HTMLDivElement>}
      data-ag-part="time-field"
      data-ag-size={size}
      {...(dir !== undefined ? { dir } : {})}
      className={`ag-time-field${className ? ` ${className}` : ''}`}
      {...(value !== undefined ? { value: value as never } : {})}
      {...(defaultValue !== undefined ? { defaultValue: defaultValue as never } : {})}
      {...(onValueChange !== undefined ? { onChange: (v) => onValueChange((v ?? null) as TimeValue | null) } : {})}
      {...(minValue !== undefined ? { minValue: minValue as never } : {})}
      {...(maxValue !== undefined ? { maxValue: maxValue as never } : {})}
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
    <DateProvider locale={props.locale} dir={props.dir}>
      <TimeInner {...props} />
    </DateProvider>
  );
}

export interface TimePickerProps extends TimeFieldProps {
  minuteStep?: 1 | 5 | 10 | 15 | 30 | undefined;
  labels?:
    | {
        choose?: string | undefined;
        hour?: string | undefined;
        minute?: string | undefined;
        period?: string | undefined;
        am?: string | undefined;
        pm?: string | undefined;
        dialog?: string | undefined;
      }
    | undefined;
}

type Period = 'am' | 'pm';

const pad2 = (n: number) => String(n).padStart(2, '0');

function firstKey(keys: Selection): Key | undefined {
  if (keys === 'all') return undefined;
  for (const k of keys) return k;
  return undefined;
}

/** Apply hour/minute to the current value, keeping its type (Time,
    CalendarDateTime or ZonedDateTime). An empty picker starts from a Time. */
function withParts(cur: TimeValue | null, hour: number, minute: number): TimeValue {
  if (cur === null) return new IntlTime(hour, minute) as unknown as TimeValue;
  return cur.set({ hour, minute, second: 0, millisecond: 0 }) as TimeValue;
}

interface ColumnsProps {
  current: TimeValue | null;
  set: (v: TimeValue | null) => void;
  minuteStep: 1 | 5 | 10 | 15 | 30;
  hourCycle: 12 | 24 | undefined;
  labels: TimePickerProps['labels'];
}

function TimeColumns({ current, set, minuteStep, hourCycle, labels }: ColumnsProps) {
  const twelve = hourCycle === 12;
  const hours = React.useMemo(
    () =>
      twelve
        ? Array.from({ length: 12 }, (_, i) => ({ id: i + 1, label: pad2(i + 1) }))
        : Array.from({ length: 24 }, (_, h) => ({ id: h, label: pad2(h) })),
    [twelve],
  );
  const minutes = React.useMemo(
    () => Array.from({ length: 60 / minuteStep }, (_, i) => ({ id: i * minuteStep, label: pad2(i * minuteStep) })),
    [minuteStep],
  );
  const periods = React.useMemo(
    () => [
      { id: 'am' as Period, label: labels?.am ?? 'AM' },
      { id: 'pm' as Period, label: labels?.pm ?? 'PM' },
    ],
    [labels?.am, labels?.pm],
  );

  const h24 = current?.hour;
  const m = current?.minute;
  const period: Period | undefined = h24 === undefined ? undefined : h24 < 12 ? 'am' : 'pm';
  const hourKey = h24 === undefined ? undefined : twelve ? h24 % 12 || 12 : h24;
  const minuteKey = m !== undefined && m % minuteStep === 0 ? m : undefined;

  const onHour = (keys: Selection) => {
    const k = firstKey(keys);
    if (k === undefined) return;
    const picked = Number(k);
    const hour = twelve ? (picked % 12) + ((period ?? 'am') === 'pm' ? 12 : 0) : picked;
    set(withParts(current, hour, m ?? 0));
  };
  const onMinute = (keys: Selection) => {
    const k = firstKey(keys);
    if (k === undefined) return;
    set(withParts(current, h24 ?? 0, Number(k)));
  };
  const onPeriod = (keys: Selection) => {
    const k = firstKey(keys);
    if (k === undefined) return;
    const base = h24 ?? 0;
    set(withParts(current, (base % 12) + (k === 'pm' ? 12 : 0), m ?? 0));
  };

  const option = (item: { id: Key; label: string }) => (
    <RACListBoxItem id={item.id} textValue={item.label} className="ag-time-picker__option">
      {item.label}
    </RACListBoxItem>
  );

  return (
    <div className="ag-time-picker__columns">
      <RACListBox
        aria-label={labels?.hour ?? 'Hour'}
        data-ag-part="time-picker-hours"
        className="ag-time-picker__column"
        selectionMode="single"
        disallowEmptySelection
        selectedKeys={hourKey === undefined ? [] : [hourKey]}
        onSelectionChange={onHour}
        items={hours}
      >
        {option}
      </RACListBox>
      <RACListBox
        aria-label={labels?.minute ?? 'Minute'}
        data-ag-part="time-picker-minutes"
        className="ag-time-picker__column"
        selectionMode="single"
        disallowEmptySelection
        selectedKeys={minuteKey === undefined ? [] : [minuteKey]}
        onSelectionChange={onMinute}
        items={minutes}
      >
        {option}
      </RACListBox>
      {twelve ? (
        <RACListBox
          aria-label={labels?.period ?? 'AM/PM'}
          data-ag-part="time-picker-periods"
          className="ag-time-picker__column"
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={period === undefined ? [] : [period]}
          onSelectionChange={onPeriod}
          items={periods}
        >
          {option}
        </RACListBox>
      ) : null}
    </div>
  );
}

function TimePopup(props: ColumnsProps & { compact: boolean; size: 'sm' | 'md' | 'lg'; disabled: boolean; hasLabel: boolean }) {
  const { compact, size, disabled, hasLabel, labels } = props;
  const [open, setOpen] = React.useState(false);
  const labelCtx = useSlottedContext(LabelContext) as { id?: string } | null;
  const { dir } = useDateLocale();
  const labelId = hasLabel ? labelCtx?.id : undefined;
  return (
    <DatePopup
      open={open}
      onOpenChange={setOpen}
      compact={compact}
      triggerLabel={labels?.choose ?? 'Choose time'}
      triggerPart="time-picker-trigger"
      triggerDisabled={disabled}
      size={size}
      popupPart="time-picker-popover"
      popupClassName="ag-date-picker__popover ag-time-picker__dialog"
      popupLabelledBy={labelId}
      popupLabel={labelId === undefined ? (labels?.dialog ?? labels?.choose ?? 'Choose time') : undefined}
      dir={dir}
      initialFocusSelector={[
        '[data-ag-part="time-picker-hours"] [aria-selected="true"]',
        '[data-ag-part="time-picker-hours"] [role="option"]',
      ]}
    >
      <TimeColumns {...props} />
    </DatePopup>
  );
}

function TimePickerInner({ minuteStep = 5, labels, ...props }: TimePickerProps) {
  const { anchorRef, dir } = useDateLocale();
  const [widthRef, width] = useContainerWidth();
  const rootRef = React.useCallback(
    (el: HTMLDivElement | null) => {
      anchorRef(el);
      widthRef(el);
    },
    [anchorRef, widthRef],
  );
  const [current, set] = useControllableValue<TimeValue | null>(props.value, props.defaultValue ?? null, props.onValueChange);
  const size = props.size ?? 'md';
  const hasLabel = props.label !== undefined && props.label !== null;
  return (
    <RACTimeField<RACTimeValue>
      ref={rootRef}
      data-ag-part="time-picker"
      data-ag-size={size}
      {...(dir !== undefined ? { dir } : {})}
      className={`ag-time-picker${props.className ? ` ${props.className}` : ''}`}
      value={current as never}
      onChange={(v) => set((v ?? null) as TimeValue | null)}
      granularity={props.granularity === 'day' ? 'minute' : (props.granularity ?? 'minute')}
      {...(props.minValue !== undefined ? { minValue: props.minValue as never } : {})}
      {...(props.maxValue !== undefined ? { maxValue: props.maxValue as never } : {})}
      {...(props.hourCycle !== undefined ? { hourCycle: props.hourCycle } : {})}
      {...(props.isDisabled !== undefined ? { isDisabled: props.isDisabled } : {})}
      {...(props.isReadOnly !== undefined ? { isReadOnly: props.isReadOnly } : {})}
      {...(props.isInvalid !== undefined ? { isInvalid: props.isInvalid } : {})}
      {...(props.isRequired !== undefined ? { isRequired: props.isRequired } : {})}
      {...(props.name !== undefined ? { name: props.name } : {})}
    >
      {hasLabel ? <RACLabel>{props.label}</RACLabel> : null}
      <RACGroup className="ag-date-picker__group">
        <RACDateInput data-ag-part="time-input" className="ag-date-field__input">
          {(segment) => <RACDateSegment segment={segment} className="ag-date-field__segment" />}
        </RACDateInput>
        <TimePopup
          current={current}
          set={set}
          minuteStep={minuteStep}
          hourCycle={props.hourCycle}
          labels={labels}
          compact={width !== null && width < SHEET_BELOW_PX}
          size={size}
          disabled={props.isDisabled === true || props.isReadOnly === true}
          hasLabel={hasLabel}
        />
      </RACGroup>
      {props.description !== undefined && props.description !== null ? (
        <RACText slot="description">{props.description}</RACText>
      ) : null}
      <RACFieldError className="ag-date-field__error">{props.errorMessage}</RACFieldError>
    </RACTimeField>
  );
}

export function TimePicker(props: TimePickerProps) {
  return (
    <DateProvider locale={props.locale} dir={props.dir}>
      <TimePickerInner {...props} />
    </DateProvider>
  );
}
