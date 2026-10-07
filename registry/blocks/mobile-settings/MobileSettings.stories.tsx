import type { Meta, StoryObj } from '@storybook/react-vite';
import { MobileSettings } from './index';

const meta = {
  title: 'surf/mobile-settings',
  component: MobileSettings,
  parameters: { ag: { subject: 'MobileSettings', kind: 'block' } },
} satisfies Meta<typeof MobileSettings>;
export default meta;
type Story = StoryObj<typeof meta>;

const renderSettings = () => <MobileSettings />;

export const Default: Story = { render: renderSettings };
export const Empty: Story = { render: () => <MobileSettings /> };
export const RTL: Story = { globals: { dir: 'rtl' }, render: renderSettings };
export const ReducedTransparency: Story = {
  parameters: { ag: { subject: 'MobileSettings', kind: 'block', material: 'regular' } },
  render: renderSettings,
};
export const ForcedColors: Story = {
  globals: { forcedColors: 'active' },
  render: renderSettings,
};
