/* GlassCalendar — 4.x compat adapter (REQ-SURF-13, DEP-S0224) → Calendar.
   selectedDate → value (CalendarDate via fromDate(date, getLocalTimeZone())
   client-side), onDateSelect(date) ← onValueChange, minDate/maxDate →
   minValue/maxValue, locale. The 4.x event-agenda surface (events, week/day
   views, showEvents) has no 5.0 Calendar equivalent and is not rendered;
   value/defaultValue/onChange spellings are also accepted. The mapping lives
   in ./GlassCalendar.impl, loaded on first render (../lazyAdapter) so importing
   aura-glass/compat never evaluates the optional date peers. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { lazyAdapter } from '../lazyAdapter';

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

const Impl = /*#__PURE__*/ lazyAdapter<GlassCalendarProps>(() => import('./GlassCalendar.impl').then((m) => m.GlassCalendarImpl));

/**
 * 4.x `GlassCalendar` compat adapter (DEP-S0224).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link Calendar from aura-glass/date}.
 */
export function GlassCalendar(props: GlassCalendarProps) {
  warnDeprecated('DEP-S0224');
  return <Impl.Render {...props} />;
}
