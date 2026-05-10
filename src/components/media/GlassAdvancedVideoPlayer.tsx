"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Glass } from "../../primitives";
import { createGlassStyle } from "../../core/mixins/glassMixins";
import { cn } from "../../lib/utilsComprehensive";
import {
  useMedia,
  MediaFile,
  MediaChapter,
  TranscriptEntry,
} from "./GlassMediaProvider";

export interface AdvancedVideoPlayerProps {
  mediaFile: MediaFile;
  className?: string;
  "data-testid"?: string;
  showControls?: boolean;
  showTranscript?: boolean;
  showChapters?: boolean;
  showAnalytics?: boolean;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  preload?: "none" | "metadata" | "auto";
  poster?: string;
  onTimeUpdate?: (currentTime: number) => void;
  onEnded?: () => void;
  onError?: (error: string) => void;
}

interface ControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  isFullscreen: boolean;
  isMuted: boolean;
  quality: string;
  buffered: number;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onPlaybackRateChange: (rate: number) => void;
  onQualityChange: (quality: string) => void;
  onFullscreenToggle: () => void;
  onMuteToggle: () => void;
}

const formatTime = (seconds: number): string => {
  if (isNaN(seconds)) return "0:00";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  } else {
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }
};

const getInlineTranscript = (mediaFile: MediaFile): TranscriptEntry[] =>
  mediaFile.subtitles?.flatMap(
    (subtitle) =>
      subtitle.content?.map((entry) => ({
        ...entry,
        keywords: [],
        sentiment: "neutral" as const,
      })) ?? []
  ) ?? [];

const clampPercent = (value: number, total: number): number => {
  if (!Number.isFinite(value) || !Number.isFinite(total) || total <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(100, (value / total) * 100));
};

const isStorybookDataMedia = (src?: string): boolean =>
  Boolean(src?.startsWith("data:video/"));

