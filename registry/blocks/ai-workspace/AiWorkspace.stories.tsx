import type { Meta, StoryObj } from '@storybook/react';
import type { StoryAgParameters } from '../../../src/contracts/testing';
import AiWorkspacePage from './page';

const meta: Meta<typeof AiWorkspacePage> = {
  title: 'registry/ai-workspace',
  component: AiWorkspacePage,
  parameters: { ag: { subject: 'ai-workspace', kind: 'showcase', scenes: 'all' } satisfies StoryAgParameters },
};
export default meta;
type Story = StoryObj<typeof AiWorkspacePage>;

export const Default: Story = {};
export const Empty: Story = { parameters: { note: 'composer-only empty thread' } };
export const RTL: Story = { decorators: [(S) => <div dir="rtl"><S /></div>] };
export const ReducedTransparency: Story = { parameters: { agEnvironment: { transparency: 'none' } } };
export const ForcedColors: Story = { parameters: { agEnvironment: { forcedColors: 'active' } } };
