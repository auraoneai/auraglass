// CommerceCart.stories.tsx — six states per the SURF story contract.
import type { Meta, StoryObj } from '@storybook/react';
import { CommerceCart } from './index';
import { cartProps } from './fixtures';

const meta: Meta<typeof CommerceCart> = {
  title: 'surf/blocks/commerce-cart',
  component: CommerceCart,
  args: cartProps,
  parameters: { ag: { subject: 'commerce-cart', kind: 'showcase' } },
};
export default meta;
type Story = StoryObj<typeof CommerceCart>;

export const Default: Story = {};
export const Empty: Story = { args: { items: [] } };
export const Loading: Story = { args: { items: [] }, parameters: { ag: { state: 'loading' } } };
export const RTL: Story = { parameters: { globals: { dir: 'rtl' } } };
export const ReducedTransparency: Story = { parameters: { ag: { material: 'regular' } } };
export const ForcedColors: Story = { parameters: { globals: { forcedColors: 'active' } } };
