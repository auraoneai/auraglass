import type { Meta, StoryObj } from "@storybook/react";
import GlassSelectCompound from "./GlassSelectCompound";

const meta: Meta<typeof GlassSelectCompound> = {
  title: 'Controls/Inputs/Glass Select Compound',
  component: GlassSelectCompound,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "The compound Radix-style glass select API with grouped options and portal content.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof GlassSelectCompound>;

const SelectFrame = () => (
  <div className="glass-w-[min(520px,calc(100vw-48px))] glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-6 glass-shadow-xl glass-backdrop-blur-xl">
    <label className="glass-mb-2 glass-block glass-text-sm glass-font-medium glass-text-primary">
      Deployment region
    </label>
    <GlassSelectCompound defaultValue="iad">
      <GlassSelectCompound.Trigger>
        <GlassSelectCompound.Value placeholder="Choose a region" />
      </GlassSelectCompound.Trigger>
      <GlassSelectCompound.Content sideOffset={8}>
        <GlassSelectCompound.Group>
          <GlassSelectCompound.Label>North America</GlassSelectCompound.Label>
          <GlassSelectCompound.Item value="iad">US East - Virginia</GlassSelectCompound.Item>
          <GlassSelectCompound.Item value="sfo">US West - San Francisco</GlassSelectCompound.Item>
        </GlassSelectCompound.Group>
        <GlassSelectCompound.Separator />
        <GlassSelectCompound.Group>
          <GlassSelectCompound.Label>Europe</GlassSelectCompound.Label>
          <GlassSelectCompound.Item value="dub">Europe - Dublin</GlassSelectCompound.Item>
          <GlassSelectCompound.Item value="fra">Europe - Frankfurt</GlassSelectCompound.Item>
        </GlassSelectCompound.Group>
      </GlassSelectCompound.Content>
    </GlassSelectCompound>
    <p className="glass-mt-3 glass-text-sm glass-text-secondary">
      Portal content is offset from the trigger so it is readable and not clipped by the story frame.
    </p>
  </div>
);

export const Default: Story = {
  render: () => <SelectFrame />,
};

export const Minimal: Story = {
  render: () => (
    <div className="glass-w-[min(420px,calc(100vw-48px))] glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-6 glass-shadow-xl glass-backdrop-blur-xl">
      <GlassSelectCompound defaultValue="team">
        <GlassSelectCompound.Trigger variant="minimal">
          <GlassSelectCompound.Value placeholder="Choose scope" />
        </GlassSelectCompound.Trigger>
        <GlassSelectCompound.Content sideOffset={8}>
          <GlassSelectCompound.Group>
            <GlassSelectCompound.Item value="personal">Personal workspace</GlassSelectCompound.Item>
            <GlassSelectCompound.Item value="team">Team workspace</GlassSelectCompound.Item>
            <GlassSelectCompound.Item value="enterprise">Enterprise workspace</GlassSelectCompound.Item>
          </GlassSelectCompound.Group>
        </GlassSelectCompound.Content>
      </GlassSelectCompound>
    </div>
  ),
};
