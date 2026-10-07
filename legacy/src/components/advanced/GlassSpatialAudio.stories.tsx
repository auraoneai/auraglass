import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";
import {
  GlassAudioReactive as GlassAudioReactiveComponent,
  GlassSpatialAudio as GlassSpatialAudioComponent,
  GlassSpatialAudioProvider as GlassSpatialAudioProviderComponent,
  GlassSpatialVisualizer as GlassSpatialVisualizerComponent,
  useSpatialAudio,
} from "./GlassSpatialAudio";

const meta = {
  title: "Effects + Advanced/Glass Spatial Audio",
  component: GlassSpatialAudioComponent,
  parameters: {
    layout: "fullscreen",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "The real spatial-audio exports, mounted individually with safe provider context and no automatic audio playback.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GlassSpatialAudioComponent>;

export default meta;
type Story = StoryObj;

const Scene = ({ children }: { children: ReactNode }) => (
  <main
    style={{
      minHeight: "100vh",
      padding: "clamp(1.25rem, 5vw, 4rem)",
      display: "grid",
      placeItems: "center",
      color: "rgba(15, 23, 42, 0.92)",
      background:
        "radial-gradient(circle at 16% 16%, rgba(255, 255, 255, 0.98), transparent 34%), linear-gradient(145deg, #ececec 0%, #fafafa 48%, #e2e2e2 100%)",
    }}
  >
    <div style={{ width: "min(100%, 52rem)" }}>{children}</div>
  </main>
);

const AudioSurface = ({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) => (
  <section className="glass-surface-primary glass-blur-backdrop glass-border glass-border-white/20 glass-radius-2xl glass-p-6 glass-space-y-3">
    <p className="glass-text-xs glass-text-tertiary glass-uppercase glass-tracking-wide">
      {eyebrow}
    </p>
    <h2 className="glass-text-2xl glass-text-primary glass-font-semibold">
      {title}
    </h2>
    <p className="glass-text-sm glass-text-secondary">
      {children ??
        "Spatial feedback is ready and remains silent until an intentional interaction."}
    </p>
  </section>
);

function SpatialAudioProviderConsumer() {
  const { isInitialized, masterVolume } = useSpatialAudio();

  return (
    <AudioSurface
      eyebrow="Live provider context"
      title={isInitialized ? "Audio engine ready" : "Audio engine standing by"}
    >
      Master volume is {Math.round(masterVolume * 100)}%; automatic playback is
      disabled for this preview.
    </AudioSurface>
  );
}

export const GlassSpatialAudio: Story = {
  name: "GlassSpatialAudio",
  render: () => (
    <Scene>
      <GlassSpatialAudioComponent autoInitialize={false}>
        <AudioSurface
          eyebrow="Spatial sound field"
          title="Glass spatial audio"
        />
      </GlassSpatialAudioComponent>
    </Scene>
  ),
};

export const GlassSpatialAudioProvider: Story = {
  name: "GlassSpatialAudioProvider",
  render: () => (
    <Scene>
      <GlassSpatialAudioProviderComponent autoInitialize={false}>
        <SpatialAudioProviderConsumer />
      </GlassSpatialAudioProviderComponent>
    </Scene>
  ),
};

export const GlassAudioReactive: Story = {
  name: "GlassAudioReactive",
  render: () => (
    <Scene>
      <GlassSpatialAudioProviderComponent autoInitialize={false}>
        <GlassAudioReactiveComponent
          reactToFrequency={false}
          reactToVolume={false}
          className="glass-radius-2xl"
        >
          <AudioSurface
            eyebrow="Reactive material"
            title="Audio-reactive glass"
          />
        </GlassAudioReactiveComponent>
      </GlassSpatialAudioProviderComponent>
    </Scene>
  ),
};

export const GlassSpatialVisualizer: Story = {
  name: "GlassSpatialVisualizer",
  render: () => (
    <Scene>
      <AudioSurface
        eyebrow="Three-dimensional field"
        title="Spatial visualizer"
      >
        The live visualizer export is mounted in the lower-right corner with a
        silent provider and an empty source field.
      </AudioSurface>
      <GlassSpatialAudioProviderComponent autoInitialize={false}>
        <GlassSpatialVisualizerComponent
          show
          className="glass-w-60 glass-h-60"
        />
      </GlassSpatialAudioProviderComponent>
    </Scene>
  ),
};
