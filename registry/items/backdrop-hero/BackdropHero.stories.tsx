import type { Meta, StoryObj } from '@storybook/react';
import { BackdropHero } from './index';

const meta: Meta<typeof BackdropHero> = {
  parameters: { ag: { subject: 'BackdropHero', kind: 'showcase' } }, title: 'registry/backdrop-hero', component: BackdropHero };
export default meta;
type Story = StoryObj<typeof BackdropHero>;

const base = { preset: 'photo' as const, title: 'Glass everywhere', lede: 'Ship the material', src: '/media/hero.jpg' };
export const Default: Story = { args: base };
export const Aurora: Story = { args: { ...base, preset: 'aurora' } };
export const Empty: Story = { args: { preset: 'aurora' as const, title: '', lede: '' } };
export const RTL: Story = { args: base, decorators: [(S) => <div dir="rtl"><S /></div>] };
export const ReducedTransparency: Story = { args: base, parameters: { agEnvironment: { transparency: 'none' } } };
export const ForcedColors: Story = { args: base, parameters: { agEnvironment: { forcedColors: 'active' } } };
