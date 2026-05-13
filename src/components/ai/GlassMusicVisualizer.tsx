"use client";
import React from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motion } from "framer-motion";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useMotionPreference } from "../../hooks/useMotionPreference";
import { OptimizedGlass } from "../../primitives";
import { useA11yId } from "../../utils/a11y";
import { createGlassStyle } from "../../utils/createGlassStyle";
import { useGlassSound } from "../../utils/soundDesign";
import { ANIMATION } from "../../tokens/designConstants";
import { ContrastGuard } from "../accessibility/ContrastGuard";

export interface AudioSettings {
  volume: number;
  gain: number;
  bassBoost: number;
  trebleBoost: number;
  smoothing: number;
  fftSize: number;
}

export interface VisualizationSettings {
  mode: "bars" | "wave" | "circular" | "spectrum" | "particles" | "ripples";
  colorScheme: "rainbow" | "monochrome" | "neon" | "fire" | "ice" | "galaxy";
  particleCount: number;
  sensitivity: number;
  symmetry: boolean;
  mirror: boolean;
}

export interface GlassMusicVisualizerProps {
  audioSource?: string | MediaStream;
  audioSettings?: Partial<AudioSettings>;
  visualSettings?: Partial<VisualizationSettings>;
  compact?: boolean;
  contained?: boolean;
  maxHeight?: number | string;
  showControls?: boolean;
  showFrequencyDisplay?: boolean;
  showWaveform?: boolean;
  showSpectrum?: boolean;
  showSettings?: boolean;
  realTimeAnalysis?: boolean;
  enableInteraction?: boolean;
  enableRecording?: boolean;
  canvasWidth?: number;
  canvasHeight?: number;
  onAudioLoad?: (duration: number) => void;
  onFrequencyData?: (data: Uint8Array) => void;
  onBeatDetected?: (intensity: number) => void;
  className?: string;
}

const defaultAudioSettings: AudioSettings = {
  volume: 0.8,
  gain: 1.0,
  bassBoost: 0,
  trebleBoost: 0,
  smoothing: 0.8,
  fftSize: 256,
};

const defaultVisualSettings: VisualizationSettings = {
  mode: "bars",
  colorScheme: "rainbow",
  particleCount: 100,
  sensitivity: 1.0,
  symmetry: false,
  mirror: false,
};

const colorSchemes = {
  rainbow: [
    "var(--glass-color-danger)",
    "var(--glass-color-warning)",
    "var(--glass-color-warning)",
    "var(--glass-color-success)",
    "var(--glass-color-success)",
    "var(--glass-color-info)",
    "var(--glass-color-info)",
    "var(--glass-color-primary)",
    "var(--glass-color-primary)",
    "var(--glass-color-secondary)",
  ],
  monochrome: [
    "var(--glass-white)",
    "color-mix(in srgb, var(--glass-white) 88%, black)",
    "color-mix(in srgb, var(--glass-white) 75%, black)",
    "color-mix(in srgb, var(--glass-white) 63%, black)",
    "color-mix(in srgb, var(--glass-white) 50%, black)",
    "color-mix(in srgb, var(--glass-white) 38%, black)",
    "color-mix(in srgb, var(--glass-white) 25%, black)",
    "color-mix(in srgb, var(--glass-white) 13%, black)",
  ],
  neon: [
    "#ff00ff",
    "#ff0080",
    "#ff0040",
    "#ff8040",
    "#ffff40",
    "#80ff40",
    "#40ff40",
    "#40ff80",
    "#40ffff",
    "#4080ff",
  ],
  fire: [
    "#ffff00",
    "#ffcc00",
    "#ff9900",
    "#ff6600",
    "#ff3300",
    "#ff0000",
    "#cc0000",
    "#990000",
  ],
  ice: [
    "var(--glass-white)",
    "color-mix(in srgb, var(--glass-color-info) 12%, white)",
    "color-mix(in srgb, var(--glass-color-info) 25%, white)",
    "color-mix(in srgb, var(--glass-color-info) 38%, white)",
    "color-mix(in srgb, var(--glass-color-info) 50%, white)",
    "color-mix(in srgb, var(--glass-color-info) 63%, white)",
    "color-mix(in srgb, var(--glass-color-info) 75%, white)",
    "color-mix(in srgb, var(--glass-color-info) 88%, white)",
  ],
  galaxy: [
    "#1a1a2e",
    "#16213e",
    "#0f3460",
    "#533483",
    "#7209b7",
    "#a663cc",
    "#4cc9f0",
  ],
};

