/**
 * AuraGlass Sound Design System
 * Haptic and audio feedback for glass interactions
 */
import {
  getSafeDocument,
  getSafeNavigator,
  getSafeWindow,
  isBrowser,
} from "./env";

interface SoundConfig {
  url?: string;
  volume?: number;
  pitch?: number;
  duration?: number;
  delay?: number;
  reverb?: number;
  pan?: number;
}

interface HapticPattern {
  intensity: number;
  duration: number;
  delay?: number;
  pattern?: number[];
}

export class GlassSoundDesign {
  private static instance: GlassSoundDesign;
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private oscillators: Map<string, OscillatorNode> = new Map();
  private gainNodes: Map<string, GainNode> = new Map();
  private enabled: boolean = true;
  private hapticEnabled: boolean = true;

  // Predefined glass sounds
  private readonly glassSounds = {
    tap: {
      frequency: 800,
      duration: 50,
      volume: 0.3,
      type: "sine" as OscillatorType,
    },
    hover: {
      frequency: 400,
      duration: 30,
      volume: 0.1,
      type: "triangle" as OscillatorType,
    },
    slide: {
      frequency: 600,
      duration: 100,
      volume: 0.2,
      type: "sine" as OscillatorType,
    },
    break: {
      frequency: 1200,
      duration: 200,
      volume: 0.5,
      type: "sawtooth" as OscillatorType,
    },
    morph: {
      frequency: 500,
      duration: 150,
      volume: 0.25,
      type: "sine" as OscillatorType,
    },
    ripple: {
      frequency: 300,
      duration: 300,
      volume: 0.15,
      type: "sine" as OscillatorType,
    },
    success: {
      frequency: 880,
      duration: 150,
      volume: 0.4,
      type: "sine" as OscillatorType,
    },
    error: {
      frequency: 200,
      duration: 200,
      volume: 0.4,
      type: "square" as OscillatorType,
    },
    notification: {
      frequency: 660,
      duration: 100,
      volume: 0.3,
      type: "sine" as OscillatorType,
    },
  };

  // Haptic patterns
  private readonly hapticPatterns = {
    tap: { intensity: 1, duration: 10 },
    hover: { intensity: 0.3, duration: 5 },
    slide: { intensity: 0.5, duration: 20 },
    success: { intensity: 0.8, duration: 50, pattern: [10, 10, 10] },
    error: { intensity: 1, duration: 100, pattern: [50, 50] },
    notification: { intensity: 0.6, duration: 30, pattern: [10, 10, 10, 10] },
    longPress: { intensity: 0.7, duration: 200 },
    swipe: { intensity: 0.4, duration: 15 },
  };

  private constructor() {
    // Do NOT create AudioContext at import time.
    if (isBrowser()) {
      // Set up gesture listeners to initialize audio lazily on first user interaction.
      this.setupGestureListeners();
      this.checkHapticSupport();
    } else {
      this.enabled = false;
      this.hapticEnabled = false;
    }
  }

  /**

  
   * Attach one-time listeners to create/resume AudioContext after a user gesture

  
   */

  private setupGestureListeners() {
    const doc = getSafeDocument();
    const win = getSafeWindow();
    if (!doc || !win) return;

    const enable = async () => {
      const currentWin = getSafeWindow();
      const currentDoc = getSafeDocument();
      if (!currentWin || !currentDoc) return;

      try {
        if (!this.audioContext) {
          this.audioContext = new (currentWin.AudioContext ||
            (currentWin as any).webkitAudioContext)();
        }

        if (this.audioContext?.state === "suspended") {
          await this.audioContext.resume();
        }
      } catch {
        this.enabled = false;
      } finally {
        currentDoc.removeEventListener("click", enable, true);
        currentDoc.removeEventListener("touchstart", enable, true);
        currentDoc.removeEventListener("keydown", enable, true);
      }
    };

    // Capture phase to run before most bubbling handlers, and once
    doc.addEventListener("click", enable, {
      capture: true,
      once: true,
      passive: true,
    } as any);
    doc.addEventListener("touchstart", enable, {
      capture: true,
      once: true,
      passive: true,
    } as any);
    doc.addEventListener("keydown", enable, {
      capture: true,
      once: true,
      passive: true,
    } as any);
  }

