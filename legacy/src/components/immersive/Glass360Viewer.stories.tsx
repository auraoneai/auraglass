import type { Meta, StoryObj } from "@storybook/react";

import {
  Glass360Viewer as PanoramaViewer,
  type Glass360ViewerHotspot,
  type Glass360ViewerMediaSource,
} from "./Glass360Viewer";

const panoramaUrl =
  "data:image/svg+xml," +
  encodeURIComponent(
    [
      '<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="800" viewBox="0 0 1600 800">',
      '<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">',
      '<stop offset="0" stop-color="#f8fafc"/><stop offset="1" stop-color="#cbd5e1"/>',
      '</linearGradient><linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">',
      '<stop offset="0" stop-color="#b6c2cf"/><stop offset="1" stop-color="#64748b"/>',
      '</linearGradient></defs><rect width="1600" height="500" fill="url(#sky)"/>',
      '<rect y="500" width="1600" height="300" fill="url(#ground)"/>',
      '<path d="M0 520 260 340 520 500 780 300 1040 500 1320 350 1600 520V610H0Z" fill="#94a3b8" opacity=".72"/>',
      '<circle cx="1240" cy="170" r="72" fill="#ffffff" opacity=".82"/>',
      '<path d="M0 615c280-60 520 70 800 0s520-70 800 0v185H0Z" fill="#e2e8f0" opacity=".86"/>',
      "</svg>",
    ].join("")
  );

const panoramaSource: Glass360ViewerMediaSource = {
  type: "image",
  url: panoramaUrl,
  projection: "equirectangular",
  title: "Silver Ridge overlook",
  description: "A neutral panoramic scene used for deterministic rendering.",
};

const panoramaHotspots: Glass360ViewerHotspot[] = [
  {
    id: "ridge",
    x: 18,
    y: -8,
    title: "Ridge overlook",
    description: "Primary viewpoint",
    color: "rgba(255, 255, 255, 0.92)",
  },
  {
    id: "trail",
    x: -42,
    y: 12,
    title: "Lower trail",
    description: "Accessible route",
    color: "rgba(248, 250, 252, 0.88)",
  },
];

const meta = {
  title: "Effects + Advanced/Glass360 Viewer",
  component: PanoramaViewer,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "Direct rendering of the public Glass360Viewer export with an embedded, network-free panorama and deterministic hotspots.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PanoramaViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Glass360Viewer: Story = {
  args: {
    source: panoramaSource,
  },
  render: () => (
    <PanoramaViewer
      source={{ ...panoramaSource }}
      hotspots={panoramaHotspots}
      controls={{
        zoom: true,
        pan: true,
        autoRotate: true,
        gyroscope: false,
        fullscreen: true,
        vr: false,
        playback: false,
        volume: false,
      }}
      autoRotateEnabled={false}
      respectMotionPreference
      loadingComponent={
        <div className="glass-relative glass-w-full glass-h-full glass-overflow-hidden">
          <img
            src={panoramaUrl}
            alt="Silver Ridge panoramic landscape"
            className="glass-w-full glass-h-full glass-object-cover"
          />
          <div className="glass-absolute glass-left-4 glass-bottom-4 glass-surface-overlay glass-radius-lg glass-px-4 glass-py-3 glass-border glass-border-subtle">
            <div className="glass-text-sm glass-font-semibold glass-text-primary">
              Silver Ridge overlook
            </div>
            <div className="glass-text-xs glass-text-secondary glass-mt-1">
              Drag to explore the embedded panorama
            </div>
          </div>
        </div>
      }
      style={{
        width: "min(720px, calc(100vw - 32px))",
        height: "min(420px, calc(100vh - 48px))",
      }}
    />
  ),
};
