import { CalendarDate } from '@internationalized/date';
import { DatePicker } from 'aura-glass/date';

export default function DatePickerMinimal() {
  return <DatePicker label="Due date" defaultValue={new CalendarDate(2026, 10, 15)} />;
}
