/* GlassCalendar implementation — loaded on first render by ./GlassCalendar
   (../lazyAdapter: keeps the optional date peers out of the compat import graph).
   selectedDate → value (CalendarDate via fromDate(date, getLocalTimeZone())
   client-side), onDateSelect(date) ← onValueChange, minDate/maxDate →
   minValue/maxValue, locale. value/defaultValue/onChange spellings are also
   accepted. */
'use client';
import * as React from 'react';
import { Calendar } from '../../../date/Calendar';
import type { CalendarDate, DateValue } from '../../../date/shared';
import { toCalendarDate, toJsDate } from './shared';
import type { GlassCalendarProps } from './GlassCalendar';

export function GlassCalendarImpl(props: GlassCalendarProps) {
  const { selectedDate, value, defaultValue, onDateSelect, onChange, minDate, maxDate, locale, weekNumbers, timeZone, className } = props;
  const selected = toCalendarDate(value ?? selectedDate, timeZone);
  const dv = toCalendarDate(defaultValue, timeZone);
  const minV = toCalendarDate(minDate, timeZone);
  const maxV = toCalendarDate(maxDate, timeZone);
  const [internal, setInternal] = React.useState(selected);
  const controlled = value !== undefined;
  return (
    <Calendar
      {...(controlled ? { value: selected ?? null } : internal ? { value: internal } : dv ? { defaultValue: dv } : {})}
      onValueChange={(next: DateValue | null) => {
        if (!controlled) setInternal(next ? (next as CalendarDate) : undefined);
        const js = toJsDate(next, timeZone);
        onChange?.(js);
        if (js) onDateSelect?.(js);
      }}
      {...(minV ? { minValue: minV } : {})}
      {...(maxV ? { maxValue: maxV } : {})}
      {...(locale ? { locale } : {})}
      {...(weekNumbers ? { showWeekNumbers: true } : {})}
      aria-label={props['aria-label'] ?? 'Calendar'}
      {...(className ? { className } : {})}
    />
  );
}
