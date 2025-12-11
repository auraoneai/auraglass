"use client";
import { useReducedMotion } from "@/hooks/useReducedMotion";
/**
 * AuraGlass Spatial Audio System
 * 3D positioned glass sounds with Web Audio API and HRTF
 */

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  createContext,
  useContext,
  HTMLAttributes,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import { ContrastGuard } from "../accessibility/ContrastGuard";
import { ANIMATION } from "../../tokens/designConstants";

// Spatial audio types
interface SpatialPosition {
  x: number; // -1 to 1 (left to right)
  y: number; // -1 to 1 (bottom to top)
  z: number; // -1 to 1 (back to front)
}

interface AudioSource {
  id: string;
  position: SpatialPosition;
  volume: number;
  buffer: AudioBuffer | null;
  source: AudioBufferSourceNode | null;
  panner: PannerNode | null;
  gain: GainNode | null;
  isPlaying: boolean;
  loop: boolean;
  category: "ui" | "ambient" | "feedback" | "notification";
}

interface SpatialAudioSettings {
  masterVolume: number;
  enableSpatial: boolean;
  enableHRTF: boolean;
  distanceModel: "linear" | "inverse" | "exponential";
  maxDistance: number;
  rolloffFactor: number;
  doppler: boolean;
}

interface GlassSound {
  name: string;
  url: string;
  volume: number;
  category: "ui" | "ambient" | "feedback" | "notification";
  spatial: boolean;
  variations?: string[];
}

// Pre-defined glass sounds
const GLASS_SOUNDS: Record<string, GlassSound> = {
  tap: {
    name: "Glass Tap",
    url: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUaBy2I1/LNdCYCKnbK7+OUQwouetDrQVNFSYd8LE/T9YNJOgVMnN/xy2MaCUaQ2fLKdCYEKnbK7+GUQQsUXrTp66lWFApBn+TyvWUaByuI1/PNdCYCK3fK7+OUQgsuetDryVNFN45+LE/T9YVJOgVMnt/xy2IdCkaQ2fLKdCgEKnbK7+GUQQsUXrTp65ZWFApGn+TyvWUaBiuI1/PNdCgDKnfK7+OUQgouetDryVNFTYd8LE/T9YFJOgVRnt/xy2MdCkaQ2fLKdCgEKnbK7+GUQQsUXrTp66hWFApGn+TyvWUaCy2I1/PNdCcCKnfK7+OUQgsuetDryVNFSId8LE/T9YVJOgVMn9/xy2MdCkaQ2fLKdCgEKnbK7+GUQQsUXrTp66lWFApGn+TyvWUaCy2I1/PNdCcCKnfK7+OUQgsuetDryVNFT4d8LE/T9YVJOgVMnt/xy2MdCkaQ2fLKdCgEKnbK7+GUQQsUXrTp66lWFApGn+TyvWUaBy2I1/PNdCcCKnfK7+OUQgsuetDryVNFTId8LE/T9YRJOgVMn9/xy2MdCkaQ2fLKdCcEKnbK7+GUQgouetDryVNFSId8LE/T9YVJOgVMntr/uuUaBy2I1/PNdCcCKnbK7+OUQgsuetDryVNFTId8LE/T9YVJOgVMntr/xy2MdCkaQ2fLKdCgEKnbK7+GUQgouetDryVNFTId8LE/T9YVJOgVMntr/xy2MdCkaQ2fLKdCgEKnbK7+GUQgouetDryVNFTId8LE/T9YVJOgVMntr/xy2MdCkaQ2fLKdCgEKnbK7+GUQgouetDryVNFTId8",
    volume: 0.7,
    category: "ui",
    spatial: true,
    variations: ["tap1", "tap2", "tap3"],
  },
  hover: {
    name: "Glass Hover",
    url: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj",
    volume: 0.4,
    category: "ui",
    spatial: true,
  },
  slide: {
    name: "Glass Slide",
    url: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAAC",
    volume: 0.6,
    category: "ui",
    spatial: true,
  },
  break: {
    name: "Glass Break",
    url: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ",
    volume: 0.8,
    category: "feedback",
    spatial: true,
  },
  ambientGlass: {
    name: "Ambient Glass",
    url: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0",
    volume: 0.3,
    category: "ambient",
    spatial: true,
  },
  notification: {
    name: "Glass Bell",
    url: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgA",
    volume: 0.7,
    category: "notification",
    spatial: true,
  },
};

