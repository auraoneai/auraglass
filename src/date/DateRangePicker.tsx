'use client';
/* DateRangePicker (SURF-213, REQ-SURF-98/99/102): two DateInputs + a CMP
   Button trigger opening a DatePopup (CMP Popover anchored at >=640px container,
   bottom-sheet presentation below) with presets and a RangeCalendar.

   Draft-commit: the calendar inside the popup is standalone (it ignores RAC's
   picker context) and edits a draft range. Presets write the draft too. The
   draft is applied to the field — and onValueChange fires, once — only on
   Apply; Cancel, Escape or an outside dismiss discard it. Typing directly in
   the segments still commits immediately (that is the field, not the draft).

   visibleMonths defaults to 2 when the picker's container is >=768px wide (or
   not yet measured) and 1 below; one CalendarGrid renders per visible month.
   Presets sit beside the calendar in the popover and above it in the sheet. */
import * as React from 'react';
import {
  DateInput as RACDateInput,
  DateRangePicker as RACDateRangePicker,
  DateRangePickerStateContext,
  DateSegment as RACDateSegment,
  FieldError as RACFieldError,
  Group as RACGroup,
  Label as RACLabel,
  LabelContext,
  ListBox as RACListBox,
  ListBoxItem as RACListBoxItem,
  Text as RACText,
  useSlottedContext,
} from 'react-aria-components';
import { Button } from '../components/button';
import { DateProvider, useDateLocale } from './DateProvider';
import { RangeCalendarImpl } from './Calendar';
import { CALENDAR_INITIAL_FOCUS, DatePopup } from './DatePopup';
import { SHEET_BELOW_PX, TWO_MONTHS_FROM_PX, useContainerWidth } from './useContainerWidth';
import { useControllableValue } from './useControllableValue';
import type { DateFieldLikeProps, DateValue } from './shared';

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
  defaultValue?: DateRangeValue | null | undefined;
  onValueChange?: ((v: DateRangeValue | null) => void) | undefined;
  presets?: readonly DateRangePreset[] | undefined;
  /** Default: 2 at a >=768px container, 1 below. */
  visibleMonths?: 1 | 2 | undefined;
  className?: string | undefined;
  labels?:
    | {
        choose?: string | undefined;
        start?: string | undefined;
        end?: string | undefined;
        presets?: string | undefined;
        apply?: string | undefined;
        cancel?: string | undefined;
        dialog?: string | undefined;
      }
    | undefined;
}

interface RangePopupProps {
  committed: DateRangeValue | null;
  commit: (v: DateRangeValue | null) => void;
  compact: boolean;
  visibleMonths: 1 | 2;
  presets: readonly DateRangePreset[] | undefined;
  size: 'sm' | 'md' | 'lg';
  disabled: boolean;
  hasLabel: boolean;
  labels: DateRangePickerProps['labels'];
  calendarProps: Pick<DateRangePickerProps, 'minValue' | 'maxValue' | 'isDateUnavailable' | 'firstDayOfWeek'>;
}