  static getInstance(): GlassSoundDesign {
    if (!GlassSoundDesign.instance) {
      GlassSoundDesign.instance = new GlassSoundDesign();
    }
    return GlassSoundDesign.instance;
  }

  /**
   * Get available glass sound types
   */
  getGlassSoundTypes() {
    return Object.keys(this.glassSounds) as Array<
      keyof typeof this.glassSounds
    >;
  }

  /**
   * Get available haptic pattern types
   */
  getHapticPatternTypes() {
    return Object.keys(this.hapticPatterns) as Array<
      keyof typeof this.hapticPatterns
    >;
  }

  /**
   * Initialize Web Audio API context
   */
  private initAudioContext() {
    const win = getSafeWindow();
    if (!win) return;
    try {
      if (!this.audioContext) {
        this.audioContext = new (win.AudioContext ||
          (win as any).webkitAudioContext)();
      }
    } catch {
      this.enabled = false;
    }
  }

  /**
   * Allow callers to explicitly request audio enablement (e.g., from a button onClick)
   */
  async requestEnableAudio() {
    if (!isBrowser()) return false;
    try {
      this.initAudioContext();
      if (this.audioContext?.state === "suspended") {
        await this.audioContext.resume();
      }
      return !!this.audioContext && this.audioContext.state !== "suspended";
    } catch {
      this.enabled = false;
      return false;
    }
  }

  /**
   * Check if haptic feedback is supported
   */
  private checkHapticSupport() {
    const nav = getSafeNavigator();
    this.hapticEnabled = !!nav && "vibrate" in nav;
  }