// Spatial audio engine
class SpatialAudioEngine {
  private context: AudioContext | null = null;
  private listener: AudioListener | null = null;
  private sources: Map<string, AudioSource> = new Map();
  private buffers: Map<string, AudioBuffer> = new Map();
  private settings: SpatialAudioSettings;
  private masterGain: GainNode | null = null;
  private isInitialized = false;

  constructor(settings: Partial<SpatialAudioSettings> = {}) {
    this.settings = {
      masterVolume: 0.7,
      enableSpatial: true,
      enableHRTF: true,
      distanceModel: "inverse",
      maxDistance: 10000,
      rolloffFactor: 1,
      doppler: false,
      ...settings,
    };
  }

  async initialize(): Promise<boolean> {
    try {
      // Create audio context
      this.context = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      if (!this.context) {
        throw new Error("Web Audio API not supported");
      }

      // Resume context if suspended
      if (this.context.state === "suspended") {
        await this.context.resume();
      }

      // Get listener
      this.listener = this.context.listener;

      // Create master gain
      this.masterGain = this.context.createGain();
      this.masterGain.gain.value = this.settings.masterVolume;
      this.masterGain.connect(this.context.destination);

      // Set up spatial audio if supported
      if (this.listener && this.settings.enableSpatial) {
        this.setupSpatialAudio();
      }

      // Preload glass sounds
      await this.preloadSounds();

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error("Failed to initialize spatial audio:", error);
      return false;
    }
  }

  // Public getter for context
  getContext(): AudioContext | null {
    return this.context;
  }

  // Public getter for sources
  getSources(): Map<string, AudioSource> {
    return this.sources;
  }

  private setupSpatialAudio(): void {
    if (!this.listener) return;

    // Set listener orientation (forward and up vectors)
    if (this.listener.forwardX) {
      // New Web Audio API
      this.listener.forwardX.value = 0;
      this.listener.forwardY.value = 0;
      this.listener.forwardZ.value = -1;
      this.listener.upX.value = 0;
      this.listener.upY.value = 1;
      this.listener.upZ.value = 0;
    } else {
      // Legacy Web Audio API
      (this.listener as any).setOrientation?.(0, 0, -1, 0, 1, 0);
    }

    // Set listener position
    if (this.listener.positionX) {
      this.listener.positionX.value = 0;
      this.listener.positionY.value = 0;
      this.listener.positionZ.value = 0;
    } else {
      (this.listener as any).setPosition?.(0, 0, 0);
    }
  }

  private async preloadSounds(): Promise<void> {
    const loadPromises = Object.entries(GLASS_SOUNDS).map(
      async ([key, sound]) => {
        try {
          // For demo purposes, we'll create synthetic glass sounds
          const buffer = await this.createSyntheticGlassSound(
            sound.name,
            sound.category
          );
          this.buffers.set(key, buffer);
        } catch (error) {
          console.warn(`Failed to load sound ${key}:`, error);
        }
      }
    );

    await Promise.all(loadPromises);
  }

  private async createSyntheticGlassSound(
    name: string,
    category: string
  ): Promise<AudioBuffer> {
    if (!this.context) {
      throw new Error("Audio context not initialized");
    }

    const sampleRate = this.context.sampleRate;
    const duration = category === "ambient" ? 2.0 : 0.5;
    const buffer = this.context.createBuffer(
      2,
      sampleRate * duration,
      sampleRate
    );

    // Generate glass-like sounds based on category
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel);

