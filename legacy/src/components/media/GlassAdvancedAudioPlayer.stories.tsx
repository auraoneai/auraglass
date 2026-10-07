import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassAdvancedAudioPlayer as GlassAdvancedAudioPlayerComponent } from "./GlassAdvancedAudioPlayer";
import { GlassMediaProvider, type MediaFile } from "./GlassMediaProvider";

const meta = {
  title: "Media/Glass Advanced Audio Player",
  component: GlassAdvancedAudioPlayerComponent,
  parameters: {
    layout: "fullscreen",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "Direct, deterministic coverage for GlassAdvancedAudioPlayer using inline artwork, a local media fixture, and its real provider context.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GlassAdvancedAudioPlayerComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const coverSvg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 720">',
  '<defs><linearGradient id="canvas" x1="0" y1="0" x2="1" y2="1">',
  '<stop offset="0" stop-color="#dce5ec"/><stop offset="0.52" stop-color="#f8fafc"/>',
  '<stop offset="1" stop-color="#cbd8e2"/></linearGradient></defs>',
  '<rect width="720" height="720" fill="url(#canvas)"/>',
  '<circle cx="360" cy="360" r="192" fill="rgba(255,255,255,0.28)" stroke="rgba(255,255,255,0.68)" stroke-width="4"/>',
  '<circle cx="360" cy="360" r="72" fill="rgba(15,23,42,0.9)"/>',
  '<circle cx="360" cy="360" r="18" fill="#f8fafc"/>',
  '<text x="72" y="108" font-family="Aeonik,Arial,sans-serif" font-size="42" font-weight="700" fill="#0f172a">Material Notes</text>',
  '<text x="74" y="652" font-family="Aeonik,Arial,sans-serif" font-size="24" fill="#334155">AuraGlass Audio Journal</text>',
  "</svg>",
].join("");
const cover = `data:image/svg+xml,${encodeURIComponent(coverSvg)}`;

const sampleAudio: MediaFile = {
  id: "storybook-glass-audio",
  type: "audio",
  src: "data:audio/mpeg;base64,",
  thumbnail: cover,
  title: "Material Notes — Episode 18",
  description: "A calm conversation about depth, clarity, and restraint.",
  duration: 248,
  format: "mp3",
};

const stageStyle: CSSProperties = {
  alignItems: "center",
  boxSizing: "border-box",
  display: "flex",
  justifyContent: "center",
  minHeight: "100vh",
  padding: "clamp(16px, 4vw, 48px)",
  width: "100%",
};

export const GlassAdvancedAudioPlayer: Story = {
  name: "GlassAdvancedAudioPlayer",
  args: {
    mediaFile: sampleAudio,
  },
  render: () => (
    <main style={stageStyle}>
      <div style={{ width: "min(100%, 760px)" }}>
        <GlassMediaProvider>
          <GlassAdvancedAudioPlayerComponent
            mediaFile={sampleAudio}
            variant="full"
            visualizerType="none"
            showWaveform={false}
            showTranscript={false}
            showPlaylist={false}
            preload="none"
            data-testid="glass-advanced-audio-player-story"
          />
        </GlassMediaProvider>
      </div>
    </main>
  ),
};
