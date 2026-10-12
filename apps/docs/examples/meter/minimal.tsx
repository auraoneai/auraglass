import { Meter } from 'aura-glass';

export default function MeterMinimal() {
  return <Meter label="Storage" value={72} low={20} high={80} optimum={10} showValue />;
}
