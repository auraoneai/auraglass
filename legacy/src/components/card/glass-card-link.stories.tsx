import type { Meta, StoryObj } from '@storybook/react';
import { GlassCardLink } from './glass-card-link';

const meta: Meta<typeof GlassCardLink> = {
  title: 'Surfaces/Cards + Panels/glass card link',
  component: GlassCardLink,
  parameters: {
    layout: 'centered',
    previewSurface: 'component',
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
  render: (args) => (
    <div className="glass-neutral-level1 glass-rounded-2xl glass-p-8">
      <GlassCardLink {...args}>Glass glass-card-link</GlassCardLink>
    </div>
  ),
  args: {},
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
