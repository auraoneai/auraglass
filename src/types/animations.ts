import React from "react";
import type {
  PanInfo,
  TargetAndTransition,
  Transition as FramerTransition,
  VariantLabels,
  Variants,
} from "framer-motion";

// Animation type definitions
export type AnimationType = "spring" | "tween" | "keyframes" | "inertia";

export type EasingFunction =
  | "linear"
  | "easeIn"
  | "easeOut"
  | "easeInOut"
  | "circIn"
  | "circOut"
  | "circInOut"
  | "backIn"
  | "backOut"
  | "backInOut"
  | "anticipate"
  | number[];

export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
  velocity?: number;
  restSpeed?: number;
  restDelta?: number;
}

export interface TweenConfig {
  duration?: number;
  ease?: EasingFunction;
  times?: number[];
  yoyo?: boolean;
  loop?: number;
  repeat?: number;
  repeatDelay?: number;
}

export interface KeyframesConfig {
  times?: number[];
  ease?: EasingFunction | EasingFunction[];
  yoyo?: boolean;
  loop?: number;
  repeat?: number;
  repeatDelay?: number;
}

export interface InertiaConfig {
  velocity?: number;
  power?: number;
  timeConstant?: number;
  modifyTarget?: (target: number) => number;
  min?: number;
  max?: number;
}

export type AnimationConfig =
  | SpringConfig
  | TweenConfig
  | KeyframesConfig
  | InertiaConfig;

export type Transition = FramerTransition & {
  type: AnimationType;
  [key: string]: unknown;
};

export type AnimationTarget = boolean | TargetAndTransition | VariantLabels;
export type GestureAnimationTarget = TargetAndTransition | VariantLabels;
export interface ViewportOptions {
  root?: React.RefObject<Element>;
  once?: boolean;
  margin?: string;
  amount?: "some" | "all" | number;
}
export type DragConstraints =
  | false
  | Partial<Record<"top" | "right" | "bottom" | "left", number>>
  | React.RefObject<Element>;
export type DragEventHandler = (
  event: MouseEvent | TouchEvent | PointerEvent,
  info: PanInfo
) => void;

export interface AnimationProps {
  initial?: AnimationTarget;
  animate?: AnimationTarget;
  exit?: AnimationTarget;
  transition?: Transition;
  variants?: Variants;
  whileHover?: GestureAnimationTarget;
  whileTap?: GestureAnimationTarget;
  whileDrag?: GestureAnimationTarget;
  whileFocus?: GestureAnimationTarget;
  whileInView?: GestureAnimationTarget;
  viewport?: ViewportOptions;
  layout?: boolean | "position" | "size";
  layoutId?: string;
  drag?: boolean | "x" | "y";
  dragConstraints?: DragConstraints;
  dragElastic?: number | boolean;
  dragMomentum?: boolean;
  onDragStart?: DragEventHandler;
  onDragEnd?: DragEventHandler;
  onDrag?: DragEventHandler;
}

// Physics-based interaction types
export interface PhysicsInteractionOptions {
  stiffness?: number;
  damping?: number;
  mass?: number;
  scale?: number;
  rotation?: number;
  duration?: number;
  delay?: number;
  affectsScale?: boolean;
  affectsRotation?: boolean;
  scaleAmplitude?: number;
  rotationAmplitude?: number;
  strength?: number;
  radius?: number;
}

export interface MagneticEffectOptions {
  strength?: number;
  radius?: number;
  ease?: EasingFunction;
  triggerDistance?: number;
}

// Predefined animation presets
export interface AnimationPresets {
  fadeIn: AnimationProps;
  fadeOut: AnimationProps;
  slideIn: AnimationProps;
  slideOut: AnimationProps;
  scaleIn: AnimationProps;
  scaleOut: AnimationProps;
  bounce: AnimationProps;
  shake: AnimationProps;
  pulse: AnimationProps;
  spin: AnimationProps;
}
