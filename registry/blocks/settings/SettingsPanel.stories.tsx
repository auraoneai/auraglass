// SettingsPanel.stories.tsx — showcase stories (kind 'showcase').
import type { Meta, StoryObj } from '@storybook/react';
import { SettingsPanel } from './index';
import { settingsProps } from './fixtures';

const meta: Meta<typeof SettingsPanel> = {
  title: 'plat/blocks/settings',
  component: SettingsPanel,
  args: settingsProps,
  parameters: { ag: { subject: 'settings', kind: 'showcase' } },
};
export default meta;
type Story = StoryObj<typeof SettingsPanel>;

export const Default: Story = {};
export const RowsSection: Story = { args: { defaultSection: 'workspace' } };
export const RTL: Story = { parameters: { globals: { dir: 'rtl' } } };
export const ReducedTransparency: Story = { parameters: { ag: { material: 'regular' } } };
export const ForcedColors: Story = { parameters: { globals: { forcedColors: 'active' } } };
