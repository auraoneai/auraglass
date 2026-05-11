"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Glass } from "../../primitives";
import { createGlassStyle } from "../../core/mixins/glassMixins";
import { cn } from "../../lib/utilsComprehensive";
import { useMedia, MediaFile, TranscriptEntry } from "./GlassMediaProvider";

export interface AdvancedAudioPlayerProps {
  mediaFile: MediaFile;
  className?: string;
  variant?: "compact" | "full" | "podcast" | "music";
  compact?: boolean;
  contained?: boolean;
  maxHeight?: number | string;
  showTranscript?: boolean;
  showPlaylist?: boolean;
  showWaveform?: boolean;
  showLyrics?: boolean;
  autoplay?: boolean;
  loop?: boolean;
  preload?: "none" | "metadata" | "auto";
  visualizerType?: "bars" | "wave" | "circular" | "none";
  onTimeUpdate?: (currentTime: number) => void;
  onEnded?: () => void;
  onError?: (error: string) => void;
  playlist?: MediaFile[];
  "data-testid"?: string; // Add data-testid to props
}

interface WaveformProps {
  audioData: number[];
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

interface AudioVisualizerProps {
  type: "bars" | "wave" | "circular";
  audioContext?: AudioContext;
  analyzer?: AnalyserNode;
  isPlaying: boolean;
}

const formatTime = (seconds: number): string => {
  if (isNaN(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
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

const audioButtonStyle: React.CSSProperties = {
  ...createGlassStyle({
    intent: "neutral",
    elevation: "level4",
    interactive: true,
  }),
  appearance: "none",
  WebkitAppearance: "none",
  border: "1px solid rgba(148, 163, 184, 0.38)",
  color: "#f8fafc",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.12), 0 12px 28px rgba(2,6,23,0.24)",
};

const audioPrimaryButtonStyle: React.CSSProperties = {
  ...createGlassStyle({
    intent: "primary",
    elevation: "level4",
    interactive: true,
  }),
  appearance: "none",
  WebkitAppearance: "none",
  color: "#f8fafc",
  borderColor: "rgba(191, 219, 254, 0.7)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.12), 0 12px 28px rgba(2,6,23,0.24)",
};

const audioRangeStyle: React.CSSProperties = {
  appearance: "none",
  WebkitAppearance: "none",
  color: "#0ea5e9",
  accentColor: "#0ea5e9",
};

const audioComponentStyles = `
  .ag-advanced-audio-player,
  .ag-advanced-audio-player * {
    box-sizing: border-box;
  }

  .ag-advanced-audio-player .ag-audio-layout {
    display: flex;
    flex-wrap: wrap;
    min-width: 0;
  }

  .ag-advanced-audio-player .ag-audio-main {
    flex: 1 1 26rem;
    min-width: min(100%, 20rem);
  }

  .ag-advanced-audio-player .ag-audio-side-panels {
    display: flex;
    flex: 1 1 24rem;
    min-width: min(100%, 20rem);
    max-width: 44rem;
    border-left: 1px solid rgba(15, 23, 42, 0.12);
  }

  .ag-advanced-audio-player .ag-audio-side-panel {
    flex: 1 1 20rem;
    min-width: min(100%, 18rem);
    height: 24rem;
    max-height: 24rem;
    overflow: hidden;
  }

  .ag-advanced-audio-player .ag-audio-side-panel + .ag-audio-side-panel {
    border-left: 1px solid rgba(15, 23, 42, 0.12);
  }

  .ag-advanced-audio-player .ag-audio-panel-content {
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.82), rgba(248, 250, 252, 0.68));
    color: #0f172a;
  }

  .ag-advanced-audio-player .ag-audio-panel-scroll {
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding-right: 2px;
  }

  @media (max-width: 920px) {
    .ag-advanced-audio-player .ag-audio-side-panels {
      width: 100%;
      max-width: none;
      border-left: 0;
      border-top: 1px solid rgba(15, 23, 42, 0.12);
    }
  }

  @media (max-width: 640px) {
    .ag-advanced-audio-player .ag-audio-side-panels {
      flex-direction: column;
    }

    .ag-advanced-audio-player .ag-audio-side-panel {
      width: 100%;
      max-height: 20rem;
    }
  }
`;

const fallbackCover =
  "data:image/svg+xml," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 720">
      <defs>
        <linearGradient id="cover" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#0f172a"/>
          <stop offset="0.5" stop-color="#7c3aed"/>
          <stop offset="1" stop-color="#0f766e"/>
        </linearGradient>
      </defs>
      <rect width="720" height="720" fill="url(#cover)"/>
      <circle cx="360" cy="360" r="170" fill="rgba(255,255,255,0.16)"/>
      <circle cx="360" cy="360" r="58" fill="rgba(255,255,255,0.88)"/>
      <rect x="112" y="108" width="408" height="74" rx="22" fill="rgba(255,255,255,0.18)"/>
      <text x="142" y="158" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="700" fill="#ffffff">AuraGlass Audio</text>
      <rect x="116" y="572" width="488" height="12" rx="6" fill="rgba(255,255,255,0.24)"/>
      <rect x="116" y="572" width="228" height="12" rx="6" fill="#ffffff"/>
    </svg>
  `);

const Waveform: React.FC<WaveformProps> = ({
  audioData,
  currentTime,
  duration,
  onSeek,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverTime, setHoverTime] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !audioData.length) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // Draw waveform
    const barWidth = width / audioData.length;
    const progress = currentTime / duration;

    audioData.forEach((amplitude, index) => {
      const barHeight = amplitude * height * 0.8;
      const x = index * barWidth;
      const y = (height - barHeight) / 2;

      // Color based on progress
      const isPlayed = index / audioData.length < progress;
      ctx.fillStyle = isPlayed
        ? "var(--glass-color-primary)"
        : "var(--glass-gray-200)";
      ctx.fillRect(x, y, barWidth - 1, barHeight);
    });

    // Progress indicator
    const progressX = progress * width;
    ctx.strokeStyle = "#1d4ed8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(progressX, 0);
    ctx.lineTo(progressX, height);
    ctx.stroke();

    // Hover indicator
    if (isHovering) {
      const hoverX = (hoverTime / duration) * width;
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(hoverX, 0);
      ctx.lineTo(hoverX, height);
      ctx.stroke();
    }
  }, [audioData, currentTime, duration, isHovering, hoverTime]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const time = percentage * duration;

    setHoverTime(time);
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const time = percentage * duration;

    onSeek(time);
  };

  return (
    <div data-glass-component className="glass-relative">
      <canvas
        ref={canvasRef}
        width={400}
        height={80}
        className="glass-w-full glass-h-20 glass-cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={handleClick}
      />
      {isHovering && (
        <div
          className="glass-absolute glass-bottom-24 glass-surface-overlay glass-text-primary glass-text-xs glass-px-2 glass-py-1 glass-radius glass-pointer-events-none"
          style={{
            left: `${(hoverTime / duration) * 100}%`,
            transform: "translateX(-50%)",
          }}
        >
          {formatTime(hoverTime)}
        </div>
      )}
    </div>
  );
};

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  type,
  audioContext,
  analyzer,
  isPlaying,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const getIdleData = useCallback(() => {
    const data = new Uint8Array(64);
    for (let index = 0; index < data.length; index++) {
      const wave = Math.sin(index * 0.42) * 34;
      const pulse = Math.cos(index * 0.17) * 22;
      data[index] = Math.max(20, Math.min(160, 84 + wave + pulse));
    }
    return data;
  }, []);

  const drawBars = useCallback(
    (ctx: CanvasRenderingContext2D, dataArray: Uint8Array) => {
      const { width, height } = ctx.canvas;
      ctx.clearRect(0, 0, width, height);

      const barWidth = (width / dataArray.length) * 2.5;
      let x = 0;

      for (let i = 0; i < dataArray.length; i++) {
        const barHeight = (dataArray[i] / 255) * height;

        const r = barHeight + 25 * (i / dataArray.length);
        const g = 250 * (i / dataArray.length);
        const b = 50;

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    },
    []
  );

  const drawWave = useCallback(
    (ctx: CanvasRenderingContext2D, dataArray: Uint8Array) => {
      const { width, height } = ctx.canvas;
      ctx.clearRect(0, 0, width, height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = "var(--glass-color-primary)";
      ctx.beginPath();

      const sliceWidth = width / dataArray.length;
      let x = 0;

      for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(width, height / 2);
      ctx.stroke();
    },
    []
  );

  const drawCircular = useCallback(
    (ctx: CanvasRenderingContext2D, dataArray: Uint8Array) => {
      const { width, height } = ctx.canvas;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 4;

      ctx.strokeStyle = "var(--glass-color-primary)";
      ctx.lineWidth = 2;

      for (let i = 0; i < dataArray.length; i++) {
        const angle = (i / dataArray.length) * 2 * Math.PI;
        const amplitude = (dataArray[i] / 255) * radius;

        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + amplitude);
        const y2 = centerY + Math.sin(angle) * (radius + amplitude);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    },
    []
  );

  const animate = useCallback(() => {
    if (!analyzer || !isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dataArray = new Uint8Array(analyzer.frequencyBinCount);
    analyzer.getByteFrequencyData(dataArray);

    switch (type) {
      case "bars":
        drawBars(ctx, dataArray);
        break;
      case "wave":
        drawWave(ctx, dataArray);
        break;
      case "circular":
        drawCircular(ctx, dataArray);
        break;
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [analyzer, isPlaying, type, drawBars, drawWave, drawCircular]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (ctx && (!isPlaying || !analyzer)) {
      const idleData = getIdleData();
      switch (type) {
        case "bars":
          drawBars(ctx, idleData);
          break;
        case "wave":
          drawWave(ctx, idleData);
          break;
        case "circular":
          drawCircular(ctx, idleData);
          break;
      }
    }

    if (isPlaying) {
      animate();
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [
    isPlaying,
    analyzer,
    animate,
    drawBars,
    drawWave,
    drawCircular,
    getIdleData,
    type,
  ]);

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={100}
      className="glass-w-full glass-h-24"
    />
  );
};

const PlaylistPanel: React.FC<{
  playlist: MediaFile[];
  currentMediaId: string;
  onMediaSelect: (media: MediaFile) => void;
}> = ({ playlist, currentMediaId, onMediaSelect }) => {
  return (
    <div className="ag-audio-panel-content glass-surface-subtle glass-p-4">
      <h3 className="glass-font-semibold glass-text-secondary glass-mb-3">
        Playlist
      </h3>
      <div className="ag-audio-panel-scroll glass-space-y-2">
        {playlist.map((media, index) => (
          <button
            key={media.id}
            onClick={() => onMediaSelect(media)}
            className="glass-flex glass-items-center glass-gap-3 glass-w-full glass-p-3 glass-radius-lg glass-text-left glass-transition-colors glass-focus glass-touch-target glass-contrast-guard"
            style={{
              background:
                media.id === currentMediaId
                  ? "rgba(219, 234, 254, 0.9)"
                  : "rgba(255, 255, 255, 0.74)",
              border: "1px solid rgba(15, 23, 42, 0.12)",
              color: "#0f172a",
              minHeight: 84,
            }}
          >
            <div className="glass-text-lg">{index + 1}</div>
            <div className="glass-flex-1 glass-min-w-0">
              <div className="glass-font-medium glass-text-secondary glass-truncate">
                {media.title || `Track ${index + 1}`}
              </div>
              {media.description && (
                <div className="glass-text-sm glass-text-secondary glass-truncate">
                  {media.description}
                </div>
              )}
              <div className="glass-text-xs glass-text-secondary">
                {media.duration ? formatTime(media.duration) : "--:--"}
              </div>
            </div>
            {media.id === currentMediaId && (
              <div className="glass-text-primary">▶</div>
            )}
          </button>
        ))}
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
          className="glass-surface-subtle glass-radius glass-px-1"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="ag-audio-panel-content glass-surface-subtle glass-p-4 glass-h-full glass-flex glass-flex-col">
      <div className="glass-flex glass-items-center glass-justify-between glass-mb-4">
        <h3 className="glass-font-semibold glass-text-secondary">Transcript</h3>
        <div className="glass-text-sm glass-text-secondary">
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
          className="glass-w-full glass-px-3 glass-py-2 glass-border glass-border-subtle glass-radius-lg glass-focus-outline-none glass-focus-ring-2 glass-focus-ring-blue-500 glass-focus glass-touch-target glass-contrast-guard"
        />
        {searchQuery && (
          <div className="glass-text-sm glass-text-secondary glass-mt-2">
            {highlightedResults.length} results found
          </div>
        )}
      </div>

      {/* Transcript Entries */}
      <div className="ag-audio-panel-scroll glass-flex-1 glass-space-y-2">
        {(searchQuery ? highlightedResults : transcript).map((entry: any) => {
          const isActive =
            currentTime >= entry.startTime && currentTime <= entry.endTime;

          return (
            <button
              key={entry.id}
              onClick={() => onTranscriptClick(entry)}
              className="glass-flex glass-flex-col glass-items-start glass-gap-2 glass-w-full glass-p-3 glass-radius-lg glass-text-left glass-transition-colors glass-focus glass-touch-target glass-contrast-guard"
              style={{
                background: isActive
                  ? "rgba(219, 234, 254, 0.9)"
                  : "rgba(255, 255, 255, 0.74)",
                border: "1px solid rgba(15, 23, 42, 0.12)",
                color: "#0f172a",
              }}
            >
              <div className="glass-flex glass-items-center glass-justify-between glass-w-full">
                <span className="glass-text-xs glass-text-secondary glass-font-mono">
                  {formatTime(entry.startTime)}
                </span>
                {entry.speaker && (
                  <span className="glass-text-xs glass-surface-subtle glass-text-secondary glass-px-2 glass-py-1 glass-radius">
                    {entry.speaker}
                  </span>
                )}
              </div>

              <div className="glass-text-sm glass-text-secondary glass-leading-relaxed">
                {searchQuery
                  ? highlightText(entry.text, searchQuery)
                  : entry.text}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const GlassAdvancedAudioPlayer: React.FC<AdvancedAudioPlayerProps> = (
  props
) => {
  const {
    mediaFile,
    className,
    variant = "full",
    compact = false,
    contained = false,
    maxHeight,
    showTranscript = false,
    showPlaylist = false,
    showWaveform = false,
    showLyrics = false,
    autoplay = false,
    loop = false,
    preload = "metadata",
    visualizerType = "bars",
    onTimeUpdate,
    onEnded,
    onError,
    playlist = [],
  } = props;
  const {
    playbackState,
    setPlaybackState,
    play,
    pause,
    seekTo,
    setVolume,
    setPlaybackRate,
    toggleMute,
    transcripts,
    generateTranscript,
    trackView,
  } = useMedia();

  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext>();
  const analyzerRef = useRef<AnalyserNode>();

  const [transcriptSearch, setTranscriptSearch] = useState("");
  const [hasTranscript, setHasTranscript] = useState(false);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);
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
  const isMuted = playbackState?.isMuted || false;
  const coverSrc = mediaFile.thumbnail || mediaFile.poster || fallbackCover;
  const playbackSpeeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const resolvedVariant = compact ? "compact" : variant;
  const resolvedMaxHeight =
    typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;

  // Lazily create audio context when user initiates playback
  const ensureAudioContext = useCallback(() => {
    if (
      visualizerType === "none" ||
      !audioRef.current ||
      audioContextRef.current
    )
      return;
    try {
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      analyzerRef.current = audioContextRef.current.createAnalyser();
      analyzerRef.current.fftSize = 256;
      const source = audioContextRef.current.createMediaElementSource(
        audioRef.current
      );
      source.connect(analyzerRef.current);
      analyzerRef.current.connect(audioContextRef.current.destination);
    } catch {
      // Visualization is optional when the browser blocks audio analysis.
    }
  }, [visualizerType]);
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

  // Generate mock waveform data
  useEffect(() => {
    if (showWaveform) {
      const mockData = Array.from(
        { length: 100 },
        (_, index) =>
          0.22 +
          Math.abs(Math.sin(index * 0.29)) * 0.42 +
          Math.abs(Math.cos(index * 0.11)) * 0.18
      );
      setWaveformData(mockData);
    }
  }, [showWaveform]);

  // Audio event handlers
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;

      if (playbackState && playbackState.mediaId === mediaFile.id) {
        setPlaybackState({ ...playbackState, currentTime });
      }

      onTimeUpdate?.(currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const duration = audioRef.current.duration;
      if (playbackState && playbackState.mediaId === mediaFile.id) {
        setPlaybackState({ ...playbackState, duration, isLoading: false });
      }
    }
  };

  const handleEnded = () => {
    if (playlist.length > 0 && currentPlaylistIndex < playlist.length - 1) {
      // Auto-play next track
      const nextIndex = currentPlaylistIndex + 1;
      setCurrentPlaylistIndex(nextIndex);
      handleMediaSelect(playlist[nextIndex]);
    } else {
      if (playbackState && playbackState.mediaId === mediaFile.id) {
        setPlaybackState({
          ...playbackState,
          isPlaying: false,
          currentTime: 0,
        });
      }

      trackView(mediaFile.id, duration);
      onEnded?.();
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      play(mediaFile.id);
      // Create AudioContext and wiring as part of user gesture
      ensureAudioContext();
      if (audioRef.current) {
        audioRef.current.play();
      }
    }
  };

  const handleSeek = (time: number) => {
    seekTo(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const handleMuteToggle = () => {
    toggleMute();
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const handleMediaSelect = (media: MediaFile) => {
    play(media.id);
    const index = playlist.findIndex((item) => item.id === media.id);
    if (index !== -1) {
      setCurrentPlaylistIndex(index);
    }
  };

  const handleTranscriptClick = (entry: TranscriptEntry) => {
    handleSeek(entry.startTime);
  };

  const handleSpeedCycle = () => {
    const currentIndex = playbackSpeeds.indexOf(playbackRate);
    const nextSpeed =
      playbackSpeeds[(currentIndex + 1) % playbackSpeeds.length];
    handlePlaybackRateChange(nextSpeed);
  };

  const renderCompactPlayer = () => (
    <div
      className="glass-flex glass-items-center glass-gap-4 glass-p-4"
      style={{ color: "#0f172a", minHeight: 96 }}
    >
      <img
        src={coverSrc}
        alt=""
        className="glass-w-16 glass-h-16 glass-object-cover glass-radius-lg"
        style={{ flex: "0 0 auto", boxShadow: "0 10px 24px rgba(2,6,23,0.16)" }}
      />
      <button
        onClick={handlePlayPause}
        className="glass-w-12 glass-h-12 glass-flex glass-items-center glass-justify-center glass-surface-primary glass-text-primary glass-radius-full glass-transition-colors glass-focus glass-touch-target glass-contrast-guard"
        style={audioPrimaryButtonStyle}
        aria-label={isPlaying ? "Pause audio" : "Play audio"}
      >
        {isPlaying ? "⏸️" : "▶️"}
      </button>

      <div className="glass-flex-1">
        <div className="glass-font-medium glass-text-secondary glass-truncate">
          {mediaFile.title || "Untitled Track"}
        </div>
        <div className="glass-text-sm glass-text-secondary glass-truncate">
          {mediaFile.description || "No description"}
        </div>
      </div>

      <div
        className="glass-text-sm glass-text-secondary glass-font-mono"
        style={{
          ...createGlassStyle({ intent: "neutral", elevation: "level1" }),
          color: "#0f172a",
          border: "1px solid rgba(148,163,184,0.34)",
          borderRadius: 999,
          padding: "8px 12px",
          whiteSpace: "nowrap",
        }}
      >
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  );

  const renderFullPlayer = () => (
    <div className="glass-p-6 glass-space-y-6" style={{ color: "#0f172a" }}>
      {/* Header */}
      <div
        className="glass-flex glass-items-center glass-gap-4"
        style={{ alignItems: "center" }}
      >
        <img
          src={coverSrc}
          alt=""
          className="glass-w-24 glass-h-24 glass-object-cover glass-radius-lg"
          style={{
            flex: "0 0 auto",
            border: "1px solid rgba(148,163,184,0.34)",
            boxShadow: "0 16px 34px rgba(2,6,23,0.18)",
          }}
        />
        <div>
          <h2 className="glass-text-xl glass-font-semibold glass-text-secondary">
            {mediaFile.title || "Untitled Track"}
          </h2>
          {mediaFile.description && (
            <p className="glass-text-secondary glass-mt-1">
              {mediaFile.description}
            </p>
          )}
        </div>
      </div>

      {/* Waveform or Visualizer */}
      {showWaveform ? (
        <Waveform
          audioData={waveformData}
          currentTime={currentTime}
          duration={duration}
          onSeek={handleSeek}
        />
      ) : (
        visualizerType !== "none" && (
          <AudioVisualizer
            type={visualizerType}
            audioContext={audioContextRef.current}
            analyzer={analyzerRef.current}
            isPlaying={isPlaying}
          />
        )
      )}

      {/* Progress Bar */}
      <div className="glass-space-y-2">
        <div className="glass-flex glass-justify-between glass-text-sm glass-text-secondary glass-font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div
          className="glass-w-full glass-h-2 glass-surface-subtle glass-radius-full glass-cursor-pointer"
          style={createGlassStyle({ intent: "neutral", elevation: "level1" })}
          onClick={(event) => {
            if (duration <= 0) return;
            const rect = event.currentTarget.getBoundingClientRect();
            handleSeek(((event.clientX - rect.left) / rect.width) * duration);
          }}
        >
          <div
            className="glass-h-full glass-surface-primary glass-radius-full"
            style={{
              width: `${clampPercent(currentTime, duration)}%`,
            }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="glass-flex glass-items-center glass-justify-center glass-gap-6">
        <button
          onClick={() => handleSeek(Math.max(0, currentTime - 10))}
          className="glass-w-10 glass-h-10 glass-flex glass-items-center glass-justify-center hover:glass-surface-subtle glass-radius-full glass-transition-colors glass-focus glass-touch-target glass-contrast-guard"
          style={audioButtonStyle}
          aria-label="Rewind 10 seconds"
        >
          ⏪
        </button>

        <button
          onClick={handlePlayPause}
          className="glass-w-16 glass-h-16 glass-flex glass-items-center glass-justify-center glass-surface-primary glass-text-primary glass-radius-full glass-transition-colors glass-text-xl glass-focus glass-touch-target glass-contrast-guard"
          style={audioPrimaryButtonStyle}
          aria-label={isPlaying ? "Pause audio" : "Play audio"}
        >
          {isPlaying ? "⏸️" : "▶️"}
        </button>

        <button
          onClick={() => handleSeek(Math.min(duration, currentTime + 10))}
          className="glass-w-10 glass-h-10 glass-flex glass-items-center glass-justify-center hover:glass-surface-subtle glass-radius-full glass-transition-colors glass-focus glass-touch-target glass-contrast-guard"
          style={audioButtonStyle}
          aria-label="Forward 10 seconds"
        >
          ⏩
        </button>
      </div>

      {/* Volume and Speed */}
      <div
        className="glass-flex glass-items-center glass-justify-between"
        style={{ gap: 16, flexWrap: "wrap" }}
      >
        <div className="glass-flex glass-items-center glass-gap-3">
          <button
            onClick={handleMuteToggle}
            className="glass-w-8 glass-h-8 glass-flex glass-items-center glass-justify-center hover:glass-surface-subtle glass-radius glass-transition-colors glass-focus glass-touch-target glass-contrast-guard"
            style={audioButtonStyle}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? "🔇" : "🔊"}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            className="glass-w-20 glass-focus glass-touch-target glass-contrast-guard"
            style={audioRangeStyle}
            aria-label="Volume"
          />
        </div>

        <div className="glass-flex glass-items-center glass-gap-3">
          <span className="glass-text-sm glass-text-secondary">Speed:</span>
          <button
            type="button"
            onClick={handleSpeedCycle}
            className="glass-text-sm glass-border glass-border-subtle glass-radius glass-px-3 glass-py-2 glass-focus glass-touch-target glass-contrast-guard"
            style={audioButtonStyle}
            aria-label={`Playback speed: ${playbackRate}x`}
          >
            {playbackRate}x
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <Glass
      className={cn(
        "ag-advanced-audio-player glass-overflow-hidden",
        className
      )}
      data-testid={props["data-testid"]}
      style={{
        ...createGlassStyle({ intent: "neutral", elevation: "level2" }),
        color: "#0f172a",
        border: "1px solid rgba(148, 163, 184, 0.28)",
        boxShadow: "0 24px 70px rgba(15, 23, 42, 0.18)",
        maxHeight:
          resolvedMaxHeight ?? (compact || contained ? "220px" : undefined),
        overflow:
          compact || contained || resolvedMaxHeight ? "auto" : undefined,
      }}
    >
      <style>{audioComponentStyles}</style>
      <div className="ag-audio-layout glass-flex">
        {/* Main Player */}
        <div className="ag-audio-main glass-flex-1">
          <audio
            ref={audioRef}
            src={mediaFile.src}
            autoPlay={autoplay}
            loop={loop}
            preload={preload}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
            onError={() => onError?.("Audio playback error occurred")}
          />

          {resolvedVariant === "compact"
            ? renderCompactPlayer()
            : renderFullPlayer()}
        </div>

        {/* Side Panels */}
        {(!compact && showPlaylist && playlist.length > 0) ||
        (!compact &&
          showTranscript &&
          hasTranscript &&
          visibleTranscript.length > 0) ? (
          <div className="ag-audio-side-panels glass-flex">
            {!compact && showPlaylist && playlist.length > 0 && (
              <div className="ag-audio-side-panel glass-border-l glass-border-subtle">
                <PlaylistPanel
                  playlist={playlist}
                  currentMediaId={mediaFile.id}
                  onMediaSelect={handleMediaSelect}
                />
              </div>
            )}

            {showTranscript &&
              hasTranscript &&
              visibleTranscript.length > 0 && (
                <div className="ag-audio-side-panel glass-border-l glass-border-subtle glass-overflow-hidden">
                  <TranscriptPanel
                    transcript={visibleTranscript}
                    currentTime={currentTime}
                    searchQuery={transcriptSearch}
                    onSearchChange={setTranscriptSearch}
                    onTranscriptClick={handleTranscriptClick}
                  />
                </div>
              )}
          </div>
        ) : null}
      </div>
    </Glass>
  );
};
