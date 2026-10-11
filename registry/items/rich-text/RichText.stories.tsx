// RichText.stories.tsx — showcase stories (kind 'showcase').
import type { Meta, StoryObj } from '@storybook/react';
import { RichText } from './index';
import { richTextEmpty, richTextProps } from './fixtures';

const meta: Meta<typeof RichText> = {
  title: 'plat/items/rich-text',
  component: RichText,
  args: richTextProps,
  parameters: { ag: { subject: 'rich-text', kind: 'showcase' } },
};
export default meta;
type Story = StoryObj<typeof RichText>;

export const Default: Story = {};
export const Empty: Story = { args: richTextEmpty };
export const ReadOnly: Story = { args: { ...richTextProps, readOnly: true } };
export const RTL: Story = { parameters: { globals: { dir: 'rtl' } } };
export const ReducedTransparency: Story = { parameters: { ag: { material: 'regular' } } };
export const ForcedColors: Story = { parameters: { globals: { forcedColors: 'active' } } };
