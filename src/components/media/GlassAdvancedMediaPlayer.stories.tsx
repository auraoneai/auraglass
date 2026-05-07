import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  MediaProvider,
  useMedia,
  type MediaFile,
} from "./GlassMediaProvider";
import { GlassAdvancedVideoPlayer } from "./GlassAdvancedVideoPlayer";
import { GlassAdvancedAudioPlayer } from "./GlassAdvancedAudioPlayer";

const meta = {
  title: 'Media/Glass Advanced Media Player',
  parameters: {
    layout: "fullscreen",
    previewSurface: "media",
    docs: {
      description: {
        component:
          "Presentation-ready advanced media player stories using deterministic local demo media, inline poster artwork, chapters, transcripts, playlists, and bounded Storybook layouts.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const DEMO_VIDEO_SRC =
  "data:video/mp4;base64,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";

const DEMO_AUDIO_SRC =
  "data:audio/mpeg;base64,SUQzBAAAAAAAIlRTU0UAAAAOAAADTGF2ZjYyLjMuMTAwAAAAAAAAAAAAAAD/+0DAAAAAAAAAAAAAAAAAAAAAAABJbmZvAAAADwAAAAsAAAUzADc3Nzc3Nzc3N0tLS0tLS0tLS19fX19fX19fX3Nzc3Nzc3Nzc4eHh4eHh4eHh5ubm5ubm5ubm6+vr6+vr6+vr8PDw8PDw8PDw9fX19fX19fX1+vr6+vr6+vr6////////////wAAAABMYXZjNjIuMTEAAAAAAAAAAAAAAAAkBC8AAAAAAAAFM1VJYdgAAAAAAP/7EMQAAARwGVdUYIAwqQjpAzZQAAAArTlAAAJkyZPTAQABBMmTB8PwQBAEDji4Pn8QBjWD79RyhVYwMYggQksaCgKbWhigAa2dJpHLAQyBrqcp7OxXwFDvh0xvxJQV8RHvrQQAAlsL//sSxAKARSwjPb2wgDCXA+Y1nuCGQAwB9K0loK5gCTAcPPkJzEBUDAwNCmMQNa3Z4Q4qr1f0f//9IAAACtcDEqiMBMxFQAJuY44yaBCeXCcUyuUwbWexNL0E6Lux38uqYUIwwAkaOJgZ//sQxASCBRwnGAz7Ymijg6X1juiGA5GEOLaZhnMpsYj0ncThrC4cfxmSH4KPEk3Ui8sp8xIAgEbCIAlsig5qaMBHo0QE4nH8FSAoEIYJUDwVVFWdn7NiffI//9S/ti4INEBCZi3GA0D/+xLEBQKFBCUYDPtiaI0DpnGe4IbiYMIuRlOeGGrCPEactmNhBwlyZCcgZGRFadFZ6xSAsKAuzD7tIQnmBYY60saDCEaSoBzFBczz2A9OS3////o//dUukPKk3YnoEB3lBHhsijCnlUD/+xDECQNE4CcUDPuCaIWEJQmvZIYsdHNJk9NmCPEI1IKBlJZnsFUNTBYoHacFkSIIVKGQ3mHCpqY8AS5lmJ0m3gDAk+YGnbTv/r1KbsluDAQYFEJh4qGXYyZHFoppGi7nBORnh8bTQv/7EsQOAgTcJRwOe2Qon4OmdM5kTmKE4YSL3fiX2LYYALRIGwAHUaAM1WEwjNlAIbtYRQgIIa0XY9dFenV1LW5dlX9UB9NHrhMAITNQgAAUAAIj9JFMr6MCjAclLtjS5ZW206HLOLWf///7EMQQgESQHUngv2AwioPoNBfsDv/1/sBAIag+wFMmM/D/AeDG/41IKLbrvUwlSk4pbMlOqb2d3/0UVWnLdJgMaIA5jA4gZnIBhtIAKHOlpjqGBO4ZRkOrYo7QXcFVwgEFNSyp9Vgg//sSxBYCRFAlHg37ZCh8g+bpjmCGpsyf/zXQrUGh0GiaQzWXWTS/1//XYo86aqgXAzAB4yGHMQxe0yNwuTaLjJEDVwQIFRogectgbiseSgGi4dMPqBMtAHE1wQFzhiQxY4AuaMHafz0y//sQxB8DxAwhJg37RCiCBCQBr2yFS7D1IEvAAC0ADeblqKMoAgYYlMC0Whuytn8rUvjd8EBn///+v/3LlMCkBRwAmVdxg4OnGSSBAwarRwFBBz4CGBRKv7FVltkrj+BGIj9RbKf4sCb/+xLEKAAEbB9HVbCAMRSd58M4oAATmf+LBUnLt/+TjcxmO//yQkPdFP///JzFagBgq3f8CWmOFKZT/oqsCsV/8FODl+FoIIlSkvHKJaRBxq/m5BKQ4h9XX/JhgUygPUkur/KzE0Ny8XT/+xDEHYAIFM1IGZaAAAAANIOAAATL//MjMuJMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==";

const svgDataUri = (title: string, subtitle: string, accent: string) =>
  `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#0f172a"/>
          <stop offset="0.55" stop-color="${accent}"/>
          <stop offset="1" stop-color="#0f766e"/>
        </linearGradient>
      </defs>
      <rect width="1280" height="720" fill="url(#bg)"/>
      <circle cx="1010" cy="170" r="118" fill="rgba(255,255,255,0.16)"/>
      <rect x="84" y="92" width="560" height="112" rx="24" fill="rgba(255,255,255,0.16)"/>
      <rect x="84" y="246" width="840" height="20" rx="10" fill="rgba(255,255,255,0.30)"/>
      <rect x="84" y="292" width="620" height="20" rx="10" fill="rgba(255,255,255,0.20)"/>
      <text x="112" y="162" font-family="Inter, Arial, sans-serif" font-size="48" font-weight="700" fill="#ffffff">${title}</text>
      <text x="112" y="374" font-family="Inter, Arial, sans-serif" font-size="30" fill="#dbeafe">${subtitle}</text>
      <rect x="84" y="516" width="1112" height="14" rx="7" fill="rgba(255,255,255,0.26)"/>
      <rect x="84" y="516" width="420" height="14" rx="7" fill="#ffffff"/>
    </svg>
  `)}`;

const VIDEO_POSTER = svgDataUri(
  "AuraGlass Media Demo",
  "Chapters, transcript, and custom controls",
  "#1d4ed8"
);

const AUDIO_COVER = svgDataUri(
  "Tech Talk Weekly",
  "AI-assisted media workflows",
  "#7c3aed"
);

const chapterThumb = (title: string, accent: string) =>
  svgDataUri(title, "Chapter preview", accent);

const transcriptContent = [
  {
    id: "transcript-intro",
    startTime: 0,
    endTime: 8,
    speaker: "Host",
    confidence: 0.97,
    text: "Welcome to the AuraGlass media workspace. The player is using deterministic local media for this presentation.",
  },
  {
    id: "transcript-chapters",
    startTime: 8,
    endTime: 18,
    speaker: "Producer",
    confidence: 0.94,
    text: "Chapter navigation stays visible beside the video so reviewers can inspect timing, labels, and thumbnail treatment.",
  },
  {
    id: "transcript-controls",
    startTime: 18,
    endTime: 30,
    speaker: "Host",
    confidence: 0.96,
    text: "The transcript panel is readable immediately and every entry can be used as a seek target.",
  },
];

const sampleVideoFile: MediaFile = {
  id: "video_demo",
  type: "video",
  src: DEMO_VIDEO_SRC,
  title: "Product Demo Video",
  description:
    "A deterministic local media preview for the advanced video player.",
  duration: 30,
  poster: VIDEO_POSTER,
  quality: "720p",
  chapters: [
    {
      id: "chapter_1",
      title: "Introduction",
      startTime: 0,
      endTime: 8,
      thumbnail: chapterThumb("Intro", "#1d4ed8"),
      description: "Opening context and player overview",
    },
    {
      id: "chapter_2",
      title: "Core Features",
      startTime: 8,
      endTime: 18,
      thumbnail: chapterThumb("Features", "#0f766e"),
      description: "Custom controls, transcript, and chapter states",
    },
    {
      id: "chapter_3",
      title: "Review Notes",
      startTime: 18,
      endTime: 30,
      thumbnail: chapterThumb("Review", "#7c3aed"),
      description: "Complete presentation variant for visual QA",
    },
  ],
  subtitles: [
    {
      id: "video_transcript",
      language: "en",
      label: "English transcript",
      isDefault: true,
      content: transcriptContent,
    },
  ],
  metadata: {
    bitrate: "local-demo",
    codec: "H.264",
    resolution: "1280x720",
    fps: 24,
  },
};

const sampleAudioFile: MediaFile = {
  id: "audio_demo",
  type: "audio",
  src: DEMO_AUDIO_SRC,
  title: "Tech Podcast Episode 127",
  description:
    "A local audio demo with transcript content, waveform, and visualizer states.",
  duration: 120,
  thumbnail: AUDIO_COVER,
  format: "mp3",
  subtitles: [
    {
      id: "audio_transcript",
      language: "en",
      label: "Episode transcript",
      isDefault: true,
      content: transcriptContent.map((entry, index) => ({
        ...entry,
        id: `audio-${entry.id}`,
        startTime: index * 20,
        endTime: index * 20 + 16,
      })),
    },
  ],
  metadata: {
    artist: "Tech Talk Weekly",
    album: "Season 3",
    bitrate: "48kbps local demo",
    genre: "Technology",
  },
};

const samplePlaylist: MediaFile[] = [
  {
    ...sampleAudioFile,
    id: "track_1",
    title: "Introduction to Web Media",
    description: "Overview of modern web media capabilities",
    duration: 180,
  },
  {
    ...sampleAudioFile,
    id: "track_2",
    title: "AI in Media Processing",
    description: "How artificial intelligence transforms media experiences",
    duration: 240,
  },
  {
    ...sampleAudioFile,
    id: "track_3",
    title: "Future of Interactive Media",
    description: "Trends for next-generation media interfaces",
    duration: 200,
  },
];

const videoFiles = [sampleVideoFile];
const audioFiles = [sampleAudioFile];
const allFiles = [sampleVideoFile, sampleAudioFile, ...samplePlaylist];

function MediaRegistry({
  files,
  children,
}: {
  files: MediaFile[];
  children: React.ReactNode;
}) {
  const { addMediaFile, removeMediaFile } = useMedia();
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    files.forEach(addMediaFile);
    setReady(true);

    return () => {
      files.forEach((file) => removeMediaFile(file.id));
    };
  }, [addMediaFile, files, removeMediaFile]);

  return ready ? <>{children}</> : null;
}

function DemoProvider({
  files,
  children,
}: {
  files: MediaFile[];
  children: React.ReactNode;
}) {
  return (
    <MediaProvider>
      <MediaRegistry files={files}>{children}</MediaRegistry>
    </MediaProvider>
  );
}

function Stage({
  children,
  maxWidth = 1120,
}: {
  children: React.ReactNode;
  maxWidth?: number;
}) {
  return (
    <div
      className="ag-media-stage glass-on-dark"
      data-bg="dark"
      style={{
        boxSizing: "border-box",
        minHeight: "100vh",
        padding: "28px 24px 80px",
        overflow: "auto",
      }}
    >
      <style>
        {`
          .ag-media-stage button {
            appearance: none;
            -webkit-appearance: none;
            border: 1px solid rgba(148, 163, 184, 0.38);
            border-radius: 14px;
            background: rgba(15, 23, 42, 0.68);
            color: #f8fafc;
            font: inherit;
            -webkit-text-fill-color: currentColor;
            backdrop-filter: blur(22px) saturate(140%);
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 10px 24px rgba(2, 6, 23, 0.18);
          }

          .ag-media-stage button:hover {
            background: rgba(30, 41, 59, 0.74);
          }

          .ag-media-stage button[aria-label] {
            border-radius: 999px;
          }

          .ag-media-stage .glass-text-primary,
          .ag-media-stage .glass-text-secondary,
          .ag-media-stage .glass-text-tertiary,
          .ag-media-stage .glass-text-inverse,
          .ag-media-stage .glass-placeholder-gray-400::placeholder {
            color: #f8fafc !important;
            -webkit-text-fill-color: #f8fafc;
          }

          .ag-media-stage .glass-text-secondary {
            opacity: 0.86;
          }

          .ag-media-stage .glass-surface-dark,
          .ag-media-stage .glass-surface-subtle,
          .ag-media-stage .glass-surface-blue,
          .ag-media-stage [class*="glass-surface-dark"],
          .ag-media-stage [class*="glass-surface-subtle"],
          .ag-media-stage [class*="glass-surface-blue"],
          .ag-media-stage .bg-white,
          .ag-media-stage .bg-gray-50,
          .ag-media-stage .bg-blue-100 {
            background-color: rgba(15, 23, 42, 0.62) !important;
            color: #f8fafc !important;
            -webkit-text-fill-color: #f8fafc;
            border-color: rgba(226, 232, 240, 0.24) !important;
            backdrop-filter: blur(22px) saturate(145%);
          }

          .ag-media-stage .glass-surface-blue,
          .ag-media-stage [class*="glass-surface-blue"],
          .ag-media-stage .bg-blue-100 {
            background-color: rgba(37, 99, 235, 0.72) !important;
          }

          .ag-media-stage input[type="text"] {
            background-color: rgba(15, 23, 42, 0.62) !important;
            border-color: rgba(226, 232, 240, 0.28) !important;
            color: #f8fafc !important;
            -webkit-text-fill-color: #f8fafc;
            backdrop-filter: blur(22px) saturate(145%);
          }

          .ag-media-stage input[type="range"] {
            appearance: none;
            -webkit-appearance: none;
            accent-color: #38bdf8;
            background: rgba(30, 41, 59, 0.22);
            border-radius: 999px;
          }

          .ag-media-stage [data-testid="glassadvancedvideoplayer"] {
            background: rgba(2, 6, 23, 0.72) !important;
            color: #f8fafc !important;
            backdrop-filter: blur(18px) saturate(145%);
          }

          .ag-media-stage [data-testid="glassadvancedvideoplayer"] img {
            background: transparent !important;
          }

          .ag-media-stage [data-testid="glassadvancedvideoplayer"] > .glass-relative {
            background: rgba(2, 6, 23, 0.18);
            min-height: 0;
          }

          .ag-media-stage [data-testid="glassadvancedvideoplayer"] .ag-video-controls {
            top: auto !important;
            right: 0 !important;
            bottom: 0 !important;
            left: 0 !important;
            z-index: 20 !important;
            border-top: 1px solid rgba(226, 232, 240, 0.26) !important;
            border-right: 0 !important;
            border-bottom: 0 !important;
            border-left: 0 !important;
            border-radius: 0 !important;
            background:
              linear-gradient(180deg, rgba(15, 23, 42, 0.62), rgba(2, 6, 23, 0.9)),
              rgba(2, 6, 23, 0.84) !important;
            backdrop-filter: blur(26px) saturate(150%) !important;
            -webkit-backdrop-filter: blur(26px) saturate(150%) !important;
          }

          .ag-media-stage [data-testid="glassadvancedvideoplayer"] > .glass-relative > .glass-flex-1 {
            min-height: 0;
            overflow: hidden;
          }

          .ag-media-stage [data-testid="glassadvancedvideoplayer"] > .glass-relative > .glass-flex-1 > img,
          .ag-media-stage [data-testid="glassadvancedvideoplayer"] > .glass-relative > .glass-flex-1 > video {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
          }

          .ag-media-stage .ag-player-frame {
            background: rgba(2, 6, 23, 0.24);
            border: 1px solid rgba(226, 232, 240, 0.18);
            backdrop-filter: blur(24px) saturate(145%);
          }

          @media (max-width: 720px) {
            .ag-media-stage {
              padding: 18px 12px 52px !important;
            }

            .ag-media-stage .ag-player-frame {
              height: auto !important;
              min-height: 0 !important;
              overflow: visible !important;
            }

            .ag-media-stage [data-testid="glassadvancedvideoplayer"] {
              min-height: 0 !important;
            }

            .ag-media-stage [data-testid="glassadvancedvideoplayer"] > .glass-relative {
              min-height: 0;
              flex-direction: column;
            }

            .ag-media-stage [data-testid="glassadvancedvideoplayer"] > .glass-relative > .glass-flex-1 {
              flex: 0 0 auto;
              min-height: 220px;
              aspect-ratio: 16 / 9;
            }

            .ag-media-stage [data-testid="glassadvancedvideoplayer"] .ag-video-controls {
              position: relative !important;
              padding: 12px !important;
            }

            .ag-media-stage [data-testid="glassadvancedvideoplayer"] > .glass-relative > .glass-flex {
              width: 100%;
              flex-direction: column;
            }

            .ag-media-stage [data-testid="glassadvancedvideoplayer"] .glass-w-80,
            .ag-media-stage [data-testid="glassadvancedvideoplayer"] .glass-w-96,
            .ag-media-stage .glass-w-80,
            .ag-media-stage .glass-w-96 {
              width: 100% !important;
            }

            .ag-media-stage [data-testid="glassadvancedvideoplayer"] .glass-h-full {
              height: auto !important;
            }

            .ag-media-stage [data-testid="glassadvancedvideoplayer"] .glass-max-h-96,
            .ag-media-stage [data-testid="glassadvancedvideoplayer"] .glass-overflow-y-auto {
              max-height: 260px;
            }

            .ag-media-stage .glass-flex {
              min-width: 0;
            }

            .ag-media-stage .ag-wide-player-scroll {
              overflow-x: visible !important;
            }

            .ag-media-stage .ag-wide-player-inner {
              min-width: 0 !important;
            }
          }
        `}
      </style>
      <div
        style={{
          width: "100%",
          maxWidth,
          margin: "0 auto",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function PlayerFrame({
  children,
  height,
}: {
  children: React.ReactNode;
  height?: number;
}) {
  return (
    <div
      className="ag-player-frame"
      style={{
        height,
        minHeight: height,
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 24px 80px rgba(2, 6, 23, 0.34)",
      }}
    >
      {children}
    </div>
  );
}

export const AdvancedVideoPlayer: Story = {
  render: () => (
    <DemoProvider files={videoFiles}>
      <Stage maxWidth={960}>
        <PlayerFrame height={520}>
          <GlassAdvancedVideoPlayer
            mediaFile={sampleVideoFile}
            showControls
            showTranscript={false}
            showChapters={false}
            className="glass-h-full"
          />
        </PlayerFrame>
      </Stage>
    </DemoProvider>
  ),
};

export const VideoWithChapters: Story = {
  render: () => (
    <DemoProvider files={videoFiles}>
      <Stage maxWidth={1160}>
        <PlayerFrame height={500}>
          <GlassAdvancedVideoPlayer
            mediaFile={sampleVideoFile}
            showControls
            showChapters
            showTranscript={false}
            className="glass-h-full"
          />
        </PlayerFrame>
      </Stage>
    </DemoProvider>
  ),
};

export const VideoWithTranscription: Story = {
  render: () => (
    <DemoProvider files={videoFiles}>
      <Stage maxWidth={1220}>
        <PlayerFrame height={520}>
          <GlassAdvancedVideoPlayer
            mediaFile={sampleVideoFile}
            showControls
            showChapters={false}
            showTranscript
            className="glass-h-full"
          />
        </PlayerFrame>
      </Stage>
    </DemoProvider>
  ),
};

export const FullFeaturedVideoPlayer: Story = {
  render: () => (
    <DemoProvider files={videoFiles}>
      <Stage maxWidth={1420}>
        <div className="ag-wide-player-scroll" style={{ overflowX: "auto", paddingBottom: 8 }}>
          <div className="ag-wide-player-inner" style={{ minWidth: 1280 }}>
            <PlayerFrame height={560}>
              <GlassAdvancedVideoPlayer
                mediaFile={sampleVideoFile}
                showControls
                showChapters
                showTranscript
                showAnalytics
                className="glass-h-full"
              />
            </PlayerFrame>
          </div>
        </div>
      </Stage>
    </DemoProvider>
  ),
};

export const CompactAudioPlayer: Story = {
  render: () => (
    <DemoProvider files={audioFiles}>
      <Stage maxWidth={560}>
        <GlassAdvancedAudioPlayer
          mediaFile={sampleAudioFile}
          variant="compact"
          visualizerType="none"
        />
      </Stage>
    </DemoProvider>
  ),
};

export const FullAudioPlayerWithVisualizer: Story = {
  render: () => (
    <DemoProvider files={audioFiles}>
      <Stage maxWidth={760}>
        <GlassAdvancedAudioPlayer
          mediaFile={sampleAudioFile}
          variant="full"
          visualizerType="bars"
          showWaveform={false}
        />
      </Stage>
    </DemoProvider>
  ),
};

export const AudioPlayerWithWaveform: Story = {
  render: () => (
    <DemoProvider files={audioFiles}>
      <Stage maxWidth={760}>
        <GlassAdvancedAudioPlayer
          mediaFile={sampleAudioFile}
          variant="full"
          visualizerType="none"
          showWaveform
        />
      </Stage>
    </DemoProvider>
  ),
};

export const PodcastPlayerWithTranscript: Story = {
  render: () => (
    <DemoProvider files={audioFiles}>
      <Stage maxWidth={1160}>
        <GlassAdvancedAudioPlayer
          mediaFile={sampleAudioFile}
          variant="podcast"
          showTranscript
          visualizerType="wave"
        />
      </Stage>
    </DemoProvider>
  ),
};

export const MusicPlayerWithPlaylist: Story = {
  render: () => (
    <DemoProvider files={samplePlaylist}>
      <Stage maxWidth={1160}>
        <GlassAdvancedAudioPlayer
          mediaFile={samplePlaylist[0]}
          variant="music"
          showPlaylist
          playlist={samplePlaylist}
          visualizerType="circular"
        />
      </Stage>
    </DemoProvider>
  ),
};

export const MediaPlayerShowcase: Story = {
  render: () => (
    <DemoProvider files={allFiles}>
      <Stage maxWidth={1280}>
        <div style={{ display: "grid", gap: 28 }}>
          <PlayerFrame height={520}>
            <GlassAdvancedVideoPlayer
              mediaFile={sampleVideoFile}
              showControls
              showChapters
              showTranscript
              className="glass-h-full"
            />
          </PlayerFrame>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
              gap: 24,
            }}
          >
            <GlassAdvancedAudioPlayer
              mediaFile={sampleAudioFile}
              variant="full"
              visualizerType="bars"
            />
            <GlassAdvancedAudioPlayer
              mediaFile={samplePlaylist[0]}
              variant="music"
              showPlaylist
              playlist={samplePlaylist}
              visualizerType="circular"
            />
          </div>
        </div>
      </Stage>
    </DemoProvider>
  ),
  parameters: {
    previewSurface: "app",
  },
};
