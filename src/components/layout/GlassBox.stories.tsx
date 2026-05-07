import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassBox } from './GlassBox';

const meta: Meta<typeof GlassBox> = {
  title: 'Surfaces/App Shells + Layout/Glass Box',
  component: GlassBox,
  parameters: {
    layout: 'centered',
    previewSurface: 'component',
    docs: {
      description: {
        component: 'Glass layout container shown with practical product-card content.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  args: {
    className: '',
  },
};

export default meta;
type Story = StoryObj<typeof GlassBox>;

const SummaryContent = () => (
  <div className="glass-space-y-4">
    <div className="glass-flex glass-items-start glass-justify-between glass-gap-4">
      <div>
        <p className="glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide glass-text-secondary">
          Workspace
        </p>
        <h3 className="glass-mt-1 glass-text-lg glass-font-semibold glass-text-primary">
          Design system health
        </h3>
      </div>
      <span className="glass-rounded-full glass-bg-emerald-100 glass-px-3 glass-py-1 glass-text-xs glass-font-medium glass-text-emerald-700">
        Clear
      </span>
    </div>
    <p className="glass-text-sm glass-text-secondary">
      A responsive glass box with enough content to show padding, contrast, and surface transparency.
    </p>
    <div className="glass-grid glass-grid-cols-3 glass-gap-3">
      {['Tokens', 'Stories', 'A11y'].map((label) => (
        <div key={label} className="glass-rounded-lg glass-bg-white/55 glass-p-3 glass-text-center">
          <div className="glass-text-sm glass-font-semibold glass-text-primary">AA</div>
          <div className="glass-text-xs glass-text-secondary">{label}</div>
        </div>
      ))}
    </div>
  </div>
);

export const Default: Story = {
  render: (args) => (
    <GlassBox
      {...args}
      className="glass-w-full glass-max-w-md glass-rounded-2xl glass-border glass-border-white/35 glass-bg-white/60 glass-p-5 glass-shadow-xl"
    >
      <SummaryContent />
    </GlassBox>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-grid glass-w-full glass-max-w-4xl glass-grid-cols-1 glass-gap-4 sm:glass-grid-cols-3">
      {[
        ['Subtle', 'glass-bg-white/45 glass-shadow-md'],
        ['Elevated', 'glass-bg-white/70 glass-shadow-xl'],
        ['Outlined', 'glass-border-white/45 glass-bg-white/35 glass-shadow-sm'],
      ].map(([label, classes]) => (
        <GlassBox
          key={label}
          {...args}
          className={`glass-min-h-44 glass-rounded-2xl glass-border glass-p-4 ${classes}`}
        >
          <h3 className="glass-text-base glass-font-semibold glass-text-primary">{label}</h3>
          <p className="glass-mt-2 glass-text-sm glass-text-secondary">
            Bounded glass content that remains readable in light, liquid, and dark previews.
          </p>
        </GlassBox>
      ))}
    </div>
  ),
};
