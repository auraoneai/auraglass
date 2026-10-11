// RhfTextField.stories.tsx — showcase stories (kind 'showcase').
import type { Meta, StoryObj } from '@storybook/react';
import { RhfTextField } from './index';
import { rhfControlDouble, rhfFieldProps } from './fixtures';

const meta: Meta<typeof RhfTextField> = {
  title: 'plat/items/react-hook-form',
  component: RhfTextField,
  args: { ...rhfFieldProps, control: rhfControlDouble },
  parameters: { ag: { subject: 'react-hook-form', kind: 'showcase' } },
};
export default meta;
type Story = StoryObj<typeof RhfTextField>;

export const Default: Story = {};
export const RTL: Story = { parameters: { globals: { dir: 'rtl' } } };
export const ReducedTransparency: Story = { parameters: { ag: { material: 'regular' } } };
export const ForcedColors: Story = { parameters: { globals: { forcedColors: 'active' } } };
