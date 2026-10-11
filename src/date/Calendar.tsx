'use client';
/* Calendar + RangeCalendar (SURF-211, REQ-SURF-100/102/103): RAC calendar grid,
   optional ISO week-number rowheaders, one grid per visible month.

   Week numbers: RAC's CalendarGridBody has no row hook, so the rowheader is
   emitted together with the FIRST cell of each row (the cell whose locale
   weekday index is 0), giving exactly one <th role=rowheader scope=row> + 7
   gridcells per week. The week number is the ISO week of that row's Thursday
   (rows that start on Sunday or Saturday straddle two ISO weeks; the Thursday
   decides, as in ISO-8601), computed from the CalendarDate via Date.UTC. The
   matching header row adds one leading column header.

   Contextual use: inside a RAC DatePicker the Calendar reads value/onChange
   from the picker's CalendarContext (pass no value props), so a selection
   updates the field and closes the picker through one value chain. */
import * as React from 'react';
import {
  Button as RACButton,
  Calendar as RACCalendar,
  CalendarCell as RACCalendarCell,
  CalendarContext,
  CalendarGrid as RACCalendarGrid,
  CalendarGridBody as RACCalendarGridBody,
  CalendarGridHeader as RACCalendarGridHeader,
  CalendarHeaderCell as RACCalendarHeaderCell,
  CalendarStateContext,
  Heading as RACHeading,
  RangeCalendar as RACRangeCalendar,
  RangeCalendarContext,
  RangeCalendarStateContext,
  useLocale,
  useSlottedContext,
} from 'react-aria-components';
import { DateFormatter, getDayOfWeek, startOfWeek } from '@internationalized/date';
import { DateProvider, useDateLocale } from './DateProvider';
import { isoWeekNumber, isoWeekday } from './week-number';
import { raChangeDetails } from './shared';
import type { DateFieldLikeProps, DateValue } from './shared';
import type { toChangeDetails } from '../foundation';
/** S-30 ChangeDetails, via the CMP foundation seam (no contracts/ specifier in src). */
type ChangeDetails = ReturnType<typeof toChangeDetails>;

export interface CalendarLabels {
  previous?: string | undefined;
  next?: string | undefined;
  /** Week-number column header (visually hidden) and rowheader prefix. */
  week?: string | undefined;
}

export interface CalendarProps extends DateFieldLikeProps<DateValue> {
  showWeekNumbers?: boolean | undefined;
  className?: string | undefined;
  labels?: CalendarLabels | undefined;
}

type FirstDayOfWeek = NonNullable<DateFieldLikeProps['firstDayOfWeek']>;

function useGridFirstDayOfWeek(): FirstDayOfWeek | undefined {
  const cal = useSlottedContext(CalendarContext) as { firstDayOfWeek?: FirstDayOfWeek } | null;
  const range = useSlottedContext(RangeCalendarContext) as { firstDayOfWeek?: FirstDayOfWeek } | null;
  return cal?.firstDayOfWeek ?? range?.firstDayOfWeek;
}

function WeekNumberHeader({ offsetMonths, weekLabel }: { offsetMonths: number; weekLabel: string }) {
  const calState = React.useContext(CalendarStateContext);
  const rangeState = React.useContext(RangeCalendarStateContext);
  const state = calState ?? rangeState;
  const { locale } = useLocale();
  const firstDayOfWeek = useGridFirstDayOfWeek();
  if (!state) return null;
  const start = state.visibleRange.start.add({ months: offsetMonths });
  const weekStart = startOfWeek(start, locale, firstDayOfWeek);
  const fmt = new DateFormatter(locale, { weekday: 'narrow', timeZone: state.timeZone });
  const days = Array.from({ length: 7 }, (_, i) => weekStart.add({ days: i }));
  return (
    <thead aria-hidden="true">
      <tr>
        <th className="ag-calendar__weekno-header" data-ag-part="calendar-weekno-header">
          <span className="ag-vh">{weekLabel}</span>
        </th>
        {days.map((d) => (
          <th key={d.toString()} className="ag-calendar__weekday">
            {fmt.format(d.toDate(state.timeZone))}
          </th>
        ))}
      </tr>
    </thead>
  );
}

interface GridProps {
  showWeekNumbers?: boolean | undefined;
  offsetMonths?: number | undefined;
  weekLabel: string;
}

const noopSubscribe = () => () => {};

function hasZone(v: unknown): boolean {
  const first = Array.isArray(v) ? v[0] : v;
  return first != null && typeof first === 'object' && 'timeZone' in first;
}

/* REQ-SURF-08: React Aria derives "today" (data-today, the "Today, " cell
   label) from the calendar state's timeZone, which is the host's local zone,
   so a server in one zone and a client in another render different markup and
   hydration fails. Until hydration completes (server render + hydrating pass)
   cells resolve "today" in UTC, identical on every host; the post-hydration
   render restores the viewer's local zone. A zoned value keeps its own zone.
   The state object is adjusted in place: React Aria keys per-state data on
   its identity, and RACCalendar builds a fresh state object every render. */
const hostTimeZone = new WeakMap<object, string>();

