import React, { useState, useRef, useEffect, useCallback } from "react";
import { Glass } from "../../primitives";
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

  return (
    <div
      data-glass-component
      className="absolute bottom-0 left-0 right-0 glass-gradient-primary glass-gradient-primary via-black/40 glass-gradient-primary glass-p-4"
    >
      {/* Progress Bar */}
      <div
        className="glass-w-full h-2 glass-surface-subtle/20 glass-radius-full cursor-pointer mb-4 relative"
        onClick={handleProgressClick}
        onMouseMove={handleProgressDrag}
        onMouseDown={() => setSeeking(true)}
        onMouseUp={() => setSeeking(false)}
        onMouseLeave={() => setSeeking(false)}
      >
        {/* Buffered Progress */}
        <div
          className="absolute top-0 left-0 glass-h-full glass-surface-subtle/30 glass-radius-full"
          style={{ width: `${(buffered / duration) * 100}%` }}
        />

        {/* Played Progress */}
        <div
          className="absolute top-0 left-0 glass-h-full glass-surface-blue glass-radius-full"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />

        {/* Progress Handle */}
        <div
          className="absolute glass-top-1/2 transform -translate-y-1/2 w-4 h-4 glass-surface-blue glass-radius-full glass-border-2 glass-border-white glass-shadow-md"
          style={{ left: `calc(${(currentTime / duration) * 100}% - 8px)` }}
        />
      </div>

      <div className="glass-flex glass-items-center glass-justify-between text-primary">
        {/* Left Controls */}
        <div className="glass-flex glass-items-center glass-gap-3">
          {/* Play/Pause */}
          <button
            onClick={onPlayPause}
            className="w-12 h-12 glass-flex glass-items-center glass-justify-center glass-surface-subtle/20 hover:glass-surface-subtle/30 glass-radius-full transition-colors glass-focus glass-touch-target glass-contrast-guard"
          >
            {isPlaying ? (
              <div className="glass-flex glass-gap-1">
                <div className="w-1 h-4 glass-surface-subtle glass-radius-full" />
                <div className="w-1 h-4 glass-surface-subtle glass-radius-full" />
              </div>
            ) : (
              <div className="w-0 h-0 glass-border-l-4 glass-border-l-white glass-border-y-4 glass-border-y-transparent ml-1" />
            )}
          </button>

          {/* Volume */}
          <div
            className="relative"
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <button
              onClick={onMuteToggle}
              className="w-10 h-10 glass-flex glass-items-center glass-justify-center hover:glass-surface-subtle/20 glass-radius-full transition-colors glass-focus glass-touch-target glass-contrast-guard"
            >
              {isMuted || volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}
            </button>

            {showVolumeSlider && (
              <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 glass-surface-dark/80 glass-radius-lg glass-p-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => onVolumeChange(Number(e.target.value))}
                  className="w-16 h-1 glass-surface-subtle/20 glass-radius-full appearance-none slider-thumb-white glass-focus glass-touch-target glass-contrast-guard"
                />
              </div>
            )}
          </div>

          {/* Time Display */}
          <div className="glass-text-sm font-mono">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        {/* Right Controls */}
        <div className="glass-flex glass-items-center glass-gap-3">
          {/* Playback Speed */}
          <div className="relative">
            <button
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              className="glass-px-3 glass-py-2 glass-text-sm hover:glass-surface-subtle/20 glass-radius-md transition-colors glass-focus glass-touch-target glass-contrast-guard"
            >
              {playbackRate}x
            </button>

            {showSpeedMenu && (
              <div className="absolute bottom-12 right-0 glass-surface-dark/90 glass-radius-lg glass-p-2 glass-min-w-20">
                {playbackSpeeds.map((speed: any) => (
                  <button
                    key={speed}
                    onClick={() => {
                      onPlaybackRateChange(speed);
                      setShowSpeedMenu(false);
                    }}
                    className={cn(
                      "block w-full text-left px-3 py-2 text-sm rounded hover:bg-white/20 transition-colors glass-focus glass-touch-target glass-contrast-guard",
                      speed === playbackRate && "bg-blue-500"
                    )}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quality */}
          <div className="relative">
            <button
              onClick={() => setShowQualityMenu(!showQualityMenu)}
              className="glass-px-3 glass-py-2 glass-text-sm hover:glass-surface-subtle/20 glass-radius-md transition-colors glass-focus glass-touch-target glass-contrast-guard"
            >
              {quality}
            </button>

            {showQualityMenu && (
              <div className="absolute bottom-12 right-0 glass-surface-dark/90 glass-radius-lg glass-p-2 glass-min-w-20">
                {qualities.map((q: any) => (
                  <button
                    key={q}
                    onClick={() => {
                      onQualityChange(q);
                      setShowQualityMenu(false);
                    }}
                    className={cn(
                      "block w-full text-left px-3 py-2 text-sm rounded hover:bg-white/20 transition-colors glass-focus glass-touch-target glass-contrast-guard",
                      q === quality && "bg-blue-500"
                    )}
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
            className="w-10 h-10 glass-flex glass-items-center glass-justify-center hover:glass-surface-subtle/20 glass-radius-full transition-colors glass-focus glass-touch-target glass-contrast-guard"
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
    <div className="glass-surface-subtle text-primary glass-p-4 glass-radius-lg">
      <h3 className="glass-text-lg font-semibold mb-4">Chapters</h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {chapters.map((chapter: any) => {
          const isActive =
            currentTime >= chapter.startTime && currentTime <= chapter.endTime;

          return (
            <button
              key={chapter.id}
              onClick={() => onChapterClick(chapter)}
              className={cn(
                "flex items-center gap-3 w-full p-3 rounded-lg text-left transition-colors glass-focus glass-touch-target glass-contrast-guard",
                isActive ? "bg-blue-600" : "bg-gray-800 hover:bg-gray-700"
              )}
            >
              {chapter.thumbnail && (
                <img
                  src={chapter.thumbnail}
                  alt={chapter.title}
                  className="w-16 h-9 object-cover glass-radius"
                />
              )}
              <div className="glass-flex-1">
                <div className="font-medium">{chapter.title}</div>
                <div className="glass-text-sm glass-text-secondary">
                  {formatTime(chapter.startTime)} -{" "}
                  {formatTime(chapter.endTime)}
                </div>
                {chapter.description && (
                  <div className="glass-text-xs glass-text-secondary mt-1">
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
    <div className="glass-surface-subtle text-primary glass-p-4 glass-radius-lg glass-h-full glass-flex glass-flex-col">
      <div className="glass-flex glass-items-center glass-justify-between mb-4">
        <h3 className="glass-text-lg font-semibold">Transcript</h3>
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
          className="glass-w-full glass-px-3 glass-py-2 glass-surface-primary glass-border glass-border-gray-700 glass-radius-lg text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 glass-focus glass-touch-target glass-contrast-guard"
        />
        {searchQuery && (
          <div className="glass-text-sm glass-text-secondary mt-2">
            {highlightedResults.length} results found
          </div>
        )}
      </div>

      {/* Transcript Entries */}
      <div className="glass-flex-1 overflow-y-auto space-y-3">
        {(searchQuery ? highlightedResults : transcript).map((entry: any) => {
          const isActive =
            currentTime >= entry.startTime && currentTime <= entry.endTime;
          const confidence = entry.confidence || 0;

          return (
            <button
              key={entry.id}
              onClick={() => onTranscriptClick(entry)}
              className={cn(
                "flex flex-col items-start gap-2 w-full p-3 rounded-lg text-left transition-colors glass-focus glass-touch-target glass-contrast-guard",
                isActive ? "bg-blue-600" : "bg-gray-800 hover:bg-gray-700"
              )}
            >
              <div className="glass-flex glass-items-center glass-justify-between glass-w-full">
                <div className="glass-flex glass-items-center glass-gap-2">
                  <span className="glass-text-xs glass-text-secondary font-mono">
                    {formatTime(entry.startTime)}
                  </span>
                  {entry.speaker && (
                    <span className="glass-text-xs glass-surface-subtle text-gray-300 glass-px-2 glass-py-1 glass-radius">
                      {entry.speaker}
                    </span>
                  )}
                </div>
                <div className="glass-flex glass-items-center glass-gap-2">
                  {confidence > 0 && (
                    <div
                      className={cn(
                        "text-xs px-2 py-1 rounded",
                        confidence > 0.9
                          ? "bg-green-600"
                          : confidence > 0.7
                            ? "bg-yellow-600"
                            : "bg-red-600"
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

              <div className="glass-text-sm leading-relaxed">
                {searchQuery
                  ? highlightText(entry.text, searchQuery)
                  : entry.text}
              </div>

              {entry.keywords && entry.keywords.length > 0 && (
                <div className="glass-flex glass-flex-wrap glass-gap-1 mt-2">
                  {entry.keywords.map((keyword: any) => (
                    <span
                      key={keyword}
                      className="glass-text-xs glass-surface-subtle text-gray-300 glass-px-2 glass-py-1 glass-radius"
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
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [transcriptSearch, setTranscriptSearch] = useState("");
  const [hasTranscript, setHasTranscript] = useState(false);

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
      if (videoRef.current) {
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

  return (
    <div
      className={cn("relative bg-black rounded-lg overflow-hidden", className)}
    >
      <div
        ref={containerRef}
        className="relative glass-w-full glass-h-full glass-flex"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setShowControlsOverlay(false)}
      >
        {/* Video Container */}
        <div className="glass-flex-1 relative">
          <video
            ref={videoRef}
            src={mediaFile.src}
            poster={poster || mediaFile.poster}
            autoPlay={autoplay}
            muted={muted}
            loop={loop}
            preload={preload}
            className="glass-w-full glass-h-full object-contain"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
            onError={handleError}
            onClick={handlePlayPause}
          />

          {/* Loading Overlay */}
          {playbackState?.isLoading && (
            <div className="absolute inset-0 glass-flex glass-items-center glass-justify-center glass-surface-dark/50">
              <div className="animate-spin glass-radius-full h-16 w-16 glass-border-4 glass-border-white glass-border-t-transparent" />
            </div>
          )}

          {/* Error Overlay */}
          {playbackState?.isError && (
            <div className="absolute inset-0 glass-flex glass-items-center glass-justify-center glass-surface-dark/80 text-primary">
              <div className="text-center">
                <div className="glass-text-4xl mb-4">⚠️</div>
                <h3 className="glass-text-xl font-semibold mb-2">
                  Playback Error
                </h3>
                <p className="text-gray-300">Unable to load video content</p>
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
        <div className="glass-flex">
          {/* Chapters Panel */}
          {showChapters &&
            mediaFile.chapters &&
            mediaFile.chapters.length > 0 && (
              <Glass className="w-80 glass-h-full overflow-hidden">
                <ChapterList
                  chapters={mediaFile.chapters}
                  currentTime={currentTime}
                  onChapterClick={handleChapterClick}
                />
              </Glass>
            )}

          {/* Transcript Panel */}
          {showTranscript && hasTranscript && transcripts[mediaFile.id] && (
            <Glass className="w-96 glass-h-full overflow-hidden">
              <TranscriptPanel
                transcript={transcripts[mediaFile.id]}
                currentTime={currentTime}
                searchQuery={transcriptSearch}
                onSearchChange={setTranscriptSearch}
                onTranscriptClick={handleTranscriptClick}
              />
            </Glass>
          )}
        </div>
      </div>
    </div>
  );
};