const readableGlassTextStyle: React.CSSProperties = {
  "--glass-text-primary": "var(--glass-theme-text, rgba(255, 255, 255, 0.95))",
  "--typography-text-primary":
    "var(--glass-theme-text, rgba(255, 255, 255, 0.95))",
  "--glass-theme-text": "var(--glass-theme-text, rgba(255, 255, 255, 0.95))",
  color: "var(--glass-theme-text, rgba(255, 255, 255, 0.95))",
} as React.CSSProperties;

export const GlassMusicVisualizer = forwardRef<
  HTMLDivElement,
  GlassMusicVisualizerProps
>(
  (
    {
      audioSource,
      audioSettings = {},
      visualSettings = {},
      compact = false,
      contained = false,
      maxHeight,
      showControls = true,
      showFrequencyDisplay = false,
      showWaveform = true,
      showSpectrum = true,
      showSettings = false,
      realTimeAnalysis = true,
      enableInteraction = true,
      enableRecording = false,
      canvasWidth = 800,
      canvasHeight = 400,
      onAudioLoad,
      onFrequencyData,
      onBeatDetected,
      className = "",
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const [isPlaying, setIsPlaying] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [frequencyData, setFrequencyData] = useState<Uint8Array>(
      new Uint8Array(128)
    );
    const [waveformData, setWaveformData] = useState<Uint8Array>(
      new Uint8Array(128)
    );
    const [beatIntensity, setBeatIntensity] = useState(0);

    const [audioConfig, setAudioConfig] = useState<AudioSettings>({
      ...defaultAudioSettings,
      ...audioSettings,
    });

    const [visualConfig, setVisualConfig] = useState<VisualizationSettings>({
      ...defaultVisualSettings,
      ...visualSettings,
    });

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<AudioBufferSourceNode | null>(null);
    const animationFrameRef = useRef<number>();
    const particles = useRef<
      Array<{
        x: number;
        y: number;
        vx: number;
        vy: number;
        size: number;
        color: string;
        life: number;
      }>
    >([]);

    const modeSelectId = useA11yId("glass-music-mode");
    const colorSchemeSelectId = useA11yId("glass-music-color-scheme");
    const smoothingId = useA11yId("glass-music-smoothing");
    const fftSelectId = useA11yId("glass-music-fft-size");
    const volumeControlId = useA11yId("glass-music-volume");

    const id = useA11yId("glass-music-visualizer");
    const { shouldAnimate } = useMotionPreference();
    const { play } = useGlassSound();
    const boundedHeight = maxHeight ?? (compact || contained ? 240 : undefined);

    // Initialize audio context and analyser
    const initializeAudio = useCallback(async () => {
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext ||
            (window as any).webkitAudioContext)();
        }

        const context = audioContextRef.current;
        const analyser = context.createAnalyser();
        analyser.fftSize = audioConfig.fftSize;
        analyser.smoothingTimeConstant = audioConfig.smoothing;

        analyserRef.current = analyser;

        // Initialize frequency and waveform data arrays
        const bufferLength = analyser.frequencyBinCount;
        setFrequencyData(new Uint8Array(bufferLength));
        setWaveformData(new Uint8Array(bufferLength));

        // Connect audio source if provided
        if (audioSource && typeof audioSource === "string") {
          const audio = audioRef.current;
          if (audio) {
            audio.src = audioSource;
            const source = context.createMediaElementSource(audio);
            source.connect(analyser);
            analyser.connect(context.destination);
            sourceRef.current = source as any;
          }
        } else if (audioSource instanceof MediaStream) {
          const source = context.createMediaStreamSource(audioSource);
          source.connect(analyser);
          analyser.connect(context.destination);
          sourceRef.current = source as any;
        }
      } catch {
        analyserRef.current = null;
        sourceRef.current = null;
      }
    }, [audioSource, audioConfig.fftSize, audioConfig.smoothing]);

    // Beat detection algorithm
    const detectBeat = useCallback(
      (frequencyData: Uint8Array) => {
        const bassRange = Math.floor(frequencyData.length * 0.1);
        const midRange = Math.floor(frequencyData.length * 0.3);

        let bassSum = 0;
        let midSum = 0;

        for (let i = 0; i < bassRange; i++) {
          bassSum += frequencyData[i];
        }

        for (let i = bassRange; i < midRange; i++) {
          midSum += frequencyData[i];
        }

        const bassAvg = bassSum / bassRange;
        const midAvg = midSum / (midRange - bassRange);
        const intensity = (bassAvg + midAvg) / 2 / 255;

        setBeatIntensity(intensity);

        if (intensity > 0.7) {
          onBeatDetected?.(intensity);
        }

        return intensity;
      },
      [onBeatDetected]
    );

    // Visualization rendering
    const renderVisualization = useCallback(() => {
      const canvas = canvasRef.current;
      const analyser = analyserRef.current;

      if (!canvas || !analyser) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Update data arrays
      const frequencyArray = new Uint8Array(analyser.frequencyBinCount);
      const waveformArray = new Uint8Array(analyser.frequencyBinCount);

      analyser.getByteFrequencyData(frequencyArray);
      analyser.getByteTimeDomainData(waveformArray);

      setFrequencyData(frequencyArray);
      setWaveformData(waveformArray);
      onFrequencyData?.(frequencyArray);

      // Detect beats
      const beat = detectBeat(frequencyArray);

      // Clear canvas
      ctx.fillStyle =
        "rgba(var(--glass-color-black) / var(--glass-opacity-10))";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Get colors for current scheme
      const colors =
        colorSchemes[visualConfig.colorScheme] || colorSchemes.rainbow;

      switch (visualConfig.mode) {
        case "bars":
          renderBars(ctx, frequencyArray, colors, beat);
          break;
        case "wave":
          renderWave(ctx, waveformArray, colors, beat);
          break;
        case "circular":
          renderCircular(ctx, frequencyArray, colors, beat);
          break;
        case "spectrum":
          renderSpectrum(ctx, frequencyArray, colors, beat);
          break;
        case "particles":
          renderParticles(ctx, frequencyArray, colors, beat);
          break;
        case "ripples":
          renderRipples(ctx, frequencyArray, colors, beat);
          break;
      }

      if (realTimeAnalysis && isPlaying && shouldAnimate && !prefersReducedMotion) {
        animationFrameRef.current = requestAnimationFrame(renderVisualization);
      }
    }, [
      visualConfig,
      realTimeAnalysis,
      isPlaying,
      shouldAnimate,
      prefersReducedMotion,
      detectBeat,
      onFrequencyData,
    ]);

    // Visualization modes
    const renderBars = (
      ctx: CanvasRenderingContext2D,
      data: Uint8Array,
      colors: string[],
      beat: number
    ) => {
      const barWidth = ctx.canvas.width / data.length;
      const heightScale = visualConfig.sensitivity;

      for (let i = 0; i < data.length; i++) {
        const barHeight = (data[i] / 255) * ctx.canvas.height * heightScale;
        const colorIndex = Math.floor((i / data.length) * colors.length);

        // Add beat intensity to color brightness
        const alpha = Math.max(0.3, beat);
        ctx.fillStyle =
          colors[colorIndex] +
          Math.floor(alpha * 255)
            .toString(16)
            .padStart(2, "0");

        ctx.fillRect(
          i * barWidth,
          ctx.canvas.height - barHeight,
          barWidth - 1,
          barHeight
        );

        // Mirror effect
        if (visualConfig.mirror) {
          ctx.fillRect(i * barWidth, 0, barWidth - 1, barHeight);
        }
      }
    };

    const renderWave = (
      ctx: CanvasRenderingContext2D,
      data: Uint8Array,
      colors: string[],
      beat: number
    ) => {
      ctx.lineWidth = 2 + beat * 3;
      ctx.strokeStyle = colors[Math.floor(beat * colors.length)];

      ctx.beginPath();
      const sliceWidth = ctx.canvas.width / data.length;
      let x = 0;

      for (let i = 0; i < data.length; i++) {
        const v = (data[i] / 128.0) * visualConfig.sensitivity;
        const y = (v * ctx.canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.stroke();
    };

    const renderCircular = (
      ctx: CanvasRenderingContext2D,
      data: Uint8Array,
      colors: string[],
      beat: number
    ) => {
      const centerX = ctx.canvas.width / 2;
      const centerY = ctx.canvas.height / 2;
      const radius = Math.min(centerX, centerY) * 0.7;

      for (let i = 0; i < data.length; i++) {
        const angle = (i / data.length) * Math.PI * 2;
        const amplitude =
          (data[i] / 255) * radius * visualConfig.sensitivity * 0.5;

        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + amplitude);
        const y2 = centerY + Math.sin(angle) * (radius + amplitude);

        const colorIndex = Math.floor((i / data.length) * colors.length);
        ctx.strokeStyle = colors[colorIndex];
        ctx.lineWidth = 1 + beat * 2;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    };

    const renderSpectrum = (
      ctx: CanvasRenderingContext2D,
      data: Uint8Array,
      colors: string[],
      beat: number
    ) => {
      const { width, height } = ctx.canvas;

      // Shift existing data left without reading pixels back from the GPU.
      ctx.drawImage(
        ctx.canvas,
        1,
        0,
        width - 1,
        height,
        0,
        0,
        width - 1,
        height
      );
      ctx.clearRect(width - 1, 0, 1, height);

      // Add new column
      const x = width - 1;
      for (let i = 0; i < data.length; i++) {
        const y = Math.floor((i / data.length) * height);
        const intensity = data[i] / 255;
        const colorIndex = Math.floor(intensity * colors.length);
        const color = colors[colorIndex] || "#ffffff";

        ctx.fillStyle = color.startsWith("#")
          ? `${color}${Math.round(intensity * 255)
              .toString(16)
              .padStart(2, "0")}`
          : color;
        ctx.fillRect(x, y, 1, Math.max(1, Math.ceil(height / data.length)));
      }
    };

    const renderParticles = (
      ctx: CanvasRenderingContext2D,
      data: Uint8Array,
      colors: string[],
      beat: number
    ) => {
      // Update existing particles
      particles.current = particles.current.filter((particle: any) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.01;
        particle.vy += 0.1; // gravity

        return (
          particle.life > 0 &&
          particle.x >= 0 &&
          particle.x <= ctx.canvas.width &&
          particle.y >= 0 &&
          particle.y <= ctx.canvas.height
        );
      });

      // Create new particles based on frequency data
      for (let i = 0; i < data.length; i += 4) {
        if (particles.current.length < visualConfig.particleCount) {
          const intensity = data[i] / 255;
          if (intensity > 0.1) {
            particles.current.push({
              x: (i / data.length) * ctx.canvas.width,
              y: ctx.canvas.height - intensity * ctx.canvas.height * 0.5,
              vx: (Math.random() - 0.5) * 4,
              vy: -Math.random() * intensity * 5,
              size: intensity * 5 + 1,
              color: colors[Math.floor(intensity * colors.length)],
              life: 1.0,
            });
          }
        }
      }

      // Render particles
      particles.current.forEach((particle: any) => {
        ctx.save();
        ctx.globalAlpha = particle.life;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    };

    const renderRipples = (
      ctx: CanvasRenderingContext2D,
      data: Uint8Array,
      colors: string[],
      beat: number
    ) => {
      const centerX = ctx.canvas.width / 2;
      const centerY = ctx.canvas.height / 2;

      // Calculate average intensity
      const avgIntensity =
        data.reduce((sum, val) => sum + val, 0) / data.length / 255;

      // Draw ripples based on beat intensity
      if (beat > 0.3) {
        const rippleCount = 5;
        for (let i = 0; i < rippleCount; i++) {
          const radius = beat * 200 + i * 50;
          const alpha = Math.max(0, 1 - radius / 300);

          ctx.strokeStyle =
            colors[i % colors.length] +
            Math.floor(alpha * 255)
              .toString(16)
              .padStart(2, "0");
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Add frequency-based elements
      for (let i = 0; i < data.length; i += 8) {
        const angle = (i / data.length) * Math.PI * 2;
        const intensity = data[i] / 255;
        const radius = intensity * 100 + 50;

        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        ctx.fillStyle = colors[Math.floor(intensity * colors.length)];
        ctx.beginPath();
        ctx.arc(x, y, intensity * 5 + 1, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // Audio controls
    const handlePlay = useCallback(async () => {
      if (!audioContextRef.current) {
        await initializeAudio();
      }

      if (audioRef.current) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          if (shouldAnimate && !prefersReducedMotion) {
            renderVisualization();
          }
          play("play");
        } catch {
          setIsPlaying(false);
        }
      }
    }, [initializeAudio, renderVisualization, play, shouldAnimate, prefersReducedMotion]);

    const handlePause = useCallback(() => {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        play("pause");
      }
    }, [play]);

    const handleStop = useCallback(() => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
        setCurrentTime(0);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        play("stop");
      }
    }, [play]);

    // Initialize on mount
    useEffect(() => {
      if (audioSource) {
        initializeAudio();
      }

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
      };
    }, [audioSource, initializeAudio]);

    // Update canvas size
    useEffect(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
      }
    }, [canvasWidth, canvasHeight]);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas || analyserRef.current) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { width, height } = canvas;
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "rgba(56, 189, 248, 0.16)");
      gradient.addColorStop(0.48, "rgba(168, 85, 247, 0.16)");
      gradient.addColorStop(1, "rgba(244, 63, 94, 0.18)");
      ctx.fillStyle = "rgba(8, 13, 28, 0.86)";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const colors =
        colorSchemes[visualConfig.colorScheme] || colorSchemes.rainbow;
      const barCount = compact ? 32 : 56;
      const gap = compact ? 3 : 4;
      const barWidth = Math.max(3, (width - gap * (barCount - 1)) / barCount);

      for (let index = 0; index < barCount; index += 1) {
        const t = index / Math.max(1, barCount - 1);
        const wave =
          0.25 +
          Math.abs(Math.sin(t * Math.PI * 3.2)) * 0.48 +
          Math.abs(Math.cos(t * Math.PI * 8.4)) * 0.16;
        const barHeight = Math.min(height * 0.82, height * wave);
        const x = index * (barWidth + gap);
        const y = height - barHeight - height * 0.08;
        ctx.fillStyle = colors[index % colors.length];
        ctx.globalAlpha = 0.74;
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      ctx.globalAlpha = 1;
      ctx.strokeStyle = "rgba(255,255,255,0.14)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height * 0.5);
      for (let x = 0; x <= width; x += 8) {
        const y =
          height * 0.5 +
          Math.sin((x / width) * Math.PI * 4) * (compact ? 10 : 18);
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }, [canvasWidth, canvasHeight, compact, visualConfig.colorScheme]);

    const Controls = () => (
      <div
        className={cn(
          "glass-flex glass-items-center glass-gap-2",
          compact ? "glass-flex-wrap" : "glass-space-x-4"
        )}
      >
        <motion.button
          className={cn(
            "glass-surface-blue hover:glass-surface-blue glass-text-primary glass-radius-lg glass-transition-colors",
            compact ? "glass-p-1.5 glass-text-xs" : "glass-p-2"
          )}
          whileHover={shouldAnimate ? { scale: 1.1 } : {}}
          whileTap={shouldAnimate ? { scale: 0.9 } : {}}
          onClick={isPlaying ? handlePause : handlePlay}
        >
          {isPlaying ? "⏸️" : "▶️"}
        </motion.button>

        <motion.button
          className={cn(
            "glass-surface-primary hover:glass-surface-primary glass-text-primary glass-radius-lg glass-transition-colors",
            compact ? "glass-p-1.5 glass-text-xs" : "glass-p-2"
          )}
          whileHover={shouldAnimate ? { scale: 1.1 } : {}}
          whileTap={shouldAnimate ? { scale: 0.9 } : {}}
          onClick={handleStop}
        >
          ⏹️
        </motion.button>

        <div className="glass-flex glass-items-center glass-gap-1">
          <span className="glass-text-xs glass-text-primary-glass-opacity-60">
            {Math.floor(currentTime / 60)}:
            {Math.floor(currentTime % 60)
              .toString()
              .padStart(2, "0")}
          </span>
          <span className="glass-text-primary-glass-opacity-40">/</span>
          <span className="glass-text-xs glass-text-primary-glass-opacity-60">
            {Math.floor(duration / 60)}:
            {Math.floor(duration % 60)
              .toString()
              .padStart(2, "0")}
          </span>
        </div>

        <div className="glass-flex glass-items-center glass-gap-1">
          <label
            htmlFor={volumeControlId}
            className="glass-text-xs glass-text-primary-glass-opacity-80"
          >
            {compact ? "Vol" : "Volume:"}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={audioConfig.volume}
            onChange={(e) => {
              const volume = parseFloat(e.target.value);
              setAudioConfig((prev: any) => ({ ...prev, volume }));
              if (audioRef.current) {
                audioRef.current.volume = volume;
              }
            }}
            className={cn(
              "glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer",
              compact ? "glass-w-12" : "glass-w-16"
            )}
            aria-label="Volume"
            id={volumeControlId}
          />
        </div>
      </div>
    );

    return (
      <OptimizedGlass
        ref={ref}
        variant="frosted"
        data-glass-component
        className={cn(
          "glass-music-visualizer glass-max-w-full glass-overflow-auto",
          compact ? "glass-p-3 glass-space-y-2" : "glass-p-4 glass-space-y-4",
          className
        )}
        style={{
          ...readableGlassTextStyle,
          maxHeight:
            boundedHeight !== undefined
              ? typeof boundedHeight === "number"
                ? `${boundedHeight}px`
                : boundedHeight
              : "100%",
          overflow: compact || contained ? "auto" : undefined,
          minWidth: 0,
        }}
        {...props}
      >
        {/* Header */}
        <div className="glass-flex glass-items-center glass-justify-between glass-gap-3">
          <div className="glass-min-w-0">
            <h3
              className={cn(
                "glass-font-semibold glass-text-primary-glass-opacity-90 glass-truncate",
                compact ? "glass-text-sm" : "glass-text-lg"
              )}
            >
              Music Visualizer
            </h3>
            <p
              className={cn(
                "glass-text-primary-glass-opacity-60 glass-truncate",
                compact ? "glass-text-xs" : "glass-text-sm"
              )}
            >
              Real-time audio visualization and analysis
            </p>
          </div>

          <div className="glass-flex glass-items-center glass-space-x-2">
            {realTimeAnalysis && (
              <div className="glass-flex glass-items-center glass-space-x-1 glass-text-primary">
                <div className="glass-w-2 glass-h-2 glass-surface-green glass-radius-full glass-animate-pulse" />
                <span className="glass-text-xs">Live</span>
              </div>
            )}
            {isRecording && (
              <div className="glass-flex glass-items-center glass-space-x-1 glass-text-primary">
                <div className="glass-w-2 glass-h-2 glass-surface-red glass-radius-full glass-animate-pulse" />
                <span className="glass-text-xs">Recording</span>
              </div>
            )}
          </div>
        </div>

        {/* Audio element */}
        {audioSource && typeof audioSource === "string" && (
          <audio
            ref={audioRef}
            src={audioSource}
            onLoadedMetadata={() => {
              if (audioRef.current) {
                setDuration(audioRef.current.duration);
                onAudioLoad?.(audioRef.current.duration);
              }
            }}
            onTimeUpdate={() => {
              if (audioRef.current) {
                setCurrentTime(audioRef.current.currentTime);
              }
            }}
          />
        )}

        {/* Controls */}
        {showControls && <Controls />}

        {/* Main visualization canvas */}
        <div className="glass-relative">
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            className={`
              glass-w-full glass-border glass-border-white/20 glass-radius-lg glass-surface-dark/20
              ${enableInteraction ? "glass-cursor-pointer" : ""}
            `}
            style={{
              height: compact ? "130px" : "clamp(120px, 26vw, 220px)",
              display: "block",
            }}
            onClick={
              enableInteraction
                ? isPlaying
                  ? handlePause
                  : handlePlay
                : undefined
            }
          />

          {/* Beat intensity indicator */}
          <div className="glass-absolute glass-top-2 glass-right-2">
            <div
              className="glass-w-4 glass-h-4 glass-radius-full glass-surface-red"
              style={{
                opacity: beatIntensity,
                transform: `scale(${1 + beatIntensity})`,
              }}
            />
          </div>
        </div>

        {/* Visualization controls */}
        {showSettings && (
          <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-4">
            <div className="glass-space-y-4">
              <h4 className="glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80">
                Visualization
              </h4>

              <div className="glass-space-y-3">
                <div>
                  <label
                    htmlFor={modeSelectId}
                    className="glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1"
                  >
                    Mode
                  </label>
                  <select
                    id={modeSelectId}
                    value={visualConfig.mode}
                    onChange={(e) =>
                      setVisualConfig((prev: any) => ({
                        ...prev,
                        mode: e.target.value as any,
                      }))
                    }
                    className="glass-w-full glass-p-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius-lg glass-text-primary-glass-opacity-90 glass-text-sm"
                    aria-label="Visualization mode"
                  >
                    <option value="bars">Frequency Bars</option>
                    <option value="wave">Waveform</option>
                    <option value="circular">Circular</option>
                    <option value="spectrum">Spectrum</option>
                    <option value="particles">Particles</option>
                    <option value="ripples">Ripples</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor={colorSchemeSelectId}
                    className="glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1"
                  >
                    Color Scheme
                  </label>
                  <select
                    id={colorSchemeSelectId}
                    value={visualConfig.colorScheme}
                    onChange={(e) =>
                      setVisualConfig((prev: any) => ({
                        ...prev,
                        colorScheme: e.target.value as any,
                      }))
                    }
                    className="glass-w-full glass-p-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius-lg glass-text-primary-glass-opacity-90 glass-text-sm"
                    aria-label="Color scheme"
                  >
                    <option value="rainbow">Rainbow</option>
                    <option value="monochrome">Monochrome</option>
                    <option value="neon">Neon</option>
                    <option value="fire">Fire</option>
                    <option value="ice">Ice</option>
                    <option value="galaxy">Galaxy</option>
                  </select>
                </div>

                <div>
                  <label className="glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1">
                    Sensitivity: {visualConfig.sensitivity.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="3.0"
                    step="0.1"
                    value={visualConfig.sensitivity}
                    onChange={(e) =>
                      setVisualConfig((prev: any) => ({
                        ...prev,
                        sensitivity: parseFloat(e.target.value),
                      }))
                    }
                    className="glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer"
                    aria-label="Sensitivity"
                  />
                </div>
              </div>
            </div>

            <div className="glass-space-y-4">
              <h4 className="glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80">
                Audio Settings
              </h4>

              <div className="glass-space-y-3">
                <div>
                  <label className="glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1">
                    Smoothing: {audioConfig.smoothing.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0.0"
                    max="1.0"
                    step="0.1"
                    value={audioConfig.smoothing}
                    onChange={(e) => {
                      const smoothing = parseFloat(e.target.value);
                      setAudioConfig((prev: any) => ({ ...prev, smoothing }));
                      if (analyserRef.current) {
                        analyserRef.current.smoothingTimeConstant = smoothing;
                      }
                    }}
                    className="glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer"
                    aria-label="Smoothing"
                  />
                </div>

                <div>
                  <label className="glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1">
                    FFT Size
                  </label>
                  <select
                    value={audioConfig.fftSize}
                    onChange={(e) =>
                      setAudioConfig((prev: any) => ({
                        ...prev,
                        fftSize: parseInt(e.target.value),
                      }))
                    }
                    className="glass-w-full glass-p-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius-lg glass-text-primary-glass-opacity-90 glass-text-sm"
                    aria-label="FFT size"
                  >
                    <option value="128">128</option>
                    <option value="256">256</option>
                    <option value="512">512</option>
                    <option value="1024">1024</option>
                    <option value="2048">2048</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Frequency display */}
        {showFrequencyDisplay && (
          <div
            className={`
            glass-p-3 glass-radius-lg glass-border glass-border-white/10
            ${createGlassStyle({ blur: "sm", opacity: 0.6 }).background}
          `}
          >
            <h4 className="glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80 glass-mb-2">
              Frequency Analysis
            </h4>
            <div className="glass-grid glass-grid-cols-4 glass-gap-4 glass-text-sm">
              <div>
                <span className="glass-text-primary-glass-opacity-60">
                  Bass:
                </span>
                <div className="glass-text-primary-glass-opacity-90 glass-font-medium">
                  {Math.round(
                    (frequencyData.slice(0, 8).reduce((a, b) => a + b, 0) /
                      8 /
                      255) *
                      100
                  )}
                  %
                </div>
              </div>
              <div>
                <span className="glass-text-primary-glass-opacity-60">
                  Mid:
                </span>
                <div className="glass-text-primary-glass-opacity-90 glass-font-medium">
                  {Math.round(
                    (frequencyData.slice(8, 32).reduce((a, b) => a + b, 0) /
                      24 /
                      255) *
                      100
                  )}
                  %
                </div>
              </div>
              <div>
                <span className="glass-text-primary-glass-opacity-60">
                  Treble:
                </span>
                <div className="glass-text-primary-glass-opacity-90 glass-font-medium">
                  {Math.round(
                    (frequencyData.slice(32).reduce((a, b) => a + b, 0) /
                      (frequencyData.length - 32) /
                      255) *
                      100
                  )}
                  %
                </div>
              </div>
              <div>
                <span className="glass-text-primary-glass-opacity-60">
                  Beat:
                </span>
                <div className="glass-text-primary-glass-opacity-90 glass-font-medium">
                  {Math.round(beatIntensity * 100)}%
                </div>
              </div>
            </div>
          </div>
        )}
      </OptimizedGlass>
    );
  }
);

GlassMusicVisualizer.displayName = "GlassMusicVisualizer";