function RangePopup({
  committed,
  commit,
  compact,
  visibleMonths,
  presets,
  size,
  disabled,
  hasLabel,
  labels,
  calendarProps,
}: RangePopupProps) {
  const state = React.useContext(DateRangePickerStateContext);
  const labelCtx = useSlottedContext(LabelContext) as { id?: string } | null;
  const { dir } = useDateLocale();
  const [draft, setDraft] = React.useState<DateRangeValue | null>(committed);
  if (!state) return null;
  const labelId = hasLabel ? labelCtx?.id : undefined;

  const onOpenChange = (open: boolean) => {
    if (open) setDraft(committed); // every open starts from the committed value
    state.setOpen(open);
  };
  const apply = () => {
    commit(draft);
    state.setOpen(false);
  };

  return (
    <DatePopup
      open={state.isOpen}
      onOpenChange={onOpenChange}
      compact={compact}
      triggerLabel={labels?.choose ?? 'Choose dates'}
      triggerPart="date-range-picker-trigger"
      triggerDisabled={disabled}
      size={size}
      popupPart="date-range-picker-popover"
      popupClassName="ag-date-picker__popover ag-date-range-picker__dialog"
      popupLabelledBy={labelId}
      popupLabel={labelId === undefined ? (labels?.dialog ?? labels?.choose ?? 'Choose dates') : undefined}
      dir={dir}
      initialFocusSelector={CALENDAR_INITIAL_FOCUS}
    >
      <div className="ag-date-range-picker__body" data-ag-layout={compact ? 'stacked' : 'beside'}>
        {presets !== undefined && presets.length > 0 ? (
          <RACListBox
            aria-label={labels?.presets ?? 'Presets'}
            data-ag-part="date-range-presets"
            className="ag-date-range-picker__presets"
            selectionMode="single"
            onAction={(i) => {
              const p = presets[Number(i)];
              if (p !== undefined) setDraft(p.value);
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
        <RangeCalendarImpl
          standalone
          autoFocus
          value={draft}
          onValueChange={(v) => setDraft(v)}
          visibleMonths={visibleMonths}
          size={size}
          {...(calendarProps.minValue !== undefined ? { minValue: calendarProps.minValue } : {})}
          {...(calendarProps.maxValue !== undefined ? { maxValue: calendarProps.maxValue } : {})}
          {...(calendarProps.isDateUnavailable !== undefined ? { isDateUnavailable: calendarProps.isDateUnavailable } : {})}
          {...(calendarProps.firstDayOfWeek !== undefined ? { firstDayOfWeek: calendarProps.firstDayOfWeek } : {})}
        />
      </div>
      <div className="ag-date-range-picker__actions" data-ag-part="date-range-actions">
        <Button variant="clear" size={size} suppressInnerParts data-ag-part="date-range-cancel" onClick={() => state.setOpen(false)}>
          {labels?.cancel ?? 'Cancel'}
        </Button>
        <Button size={size} suppressInnerParts data-ag-part="date-range-apply" disabled={draft === null} onClick={apply}>
          {labels?.apply ?? 'Apply'}
        </Button>
      </div>
    </DatePopup>
  );
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
  visibleMonths,
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
}: DateRangePickerProps) {
  const { anchorRef, dir } = useDateLocale();
  const [widthRef, width] = useContainerWidth();
  const rootRef = React.useCallback(
    (el: HTMLDivElement | null) => {
      anchorRef(el);
      widthRef(el);
    },
    [anchorRef, widthRef],
  );
  const [committed, commit] = useControllableValue<DateRangeValue | null>(value, defaultValue ?? null, onValueChange);
  const months: 1 | 2 = visibleMonths ?? (width === null || width >= TWO_MONTHS_FROM_PX ? 2 : 1);
  const hasLabel = label !== undefined && label !== null;
  return (
    <RACDateRangePicker
      ref={rootRef}
      data-ag-part="date-range-picker"
      data-ag-size={size}
      {...(dir !== undefined ? { dir } : {})}
      className={`ag-date-range-picker${className ? ` ${className}` : ''}`}
      value={committed as never}
      onChange={(v) => commit((v ?? null) as DateRangeValue | null)}
      {...(minValue !== undefined ? { minValue: minValue as never } : {})}
      {...(maxValue !== undefined ? { maxValue: maxValue as never } : {})}
      {...(isDateUnavailable !== undefined ? { isDateUnavailable } : {})}
      {...(firstDayOfWeek !== undefined ? { firstDayOfWeek } : {})}
      {...(isInvalid !== undefined ? { isInvalid } : {})}
      {...(isRequired !== undefined ? { isRequired } : {})}
      {...(isDisabled !== undefined ? { isDisabled } : {})}
      {...(isReadOnly !== undefined ? { isReadOnly } : {})}
      {...(name !== undefined ? { startName: `${name}-start`, endName: `${name}-end` } : {})}
    >
      {hasLabel ? <RACLabel>{label}</RACLabel> : null}
      <RACGroup className="ag-date-picker__group ag-date-range-picker__group">
        <RACDateInput slot="start" aria-label={labels?.start ?? 'Start date'} data-ag-part="date-input-start" className="ag-date-field__input">
          {(segment) => <RACDateSegment segment={segment} className="ag-date-field__segment" />}
        </RACDateInput>
        <span aria-hidden="true" className="ag-date-range-picker__sep">–</span>
        <RACDateInput slot="end" aria-label={labels?.end ?? 'End date'} data-ag-part="date-input-end" className="ag-date-field__input">
          {(segment) => <RACDateSegment segment={segment} className="ag-date-field__segment" />}
        </RACDateInput>
        <RangePopup
          committed={committed}
          commit={commit}
          compact={width !== null && width < SHEET_BELOW_PX}
          visibleMonths={months}
          presets={presets}
          size={size}
          disabled={isDisabled === true || isReadOnly === true}
          hasLabel={hasLabel}
          labels={labels}
          calendarProps={{ minValue, maxValue, isDateUnavailable, firstDayOfWeek }}
        />
      </RACGroup>
      {description !== undefined && description !== null ? (
        <RACText slot="description">{description}</RACText>
      ) : null}
      <RACFieldError className="ag-date-field__error">{errorMessage}</RACFieldError>
    </RACDateRangePicker>
  );
}

export function DateRangePicker(props: DateRangePickerProps) {
  return (
    <DateProvider locale={props.locale} dir={props.dir}>
      <Inner {...props} />
    </DateProvider>
  );
}