      for (let i = 0; i < channelData.length; i++) {
        const t = i / sampleRate;
        let sample = 0;

        switch (category) {
          case "ui":
            // Sharp, metallic sound
            sample = Math.sin(2 * Math.PI * 2000 * t) * Math.exp(-t * 8) * 0.3;
            sample +=
              Math.sin(2 * Math.PI * 3000 * t) * Math.exp(-t * 12) * 0.2;
            break;

          case "feedback":
            // Glass breaking sound
            sample = (Math.random() - 0.5) * Math.exp(-t * 3) * 0.6;
            sample += Math.sin(2 * Math.PI * 1500 * t) * Math.exp(-t * 5) * 0.4;
            break;

          case "ambient":
            // Soft, ethereal glass ambient
            sample = Math.sin(2 * Math.PI * 220 * t) * Math.sin(t * 0.5) * 0.1;
            sample +=
              Math.sin(2 * Math.PI * 440 * t) * Math.sin(t * 0.3) * 0.05;
            break;

          case "notification":
            // Bell-like glass sound
            sample = Math.sin(2 * Math.PI * 800 * t) * Math.exp(-t * 2) * 0.4;
            sample += Math.sin(2 * Math.PI * 1200 * t) * Math.exp(-t * 3) * 0.3;
            break;
        }

        channelData[i] = sample;
      }
    }

    return buffer;
  }

  createSource(
    id: string,
    soundKey: string,
    position: SpatialPosition
  ): AudioSource | null {
    if (!this.context || !this.masterGain) return null;

    const buffer = this.buffers.get(soundKey);
    const soundConfig = GLASS_SOUNDS[soundKey];

    if (!buffer || !soundConfig) return null;

    // Create audio nodes
    const source = this.context.createBufferSource();
    const gain = this.context.createGain();
    const panner = this.context.createPanner();

    // Configure buffer source
    source.buffer = buffer;
    source.loop = false;

    // Configure gain
    gain.gain.value = soundConfig.volume;

    // Configure panner for spatial audio
    if (this.settings.enableSpatial && soundConfig.spatial) {
      panner.panningModel = this.settings.enableHRTF ? "HRTF" : "equalpower";
      panner.distanceModel = this.settings.distanceModel;
      panner.maxDistance = this.settings.maxDistance;
      panner.rolloffFactor = this.settings.rolloffFactor;

      // Set position
      if (panner.positionX) {
        panner.positionX.value = position.x;
        panner.positionY.value = position.y;
        panner.positionZ.value = position.z;
      } else {
        (panner as any).setPosition?.(position.x, position.y, position.z);
      }

      // Connect: source -> gain -> panner -> master gain -> destination
      source.connect(gain);
      gain.connect(panner);
      panner.connect(this.masterGain);
    } else {
      // Non-spatial: source -> gain -> master gain -> destination
      source.connect(gain);
      gain.connect(this.masterGain);
    }

    const audioSource: AudioSource = {
      id,
      position,
      volume: soundConfig.volume,
      buffer,
      source,
      panner:
        this.settings.enableSpatial && soundConfig.spatial ? panner : null,
      gain,
      isPlaying: false,
      loop: false,
      category: soundConfig.category,
    };

    this.sources.set(id, audioSource);
    return audioSource;
  }

  playSound(
    id: string,
    soundKey: string,
    position: SpatialPosition,
    options: {
      loop?: boolean;
      volume?: number;
      delay?: number;
    } = {}
  ): void {
    if (!this.isInitialized) return;

    // Stop existing source if playing
    this.stopSound(id);

    const source = this.createSource(id, soundKey, position);
    if (!source) return;

    // Apply options
    if (options.volume !== undefined && source.gain) {
      source.gain.gain.value = options.volume;
    }

    if (options.loop && source.source) {
      source.source.loop = true;
      source.loop = true;
    }

    // Play
    if (source.source) {
      const when = this.context!.currentTime + (options.delay || 0);
      source.source.start(when);
      source.isPlaying = true;

      // Handle ended event for non-looping sounds
      if (!source.loop) {
        source.source.addEventListener("ended", () => {
          this.sources.delete(id);
        });
      }
    }
  }

  stopSound(id: string): void {
    const source = this.sources.get(id);
    if (source && source.source && source.isPlaying) {
      try {
        source.source.stop();
      } catch (error) {
        // Source might already be stopped
      }
      source.isPlaying = false;
      this.sources.delete(id);
    }
  }

  updateSourcePosition(id: string, position: SpatialPosition): void {
    const source = this.sources.get(id);
    if (source && source.panner) {
      if (source.panner.positionX) {
        source.panner.positionX.value = position.x;
        source.panner.positionY.value = position.y;
        source.panner.positionZ.value = position.z;
      } else {
        (source.panner as any).setPosition?.(
          position.x,
          position.y,
          position.z
        );
      }
      source.position = position;
    }
  }

  updateListenerPosition(position: SpatialPosition): void {
    if (!this.listener) return;

    if (this.listener.positionX) {
      this.listener.positionX.value = position.x;
      this.listener.positionY.value = position.y;
      this.listener.positionZ.value = position.z;
    } else {
      (this.listener as any).setPosition?.(position.x, position.y, position.z);
    }
  }

  updateListenerOrientation(
    forward: SpatialPosition,
    up: SpatialPosition
  ): void {
    if (!this.listener) return;

    if (this.listener.forwardX) {
      this.listener.forwardX.value = forward.x;
      this.listener.forwardY.value = forward.y;
      this.listener.forwardZ.value = forward.z;
      this.listener.upX.value = up.x;
      this.listener.upY.value = up.y;
      this.listener.upZ.value = up.z;
    } else {
      (this.listener as any).setOrientation?.(
        forward.x,
        forward.y,
        forward.z,
        up.x,
        up.y,
        up.z
      );
    }
  }

  setMasterVolume(volume: number): void {
    this.settings.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.masterGain) {
      this.masterGain.gain.value = this.settings.masterVolume;
    }
  }

  getMasterVolume(): number {
    return this.settings.masterVolume;
  }

  getActiveSources(): AudioSource[] {
    return Array.from(this.sources.values());
  }

  cleanup(): void {
    // Stop all sources
    this.sources.forEach((source, id) => {
      this.stopSound(id);
    });

    // Close context
    if (this.context && this.context.state !== "closed") {
      this.context.close();
    }

    this.sources.clear();
    this.buffers.clear();
    this.isInitialized = false;
  }
}

