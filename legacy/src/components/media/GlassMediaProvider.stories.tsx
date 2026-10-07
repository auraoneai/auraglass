import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  GlassMediaProvider as GlassMediaProviderComponent,
  useMedia,
} from "./GlassMediaProvider";

const meta = {
  title: "Media/Glass Media Provider",
  component: GlassMediaProviderComponent,
  parameters: {
    layout: "fullscreen",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "Direct coverage for the exported GlassMediaProvider with a live context consumer and deterministic provider state.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GlassMediaProviderComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const stageStyle: CSSProperties = {
  alignItems: "center",
  boxSizing: "border-box",
  display: "flex",
  justifyContent: "center",
  minHeight: "100vh",
  padding: "clamp(20px, 5vw, 64px)",
  background:
    "linear-gradient(145deg, #eef2f5 0%, #f8fafc 48%, #dce3e8 100%)",
  width: "100%",
};

function MediaContextPreview() {
  const { mediaFiles, playbackState, isRecording, recordingDevices } =
    useMedia();

  const statusRows = [
    ["Library", `${mediaFiles.length} items`],
    ["Playback", playbackState?.isPlaying ? "Playing" : "Ready"],
    ["Recording", isRecording ? "Recording" : "Standing by"],
    ["Inputs", `${recordingDevices.length} available`],
  ] as const;

  return (
    <section
      className="glass-foundation-complete glass-w-full glass-p-6 sm:glass-p-8"
      style={{
        maxWidth: 680,
        background: "rgba(255,255,255,.3)",
        border: "1px solid rgba(148,163,184,.3)",
        boxShadow: "0 24px 64px rgba(15,23,42,.14)",
      }}
      aria-label="Media provider status"
    >
      <p className="glass-m-0 glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide" style={{ color: "rgba(15,23,42,.68)" }}>
        Live media context
      </p>
      <h2 className="glass-mt-2 glass-text-2xl glass-font-semibold glass-text-primary">
        Media workspace ready
      </h2>
      <p className="glass-mt-2 glass-text-sm glass-leading-relaxed glass-text-secondary">
        Playback, recording, transcripts, chapters, and analytics are exposed
        through the mounted provider.
      </p>

      <dl
        className="glass-mt-6 glass-grid glass-gap-3 sm:glass-grid-cols-2"
        style={{ marginBottom: 0 }}
      >
        {statusRows.map(([label, value]) => (
          <div
            key={label}
            className="glass-surface-subtle glass-radius-xl glass-border glass-border-white/20 glass-p-4"
          >
            <dt className="glass-text-xs glass-font-medium" style={{ color: "rgba(15,23,42,.68)" }}>
              {label}
            </dt>
            <dd className="glass-m-0 glass-mt-1 glass-text-base glass-font-semibold glass-text-primary">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export const GlassMediaProvider: Story = {
  name: "GlassMediaProvider",
  args: {
    children: null,
  },
  render: () => (
    <main style={stageStyle}>
      <GlassMediaProviderComponent
        className="glass-w-full"
        data-testid="glass-media-provider-story"
      >
        <MediaContextPreview />
      </GlassMediaProviderComponent>
    </main>
  ),
};
