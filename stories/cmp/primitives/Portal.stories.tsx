import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Portal } from '../../../src/primitives/Portal';
import { AuraGlassProvider } from '../../../src/theme/index';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const meta = {
  title: 'Foundation/Portal',
  component: Portal,
  tags: ['core'],
  parameters: { ag: { subject: 'Portal', kind: 'component' } satisfies StoryAgParameters },
} satisfies Meta<typeof Portal>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <AuraGlassProvider>
      <Portal><div>Portal content</div></Portal>
    </AuraGlassProvider>
  ),
};
export const States: Story = {
  render: () => <Portal container={typeof document !== 'undefined' ? document.body : null}><div>Body portal</div></Portal>,
};
export const ForcedColors: Story = {
  render: () => <Portal container={typeof document !== 'undefined' ? document.body : null}><div>Portal</div></Portal>,
};
export const RTL: Story = {
  render: () => (
    <AuraGlassProvider>
      <Portal><div dir="rtl">Portal content</div></Portal>
    </AuraGlassProvider>
  ),
};
