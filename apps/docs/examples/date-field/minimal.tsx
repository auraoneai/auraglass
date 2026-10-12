import { CalendarDate } from '@internationalized/date';
import { DateField } from 'aura-glass/date';

export default function DateFieldMinimal() {
  return <DateField label="Publish on" defaultValue={new CalendarDate(2026, 10, 7)} />;
}
