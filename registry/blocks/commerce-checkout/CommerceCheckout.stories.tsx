// CommerceCheckout.stories.tsx — six states per the SURF story contract.
import type { Meta, StoryObj } from '@storybook/react';
import { CommerceCheckout } from './index';
import { checkoutProps } from './fixtures';

const meta: Meta<typeof CommerceCheckout> = {
  title: 'surf/blocks/commerce-checkout',
  component: CommerceCheckout,
  args: checkoutProps,
  parameters: { ag: { subject: 'commerce-checkout', kind: 'showcase' } },
};
export default meta;
type Story = StoryObj<typeof CommerceCheckout>;

export const Default: Story = {};
export const Empty: Story = { args: { items: [] } };
export const Loading: Story = { parameters: { ag: { state: 'loading' } } };
export const RTL: Story = { parameters: { globals: { dir: 'rtl' } } };
export const ReducedTransparency: Story = { parameters: { ag: { material: 'regular' } } };
export const ForcedColors: Story = { parameters: { globals: { forcedColors: 'active' } } };
export const ReviewStep: Story = { args: { defaultStep: 'review' } };