  /**
   * Play a synthetic glass sound
   */
  playGlassSound(
    type: keyof typeof GlassSoundDesign.prototype.glassSounds,
    customConfig?: Partial<typeof GlassSoundDesign.prototype.glassSounds.tap>
  ) {
    if (!this.enabled || !this.audioContext) return;

    const config = { ...this.glassSounds[type], ...customConfig };

    try {
      // Create oscillator
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      // Configure oscillator
      oscillator.type = config.type;
      oscillator.frequency.setValueAtTime(
        config.frequency,
        this.audioContext.currentTime
      );

      // Configure gain (volume)
      gainNode.gain.setValueAtTime(
        config.volume,
        this.audioContext.currentTime
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioContext.currentTime + config.duration / 1000
      );

      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Play sound
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + config.duration / 1000);

      // Cleanup
      oscillator.onended = () => {
        oscillator.disconnect();
        gainNode.disconnect();
      };
    } catch {
      this.enabled = false;
    }
  }

  /**
   * Play a chord (multiple frequencies)
   */
  playChord(
    frequencies: number[],
    duration: number = 200,
    volume: number = 0.3
  ) {
    if (!this.enabled || !this.audioContext) return;

    frequencies.forEach((freq: any) => {
      this.playGlassSound("tap", {
        frequency: freq,
        duration,
        volume: volume / frequencies.length,
      });
    });
  }

  /**
   * Play an arpeggio
   */
  playArpeggio(
    frequencies: number[],
    noteDuration: number = 100,
    noteDelay: number = 50,
    volume: number = 0.3
  ) {
    if (!this.enabled || !this.audioContext) return;

    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.playGlassSound("tap", {
          frequency: freq,
          duration: noteDuration,
          volume,
        });
      }, index * noteDelay);
    });
  }

  /**
   * Create ambient glass atmosphere
   */
  createAmbientGlass(
    config: {
      baseFrequency?: number;
      modulationRate?: number;
      volume?: number;
    } = {}
  ) {
    if (!this.enabled || !this.audioContext) return null;

    const { baseFrequency = 200, modulationRate = 0.5, volume = 0.1 } = config;

    try {
      // Create nodes
      const oscillator = this.audioContext.createOscillator();
      const modulatorOsc = this.audioContext.createOscillator();
      const modulatorGain = this.audioContext.createGain();
      const mainGain = this.audioContext.createGain();

      // Configure main oscillator
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(
        baseFrequency,
        this.audioContext.currentTime
      );

      // Configure modulator
      modulatorOsc.type = "sine";
      modulatorOsc.frequency.setValueAtTime(
        modulationRate,
        this.audioContext.currentTime
      );
      modulatorGain.gain.setValueAtTime(50, this.audioContext.currentTime);

      // Configure main gain
      mainGain.gain.setValueAtTime(volume, this.audioContext.currentTime);

      // Connect modulation
      modulatorOsc.connect(modulatorGain);
      modulatorGain.connect(oscillator.frequency);

      // Connect to output
      oscillator.connect(mainGain);
      mainGain.connect(this.audioContext.destination);

      // Start oscillators
      oscillator.start();
      modulatorOsc.start();

      // Store for later control
      const id = Date.now().toString();
      this.oscillators.set(id, oscillator);
      this.gainNodes.set(id, mainGain);

      return {
        id,
        stop: () => {
          oscillator.stop();
          modulatorOsc.stop();
          oscillator.disconnect();
          modulatorOsc.disconnect();
          modulatorGain.disconnect();
          mainGain.disconnect();
          this.oscillators.delete(id);
          this.gainNodes.delete(id);
        },
        setVolume: (newVolume: number) => {
          mainGain.gain.setValueAtTime(
            newVolume,
            this.audioContext!.currentTime
          );
        },
      };
    } catch {
      return null;
    }
  }

  /**
   * Trigger haptic feedback
   */
  triggerHaptic(
    pattern:
      | keyof typeof GlassSoundDesign.prototype.hapticPatterns
      | HapticPattern
  ) {
    if (!this.hapticEnabled) return;

    const config =
      typeof pattern === "string" ? this.hapticPatterns[pattern] : pattern;

    try {
      const nav = getSafeNavigator();
      if (!nav || typeof nav.vibrate !== "function") return;

      if (
        "pattern" in config &&
        config.pattern &&
        Array.isArray(config.pattern)
      ) {
        nav.vibrate(config.pattern);
      } else {
        nav.vibrate(config.duration);
      }
    } catch {
      this.hapticEnabled = false;
    }
  }

  /**
   * Combined sound and haptic feedback
   */
  playFeedback(
    type: "tap" | "hover" | "slide" | "success" | "error" | "notification"
  ) {
    // Play sound
    if (this.glassSounds[type]) {
      this.playGlassSound(type);
    }

    // Trigger haptic
    if (this.hapticPatterns[type]) {
      this.triggerHaptic(type);
    }
  }

  /**
   * Create a glass resonance effect
   */
  createResonance(frequency: number = 440, decay: number = 2) {
    if (!this.enabled || !this.audioContext) return;

    const impulseLength = this.audioContext.sampleRate * decay;
    const impulse = this.audioContext.createBuffer(
      2,
      impulseLength,
      this.audioContext.sampleRate
    );

    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < impulseLength; i++) {
        channelData[i] =
          (Math.random() * 2 - 1) * Math.pow(1 - i / impulseLength, 2);
      }
    }

    const convolver = this.audioContext.createConvolver();
    convolver.buffer = impulse;

    this.playGlassSound("tap", { frequency });
  }

  /**
   * Enable/disable sound
   */
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  /**
   * Enable/disable haptics
   */
  setHapticEnabled(enabled: boolean) {
    const nav = getSafeNavigator();
    this.hapticEnabled = !!nav && enabled && "vibrate" in nav;
  }

  /**
   * Get audio context state
   */
  getState() {
    return {
      soundEnabled: this.enabled,
      hapticEnabled: this.hapticEnabled,
      audioContextState: this.audioContext?.state,
    };
  }

  /**
   * Cleanup
   */
  destroy() {
    // Stop all oscillators
    this.oscillators.forEach((osc: any) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    });

    // Disconnect all gain nodes
    this.gainNodes.forEach((gain: any) => {
      try {
        gain.disconnect();
      } catch {}
    });

    // Clear maps
    this.oscillators.clear();
    this.gainNodes.clear();
    this.sounds.clear();

    // Close audio context
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// Export singleton instance
export const glassSoundDesign = GlassSoundDesign.getInstance();

// React hook for sound design
export function useGlassSound() {
  const play = (type: string) => {
    glassSoundDesign.playGlassSound(type as any);
  };

  const haptic = (pattern: string) => {
    glassSoundDesign.triggerHaptic(pattern as any);
  };

  const feedback = (
    type: Parameters<typeof glassSoundDesign.playFeedback>[0]
  ) => {
    glassSoundDesign.playFeedback(type);
  };

  return { play, haptic, feedback, soundDesign: glassSoundDesign };
}