const fallbackPoster =
  "data:image/svg+xml," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#020617"/>
          <stop offset="0.55" stop-color="#1d4ed8"/>
          <stop offset="1" stop-color="#0f766e"/>
        </linearGradient>
      </defs>
      <rect width="1280" height="720" fill="url(#bg)"/>
      <circle cx="1018" cy="166" r="126" fill="rgba(255,255,255,0.14)"/>
      <rect x="96" y="104" width="620" height="122" rx="28" fill="rgba(255,255,255,0.16)"/>
      <path d="M604 360 468 280v160z" fill="#ffffff"/>
      <rect x="96" y="528" width="1088" height="16" rx="8" fill="rgba(255,255,255,0.24)"/>
      <rect x="96" y="528" width="462" height="16" rx="8" fill="#ffffff"/>
      <text x="132" y="178" font-family="Inter, Arial, sans-serif" font-size="52" font-weight="700" fill="#ffffff">AuraGlass Video</text>
      <text x="132" y="604" font-family="Inter, Arial, sans-serif" font-size="30" fill="#dbeafe">Stable visual media preview</text>
    </svg>
  `);

const controlButtonStyle: React.CSSProperties = {
  ...createGlassStyle({
    intent: "neutral",
    elevation: "level4",
    interactive: true,
  }),
  appearance: "none",
  WebkitAppearance: "none",
  border: "1px solid rgba(148, 163, 184, 0.42)",
  color: "#f8fafc",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.12), 0 12px 28px rgba(2,6,23,0.28)",
};

const activeButtonStyle: React.CSSProperties = {
  ...createGlassStyle({
    intent: "primary",
    elevation: "level4",
    interactive: true,
  }),
  appearance: "none",
  WebkitAppearance: "none",
  color: "#f8fafc",
  borderColor: "rgba(191, 219, 254, 0.72)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.12), 0 12px 28px rgba(2,6,23,0.28)",
};

const menuStyle: React.CSSProperties = {
  ...createGlassStyle({ intent: "neutral", elevation: "level4" }),
  color: "#f8fafc",
  border: "1px solid rgba(148, 163, 184, 0.34)",
  boxShadow: "0 18px 38px rgba(2, 6, 23, 0.42)",
};

const rangeStyle: React.CSSProperties = {
  appearance: "none",
  WebkitAppearance: "none",
  color: "#38bdf8",
  accentColor: "#38bdf8",
};

const videoComponentStyles = `
  .ag-advanced-video-player,
  .ag-advanced-video-player * {
    box-sizing: border-box;
  }

  .ag-advanced-video-player .ag-video-layout {
    display: flex;
    height: 100%;
    min-height: 0;
  }

  .ag-advanced-video-player .ag-video-surface {
    flex: 1 1 52rem;
    min-width: 32rem;
  }

  .ag-advanced-video-player .ag-video-side-panels {
    display: flex;
    flex: 0 1 42rem;
    min-width: 22rem;
    max-width: min(46rem, 48%);
    height: 100%;
    overflow: hidden;
    border-left: 1px solid rgba(226, 232, 240, 0.18);
    background: rgba(2, 6, 23, 0.22);
  }

  .ag-advanced-video-player .ag-video-side-panel {
    flex: 1 1 0;
    min-width: 0;
    height: 100%;
    overflow: hidden;
  }

  .ag-advanced-video-player .ag-video-side-panel + .ag-video-side-panel {
    border-left: 1px solid rgba(226, 232, 240, 0.16);
  }

  .ag-advanced-video-player .ag-video-panel-content {
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: linear-gradient(180deg, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.78));
    border-radius: 0;
    color: #f8fafc;
  }

  .ag-advanced-video-player .ag-video-panel-scroll {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding-right: 2px;
  }

  .ag-advanced-video-player .ag-video-controls {
    border-top: 1px solid rgba(226, 232, 240, 0.24);
    background:
      linear-gradient(180deg, rgba(15, 23, 42, 0.42), rgba(2, 6, 23, 0.92)),
      rgba(2, 6, 23, 0.84);
    backdrop-filter: blur(26px) saturate(1.45);
    -webkit-backdrop-filter: blur(26px) saturate(1.45);
  }

  .ag-advanced-video-player .ag-video-control-row,
  .ag-advanced-video-player .ag-video-control-group {
    min-width: 0;
  }

  .ag-advanced-video-player.ag-video-compact {
    overflow: hidden !important;
    min-height: 0 !important;
  }

  .ag-advanced-video-player.ag-video-compact .ag-video-layout {
    flex-direction: column;
    height: auto;
    overflow: hidden !important;
  }

  .ag-advanced-video-player.ag-video-compact .ag-video-surface {
    display: flex;
    flex: 0 0 auto;
    flex-direction: column;
    min-width: 0;
    width: 100%;
    aspect-ratio: auto;
    min-height: 0;
    overflow: hidden !important;
  }

  .ag-advanced-video-player.ag-video-compact .ag-video-surface > img,
  .ag-advanced-video-player.ag-video-compact .ag-video-surface > video {
    position: relative !important;
    aspect-ratio: 16 / 9;
    min-height: 160px;
    flex: 0 0 auto;
  }

  .ag-advanced-video-player.ag-video-compact .ag-video-controls {
    position: relative !important;
    padding: 8px !important;
    flex: 0 0 auto;
    overflow: hidden;
  }

  .ag-advanced-video-player.ag-video-compact .ag-video-control-row {
    gap: 8px !important;
    align-items: flex-start !important;
    flex-direction: row;
  }

  .ag-advanced-video-player.ag-video-compact .ag-video-control-group {
    gap: 6px !important;
    flex: 1 1 100%;
    width: 100%;
  }

  .ag-advanced-video-player.ag-video-compact .ag-video-control-group:last-child {
    display: none;
  }

  .ag-advanced-video-player.ag-video-compact .ag-video-controls button {
    min-width: 34px !important;
    min-height: 34px !important;
    max-width: 44px;
    padding: 6px !important;
    font-size: 12px !important;
  }

  .ag-advanced-video-player.ag-video-compact .ag-video-controls [aria-label^="Playback speed"],
  .ag-advanced-video-player.ag-video-compact .ag-video-controls [aria-label^="Video quality"] {
    min-width: 42px !important;
    max-width: 52px;
  }

  @media (max-width: 980px) {
    .ag-advanced-video-player {
      min-height: 0 !important;
    }

    .ag-advanced-video-player .ag-video-layout {
      flex-direction: column;
      height: auto;
    }

    .ag-advanced-video-player .ag-video-surface {
      flex: 0 0 auto;
      min-width: 0;
      width: 100%;
      aspect-ratio: 16 / 9;
      min-height: 260px;
    }

    .ag-advanced-video-player .ag-video-side-panels {
      flex: 0 0 auto;
      width: 100%;
      max-width: none;
      min-width: 0;
      height: auto;
      max-height: none;
      border-left: 0;
      border-top: 1px solid rgba(226, 232, 240, 0.18);
    }

    .ag-advanced-video-player .ag-video-side-panel {
      min-width: min(100%, 19rem);
      min-height: 260px;
      max-height: 340px;
    }
  }

  @media (max-width: 640px) {
    .ag-advanced-video-player {
      overflow: hidden !important;
    }

    .ag-advanced-video-player .ag-video-layout {
      overflow: hidden !important;
    }

    .ag-advanced-video-player .ag-video-surface {
      display: flex;
      flex-direction: column;
      overflow: hidden !important;
    }

    .ag-advanced-video-player .ag-video-controls {
      position: relative !important;
      padding: 8px !important;
      flex: 0 0 auto;
      overflow: hidden;
    }

    .ag-advanced-video-player .ag-video-control-row {
      gap: 8px !important;
      align-items: flex-start !important;
      flex-direction: column;
    }

    .ag-advanced-video-player .ag-video-control-group {
      gap: 6px !important;
      flex: 1 1 100%;
      width: 100%;
    }

    .ag-advanced-video-player .ag-video-control-group:last-child {
      justify-content: flex-start;
    }

    .ag-advanced-video-player .ag-video-controls button {
      min-width: 34px !important;
      min-height: 34px !important;
      max-width: 44px;
      padding: 6px !important;
      font-size: 12px !important;
    }

    .ag-advanced-video-player .ag-video-controls [aria-label^="Playback speed"],
    .ag-advanced-video-player .ag-video-controls [aria-label^="Video quality"] {
      min-width: 42px !important;
      max-width: 52px;
    }

    .ag-advanced-video-player .ag-video-surface {
      aspect-ratio: auto;
      min-height: 0;
    }

    .ag-advanced-video-player .ag-video-surface > img,
    .ag-advanced-video-player .ag-video-surface > video {
      position: relative !important;
      aspect-ratio: 16 / 9;
      min-height: 220px;
      flex: 0 0 auto;
    }

    .ag-advanced-video-player .ag-video-side-panels {
      flex-direction: column;
    }

    .ag-advanced-video-player .ag-video-side-panel {
      width: 100%;
      min-width: 0;
      min-height: 420px;
      height: auto;
      max-height: none;
      overflow: visible !important;
    }

    .ag-advanced-video-player .ag-video-panel-content {
      height: auto;
      max-height: 420px;
    }
  }
