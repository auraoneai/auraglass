import { ChartFrame } from 'aura-glass/data';

const DATA = [
  { month: 'Jan', alpha: 30, beta: 22 },
  { month: 'Feb', alpha: 55, beta: 40 },
  { month: 'Mar', alpha: 48, beta: 52 },
];
const SERIES = [
  { key: 'alpha', label: 'Alpha' },
  { key: 'beta', label: 'Beta' },
];

export default function ChartFrameMinimal() {
  return (
    <ChartFrame title="Signups" data={DATA} series={SERIES} x={{ key: 'month', label: 'Month' }}>
      {(ctx) => <svg width={ctx.width} height={ctx.height} aria-hidden="true" />}
    </ChartFrame>
  );
}
