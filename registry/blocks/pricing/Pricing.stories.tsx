// Pricing.stories.tsx — six states per the SURF story contract.
import type { Meta, StoryObj } from '@storybook/react';
import { Pricing } from './index';
import { pricingProps, pricingPropsJP } from './fixtures';

const meta: Meta<typeof Pricing> = {
  title: 'surf/blocks/pricing',
  component: Pricing,
  args: pricingProps,
  parameters: { ag: { subject: 'pricing', kind: 'showcase' } },
};
export default meta;
type Story = StoryObj<typeof Pricing>;

export const Default: Story = {};
export const Empty: Story = { args: { plans: [] } };
export const Loading: Story = { parameters: { ag: { state: 'loading' } } };
export const RTL: Story = { parameters: { globals: { dir: 'rtl' } } };
export const ReducedTransparency: Story = { parameters: { ag: { material: 'regular' } } };
export const ForcedColors: Story = { parameters: { globals: { forcedColors: 'active' } } };
export const JPY: Story = { args: pricingPropsJP };
export const Yearly: Story = { args: { defaultPeriod: 'yearly' } };
