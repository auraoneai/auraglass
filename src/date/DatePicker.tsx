'use client';
/* DatePicker (SURF-212, REQ-SURF-98/99/101): RAC DatePicker — DateInput
   segments + a CMP Button trigger opening the Calendar in a DatePopup (a CMP
   Popover anchored below the field at >=640px container width, presented as a
   bottom sheet below; LayerStack-registered, so Escape and focus return go
   through the stack).

   One value chain: the inner Calendar receives NO value/defaultValue/
   onValueChange; it reads RAC's CalendarContext, so an uncontrolled selection
   updates the field, closes the popup, and fires onValueChange exactly once.
   On open, focus lands on the selected date (or today) in the grid. The
   trigger's aria-describedby points at a visually hidden span holding the
   formatted current value. */
import * as React from 'react';
import {
  DatePicker as RACDatePicker,
  DatePickerStateContext,
  DateInput as RACDateInput,
  DateSegment as RACDateSegment,
  FieldError as RACFieldError,
  Group as RACGroup,
  Label as RACLabel,
  LabelContext,
  Text as RACText,
  useSlottedContext,
} from 'react-aria-components';
import { DateProvider, useDateLocale } from './DateProvider';
import { Calendar } from './Calendar';
import { CALENDAR_INITIAL_FOCUS, DatePopup } from './DatePopup';
import { SHEET_BELOW_PX, useContainerWidth } from './useContainerWidth';
import type { DateFieldLikeProps, DateValue } from './shared';

export interface DatePickerProps extends DateFieldLikeProps<DateValue> {
  className?: string | undefined;
  labels?: { choose?: string | undefined; dialog?: string | undefined } | undefined;
}

function PickerPopup({
  compact,
  size,
  disabled,
  labels,
  hasLabel,
}: {
  compact: boolean;
  size: 'sm' | 'md' | 'lg';
  disabled: boolean;
  labels: DatePickerProps['labels'];
  hasLabel: boolean;
}) {
  const state = React.useContext(DatePickerStateContext);
  const labelCtx = useSlottedContext(LabelContext) as { id?: string } | null;
  const { locale, dir } = useDateLocale();
  const valueId = React.useId();
  if (!state) return null;
  const formatted = state.value != null ? state.formatValue(locale, { month: 'long' }) : '';
  const labelId = hasLabel ? labelCtx?.id : undefined;
  return (
    <>
      <span id={valueId} className="ag-vh" data-ag-part="date-picker-value">
        {formatted}
      </span>
      <DatePopup
        open={state.isOpen}
        onOpenChange={(o) => state.setOpen(o)}
        compact={compact}
        triggerLabel={labels?.choose ?? 'Choose date'}
        triggerPart="date-picker-trigger"
        triggerDescribedBy={formatted !== '' ? valueId : undefined}
        triggerDisabled={disabled}
        size={size}
        popupPart="date-picker-popover"
        popupClassName="ag-date-picker__popover"
        popupLabelledBy={labelId}
        popupLabel={labelId === undefined ? (labels?.dialog ?? labels?.choose ?? 'Choose date') : undefined}
        dir={dir}
        initialFocusSelector={CALENDAR_INITIAL_FOCUS}
      >
        <Calendar size={size} />
      </DatePopup>
    </>
  );
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
  const { anchorRef, dir } = useDateLocale();
  const [widthRef, width] = useContainerWidth();
  const rootRef = React.useCallback(
    (el: HTMLDivElement | null) => {
      anchorRef(el);
      widthRef(el);
    },
    [anchorRef, widthRef],
  );
  const hasLabel = label !== undefined && label !== null;
  return (
    <RACDatePicker
      ref={rootRef}
      data-ag-part="date-picker"
      data-ag-size={size}
      {...(dir !== undefined ? { dir } : {})}
      className={`ag-date-picker${className ? ` ${className}` : ''}`}
      {...(value !== undefined ? { value: value as never } : {})}
      {...(defaultValue !== undefined ? { defaultValue: defaultValue as never } : {})}
      {...(onValueChange !== undefined ? { onChange: (v) => onValueChange((v ?? null) as DateValue | null) } : {})}
      {...(minValue !== undefined ? { minValue: minValue as never } : {})}
      {...(maxValue !== undefined ? { maxValue: maxValue as never } : {})}
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
      {hasLabel ? <RACLabel>{label}</RACLabel> : null}
      <RACGroup className="ag-date-picker__group">
        <RACDateInput data-ag-part="date-input" className="ag-date-field__input">
          {(segment) => <RACDateSegment segment={segment} className="ag-date-field__segment" />}
        </RACDateInput>
        <PickerPopup
          compact={width !== null && width < SHEET_BELOW_PX}
          size={size}
          disabled={isDisabled === true || isReadOnly === true}
          labels={labels}
          hasLabel={hasLabel}
        />
      </RACGroup>
      {description !== undefined && description !== null ? (
        <RACText slot="description">{description}</RACText>
      ) : null}
      <RACFieldError className="ag-date-field__error">{errorMessage}</RACFieldError>
    </RACDatePicker>
  );
}

export function DatePicker(props: DatePickerProps) {
  return (
    <DateProvider locale={props.locale} dir={props.dir}>
      <Inner {...props} />
    </DateProvider>
  );
}
