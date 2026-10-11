/* analytics stories (REQ-QUAL-58): kind/tag `showcase`, one full-page story
   (layout fullscreen) and the filter bar + chart fragment. Tier S2. */
import type { Meta, StoryObj } from '@storybook/react';
import { Analytics, AnalyticsFilterChart } from './Analytics.showcase';

const meta = {
  title: 'Showcases/Analytics',
  component: Analytics,
  tags: ['showcase'],
  globals: { scene: 'dense-text' },
  parameters: { layout: 'fullscreen', ag: { subject: 'analytics', kind: 'showcase' } },
} satisfies Meta<typeof Analytics>;
export default meta;
type Story = StoryObj<typeof meta>;

export const FullPage: Story = { name: 'Full page' };

export const FilterBarChart: Story = {
  name: 'Filter bar + chart',
  parameters: { layout: 'padded' },
  render: () => <AnalyticsFilterChart />,
};

export const FilterBarChartDark: Story = {
  name: 'Filter bar + chart (dark)',
  parameters: { layout: 'padded' },
  globals: { scheme: 'dark' },
  render: () => <AnalyticsFilterChart />,
};
