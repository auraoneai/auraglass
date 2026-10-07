import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Chart } from './Chart';

const meta = {
  title: 'surf/chart',
  parameters: { ag: { subject: 'Chart', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const DATA = [
  { m: 'Jan', a: 30, b: 50 },
  { m: 'Feb', a: 55, b: 40 },
  { m: 'Mar', a: 42, b: 70 },
  { m: 'Apr', a: 60, b: 62 },
  { m: 'May', a: 71, b: 80 },
];
const SERIES = [
  { key: 'a', label: 'Alpha' },
  { key: 'b', label: 'Beta' },
];
const BASE = { title: 'Monthly revenue', data: DATA, series: SERIES, x: { key: 'm', label: 'Month' }, yLabel: 'USD' } as const;

export const Line: Story = { render: () => <Chart {...BASE} type="line" /> };
export const Area: Story = { render: () => <Chart {...BASE} type="area" /> };
export const StackedArea: Story = { render: () => <Chart {...BASE} type="area" stacked /> };
export const Bar: Story = { render: () => <Chart {...BASE} type="bar" /> };
export const HorizontalBar: Story = { render: () => <Chart {...BASE} type="bar" orientation="horizontal" /> };
export const Donut: Story = { render: () => <Chart {...BASE} type="donut" /> };
export const Tooltip: Story = { render: () => <Chart {...BASE} type="line" tooltip /> };
export const Keyboard: Story = { render: () => <Chart {...BASE} type="bar" tooltip /> };
