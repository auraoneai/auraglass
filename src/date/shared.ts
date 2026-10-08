// Shared prop surface for ./date components (REQ-SURF-99).
import type { CalendarDate, CalendarDateTime, DateValue, Time, ZonedDateTime } from '@internationalized/date';
import type { TimeValue as RACTimeValue } from 'react-aria-components';
export type TimeValue = RACTimeValue;

export type { CalendarDate, CalendarDateTime, DateValue, Time, ZonedDateTime };

export interface DateFieldLikeProps<V extends DateValue | TimeValue = DateValue> {
  value?: V | null | undefined;
  defaultValue?: V | null | undefined;
  onValueChange?: ((v: V | null) => void) | undefined;
  minValue?: V | undefined;
  maxValue?: V | undefined;
  isDateUnavailable?: ((date: DateValue) => boolean) | undefined;
  granularity?: 'day' | 'hour' | 'minute' | 'second' | undefined;
  hourCycle?: 12 | 24 | undefined;
  firstDayOfWeek?: 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | undefined;
  locale?: string | undefined;
  label?: React.ReactNode;
  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
  isInvalid?: boolean | undefined;
  isRequired?: boolean | undefined;
  isDisabled?: boolean | undefined;
  isReadOnly?: boolean | undefined;
  name?: string | undefined;
  size?: 'sm' | 'md' | 'lg' | undefined;
}
