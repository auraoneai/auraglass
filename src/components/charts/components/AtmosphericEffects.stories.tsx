import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { AtmosphericEffects } from './AtmosphericEffects';

const EffectsFrame = ({ children }: { children: ReactNode }) => (
  <div
    className="glass-relative glass-overflow-hidden glass-rounded-xl glass-border glass-border-white/40 glass-bg-white/55 glass-p-6 glass-shadow-xl"
    style={{ width: 'min(420px, calc(100vw - 48px))', height: 240 }}
  >
    <AtmosphericEffects qualityTier="high" color="var(--glass-color-primary)" />
    <div className="glass-relative glass-z-10 glass-flex glass-h-full glass-flex-col glass-items-center glass-justify-center glass-gap-3 glass-text-center">
      <div className="glass-text-sm glass-font-semibold glass-text-primary">Atmospheric chart layer</div>
      <div className="glass-grid glass-w-full glass-grid-cols-3 glass-gap-3">
        {children}
      </div>
    </div>
  </div>
);

const meta: Meta<typeof AtmosphericEffects> = {
  title: 'Data + Visualization/Atmospheric Effects',
  component: AtmosphericEffects,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism atmosphericeffects component.',
      },
    },
  },
  argTypes: {
    // Component-specific argTypes will be added here
  },
  args: {
    // Default args will be added here
  },
};

export default meta;
type Story = StoryObj<typeof AtmosphericEffects>;

export const Default: Story = {
  render: () => (
    <EffectsFrame>
      {['Glow', 'Particles', 'Depth'].map((label) => (
        <div
          key={label}
          className="glass-rounded-lg glass-border glass-border-white/35 glass-bg-white/45 glass-p-3 glass-text-xs glass-font-medium glass-text-primary"
        >
          {label}
        </div>
      ))}
    </EffectsFrame>
  ),
  args: {
    qualityTier: 'high',
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <EffectsFrame>
      {['Low', 'Medium', 'High'].map((label) => (
        <div
          key={label}
          className="glass-rounded-lg glass-border glass-border-white/35 glass-bg-white/45 glass-p-3 glass-text-xs glass-font-medium glass-text-primary"
        >
          {label}
        </div>
      ))}
      <AtmosphericEffects {...args} />
    </EffectsFrame>
  ),
  args: {
    qualityTier: 'medium',
  },
};
