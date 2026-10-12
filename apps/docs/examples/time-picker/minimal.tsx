import { Time } from '@internationalized/date';
import { TimePicker } from 'aura-glass/date';

export default function TimePickerMinimal() {
  return <TimePicker label="Start time" hourCycle={24} defaultValue={new Time(9, 30)} minuteStep={15} />;
}
