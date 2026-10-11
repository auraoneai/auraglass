/* financial-dashboard stories (REQ-QUAL-58): kind/tag `showcase`, one full-page
   story (layout fullscreen) and two fragments. */
import type { Meta, StoryObj } from '@storybook/react';
import { FinancialDashboard, FinancialDashboardKpis, FinancialDashboardLedgerHead } from './FinancialDashboard.showcase';

const meta = {
  title: 'Showcases/Financial Dashboard',
  component: FinancialDashboard,
  tags: ['showcase'],
  globals: { scene: 'flat-white' },
  parameters: { layout: 'fullscreen', ag: { subject: 'financial-dashboard', kind: 'showcase' } },
} satisfies Meta<typeof FinancialDashboard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const FullPage: Story = { name: 'Full page' };

export const KpiRow: Story = {
  name: 'KPI row',
  parameters: { layout: 'padded' },
  render: () => <FinancialDashboardKpis />,
};

export const LedgerHead: Story = {
  name: 'Table header + 20 rows',
  parameters: { layout: 'padded' },
  render: () => <FinancialDashboardLedgerHead />,
};