function useHydrationSafeToday() {
  const hydrated = React.useSyncExternalStore(noopSubscribe, () => true, () => false);
  const calendarState = React.useContext(CalendarStateContext);
  const rangeState = React.useContext(RangeCalendarStateContext);
  const state = (calendarState ?? rangeState) as { timeZone: string; value: unknown } | null;
  if (!state) return;
  if (!hostTimeZone.has(state)) hostTimeZone.set(state, state.timeZone);
  const host = hostTimeZone.get(state)!;
  const value = state.value as { start?: unknown } | null;
  const zoned = hasZone(value && typeof value === 'object' && 'start' in value ? value.start : value);
  state.timeZone = !hydrated && !zoned ? 'UTC' : host;
}

function Grid({ showWeekNumbers, offsetMonths = 0, weekLabel }: GridProps) {
  const { locale } = useLocale();
  const firstDayOfWeek = useGridFirstDayOfWeek();
  const weeks = showWeekNumbers === true;
  useHydrationSafeToday();
  return (
    <RACCalendarGrid
      className="ag-calendar__grid"
      data-ag-part="calendar-grid"
      {...(offsetMonths > 0 ? { offset: { months: offsetMonths } } : {})}
    >
      {weeks ? (
        <WeekNumberHeader offsetMonths={offsetMonths} weekLabel={weekLabel} />
      ) : (
        <RACCalendarGridHeader>
          {(day) => <RACCalendarHeaderCell className="ag-calendar__weekday">{day}</RACCalendarHeaderCell>}
        </RACCalendarGridHeader>
      )}
      <RACCalendarGridBody>
        {(date) => {
          const cell = <RACCalendarCell data-ag-focusable="" date={date} className="ag-calendar__cell" />;
          if (!weeks || getDayOfWeek(date, locale, firstDayOfWeek) !== 0) return cell;
          const thursday = date.add({ days: (4 - isoWeekday(date) + 7) % 7 });
          const week = isoWeekNumber(thursday);
          return (
            <>
              <th
                role="rowheader"
                scope="row"
                className="ag-calendar__weekno"
                data-ag-part="calendar-weekno"
                aria-label={`${weekLabel} ${week}`}
              >
                {week}
              </th>
              {cell}
            </>
          );
        }}
      </RACCalendarGridBody>
    </RACCalendarGrid>
  );
}

/* APG date grid (REQ-SURF-100): Home / End move to the first / last day of
   the focused WEEK. RAC maps them to the start / end of the month, so the
   month wrapper intercepts both keys in the capture phase and moves RAC's
   focused date itself (the cell then focuses through RAC's own effect). */
function Months({ className, children }: { className: string; children: React.ReactNode }) {
  const calState = React.useContext(CalendarStateContext);
  const rangeState = React.useContext(RangeCalendarStateContext);
  const state = calState ?? rangeState;
  const { locale } = useLocale();
  const firstDayOfWeek = useGridFirstDayOfWeek();
  const onKeyDownCapture = (e: React.KeyboardEvent) => {
    if (!state || (e.key !== 'Home' && e.key !== 'End')) return;
    if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) return;
    if (!(e.target instanceof Element) || e.target.closest('[role="grid"]') === null) return;
    e.preventDefault();
    e.stopPropagation();
    const start = startOfWeek(state.focusedDate, locale, firstDayOfWeek);
    state.setFocusedDate(e.key === 'Home' ? start : start.add({ days: 6 }));
  };
  return (
    <div className={className} onKeyDownCapture={onKeyDownCapture}>
      {children}
    </div>
  );
}

