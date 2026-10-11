import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppFrame } from './index';

const meta = {
  title: 'surf/app-frame',
  component: AppFrame,
  parameters: { ag: { subject: 'AppFrame', kind: 'block' } },
} satisfies Meta<typeof AppFrame>;
export default meta;
type Story = StoryObj<typeof meta>;

const renderFrame = () => (
  <AppFrame>
    <p>Workspace content</p>
  </AppFrame>
);

export const Default: Story = { render: renderFrame };
export const Empty: Story = { render: () => <AppFrame /> };
export const RTL: Story = {
  globals: { dir: 'rtl' },
  render: renderFrame,
};
export const ReducedTransparency: Story = {
  globals: { dir: 'ltr' },
  parameters: { ag: { subject: 'AppFrame', kind: 'block', material: 'regular' } },
  render: renderFrame,
};
export const ForcedColors: Story = {
  globals: { forcedColors: 'active' },
  render: renderFrame,
};
