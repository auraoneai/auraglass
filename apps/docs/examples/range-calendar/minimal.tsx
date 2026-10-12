import { CalendarDate } from '@internationalized/date';
import { RangeCalendar } from 'aura-glass/date';

export default function RangeCalendarMinimal() {
  return (
    <RangeCalendar
      aria-label="Trip dates"
      defaultValue={{ start: new CalendarDate(2026, 10, 5), end: new CalendarDate(2026, 10, 9) }}
    />
  );
}
