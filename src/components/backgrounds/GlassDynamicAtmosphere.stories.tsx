import type { Meta, StoryObj } from '@storybook/react';
import { DynamicAtmosphere } from './GlassDynamicAtmosphere';

const meta: Meta<typeof DynamicAtmosphere> = {
  title: 'Effects + Advanced/Glass Dynamic Atmosphere',
  component: DynamicAtmosphere,
  parameters: {
    layout: 'fullscreen',
    previewSurface: 'media',
    docs: {
      description: {
        component: 'Dynamic atmospheric layer shown as a bounded media composition.',
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
type Story = StoryObj<typeof DynamicAtmosphere>;

export const Default: Story = {
  render: (args) => (
    <div
      className="glass-relative glass-w-full glass-overflow-hidden"
      style={{ minHeight: 'min(100vh, 760px)' }}
    >
      <DynamicAtmosphere
        {...args}
        fullSize
        position="absolute"
        type="aurora"
        intensity={0.55}
        speed={0.25}
        primaryColor="rgba(59, 130, 246, 0.52)"
        secondaryColor="rgba(20, 184, 166, 0.42)"
        accentColor="rgba(168, 85, 247, 0.3)"
      />
      <section
        className="glass-relative glass-z-10 glass-flex glass-items-center glass-justify-center glass-p-6"
        style={{ minHeight: 'inherit' }}
      >
        <div className="glass-w-full glass-max-w-3xl glass-rounded-2xl glass-bg-black/35 glass-p-8 glass-text-white glass-shadow-2xl glass-backdrop-blur-md">
          <p className="glass-text-sm glass-font-semibold glass-uppercase glass-tracking-wide glass-text-white/70">
            Dynamic atmosphere
          </p>
          <h1 className="glass-mt-2 glass-text-3xl glass-font-semibold">
            Aurora operations view
          </h1>
          <p className="glass-mt-3 glass-text-sm glass-text-white/75">
            The animated layer fills the preview while foreground content proves readability.
          </p>
        </div>
      </section>
    </div>
  ),
  args: {
    type: 'subtle',
    intensity: 0.5,
    speed: 0.5,
  },
};

export const Variants: Story = {
  render: (args) => (
    <div
      className="glass-grid glass-w-full glass-gap-4 glass-p-6"
      style={{
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
        minHeight: 'min(100vh, 760px)',
      }}
    >
      {['subtle', 'nebula', 'aurora', 'particles'].map((type) => (
        <div key={type} className="glass-relative glass-min-h-80 glass-overflow-hidden glass-rounded-2xl glass-bg-slate-950">
          <DynamicAtmosphere {...args} type={type as any} fullSize position="absolute" intensity={0.45} speed={0.2} />
          <div className="glass-relative glass-z-10 glass-flex glass-min-h-80 glass-items-end glass-p-5">
            <div className="glass-rounded-xl glass-bg-black/35 glass-p-4 glass-text-white glass-backdrop-blur-md">
              <h3 className="glass-text-base glass-font-semibold">{type}</h3>
              <p className="glass-mt-2 glass-text-sm glass-text-white/75">Bounded atmosphere preview.</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
};
