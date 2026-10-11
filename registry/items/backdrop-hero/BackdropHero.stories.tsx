import type { Meta, StoryObj } from '@storybook/react';
import type { StoryAgParameters } from '../../../src/contracts/testing';
import { BackdropHero } from './index';
import { HERO_EMPTY_PROPS, HERO_PROPS } from './fixtures';

const meta: Meta<typeof BackdropHero> = {
  title: 'registry/backdrop-hero',
  component: BackdropHero,
  parameters: { ag: { subject: 'backdrop-hero', kind: 'showcase', scenes: 'all' } satisfies StoryAgParameters },
};
export default meta;
type Story = StoryObj<typeof BackdropHero>;

const base = HERO_PROPS;
export const Default: Story = { args: base };
export const Aurora: Story = { args: { ...base, preset: 'aurora' } };
export const Empty: Story = { args: HERO_EMPTY_PROPS };
export const RTL: Story = { args: base, decorators: [(S) => <div dir="rtl"><S /></div>] };
export const ReducedTransparency: Story = { args: base, parameters: { agEnvironment: { transparency: 'none' } } };
export const ForcedColors: Story = { args: base, parameters: { agEnvironment: { forcedColors: 'active' } } };
