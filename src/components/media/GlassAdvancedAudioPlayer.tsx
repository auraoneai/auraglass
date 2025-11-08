import React, { useState, useRef, useEffect, useCallback } from "react";
import { Glass } from "../../primitives";
import { cn } from "../../lib/utilsComprehensive";
import { useMedia, MediaFile, TranscriptEntry } from "./GlassMediaProvider";

export interface AdvancedAudioPlayerProps {
  mediaFile: MediaFile;
  className?: string;
  variant?: "compact" | "full" | "podcast" | "music";
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
    <div data-glass-component className="relative">
      <canvas
        ref={canvasRef}
        width={400}
        height={80}
        className="glass-w-full h-20 cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={handleClick}
      />
      {isHovering && (
        <div
          className="absolute bottom-24 glass-surface-dark text-primary glass-text-xs glass-px-2 glass-py-1 glass-radius pointer-events-none"
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
  }, [isPlaying, animate]);

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={100}
      className="glass-w-full h-24"
    />
  );
};

const PlaylistPanel: React.FC<{
  playlist: MediaFile[];
  currentMediaId: string;
  onMediaSelect: (media: MediaFile) => void;
}> = ({ playlist, currentMediaId, onMediaSelect }) => {
  return (
    <div className="glass-surface-subtle glass-p-4 glass-radius-lg">
      <h3 className="font-semibold glass-text-secondary mb-3">Playlist</h3>
      <div className="space-y-2 glass-max-h-64 overflow-y-auto">
        {playlist.map((media, index) => (
          <button
            key={media.id}
            onClick={() => onMediaSelect(media)}
            className={cn(
              "flex items-center gap-3 w-full p-3 rounded-lg text-left transition-colors glass-focus glass-touch-target glass-contrast-guard",
              media.id === currentMediaId
                ? "bg-blue-100 border border-blue-200"
                : "bg-white hover:bg-gray-50 border border-gray-200"
            )}
          >
            <div className="glass-text-lg">{index + 1}</div>
            <div className="glass-flex-1 glass-min-w-0">
              <div className="font-medium glass-text-secondary truncate">
                {media.title || `Track ${index + 1}`}
              </div>
              {media.description && (
                <div className="glass-text-sm glass-text-secondary truncate">
                  {media.description}
                </div>
              )}
              <div className="glass-text-xs glass-text-secondary">
                {media.duration ? formatTime(media.duration) : "--:--"}
              </div>
            </div>
            {media.id === currentMediaId && (
              <div className="text-primary">▶</div>
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
    <div className="glass-surface-subtle glass-p-4 glass-radius-lg glass-h-full glass-flex glass-flex-col">
      <div className="glass-flex glass-items-center glass-justify-between mb-4">
        <h3 className="font-semibold glass-text-secondary">Transcript</h3>
        <div className="glass-text-sm glass-text-secondary">
          {transcript.length} entries
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search transcript..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="glass-w-full glass-px-3 glass-py-2 glass-border glass-border-subtle glass-radius-lg focus:outline-none focus:ring-2 focus:ring-blue-500 glass-focus glass-touch-target glass-contrast-guard"
        />
        {searchQuery && (
          <div className="glass-text-sm glass-text-secondary mt-2">
            {highlightedResults.length} results found
          </div>
        )}
      </div>

      {/* Transcript Entries */}
      <div className="glass-flex-1 overflow-y-auto space-y-2">
        {(searchQuery ? highlightedResults : transcript).map((entry: any) => {
          const isActive =
            currentTime >= entry.startTime && currentTime <= entry.endTime;

          return (
            <button
              key={entry.id}
              onClick={() => onTranscriptClick(entry)}
              className={cn(
                "flex flex-col items-start gap-2 w-full p-3 rounded-lg text-left transition-colors glass-focus glass-touch-target glass-contrast-guard",
                isActive
                  ? "bg-blue-100 border border-blue-200"
                  : "bg-white hover:bg-gray-50"
              )}
            >
              <div className="glass-flex glass-items-center glass-justify-between glass-w-full">
                <span className="glass-text-xs glass-text-secondary font-mono">
                  {formatTime(entry.startTime)}
                </span>
                {entry.speaker && (
                  <span className="glass-text-xs glass-surface-subtle glass-text-secondary glass-px-2 glass-py-1 glass-radius">
                    {entry.speaker}
                  </span>
                )}
              </div>

              <div className="glass-text-sm glass-text-secondary leading-relaxed">
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

export const GlassAdvancedAudioPlayer: React.FC<AdvancedAudioPlayerProps> = ({
  mediaFile,
  className,
  variant = "full",
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
    } catch (error) {
      console.warn("Could not initialize audio context:", error);
    }
  }, [visualizerType]);
  // Initialize transcript
  useEffect(() => {
    if (!transcripts[mediaFile.id] && showTranscript) {
      generateTranscript(mediaFile.id).then(() => {
        setHasTranscript(true);
      });
    } else if (transcripts[mediaFile.id]) {
      setHasTranscript(true);
    }
  }, [mediaFile.id, showTranscript, generateTranscript, transcripts]);

  // Generate mock waveform data
  useEffect(() => {
    if (showWaveform) {
      const mockData = Array.from(
        { length: 100 },
        () => Math.random() * 0.8 + 0.2
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

  const renderCompactPlayer = () => (
    <div className="glass-flex glass-items-center glass-gap-4 glass-p-4">
      <button
        onClick={handlePlayPause}
        className="w-12 h-12 glass-flex glass-items-center glass-justify-center glass-surface-blue hover:glass-surface-blue text-primary glass-radius-full transition-colors glass-focus glass-touch-target glass-contrast-guard"
      >
        {isPlaying ? "⏸️" : "▶️"}
      </button>

      <div className="glass-flex-1">
        <div className="font-medium glass-text-secondary truncate">
          {mediaFile.title || "Untitled Track"}
        </div>
        <div className="glass-text-sm glass-text-secondary truncate">
          {mediaFile.description || "No description"}
        </div>
      </div>

      <div className="glass-text-sm glass-text-secondary font-mono">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  );

  const renderFullPlayer = () => (
    <div className="glass-p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="glass-text-xl font-semibold glass-text-secondary">
          {mediaFile.title || "Untitled Track"}
        </h2>
        {mediaFile.description && (
          <p className="glass-text-secondary mt-1">{mediaFile.description}</p>
        )}
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
      <div className="space-y-2">
        <div className="glass-flex glass-justify-between glass-text-sm glass-text-secondary font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div className="glass-w-full h-2 glass-surface-subtle glass-radius-full cursor-pointer">
          <div
            className="glass-h-full glass-surface-blue glass-radius-full"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="glass-flex glass-items-center glass-justify-center glass-gap-6">
        <button
          onClick={() => handleSeek(Math.max(0, currentTime - 10))}
          className="w-10 h-10 glass-flex glass-items-center glass-justify-center hover:glass-surface-subtle glass-radius-full transition-colors glass-focus glass-touch-target glass-contrast-guard"
        >
          ⏪
        </button>

        <button
          onClick={handlePlayPause}
          className="w-16 h-16 glass-flex glass-items-center glass-justify-center glass-surface-blue hover:glass-surface-blue text-primary glass-radius-full transition-colors glass-text-xl glass-focus glass-touch-target glass-contrast-guard"
        >
          {isPlaying ? "⏸️" : "▶️"}
        </button>

        <button
          onClick={() => handleSeek(Math.min(duration, currentTime + 10))}
          className="w-10 h-10 glass-flex glass-items-center glass-justify-center hover:glass-surface-subtle glass-radius-full transition-colors glass-focus glass-touch-target glass-contrast-guard"
        >
          ⏩
        </button>
      </div>

      {/* Volume and Speed */}
      <div className="glass-flex glass-items-center glass-justify-between">
        <div className="glass-flex glass-items-center glass-gap-3">
          <button
            onClick={handleMuteToggle}
            className="w-8 h-8 glass-flex glass-items-center glass-justify-center hover:glass-surface-subtle glass-radius transition-colors glass-focus glass-touch-target glass-contrast-guard"
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
            className="w-20 glass-focus glass-touch-target glass-contrast-guard"
          />
        </div>

        <div className="glass-flex glass-items-center glass-gap-3">
          <span className="glass-text-sm glass-text-secondary">Speed:</span>
          <select
            value={playbackRate}
            onChange={(e) => setPlaybackRate(Number(e.target.value))}
            className="glass-text-sm glass-border glass-border-subtle glass-radius glass-px-2 glass-py-1 glass-focus glass-touch-target glass-contrast-guard"
          >
            <option value={0.5}>0.5x</option>
            <option value={0.75}>0.75x</option>
            <option value={1}>1x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <Glass className={cn("overflow-hidden", className)}>
      <div className="glass-flex">
        {/* Main Player */}
        <div className="glass-flex-1">
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

          {variant === "compact" ? renderCompactPlayer() : renderFullPlayer()}
        </div>

        {/* Side Panels */}
        <div className="glass-flex">
          {showPlaylist && playlist.length > 0 && (
            <div className="w-80 glass-border-l glass-border-subtle">
              <PlaylistPanel
                playlist={playlist}
                currentMediaId={mediaFile.id}
                onMediaSelect={handleMediaSelect}
              />
            </div>
          )}

          {showTranscript && hasTranscript && transcripts[mediaFile.id] && (
            <div className="w-96 glass-border-l glass-border-subtle h-96 overflow-hidden">
              <TranscriptPanel
                transcript={transcripts[mediaFile.id]}
                currentTime={currentTime}
                searchQuery={transcriptSearch}
                onSearchChange={setTranscriptSearch}
                onTranscriptClick={handleTranscriptClick}
              />
            </div>
          )}
        </div>
      </div>
    </Glass>
  );
};
