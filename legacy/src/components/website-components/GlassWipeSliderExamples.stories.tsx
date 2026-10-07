import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  AuraOneVsScaleAIComparison,
  GlassWipeSliderExamples,
  PerformanceMetricsComparison,
  PresetPositionDemo,
} from './GlassWipeSliderExamples';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassWipeSliderExamples> = {
  title: 'Reference/Legacy Components/Glass Wipe Slider Examples',
  component: GlassWipeSliderExamples,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glasswipesliderexamples component.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'className prop',
    },
  },
  args: {
    className: ''
  },
};

export default meta;
type Story = StoryObj<typeof GlassWipeSliderExamples>;

export const Default: Story = {
  render: (args: any) => (
    <div className="glass-w-full" style={{ maxWidth: 960 }}>
      <AuraOneVsScaleAIComparison className={args.className} />
    </div>
  ),
};

export const Variants: Story = {
  render: (args: any) => (
    <div
      className={cn("glass-w-full glass-auto-gap glass-auto-gap-2xl", args.className)}
      style={{ maxWidth: 1040 }}
    >
      <PerformanceMetricsComparison />
      <PresetPositionDemo />
    </div>
  ),
};
