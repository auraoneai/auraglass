import { CalendarDate } from '@internationalized/date';
import { Calendar } from 'aura-glass/date';

export default function CalendarMinimal() {
  return <Calendar aria-label="Event date" defaultValue={new CalendarDate(2026, 10, 7)} />;
}