`;

const VideoControls: React.FC<ControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  playbackRate,
  isFullscreen,
  isMuted,
  quality,
  buffered,
  onPlayPause,
  onSeek,
  onVolumeChange,
  onPlaybackRateChange,
  onQualityChange,
  onFullscreenToggle,
  onMuteToggle,
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [seeking, setSeeking] = useState(false);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const time = percent * duration;
    onSeek(time);
  };

  const handleProgressDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (seeking) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const time = Math.max(0, Math.min(duration, percent * duration));
      onSeek(time);
    }
  };

  const playbackSpeeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  const qualities = ["auto", "144p", "240p", "360p", "480p", "720p", "1080p"];
  const playedPercent = clampPercent(currentTime, duration);
  const bufferedPercent = clampPercent(buffered, duration);

  return (
    <div
      data-glass-component
      className="glass-absolute glass-bottom-0 glass-left-0 glass-right-0 glass-p-4 ag-video-controls"
      style={{
        ...createGlassStyle({ intent: "neutral", elevation: "level4" }),
        position: "absolute",
        top: "auto",
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 20,
        color: "#f8fafc",
      }}
    >
      {/* Progress Bar */}
      <div
        className="glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-full glass-cursor-pointer glass-mb-4 glass-relative"
        onClick={handleProgressClick}
        onMouseMove={handleProgressDrag}
        onMouseDown={() => setSeeking(true)}
        onMouseUp={() => setSeeking(false)}
        onMouseLeave={() => setSeeking(false)}
      >
        {/* Buffered Progress */}
        <div
          className="glass-absolute glass-top-0 glass-left-0 glass-h-full glass-surface-subtle glass-radius-full"
          style={{
            width: `${bufferedPercent}%`,
          }}
        />

        {/* Played Progress */}
        <div
          className="glass-absolute glass-top-0 glass-left-0 glass-h-full glass-surface-primary glass-radius-full"
          style={{
            width: `${playedPercent}%`,
          }}
        />

        {/* Progress Handle */}
        <div
          className="glass-absolute glass-top-1/2 glass-transform glass--translate-y-1-2 glass-w-4 glass-h-4 glass-surface-primary glass-radius-full glass-border-2 glass-border-white glass-shadow-md"
          style={{ left: `calc(${playedPercent}% - 8px)` }}
        />
      </div>

      <div
        className="glass-flex glass-items-center glass-justify-between glass-text-primary ag-video-control-row"
        style={{ gap: 14, flexWrap: "wrap" }}
      >
        {/* Left Controls */}
        <div
          className="glass-flex glass-items-center glass-gap-3 ag-video-control-group"
          style={{ flexWrap: "wrap" }}
        >
          {/* Play/Pause */}
          <button
            onClick={onPlayPause}
            className="glass-w-12 glass-h-12 glass-flex glass-items-center glass-justify-center glass-surface-subtle/20 hover:glass-surface-subtle/30 glass-radius-full glass-transition-colors glass-focus glass-touch-target glass-contrast-guard"
            style={activeButtonStyle}
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? (
              <div className="glass-flex glass-gap-1">
                <div className="glass-w-1 glass-h-4 glass-surface-subtle glass-radius-full" />
                <div className="glass-w-1 glass-h-4 glass-surface-subtle glass-radius-full" />
              </div>
            ) : (
              <div className="glass-w-0 glass-h-0 glass-border-l-4 glass-border-l-white glass-border-y-4 glass-border-y-transparent glass-ml-1" />
            )}
          </button>

          {/* Volume */}
          <div
            className="glass-relative"
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <button
              onClick={onMuteToggle}
              className="glass-w-10 glass-h-10 glass-flex glass-items-center glass-justify-center hover:glass-surface-subtle/20 glass-radius-full glass-transition-colors glass-focus glass-touch-target glass-contrast-guard"
              style={controlButtonStyle}
              aria-label={
                isMuted || volume === 0 ? "Unmute video" : "Mute video"
              }
            >
              {isMuted || volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}
            </button>

            {showVolumeSlider && (
              <div
                className="glass-absolute glass-bottom-12 glass--left-1-2 glass-transform glass--translate-x-1-2 glass-radius-lg glass-p-2"
                style={menuStyle}
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => onVolumeChange(Number(e.target.value))}
                  className="glass-w-16 glass-h-1 glass-surface-subtle/20 glass-radius-full glass-appearance-none glass-slider-thumb-white glass-focus glass-touch-target glass-contrast-guard"
                  style={rangeStyle}
                />
              </div>
            )}
          </div>

          {/* Time Display */}
          <div
            className="glass-text-sm glass-font-mono"
            style={{
              ...createGlassStyle({ intent: "neutral", elevation: "level3" }),
              color: "#f8fafc",
              border: "1px solid rgba(148, 163, 184, 0.3)",
              borderRadius: 999,
              padding: "8px 12px",
              whiteSpace: "nowrap",
            }}
          >
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        {/* Right Controls */}
        <div
          className="glass-flex glass-items-center glass-gap-3 ag-video-control-group"
          style={{ flexWrap: "wrap" }}
        >
          {/* Playback Speed */}
          <div className="glass-relative">
            <button
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              className="glass-px-3 glass-py-2 glass-text-sm hover:glass-surface-subtle/20 glass-radius-md glass-transition-colors glass-focus glass-touch-target glass-contrast-guard"
              style={controlButtonStyle}
              aria-label={`Playback speed: ${playbackRate}x`}
            >
              {playbackRate}x
            </button>

            {showSpeedMenu && (
              <div
                className="glass-absolute glass-bottom-12 glass-right-0 glass-radius-lg glass-p-2 glass-min-w-20"
                style={menuStyle}
              >
                {playbackSpeeds.map((speed: any) => (
                  <button
                    key={speed}
                    onClick={() => {
                      onPlaybackRateChange(speed);
                      setShowSpeedMenu(false);
                    }}
                    className={cn(
                      "glass-block glass-w-full glass-text-left glass-px-3 glass-py-2 glass-text-sm glass-radius glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",
                      speed === playbackRate && "glass-surface-primary"
                    )}
                    style={{
                      color: "#f8fafc",
                      background:
                        speed === playbackRate
                          ? "rgba(37, 99, 235, 0.96)"
                          : "transparent",
                    }}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quality */}
          <div className="glass-relative">
            <button
              onClick={() => setShowQualityMenu(!showQualityMenu)}
              className="glass-px-3 glass-py-2 glass-text-sm hover:glass-surface-subtle/20 glass-radius-md glass-transition-colors glass-focus glass-touch-target glass-contrast-guard"
              style={controlButtonStyle}
              aria-label={`Video quality: ${quality}`}
            >
              {quality}
            </button>

            {showQualityMenu && (
              <div
                className="glass-absolute glass-bottom-12 glass-right-0 glass-radius-lg glass-p-2 glass-min-w-20"
                style={menuStyle}
              >
                {qualities.map((q: any) => (
                  <button
                    key={q}
                    onClick={() => {
                      onQualityChange(q);
                      setShowQualityMenu(false);
                    }}
                    className={cn(
                      "glass-block glass-w-full glass-text-left glass-px-3 glass-py-2 glass-text-sm glass-radius glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",
                      q === quality && "glass-surface-primary"
                    )}
                    style={{
                      color: "#f8fafc",
                      background:
                        q === quality
                          ? "rgba(37, 99, 235, 0.96)"
                          : "transparent",
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fullscreen */}
          <button
            onClick={onFullscreenToggle}
            className="glass-w-10 glass-h-10 glass-flex glass-items-center glass-justify-center hover:glass-surface-subtle/20 glass-radius-full glass-transition-colors glass-focus glass-touch-target glass-contrast-guard"
            style={controlButtonStyle}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? "⊟" : "⊞"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ChapterList: React.FC<{
  chapters: MediaChapter[];
  currentTime: number;
  onChapterClick: (chapter: MediaChapter) => void;
}> = ({ chapters, currentTime, onChapterClick }) => {
  return (
    <div className="ag-video-panel-content glass-surface-subtle glass-text-primary glass-p-4">
      <h3 className="glass-text-lg glass-font-semibold glass-mb-4">Chapters</h3>
      <div className="ag-video-panel-scroll glass-space-y-2">
        {chapters.map((chapter: any) => {
          const isActive =
            currentTime >= chapter.startTime && currentTime <= chapter.endTime;

          return (
            <button
              key={chapter.id}
              onClick={() => onChapterClick(chapter)}
              className={cn(
                "glass-flex glass-items-center glass-gap-3 glass-w-full glass-p-3 glass-radius-lg glass-text-left glass-text-primary glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",
                isActive ? "glass-surface-primary" : "glass-surface-overlay"
              )}
              style={{
                background: isActive
                  ? "rgba(37, 99, 235, 0.84)"
                  : "rgba(15, 23, 42, 0.66)",
                border: "1px solid rgba(226, 232, 240, 0.18)",
                color: "#f8fafc",
                minHeight: 84,
              }}
            >
              {chapter.thumbnail && (
                <img
                  src={chapter.thumbnail}
                  alt={chapter.title}
                  className="glass-w-16 glass-h-9 glass-object-cover glass-radius"
                />
              )}
              <div className="glass-flex-1 glass-min-w-0">
                <div className="glass-font-medium">{chapter.title}</div>
                <div className="glass-text-sm glass-text-primary">
                  {formatTime(chapter.startTime)} -{" "}
                  {formatTime(chapter.endTime)}
                </div>
                {chapter.description && (
                  <div className="glass-text-xs glass-text-primary glass-mt-1">
                    {chapter.description}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const TranscriptPanel: React.FC<{
  transcript: TranscriptEntry[];
  currentTime: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onTranscriptClick: (entry: TranscriptEntry) => void;
}> = ({
  transcript,
  currentTime,
  searchQuery,
  onSearchChange,
  onTranscriptClick,
}) => {
  const [highlightedResults, setHighlightedResults] = useState<
    TranscriptEntry[]
  >([]);

  useEffect(() => {
    if (searchQuery) {
      const results = transcript.filter((entry: any) =>
        entry.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setHighlightedResults(results);
    } else {
      setHighlightedResults([]);
    }
  }, [searchQuery, transcript]);

  const highlightText = (text: string, query: string) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark
          key={index}
          className="glass-surface-subtle glass-text-inverse glass-radius glass-px-1"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="ag-video-panel-content glass-surface-subtle glass-text-primary glass-p-4 glass-h-full glass-flex glass-flex-col">
      <div className="glass-flex glass-items-center glass-justify-between glass-mb-4">
        <h3 className="glass-text-lg glass-font-semibold">Transcript</h3>
        <div className="glass-text-sm glass-text-primary">
          {transcript.length} entries
        </div>
      </div>

      {/* Search */}
      <div className="glass-mb-4">
        <input
          type="text"
          placeholder="Search transcript..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="glass-w-full glass-px-3 glass-py-2 glass-surface-overlay glass-text-primary glass-border glass-border-subtle glass-radius-lg glass-focus glass-touch-target glass-contrast-guard"
        />
        {searchQuery && (
          <div className="glass-text-sm glass-text-primary glass-mt-2">
            {highlightedResults.length} results found
          </div>
        )}
      </div>

      {/* Transcript Entries */}
      <div className="ag-video-panel-scroll glass-flex-1 glass-space-y-3">
        {(searchQuery ? highlightedResults : transcript).map((entry: any) => {
          const isActive =
            currentTime >= entry.startTime && currentTime <= entry.endTime;
          const confidence = entry.confidence || 0;

          return (
            <button
              key={entry.id}
              onClick={() => onTranscriptClick(entry)}
              className={cn(
                "glass-flex glass-flex-col glass-items-start glass-gap-2 glass-w-full glass-p-3 glass-radius-lg glass-text-left glass-text-primary glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",
                isActive ? "glass-surface-primary" : "glass-surface-overlay"
              )}
              style={{
                background: isActive
                  ? "rgba(37, 99, 235, 0.84)"
                  : "rgba(15, 23, 42, 0.66)",
                border: "1px solid rgba(226, 232, 240, 0.18)",
                color: "#f8fafc",
              }}
            >
              <div className="glass-flex glass-items-center glass-justify-between glass-w-full">
                <div className="glass-flex glass-items-center glass-gap-2">
                  <span className="glass-text-xs glass-text-primary glass-font-mono">
                    {formatTime(entry.startTime)}
                  </span>
                  {entry.speaker && (
                    <span className="glass-text-xs glass-surface-subtle glass-text-primary glass-px-2 glass-py-1 glass-radius">
                      {entry.speaker}
                    </span>
                  )}
                </div>
                <div className="glass-flex glass-items-center glass-gap-2">
                  {confidence > 0 && (
                    <div
                      className={cn(
                        "glass-text-xs glass-px-2 glass-py-1 glass-radius",
                        confidence > 0.9
                          ? "glass-surface-success"
                          : confidence > 0.7
                            ? "glass-surface-warning"
                            : "glass-surface-danger"
                      )}
                    >
                      {Math.round(confidence * 100)}%
                    </div>
                  )}
                  {entry.sentiment && (
                    <div className="glass-text-xs">
                      {entry.sentiment === "positive"
                        ? "😊"
                        : entry.sentiment === "negative"
                          ? "😔"
                          : "😐"}
                    </div>
                  )}
                </div>
              </div>

              <div className="glass-text-sm glass-leading-relaxed">
                {searchQuery
                  ? highlightText(entry.text, searchQuery)
                  : entry.text}
              </div>

              {entry.keywords && entry.keywords.length > 0 && (
                <div className="glass-flex glass-flex-wrap glass-gap-1 glass-mt-2">
                  {entry.keywords.map((keyword: any) => (
                    <span
                      key={keyword}
                      className="glass-text-xs glass-surface-subtle glass-text-primary glass-px-2 glass-py-1 glass-radius"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const GlassAdvancedVideoPlayer: React.FC<AdvancedVideoPlayerProps> = ({
  mediaFile,
  className,
  "data-testid": dataTestId,
  showControls = true,
  showTranscript = false,
  showChapters = false,
  showAnalytics = false,
  autoplay = false,
  muted = false,
  loop = false,
  preload = "metadata",
  poster,
  onTimeUpdate,
  onEnded,
  onError,
}) => {
  const {
    playbackState,
    setPlaybackState,
    play,
    pause,
    seekTo,
    setVolume,
    setPlaybackRate,
    toggleMute,
    toggleFullscreen,
    setQuality,
    transcripts,
    generateTranscript,
    searchTranscript,
    getTranscriptAtTime,
    setActiveChapter,
    getChapterAtTime,
    trackView,
    trackEngagement,
  } = useMedia();

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [showControlsOverlay, setShowControlsOverlay] = useState(showControls);
  const [isCompact, setIsCompact] = useState(false);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [transcriptSearch, setTranscriptSearch] = useState("");
  const [hasTranscript, setHasTranscript] = useState(false);
  const inlineTranscript = React.useMemo(
    () => getInlineTranscript(mediaFile),
    [mediaFile]
  );
  const visibleTranscript = transcripts[mediaFile.id] ?? inlineTranscript;

  const isPlaying =
    playbackState?.mediaId === mediaFile.id && playbackState.isPlaying;
  const currentTime =
    playbackState?.mediaId === mediaFile.id ? playbackState.currentTime : 0;
  const duration =
    playbackState?.mediaId === mediaFile.id
      ? playbackState.duration
      : mediaFile.duration || 0;
  const volume = playbackState?.volume || 1;
  const playbackRate = playbackState?.playbackRate || 1;
  const isFullscreen = playbackState?.isFullscreen || false;
  const isMuted = playbackState?.isMuted || false;
  const quality = playbackState?.quality || "auto";
  const posterSrc =
    poster || mediaFile.poster || mediaFile.thumbnail || fallbackPoster;
  const usePosterSurface =
    !mediaFile.src || isStorybookDataMedia(mediaFile.src);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || typeof ResizeObserver === "undefined") return;

    const updateCompactState = () => {
      setIsCompact(element.getBoundingClientRect().width < 560);
    };

    updateCompactState();
    const observer = new ResizeObserver(updateCompactState);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  // Initialize transcript
  useEffect(() => {
    if (!showTranscript) return;

    if (inlineTranscript.length > 0) {
      setHasTranscript(true);
      return;
    }

    if (!transcripts[mediaFile.id] && showTranscript) {
      generateTranscript(mediaFile.id).then(() => {
        setHasTranscript(true);
      });
    } else if (transcripts[mediaFile.id]) {
      setHasTranscript(true);
    }
  }, [
    mediaFile.id,
    showTranscript,
    generateTranscript,
    transcripts,
    inlineTranscript.length,
  ]);

  // Mouse movement handling for controls
  const handleMouseMove = useCallback(() => {
    setShowControlsOverlay(true);

    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }

    const timeout = setTimeout(() => {
      if (isPlaying) {
        setShowControlsOverlay(false);
      }
    }, 3000);

    setControlsTimeout(timeout);
  }, [isPlaying, controlsTimeout]);

  // Video event handlers
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;

      if (playbackState && playbackState.mediaId === mediaFile.id) {
        setPlaybackState({ ...playbackState, currentTime });
      }

      onTimeUpdate?.(currentTime);

      // Update active chapter
      const activeChapter = getChapterAtTime(mediaFile.id, currentTime);
      if (activeChapter) {
        setActiveChapter(mediaFile.id, activeChapter.id);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      if (playbackState && playbackState.mediaId === mediaFile.id) {
        setPlaybackState({ ...playbackState, duration, isLoading: false });
      }
    }
  };

  const handleEnded = () => {
    if (playbackState && playbackState.mediaId === mediaFile.id) {
      setPlaybackState({ ...playbackState, isPlaying: false, currentTime: 0 });
    }

    trackView(mediaFile.id, duration);
    onEnded?.();
  };

  const handleError = () => {
    if (playbackState && playbackState.mediaId === mediaFile.id) {
      setPlaybackState({ ...playbackState, isError: true, isLoading: false });
    }

    onError?.("Video playback error occurred");
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
      if (videoRef.current) {
        videoRef.current.pause();
      }
    } else {
      play(mediaFile.id);
      if (videoRef.current && !usePosterSurface) {
        videoRef.current.play();
      }
    }
  };

  const handleSeek = (time: number) => {
    seekTo(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const handleMuteToggle = () => {
    toggleMute();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const handleFullscreenToggle = () => {
    toggleFullscreen();

    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleChapterClick = (chapter: MediaChapter) => {
    handleSeek(chapter.startTime);
    setActiveChapter(mediaFile.id, chapter.id);
  };

  const handleTranscriptClick = (entry: TranscriptEntry) => {
    handleSeek(entry.startTime);
  };
  const hasVisibleChapters =
    showChapters &&
    Boolean(mediaFile.chapters && mediaFile.chapters.length > 0);
  const hasVisibleTranscript =
    showTranscript && hasTranscript && visibleTranscript.length > 0;

  return (
    <div
      className={cn(
        "ag-advanced-video-player glass-relative glass-radius-lg glass-overflow-hidden",
        isCompact && "ag-video-compact",
        className
      )}
      data-testid={dataTestId || "glassadvancedvideoplayer"}
      style={{
        background: "#020617",
        color: "#f8fafc",
        minHeight: 320,
      }}
    >
      <style>{videoComponentStyles}</style>
      <div
        ref={containerRef}
        className="ag-video-layout glass-relative glass-w-full glass-h-full"
        style={{ minHeight: 0 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setShowControlsOverlay(false)}
      >
        {/* Video Container */}
        <div
          className="ag-video-surface glass-flex-1 glass-relative"
          style={{ minHeight: 0, overflow: "hidden" }}
        >
          {usePosterSurface && (
            <img
              src={posterSrc}
              alt={mediaFile.title || "Video preview"}
              className="glass-absolute glass-inset-0 glass-w-full glass-h-full glass-object-cover"
              style={{
                background: "#020617",
                cursor: "pointer",
                minHeight: "100%",
              }}
              onClick={handlePlayPause}
            />
          )}
          <video
            ref={videoRef}
            src={usePosterSurface ? undefined : mediaFile.src}
            poster={posterSrc}
            autoPlay={autoplay}
            muted={muted}
            loop={loop}
            preload={preload}
            className="glass-w-full glass-h-full glass-object-contain"
            style={usePosterSurface ? { display: "none" } : undefined}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
            onError={handleError}
            onClick={handlePlayPause}
          />

          {/* Loading Overlay */}
          {playbackState?.isLoading && (
            <div
              className="glass-absolute glass-inset-0 glass-flex glass-items-center glass-justify-center"
              style={{
                background:
                  '/* Use createGlassStyle({ intent: "primary", elevation: "level2" }) */',
              }}
            >
              <div className="glass-animate-spin glass-radius-full glass-h-16 glass-w-16 glass-border-4 glass-border-white glass-border-t-transparent" />
            </div>
          )}

          {/* Error Overlay */}
          {playbackState?.isError && (
            <div
              className="glass-absolute glass-inset-0 glass-flex glass-items-center glass-justify-center glass-text-primary"
              style={{
                background:
                  '/* Use createGlassStyle({ intent: "primary", elevation: "level2" }) */',
              }}
            >
              <div className="glass-text-center">
                <div className="glass-text-4xl glass-mb-4">⚠️</div>
                <h3 className="glass-text-xl glass-font-semibold glass-mb-2">
                  Playback Error
                </h3>
                <p className="glass-text-secondary">
                  Unable to load video content
                </p>
              </div>
            </div>
          )}

          {/* Controls Overlay */}
          {showControlsOverlay && (
            <VideoControls
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              volume={volume}
              playbackRate={playbackRate}
              isFullscreen={isFullscreen}
              isMuted={isMuted}
              quality={quality}
              buffered={
                videoRef.current?.buffered.length
                  ? videoRef.current.buffered.end(
                      videoRef.current.buffered.length - 1
                    )
                  : 0
              }
              onPlayPause={handlePlayPause}
              onSeek={handleSeek}
              onVolumeChange={handleVolumeChange}
              onPlaybackRateChange={handlePlaybackRateChange}
              onQualityChange={setQuality}
              onFullscreenToggle={handleFullscreenToggle}
              onMuteToggle={handleMuteToggle}
            />
          )}
        </div>

        {/* Side Panels */}
        {(hasVisibleChapters || hasVisibleTranscript) && (
          <div className="ag-video-side-panels glass-flex">
            {/* Chapters Panel */}
            {hasVisibleChapters && mediaFile.chapters && (
              <Glass className="ag-video-side-panel glass-h-full glass-overflow-hidden">
                <ChapterList
                  chapters={mediaFile.chapters}
                  currentTime={currentTime}
                  onChapterClick={handleChapterClick}
                />
              </Glass>
            )}

            {/* Transcript Panel */}
            {hasVisibleTranscript && (
              <Glass className="ag-video-side-panel glass-h-full glass-overflow-hidden">
                <TranscriptPanel
                  transcript={visibleTranscript}
                  currentTime={currentTime}
                  searchQuery={transcriptSearch}
                  onSearchChange={setTranscriptSearch}
                  onTranscriptClick={handleTranscriptClick}
                />
              </Glass>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
