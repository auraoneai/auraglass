'use client';
/* Calendar + RangeCalendar (SURF-211, REQ-SURF-100/103): RAC calendar grid,
   optional ISO week-number rowheaders. */
import * as React from 'react';
import {
  Button as RACButton,
  Calendar as RACCalendar,
  CalendarCell as RACCalendarCell,
  CalendarGrid as RACCalendarGrid,
  CalendarGridBody as RACCalendarGridBody,
  CalendarGridHeader as RACCalendarGridHeader,
  CalendarHeaderCell as RACCalendarHeaderCell,
  Heading as RACHeading,
  RangeCalendar as RACRangeCalendar,
} from 'react-aria-components';
import { DateProvider } from './DateProvider';
import { isoWeekNumber } from './week-number';
import type { DateFieldLikeProps, DateValue } from './shared';

export interface CalendarProps extends DateFieldLikeProps<DateValue> {
  showWeekNumbers?: boolean | undefined;
  className?: string | undefined;
}

interface GridProps {
  showWeekNumbers?: boolean | undefined;
}

function Grid({ showWeekNumbers }: GridProps) {
  return (
    <RACCalendarGrid className="ag-calendar__grid">
      <RACCalendarGridHeader>
        {(day) => (
          <RACCalendarHeaderCell className="ag-calendar__weekday">{day}</RACCalendarHeaderCell>
        )}
      </RACCalendarGridHeader>
      <RACCalendarGridBody>
        {(date) =>
          showWeekNumbers === true ? (
            <>
              <td className="ag-calendar__weekno" role="rowheader">
                {isoWeekNumber(new Date(date.year, date.month - 1, date.day))}
              </td>
              <RACCalendarCell data-ag-focusable="" date={date} className="ag-calendar__cell" />
            </>
          ) : (
            <RACCalendarCell data-ag-focusable="" date={date} className="ag-calendar__cell" />
          )
        }
      </RACCalendarGridBody>
    </RACCalendarGrid>
  );
}

function Header({ labels }: { labels?: { previous?: string | undefined; next?: string | undefined } | undefined }) {
  return (
    <header className="ag-calendar__header">
      <RACButton data-ag-focusable="" slot="previous" className="ag-calendar__nav" aria-label={labels?.previous ?? 'Previous month'}>
        <span aria-hidden="true">‹</span>
      </RACButton>
      <RACHeading className="ag-calendar__heading" aria-live="polite" />
      <RACButton data-ag-focusable="" slot="next" className="ag-calendar__nav" aria-label={labels?.next ?? 'Next month'}>
        <span aria-hidden="true">›</span>
      </RACButton>
    </header>
  );
}

export function Calendar({
  value,
  defaultValue,
  onValueChange,
  minValue,
  maxValue,
  isDateUnavailable,
  firstDayOfWeek,
  isDisabled,
  isReadOnly,
  isInvalid,
  showWeekNumbers,
  locale,
  size = 'md',
  className,
  'aria-label': ariaLabel,
}: CalendarProps & { 'aria-label'?: string | undefined }) {
  return (
    <DateProvider locale={locale}>
      <RACCalendar
        data-ag-part="calendar"
        data-ag-size={size}
        className={`ag-calendar${className ? ` ${className}` : ''}`}
        {...(value !== undefined ? { value: value as never } : {})}
        {...(defaultValue !== undefined ? { defaultValue: defaultValue as never } : {})}
        {...(onValueChange !== undefined ? { onChange: (v) => onValueChange(v) } : {})}
        {...(minValue !== undefined ? { minValue: minValue as never } : {})}
        {...(maxValue !== undefined ? { maxValue: maxValue as never } : {})}
        {...(isDateUnavailable !== undefined ? { isDateUnavailable } : {})}
        {...(firstDayOfWeek !== undefined ? { firstDayOfWeek } : {})}
        {...(isDisabled !== undefined ? { isDisabled } : {})}
        {...(isReadOnly !== undefined ? { isReadOnly } : {})}
        {...(isInvalid !== undefined ? { isInvalid } : {})}
        {...(ariaLabel !== undefined ? { 'aria-label': ariaLabel } : {})}
      >
        <Header />
        <Grid showWeekNumbers={showWeekNumbers} />
      </RACCalendar>
    </DateProvider>
  );
}

export interface RangeCalendarProps extends Omit<CalendarProps, 'value' | 'defaultValue' | 'onValueChange'> {
  value?: { start: DateValue; end: DateValue } | null | undefined;
  defaultValue?: { start: DateValue; end: DateValue } | undefined;
  onValueChange?: ((v: { start: DateValue; end: DateValue } | null) => void) | undefined;
  visibleMonths?: 1 | 2 | undefined;
}

export function RangeCalendar({
  value,
  defaultValue,
  onValueChange,
  visibleMonths,
  showWeekNumbers,
  locale,
  size = 'md',
  className,
  'aria-label': ariaLabel,
  ...rest
}: RangeCalendarProps & { 'aria-label'?: string | undefined }) {
  return (
    <DateProvider locale={locale}>
      <RACRangeCalendar
        data-ag-part="range-calendar"
        data-ag-size={size}
        className={`ag-range-calendar${className ? ` ${className}` : ''}`}
        {...(value !== undefined ? { value: value as never } : {})}
        {...(defaultValue !== undefined ? { defaultValue: defaultValue as never } : {})}
        {...(onValueChange !== undefined ? { onChange: (v) => onValueChange(v) } : {})}
        {...(visibleMonths !== undefined ? { visibleDuration: { months: visibleMonths } } : {})}
        {...(rest.minValue !== undefined ? { minValue: rest.minValue as never } : {})}
        {...(rest.maxValue !== undefined ? { maxValue: rest.maxValue as never } : {})}
        {...(rest.isDateUnavailable !== undefined ? { isDateUnavailable: rest.isDateUnavailable } : {})}
        {...(rest.firstDayOfWeek !== undefined ? { firstDayOfWeek: rest.firstDayOfWeek } : {})}
        {...(rest.isDisabled !== undefined ? { isDisabled: rest.isDisabled } : {})}
        {...(rest.isReadOnly !== undefined ? { isReadOnly: rest.isReadOnly } : {})}
        {...(rest.isInvalid !== undefined ? { isInvalid: rest.isInvalid } : {})}
        {...(ariaLabel !== undefined ? { 'aria-label': ariaLabel } : {})}
      >
        <Header />
        <div className="ag-range-calendar__months">
          <Grid showWeekNumbers={showWeekNumbers} />
        </div>
      </RACRangeCalendar>
    </DateProvider>
  );
}
