/* ops-console stories (REQ-QUAL-58): kind/tag `showcase`, one full-page story
   (layout fullscreen) and two fragments. */
import type { Meta, StoryObj } from '@storybook/react';
import { OpsConsole, OpsConsoleIncidents, OpsConsoleSplit } from './OpsConsole.showcase';

const meta = {
  title: 'Showcases/Ops Console',
  component: OpsConsole,
  tags: ['showcase'],
  globals: { scene: 'flat-black' },
  parameters: { layout: 'fullscreen', ag: { subject: 'ops-console', kind: 'showcase' } },
} satisfies Meta<typeof OpsConsole>;
export default meta;
type Story = StoryObj<typeof meta>;

export const FullPage: Story = { name: 'Full page' };

export const IncidentTable: Story = {
  name: 'Incident table',
  parameters: { layout: 'padded' },
  render: () => <OpsConsoleIncidents />,
};

export const TreePanelSplit: Story = {
  name: 'Tree + panel split',
  parameters: { layout: 'padded' },
  render: () => <OpsConsoleSplit />,
};