// React context for spatial audio
const SpatialAudioContext = createContext<{
  engine: SpatialAudioEngine | null;
  isInitialized: boolean;
  masterVolume: number;
  playGlassSound: (
    soundKey: string,
    position?: SpatialPosition,
    options?: any
  ) => string;
  stopGlassSound: (id: string) => void;
  setMasterVolume: (volume: number) => void;
}>({
  engine: null,
  isInitialized: false,
  masterVolume: 0.7,
  playGlassSound: () => "",
  stopGlassSound: () => {},
  setMasterVolume: () => {},
});

type GlassSpatialAudioConfig = {
  settings?: Partial<SpatialAudioSettings>;
  autoInitialize?: boolean;
};

interface GlassSpatialAudioProviderProps extends GlassSpatialAudioConfig {
  children: React.ReactNode;
}

// Provider component
export function GlassSpatialAudioProvider({
  children,
  settings,
  autoInitialize = true,
}: GlassSpatialAudioProviderProps) {
  const prefersReducedMotion = useReducedMotion();
  const engineRef = useRef<SpatialAudioEngine>();
  const [isInitialized, setIsInitialized] = useState(false);
  const [masterVolume, setMasterVolumeState] = useState(0.7);
  const soundIdCounter = useRef(0);

  // Initialize engine
  useEffect(() => {
    engineRef.current = new SpatialAudioEngine(settings);

    if (autoInitialize) {
      // Initialize on first user interaction
      const initializeOnInteraction = () => {
        if (engineRef.current && !isInitialized) {
          engineRef.current.initialize().then((success) => {
            setIsInitialized(success);
            if (success) {
              setMasterVolumeState(engineRef.current!.getMasterVolume());
            }
          });
        }
        document.removeEventListener("click", initializeOnInteraction);
        document.removeEventListener("keydown", initializeOnInteraction);
        document.removeEventListener("touchstart", initializeOnInteraction);
      };

      document.addEventListener("click", initializeOnInteraction);
      document.addEventListener("keydown", initializeOnInteraction);
      document.addEventListener("touchstart", initializeOnInteraction);

      return () => {
        document.removeEventListener("click", initializeOnInteraction);
        document.removeEventListener("keydown", initializeOnInteraction);
        document.removeEventListener("touchstart", initializeOnInteraction);
      };
    }

    return () => {
      if (engineRef.current) {
        engineRef.current.cleanup();
      }
    };
  }, [autoInitialize, isInitialized, settings]);

  const playGlassSound = useCallback(
    (
      soundKey: string,
      position: SpatialPosition = { x: 0, y: 0, z: 0 },
      options = {}
    ): string => {
      if (!engineRef.current || !isInitialized) return "";

      const id = `sound_${++soundIdCounter.current}`;
      engineRef.current.playSound(id, soundKey, position, options);
      return id;
    },
    [isInitialized]
  );

  const stopGlassSound = useCallback((id: string) => {
    if (engineRef.current) {
      engineRef.current.stopSound(id);
    }
  }, []);

  const setMasterVolume = useCallback((volume: number) => {
    if (engineRef.current) {
      engineRef.current.setMasterVolume(volume);
      setMasterVolumeState(volume);
    }
  }, []);

  const value = {
    engine: engineRef.current || null,
    isInitialized,
    masterVolume,
    playGlassSound,
    stopGlassSound,
    setMasterVolume,
  };

  return (
    <SpatialAudioContext.Provider value={value}>
      {children}
    </SpatialAudioContext.Provider>
  );
}

