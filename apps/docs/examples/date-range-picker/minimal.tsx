import { CalendarDate } from '@internationalized/date';
import { DateRangePicker } from 'aura-glass/date';

export default function DateRangePickerMinimal() {
  return (
    <DateRangePicker
      label="Report window"
      defaultValue={{ start: new CalendarDate(2026, 10, 1), end: new CalendarDate(2026, 10, 7) }}
    />
  );
}
