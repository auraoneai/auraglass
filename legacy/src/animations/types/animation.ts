import React from "react";
// Enhanced animation types for the AuraGlass system

export interface AnimationConfig {
  /** Animation duration in milliseconds */
  duration?: number;

  /** Animation delay in milliseconds */
  delay?: number;

  /** Animation easing function */
  easing?: string;

  /** Animation fill mode */
  fillMode?: "none" | "forwards" | "backwards" | "both";

  /** Animation direction */
  direction?: "normal" | "reverse" | "alternate" | "alternate-reverse";

  /** Animation iterations */
  iterations?: number | "infinite";

  /** Animation playback rate */
  playbackRate?: number;

  /** Enable physics-based animation */
  physics?: boolean;

  /** Spring configuration for physics animations */
  springConfig?: {
    stiffness: number;
    damping: number;
    mass: number;
    velocity: number;
    precision: number;
  };
}

export interface KeyframeConfig {
  /** CSS properties to animate */
  [property: string]: string | number;
}

export interface AnimationSequence {
  /** Sequence name */
  name: string;

  /** Animation steps */
  steps: AnimationStep[];

  /** Sequence configuration */
  config?: AnimationConfig;

  /** Sequence metadata */
  metadata?: {
    author?: string;
    version?: string;
    description?: string;
    tags?: string[];
  };
}

export interface AnimationStep {
  /** Step name */
  name?: string;

  /** Step duration */
  duration: number;

  /** Step delay */
  delay?: number;

  /** Step easing */
  easing?: string;

  /** Step keyframes */
  keyframes: KeyframeConfig | KeyframeConfig[];

  /** Step target selector */
  target?: string;

  /** Step completion callback */
  onComplete?: () => void;

  /** Step start callback */
  onStart?: () => void;

  /** Step configuration */
  config?: Partial<AnimationConfig>;
}

export interface AnimationPreset {
  /** Preset name */
  name: string;

  /** Preset configuration */
  config: AnimationConfig;

  /** Preset keyframes */
  keyframes: KeyframeConfig[];

  /** Preset category */
  category:
    | "entrance"
    | "exit"
    | "attention"
    | "navigation"
    | "loading"
    | "hover"
    | "click";

  /** Preset description */
  description?: string;

  /** Preset tags */
  tags?: string[];
}

export interface AnimationGroup {
  /** Group name */
  name: string;

  /** Group animations */
  animations: (AnimationSequence | AnimationPreset)[];

  /** Group configuration */
  config?: {
    /** Play animations in parallel */
    parallel?: boolean;

    /** Stagger delay between animations */
    stagger?: number;

    /** Group repeat count */
    repeat?: number;

    /** Group playback rate */
    playbackRate?: number;
  };

  /** Group metadata */
  metadata?: {
    author?: string;
    version?: string;
    description?: string;
    tags?: string[];
  };
}

export interface AnimationTimeline {
  /** Timeline name */
  name: string;

  /** Timeline tracks */
  tracks: AnimationTrack[];

  /** Timeline duration */
  duration: number;

  /** Timeline configuration */
  config?: {
    /** Timeline playback rate */
    playbackRate?: number;

    /** Timeline loop */
    loop?: boolean;

    /** Timeline auto-play */
    autoPlay?: boolean;
  };
}

export interface AnimationTrack {
  /** Track name */
  name: string;

  /** Track target */
  target: string;

  /** Track animations */
  animations: AnimationSequence[];

  /** Track start time */
  startTime: number;

  /** Track configuration */
  config?: {
    /** Track playback rate */
    playbackRate?: number;

    /** Track volume (for audio tracks) */
    volume?: number;

    /** Track enabled state */
    enabled?: boolean;
  };
}

export interface AnimationState {
  /** Current animation status */
  status: "idle" | "playing" | "paused" | "completed" | "cancelled";

  /** Current progress (0-1) */
  progress: number;

  /** Current time in milliseconds */
  currentTime: number;

  /** Total duration in milliseconds */
  duration: number;

  /** Playback rate */
  playbackRate: number;

  /** Loop state */
  loop: boolean;

  /** Animation direction */
  direction: "normal" | "reverse";

  /** Active animations */
  activeAnimations: string[];

  /** Completed animations */
  completedAnimations: string[];

  /** Failed animations */
  failedAnimations: string[];
}

export interface AnimationController {
  /** Play animation */
  play: (name?: string) => Promise<void>;

  /** Pause animation */
  pause: (name?: string) => Promise<void>;

  /** Stop animation */
  stop: (name?: string) => Promise<void>;

  /** Seek to time */
  seek: (time: number, name?: string) => Promise<void>;

  /** Set playback rate */
  setPlaybackRate: (rate: number, name?: string) => Promise<void>;

  /** Set loop */
  setLoop: (loop: boolean, name?: string) => Promise<void>;

  /** Reverse animation */
  reverse: (name?: string) => Promise<void>;

  /** Get animation state */
  getState: (name?: string) => AnimationState;

  /** Add event listener */
  addEventListener: (event: string, callback: Function, name?: string) => void;

  /** Remove event listener */
  removeEventListener: (
    event: string,
    callback: Function,
    name?: string
  ) => void;

  /** Destroy controller */
  destroy: () => void;
}

export interface AnimationManager {
  /** Register animation */
  register: (
    animation: AnimationSequence | AnimationPreset | AnimationGroup
  ) => string;

  /** Unregister animation */
  unregister: (id: string) => boolean;

  /** Get animation */
  get: (
    id: string
  ) => AnimationSequence | AnimationPreset | AnimationGroup | undefined;

  /** List animations */
  list: (
    category?: string
  ) => (AnimationSequence | AnimationPreset | AnimationGroup)[];