export interface GlassSpatialAudioProps
  extends GlassSpatialAudioConfig,
    HTMLAttributes<HTMLDivElement> {}

export const GlassSpatialAudio: React.FC<GlassSpatialAudioProps> = ({
  settings,
  autoInitialize = true,
  className,
  children,
  ...rest
}) => {
  return (
    <GlassSpatialAudioProvider
      settings={settings}
      autoInitialize={autoInitialize}
    >
      <div data-glass-component className={cn("relative", className)} {...rest}>
        {children ?? (
          <span className="glass-sr-only">
            Glass spatial audio provider active
          </span>
        )}
      </div>
    </GlassSpatialAudioProvider>
  );
};

// Hook to use spatial audio
export function useSpatialAudio() {
  const context = useContext(SpatialAudioContext);
  if (!context) {
    throw new Error(
      "useSpatialAudio must be used within GlassSpatialAudioProvider"
    );
  }
  return context;
}

// Component for audio-reactive glass effects
export function GlassAudioReactive({
  children,
  className,
  soundKey = "ambientGlass",
  position,
  reactToVolume = true,
  reactToFrequency = false,
  intensityMultiplier = 1,
}: {
  children: React.ReactNode;
  className?: string;
  soundKey?: string;
  position?: SpatialPosition;
  reactToVolume?: boolean;
  reactToFrequency?: boolean;
  intensityMultiplier?: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const { engine, playGlassSound, stopGlassSound } = useSpatialAudio();
  const [audioIntensity, setAudioIntensity] = useState(0);
  const soundIdRef = useRef<string>("");
  const analyzerRef = useRef<AnalyserNode>();

  // Start ambient sound and analysis
  useEffect(() => {
    if (!engine || !position) return;

    // Play ambient sound
    soundIdRef.current = playGlassSound(soundKey, position, {
      loop: true,
      volume: 0.3,
    });

    // Set up audio analysis if needed
    const audioContext = engine.getContext();
    if ((reactToVolume || reactToFrequency) && audioContext) {
      analyzerRef.current = audioContext.createAnalyser();
      analyzerRef.current.fftSize = 256;

      const source = engine.getSources().get(soundIdRef.current);
      if (source && source.gain) {
        source.gain.connect(analyzerRef.current);
      }

      // Start analysis loop
      const analyze = () => {
        if (!analyzerRef.current) return;

        const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);

        if (reactToVolume) {
          analyzerRef.current.getByteFrequencyData(dataArray);
          const average =
            dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
          setAudioIntensity((average / 255) * intensityMultiplier);
        }

        requestAnimationFrame(analyze);
      };

      analyze();
    }

    return () => {
      if (soundIdRef.current) {
        stopGlassSound(soundIdRef.current);
      }
    };
  }, [
    engine,
    soundKey,
    position,
    playGlassSound,
    stopGlassSound,
    reactToVolume,
    reactToFrequency,
    intensityMultiplier,
  ]);

  return (
    <motion.div
      className={cn("glass-audio-reactive", className)}
      animate={{
        scale: 1 + audioIntensity * 0.1,
        opacity: 0.8 + audioIntensity * 0.2,
        backgroundColor: `rgba(255, 255, 255, ${0.1 + audioIntensity * 0.1})`,
      }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: ANIMATION.DURATION.normal / 1000 }
      }
    >
      {children}
    </motion.div>
  );
}

