/* GlassCalendar — 4.x compat adapter (REQ-SURF-13, DEP-S0224) → Calendar.
   selectedDate → value (CalendarDate via fromDate(date, getLocalTimeZone())
   client-side), onDateSelect(date) ← onValueChange, minDate/maxDate →
   minValue/maxValue, locale. The 4.x event-agenda surface (events, week/day
   views, showEvents) has no 5.0 Calendar equivalent and is not rendered;
   value/defaultValue/onChange spellings are also accepted. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Calendar } from '../../../date/Calendar';
import type { CalendarDate, DateValue } from '../../../date/shared';
import { toCalendarDate, toJsDate } from './shared';

export interface GlassCalendarProps {
  selectedDate?: Date;
  value?: Date;
  defaultValue?: Date;
  onDateSelect?: (date: Date) => void;
  onChange?: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  locale?: string;
  weekNumbers?: boolean;
  timeZone?: string;
  className?: string;
  'aria-label'?: string;
  [legacy: string]: unknown;
}

/**
 * 4.x `GlassCalendar` compat adapter (DEP-S0224).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link Calendar from aura-glass/date}.
 */
export function GlassCalendar(props: GlassCalendarProps) {
  warnDeprecated('DEP-S0224');
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