  /** Create controller for animation */
  createController: (id: string) => AnimationController;

  /** Play animation */
  play: (id: string) => Promise<void>;

  /** Stop all animations */
  stopAll: () => Promise<void>;

  /** Pause all animations */
  pauseAll: () => Promise<void>;

  /** Set global playback rate */
  setGlobalPlaybackRate: (rate: number) => void;

  /** Enable/disable animations globally */
  setAnimationsEnabled: (enabled: boolean) => void;

  /** Check if animations are enabled */
  areAnimationsEnabled: () => boolean;

  /** Get performance metrics */
  getPerformanceMetrics: () => {
    totalAnimations: number;
    activeAnimations: number;
    averageDuration: number;
    totalDuration: number;
    memoryUsage: number;
  };
}

// Animation event types
export type AnimationEventType =
  | "start"
  | "complete"
  | "cancel"
  | "pause"
  | "resume"
  | "seek"
  | "iteration"
  | "error";

export interface AnimationEvent {
  type: AnimationEventType;
  animationId: string;
  timestamp: number;
  data?: unknown;
}

// Physics animation types
export interface PhysicsConfig {
  /** Gravity vector */
  gravity?: { x: number; y: number; z?: number };

  /** Air resistance */
  airResistance?: number;

  /** Surface friction */
  friction?: number;

  /** Restitution (bounciness) */
  restitution?: number;

  /** Collision detection */
  collisionDetection?: boolean;

  /** Bounds */
  bounds?: {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
    front?: number;
    back?: number;
  };

  /** Time step for simulation */
  timeStep?: number;

  /** Maximum simulation steps per frame */
  maxSteps?: number;

  /** Integration method */
  integration?: "euler" | "verlet" | "rk4";
}

export interface PhysicsBody {
  /** Body ID */
  id: string;

  /** Body position */
  position: { x: number; y: number; z?: number };

  /** Body velocity */
  velocity: { x: number; y: number; z?: number };

  /** Body acceleration */
  acceleration: { x: number; y: number; z?: number };

  /** Body mass */
  mass: number;

  /** Body shape */
  shape: "circle" | "rectangle" | "polygon" | "custom";

  /** Body dimensions */
  dimensions: {
    width?: number;
    height?: number;
    radius?: number;
    points?: { x: number; y: number }[];
  };

  /** Body material properties */
  material: {
    friction: number;
    restitution: number;
    density: number;
  };

  /** Body state */
  state: {
    isStatic: boolean;
    isKinematic: boolean;
    isSleeping: boolean;
    gravityScale: number;
  };

  /** Body forces */
  forces: Array<{
    force: { x: number; y: number; z?: number };
    duration?: number;
    type: "constant" | "impulse" | "drag";
  }>;

  /** Body constraints */
  constraints: Array<{
    type: "distance" | "angle" | "axis";
    target: PhysicsBody | { x: number; y: number; z?: number };
    stiffness: number;
    damping: number;
  }>;
}

export interface PhysicsWorld {
  /** World bodies */
  bodies: PhysicsBody[];

  /** World configuration */
  config: PhysicsConfig;

  /** World forces */
  forces: Array<{
    type: "gravity" | "wind" | "magnetic";
    vector: { x: number; y: number; z?: number };
    strength: number;
  }>;

  /** World constraints */
  constraints: Array<{
    type: "distance" | "angle" | "axis" | "surface";
    bodies:
      | [PhysicsBody, PhysicsBody]
      | [PhysicsBody, { x: number; y: number; z?: number }];
    stiffness: number;
    damping: number;
  }>;
}

// Performance monitoring types
export interface AnimationPerformanceMetrics {
  /** Frames per second */
  fps: number;

  /** Frame time in milliseconds */
  frameTime: number;

  /** Animation duration in milliseconds */
  animationDuration: number;

  /** Memory usage in bytes */
  memoryUsage: number;

  /** CPU usage percentage */
  cpuUsage: number;

  /** Dropped frames count */
  droppedFrames: number;

  /** Animation smoothness score (0-100) */
  smoothnessScore: number;

  /** Power consumption estimate */
  powerConsumption: "low" | "medium" | "high";
}

// Accessibility types
export interface AnimationAccessibilityConfig {
  /** Respect reduced motion preference */
  respectReducedMotion: boolean;

  /** Reduced motion fallback */
  reducedMotionFallback: "none" | "opacity" | "transform";

  /** Enable high contrast mode */
  highContrastMode: boolean;

  /** Animation warning threshold */
  warningThreshold: number;

  /** Allow user to disable animations */
  allowDisable: boolean;

  /** Focus management during animations */
  focusManagement: boolean;

  /** Screen reader announcements */
  screenReaderAnnouncements: boolean;
}

// Export utility types
export type AnimationType =
  | "css"
  | "javascript"
  | "web-animations"
  | "physics"
  | "canvas";
export type AnimationStatus =
  | "idle"
  | "playing"
  | "paused"
  | "completed"
  | "cancelled"
  | "error";
export type AnimationPriority = "low" | "normal" | "high" | "critical";

export interface AnimationOptions extends AnimationConfig {
  /** Animation type */
  type?: AnimationType;

  /** Animation priority */
  priority?: AnimationPriority;

  /** Animation accessibility config */
  accessibility?: Partial<AnimationAccessibilityConfig>;

  /** Animation performance config */
  performance?: {
    throttle?: boolean;
    debounce?: number;
    batch?: boolean;
  };

  /** Animation debugging */
  debug?: boolean;

  /** Animation metadata */
  metadata?: {
    author?: string;
    version?: string;
    description?: string;
    tags?: string[];
  };
}