// 3D Audio visualizer
export function GlassSpatialVisualizer({
  className,
  show = true,
}: {
  className?: string;
  show?: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const { engine } = useSpatialAudio();
  const [sources, setSources] = useState<AudioSource[]>([]);

  useEffect(() => {
    if (!engine || !show) return;

    const interval = setInterval(() => {
      setSources(engine.getActiveSources());
    }, 100);

    return () => clearInterval(interval);
  }, [engine, show]);

  if (!show) return null;

  return (
    <div
      className={cn(
        "glass-fixed glass-bottom-4 glass-right-4 glass-w-64 glass-h-64 glass-surface-primary glass-elev-3 glass-radius-lg glass-p-4",
        className
      )}
    >
      <div className="glass-text-xs glass-text-primary glass-mb-2">
        Spatial Audio
      </div>

      {/* 3D space visualization */}
      <div className="glass-relative glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-overflow-hidden">
        {/* Grid */}
        <div className="glass-absolute glass-inset-0">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={`h-${i}`}
              className="glass-absolute glass-w-full glass-h-px glass-surface-subtle/10"
              ref={(el) => {
                if (el) el.style.top = `${(i + 1) * 12.5}%`;
              }}
            />
          ))}
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={`v-${i}`}
              className="glass-absolute glass-h-full glass-w-px glass-surface-subtle/10"
              ref={(el) => {
                if (el) el.style.left = `${(i + 1) * 12.5}%`;
              }}
            />
          ))}
        </div>

        {/* Center point (listener) */}
        <div className="glass-absolute glass-w-2 glass-h-2 glass-surface-green glass-radius-full glass-top-1-2 glass-left-1-2 glass-translate-x-1/2-neg glass-translate-y-1/2-neg">
          <div className="glass-absolute glass-w-4 glass-h-4 glass-border glass-border-green glass-radius-full glass-top-1 glass--left-1 glass-animate-pulse" />
        </div>

        {/* Audio sources */}
        <AnimatePresence>
          {sources.map((source: any) => {
            // Convert 3D position to 2D screen position
            const screenX = (source.position.x + 1) * 50; // -1 to 1 -> 0 to 100%
            const screenY = (1 - source.position.y) * 50; // -1 to 1 -> 100 to 0%

            return (
              <motion.div
                key={source.id}
                className="glass-absolute glass-w-3 glass-h-3 glass-radius-full glass-transform glass--translate-x-1-2 glass--translate-y-1-2"
                style={{
                  left: `${screenX}%`,
                  top: `${screenY}%`,
                  backgroundColor:
                    source.category === "ambient"
                      ? "var(--glass-color-primary)"
                      : source.category === "ui"
                        ? "var(--glass-color-success)"
                        : source.category === "feedback"
                          ? "var(--glass-color-warning)"
                          : "#ec4899",
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        scale: source.isPlaying ? [1, 1.2, 1] : 1,
                        opacity: source.isPlaying ? 1 : 0.5,
                      }
                }
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  scale: {
                    repeat: source.isPlaying ? Infinity : 0,
                    duration: ANIMATION.DURATION.slower / 1000,
                  },
                }}
              >
                {/* Sound waves */}
                {source.isPlaying && (
                  <motion.div
                    className="glass-absolute glass-inset-0 glass-radius-full glass-border glass-opacity-30"
                    style={{
                      borderColor:
                        source.category === "ambient"
                          ? "var(--glass-color-primary)"
                          : source.category === "ui"
                            ? "var(--glass-color-success)"
                            : source.category === "feedback"
                              ? "var(--glass-color-warning)"
                              : "#ec4899",
                    }}
                    animate={
                      prefersReducedMotion
                        ? {}
                        : { scale: [1, 3, 1], opacity: [0.3, 0, 0.3] }
                    }
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : {
                            repeat: Infinity,
                            duration: (ANIMATION.DURATION.slower * 3) / 1000,
                            ease: "easeOut",
                          }
                    }
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Legend */}
        <div className="glass-absolute glass-bottom-2 glass-left-2 glass-text-xs glass-text-secondary">
          <div className="glass-flex glass-items-center glass-gap-1 glass-mb-1">
            <div className="glass-w-2 glass-h-2 glass-surface-green glass-radius-full" />
            <span>Listener</span>
          </div>
          <div className="glass-grid glass-grid-cols-2 glass-gap-1">
            <div className="glass-flex glass-items-center glass-gap-1">
              <div className="glass-w-2 glass-h-2 glass-surface-blue glass-radius-full" />
              <span>Ambient</span>
            </div>
            <div className="glass-flex glass-items-center glass-gap-1">
              <div className="glass-w-2 glass-h-2 glass-surface-emerald glass-radius-full" />
              <span>UI</span>
            </div>
            <div className="glass-flex glass-items-center glass-gap-1">
              <div className="glass-w-2 glass-h-2 glass-surface-amber glass-radius-full" />
              <span>Feedback</span>
            </div>
            <div className="glass-flex glass-items-center glass-gap-1">
              <div className="glass-w-2 glass-h-2 glass-surface-pink glass-radius-full" />
              <span>Alert</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook for easy glass sound integration
export function useGlassSound() {
  const { playGlassSound, stopGlassSound } = useSpatialAudio();

  const playTap = useCallback(
    (element?: HTMLElement) => {
      const position = element
        ? getElementPosition(element)
        : { x: 0, y: 0, z: 0 };
      return playGlassSound("tap", position);
    },
    [playGlassSound]
  );

  const playHover = useCallback(
    (element?: HTMLElement) => {
      const position = element
        ? getElementPosition(element)
        : { x: 0, y: 0, z: 0 };
      return playGlassSound("hover", position, { volume: 0.3 });
    },
    [playGlassSound]
  );

  const playSlide = useCallback(
    (element?: HTMLElement) => {
      const position = element
        ? getElementPosition(element)
        : { x: 0, y: 0, z: 0 };
      return playGlassSound("slide", position);
    },
    [playGlassSound]
  );

  const playBreak = useCallback(
    (element?: HTMLElement) => {
      const position = element
        ? getElementPosition(element)
        : { x: 0, y: 0, z: 0 };
      return playGlassSound("break", position, { volume: 0.6 });
    },
    [playGlassSound]
  );

  const playNotification = useCallback(
    (element?: HTMLElement) => {
      const position = element
        ? getElementPosition(element)
        : { x: 0, y: 0, z: 0 };
      return playGlassSound("notification", position);
    },
    [playGlassSound]
  );

  return {
    playTap,
    playHover,
    playSlide,
    playBreak,
    playNotification,
    stopSound: stopGlassSound,
  };
}

// Helper function to convert element position to spatial coordinates
function getElementPosition(element: HTMLElement): SpatialPosition {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  // Convert screen coordinates to spatial coordinates (-1 to 1)
  const x = (centerX / window.innerWidth) * 2 - 1;
  const y = 1 - (centerY / window.innerHeight) * 2;
  const z = 0; // Assume all UI elements are on the same plane

  return { x, y, z };
}

// Presets for different spatial audio setups
export const spatialAudioPresets = {
  minimal: {
    enableSpatial: false,
    masterVolume: 0.3,
    enableHRTF: false,
  },
  standard: {
    enableSpatial: true,
    masterVolume: 0.7,
    enableHRTF: true,
    distanceModel: "inverse" as const,
  },
  immersive: {
    enableSpatial: true,
    masterVolume: 0.9,
    enableHRTF: true,
    distanceModel: "exponential" as const,
    doppler: true,
  },
  gaming: {
    enableSpatial: true,
    masterVolume: 1.0,
    enableHRTF: true,
    distanceModel: "linear" as const,
    rolloffFactor: 2,
  },
};
