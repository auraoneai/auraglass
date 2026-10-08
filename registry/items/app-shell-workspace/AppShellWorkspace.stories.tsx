import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppShellWorkspace } from './index';

const meta = {
  title: 'surf/app-shell-workspace',
  component: AppShellWorkspace,
  parameters: { ag: { subject: 'AppShellWorkspace', kind: 'item' } },
} satisfies Meta<typeof AppShellWorkspace>;
export default meta;
type Story = StoryObj<typeof meta>;

const renderWorkspace = () => <AppShellWorkspace />;

export const Default: Story = { render: renderWorkspace };
export const Empty: Story = { render: () => <AppShellWorkspace /> };
export const RTL: Story = { globals: { dir: 'rtl' }, render: renderWorkspace };
export const ReducedTransparency: Story = {
  parameters: { ag: { subject: 'AppShellWorkspace', kind: 'item', material: 'regular' } },
  render: renderWorkspace,
};
export const ForcedColors: Story = {
  globals: { forcedColors: 'active' },
  render: renderWorkspace,
};
