import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { ChartFrame } from './ChartFrame';
import type { ChartContext } from './types';

const meta = {
  title: 'surf/chart-frame',
  parameters: { ag: { subject: 'ChartFrame', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

type Row = { m: string; a: number; b: number };
const DATA: Row[] = [
  { m: 'Jan', a: 30, b: 50 },
  { m: 'Feb', a: 55, b: 40 },
  { m: 'Mar', a: 42, b: 70 },
];
const SERIES = [
  { key: 'a', label: 'Alpha' },
  { key: 'b', label: 'Beta' },
];

/* A small hand-written SVG adapter (ChartAdapter<Row>). */
function lines(ctx: ChartContext<Row>) {
  const w = 640;
  return (
    <svg width="100%" height={ctx.height} viewBox={`0 0 ${w} 240`} preserveAspectRatio="none" role="img" aria-label="Line chart">
      {ctx.visibleSeries.map((s) => (
        <polyline
          key={s.key}
          fill="none"
          stroke={ctx.color(s.key)}
          strokeWidth={2}
          points={ctx.data
            .map((d, i) => {
              const x = (i + 0.5) * (w / ctx.data.length);
              return `${ctx.dir === 'rtl' ? w - x : x},${220 - Number(d[s.key as keyof Row]) * 2}`;
            })
            .join(' ')}
        />
      ))}
    </svg>
  );
}

/* The RSC-safe pattern: a client component element that reads the context. */
function LinesAdapter() {
  return lines(ChartFrame.useContext<Row>());
}

const frame = (props: Partial<React.ComponentProps<typeof ChartFrame<Row>>> = {}) => (
  <ChartFrame<Row>
    title="Monthly revenue"
    description="Two products"
    data={DATA}
    series={SERIES}
    x={{ key: 'm', label: 'Month' }}
    yLabel="USD"
    {...props}
  >
    {props.children ?? lines}
  </ChartFrame>
);

/** table='toggle' (default): the spec opens and closes the table. */
export const Default: Story = { render: () => frame() };
/** table='visually-hidden': the table stays in the accessibility tree, the plot is hidden. */
export const TableVisuallyHidden: Story = { render: () => frame({ table: 'visually-hidden' }) };
/** table='always'. */
export const TableAlways: Story = { render: () => frame({ table: 'always' }) };
/** Hiding Alpha leaves Beta as the last visible series (aria-disabled + description). */
export const LegendToggle: Story = { render: () => frame({ defaultHiddenSeries: ['a'], legend: 'top' }) };
/** Element adapter reading ChartFrame.useContext() (what a server component passes). */
export const ElementAdapter: Story = { render: () => frame({ children: <LinesAdapter /> }) };
/** legend='top' in a 360px container: the legend renders after the plot and wraps. */
export const Narrow: Story = {
  render: () => <div style={{ inlineSize: 360 }}>{frame({ legend: 'top' })}</div>,
};
/** ChartContext.dir follows the closest [dir]. */
export const Rtl: Story = { render: () => <div dir="rtl">{frame()}</div> };
