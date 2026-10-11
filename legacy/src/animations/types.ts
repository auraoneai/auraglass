// Basic animation types
export type AnimationType = 'spring' | 'tween' | 'keyframes';

export interface AnimationConfig {
  type: AnimationType;
  duration?: number;
  delay?: number;
  ease?: string;
}

export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
}

export interface AnimationProps {
  duration?: number;
  delay?: number;
  ease?: string;
  type?: AnimationType;
}
