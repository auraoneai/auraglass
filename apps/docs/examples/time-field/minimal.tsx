import { Time } from '@internationalized/date';
import { TimeField } from 'aura-glass/date';

export default function TimeFieldMinimal() {
  return <TimeField label="Reminder" defaultValue={new Time(9, 30)} />;
}
