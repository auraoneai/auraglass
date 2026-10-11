import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { ChartFrame } from './ChartFrame';

const meta = {
  title: 'surf/chart-frame',
  parameters: { ag: { subject: 'ChartFrame', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const DATA = [
  { m: 'Jan', a: 30, b: 50 },
  { m: 'Feb', a: 55, b: 40 },
  { m: 'Mar', a: 42, b: 70 },
];

const renderFrame = () => (
  <ChartFrame
    title="Monthly revenue"
    description="Two products"
    data={DATA}
    series={[{ key: 'a', label: 'Alpha' }, { key: 'b', label: 'Beta' }]}
    x={{ key: 'm', label: 'Month' }}
    yLabel="USD"
  >
    {(ctx) => (
      <svg width="100%" height={ctx.height} viewBox="0 0 640 240" preserveAspectRatio="none" role="img" aria-label="Line chart">
        {ctx.visibleSeries.map((s) => (
          <polyline
            key={s.key}
            fill="none"
            stroke={ctx.color(s.key)}
            strokeWidth={2}
            points={ctx.data.map((d, i) => `${(i + 0.5) * (640 / ctx.data.length)},${220 - (d as unknown as Record<string, number>)[s.key]! * 2}`).join(' ')}
          />
        ))}
      </svg>
    )}
  </ChartFrame>
);
export const Basic: Story = { render: renderFrame };
export const TableAlways: Story = { render: () => (
  <ChartFrame title="T" data={DATA} series={[{ key: 'a', label: 'A' }]} x={{ key: 'm', label: 'M' }} table="always">
    {() => null}
  </ChartFrame>
) };
