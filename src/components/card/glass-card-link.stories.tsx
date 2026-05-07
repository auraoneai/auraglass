import type { Meta, StoryObj } from '@storybook/react';
import { GlassCardLink } from './glass-card-link';

const meta: Meta<typeof GlassCardLink> = {
  title: 'Surfaces/Cards + Panels/glass card link',
  component: GlassCardLink,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0a0a0a' },
        { name: 'glass', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
      ],
    },
  },
  argTypes: {
    // Standard anchor element props
    href: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Glass glass-card-link',
  },
};

export const WithCustomHref: Story = {
  args: {
    ...Default.args,
    href: 'https://example.com'
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    href: '#',
    'aria-disabled': true,
  },
};
