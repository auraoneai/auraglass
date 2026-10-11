/* spatial-control-center stories (REQ-QUAL-58): kind/tag `showcase`, one full-page
   story (layout fullscreen) and the control-grid fragment. Tier S2. */
import type { Meta, StoryObj } from '@storybook/react';
import { SpatialControlCenter, SpatialControlGrid } from './SpatialControlCenter.showcase';

const meta = {
  title: 'Showcases/Spatial Control Center',
  component: SpatialControlCenter,
  tags: ['showcase'],
  globals: { scene: 'hf-pattern' },
  parameters: { layout: 'fullscreen', ag: { subject: 'spatial-control-center', kind: 'showcase', refraction: true } },
} satisfies Meta<typeof SpatialControlCenter>;
export default meta;
type Story = StoryObj<typeof meta>;

export const FullPage: Story = { name: 'Full page' };

export const ControlGrid: Story = {
  name: 'Control grid',
  parameters: { layout: 'padded' },
  render: () => <SpatialControlGrid />,
};

export const ControlGridDark: Story = {
  name: 'Control grid (dark)',
  parameters: { layout: 'padded' },
  globals: { scheme: 'dark' },
  render: () => <SpatialControlGrid />,
};