function Header({ labels }: { labels?: CalendarLabels | undefined }) {
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

function CalendarInner({
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
  size = 'md',
  className,
  labels,
  autoFocus,
  'aria-label': ariaLabel,
}: CalendarProps & { 'aria-label'?: string | undefined; autoFocus?: boolean | undefined }) {
  const { anchorRef, dir } = useDateLocale();
  return (
    <RACCalendar
      ref={anchorRef as React.Ref<HTMLDivElement>}
      data-ag-part="calendar"
      data-ag-size={size}
      {...(dir !== undefined ? { dir } : {})}
      className={`ag-calendar${className ? ` ${className}` : ''}`}
      {...(value !== undefined ? { value: value as never } : {})}
      {...(defaultValue !== undefined ? { defaultValue: defaultValue as never } : {})}
      {...(onValueChange !== undefined ? { onChange: (v) => onValueChange(v, raChangeDetails()) } : {})}
      {...(minValue !== undefined ? { minValue: minValue as never } : {})}
      {...(maxValue !== undefined ? { maxValue: maxValue as never } : {})}
      {...(isDateUnavailable !== undefined ? { isDateUnavailable } : {})}
      {...(firstDayOfWeek !== undefined ? { firstDayOfWeek } : {})}
      {...(isDisabled !== undefined ? { isDisabled } : {})}
      {...(isReadOnly !== undefined ? { isReadOnly } : {})}
      {...(isInvalid !== undefined ? { isInvalid } : {})}
      {...(autoFocus !== undefined ? { autoFocus } : {})}
      {...(ariaLabel !== undefined ? { 'aria-label': ariaLabel } : {})}
    >
      <Header labels={labels} />
      <Months className="ag-calendar__months">
        <Grid showWeekNumbers={showWeekNumbers} weekLabel={labels?.week ?? 'Week'} />
      </Months>
    </RACCalendar>
  );
}

export function Calendar(props: CalendarProps & { 'aria-label'?: string | undefined }) {
  return (
    <DateProvider locale={props.locale} dir={props.dir}>
      <CalendarInner {...props} />
    </DateProvider>
  );
}

export interface RangeCalendarProps extends Omit<CalendarProps, 'value' | 'defaultValue' | 'onValueChange'> {
  value?: { start: DateValue; end: DateValue } | null | undefined;
  defaultValue?: { start: DateValue; end: DateValue } | undefined;
  onValueChange?: ((v: { start: DateValue; end: DateValue } | null, details: ChangeDetails) => void) | undefined;
  visibleMonths?: 1 | 2 | undefined;
}

export interface RangeCalendarImplProps extends RangeCalendarProps {
  'aria-label'?: string | undefined;
  /** Ignore an enclosing RAC DateRangePicker's context (draft-commit mode). */
  standalone?: boolean | undefined;
  autoFocus?: boolean | undefined;
}

/** @internal DateRangePicker renders the draft calendar standalone. */
export function RangeCalendarImpl({
  value,
  defaultValue,
  onValueChange,
  visibleMonths = 1,
  showWeekNumbers,
  locale,
  dir,
  size = 'md',
  className,
  labels,
  standalone,
  autoFocus,
  'aria-label': ariaLabel,
  ...rest
}: RangeCalendarImplProps) {
  return (
    <DateProvider locale={locale} dir={dir}>
      <RangeCalendarBody
        {...{ value, defaultValue, onValueChange, visibleMonths, showWeekNumbers, size, className, labels, standalone, autoFocus, ariaLabel, rest }}
      />
    </DateProvider>
  );
}

function RangeCalendarBody({
  value,
  defaultValue,
  onValueChange,
  visibleMonths,
  showWeekNumbers,
  size,
  className,
  labels,
  standalone,
  autoFocus,
  ariaLabel,
  rest,
}: {
  value: RangeCalendarProps['value'];
  defaultValue: RangeCalendarProps['defaultValue'];
  onValueChange: RangeCalendarProps['onValueChange'];
  visibleMonths: 1 | 2;
  showWeekNumbers: boolean | undefined;
  size: 'sm' | 'md' | 'lg';
  className: string | undefined;
  labels: CalendarLabels | undefined;
  standalone: boolean | undefined;
  autoFocus: boolean | undefined;
  ariaLabel: string | undefined;
  rest: Omit<RangeCalendarProps, 'value' | 'defaultValue' | 'onValueChange' | 'visibleMonths' | 'showWeekNumbers' | 'locale' | 'size' | 'className' | 'labels'>;
}) {
  const { anchorRef, dir } = useDateLocale();
  const weekLabel = labels?.week ?? 'Week';
  return (
    <RACRangeCalendar
      ref={anchorRef as React.Ref<HTMLDivElement>}
      {...(standalone === true ? { slot: null } : {})}
      data-ag-part="range-calendar"
      data-ag-size={size}
      data-ag-visible-months={visibleMonths}
      {...(dir !== undefined ? { dir } : {})}
      className={`ag-range-calendar${className ? ` ${className}` : ''}`}
      {...(value !== undefined ? { value: value as never } : {})}
      {...(defaultValue !== undefined ? { defaultValue: defaultValue as never } : {})}
      {...(onValueChange !== undefined ? { onChange: (v) => onValueChange(v as never, raChangeDetails()) } : {})}
      visibleDuration={{ months: visibleMonths }}
      {...(rest.minValue !== undefined ? { minValue: rest.minValue as never } : {})}
      {...(rest.maxValue !== undefined ? { maxValue: rest.maxValue as never } : {})}
      {...(rest.isDateUnavailable !== undefined ? { isDateUnavailable: rest.isDateUnavailable } : {})}
      {...(rest.firstDayOfWeek !== undefined ? { firstDayOfWeek: rest.firstDayOfWeek } : {})}
      {...(rest.isDisabled !== undefined ? { isDisabled: rest.isDisabled } : {})}
      {...(rest.isReadOnly !== undefined ? { isReadOnly: rest.isReadOnly } : {})}
      {...(rest.isInvalid !== undefined ? { isInvalid: rest.isInvalid } : {})}
      {...(autoFocus !== undefined ? { autoFocus } : {})}
      {...(ariaLabel !== undefined ? { 'aria-label': ariaLabel } : {})}
    >
      <Header labels={labels} />
      <Months className="ag-range-calendar__months">
        {Array.from({ length: visibleMonths }, (_, i) => (
          <Grid key={i} offsetMonths={i} showWeekNumbers={showWeekNumbers} weekLabel={weekLabel} />
        ))}
      </Months>
    </RACRangeCalendar>
  );
}

export function RangeCalendar(props: RangeCalendarProps & { 'aria-label'?: string | undefined }) {
  return <RangeCalendarImpl {...props} />;
}
