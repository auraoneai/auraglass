// CodeSurface.stories.tsx — showcase stories (kind 'showcase').
import type { Meta, StoryObj } from '@storybook/react';
import { CodeSurface } from './index';
import { codeProps, codePropsEditable } from './fixtures';

const meta: Meta<typeof CodeSurface> = {
  title: 'plat/items/code-surface',
  component: CodeSurface,
  args: codeProps,
  parameters: { ag: { subject: 'code-surface', kind: 'showcase' } },
};
export default meta;
type Story = StoryObj<typeof CodeSurface>;

export const Static: Story = {};
export const Editable: Story = { args: codePropsEditable };
export const RTL: Story = { parameters: { globals: { dir: 'rtl' } } };
export const ReducedTransparency: Story = { parameters: { ag: { material: 'regular' } } };
export const ForcedColors: Story = { parameters: { globals: { forcedColors: 'active' } } };
