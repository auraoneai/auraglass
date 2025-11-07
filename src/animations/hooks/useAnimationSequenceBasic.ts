import React from 'react';
import { useRef, useCallback, useEffect, useState } from 'react';

export interface AnimationStep {
  id: string;
  duration: number;
  delay?: number;
  easing?: string;
  transform?: {
    x?: number;
    y?: number;
    scale?: number;
    rotation?: number;
    opacity?: number;
  };
  style?: Record<string, any>;
  onStart?: () => void;
  onComplete?: () => void;
  onUpdate?: (progress: number) => void;
}

export interface AnimationSequenceConfig {
  autoPlay?: boolean;
  loop?: boolean;
  reverse?: boolean;
  speed?: number;
  paused?: boolean;
}

export interface AnimationSequenceState {
  isPlaying: boolean;
  isPaused: boolean;
  currentStep: number;
  totalSteps: number;
  progress: number;
  elapsed: number;
  totalDuration: number;
}

export function useAnimationSequence(
  steps: AnimationStep[],
  config: AnimationSequenceConfig = {}
) {
  const {
    autoPlay = false,
    loop = false,
    reverse = false,
    speed = 1,
    paused = false,
  } = config;

  const [state, setState] = useState<AnimationSequenceState>({
    isPlaying: false,
    isPaused: false,
    currentStep: 0,
    totalSteps: steps.length,
    progress: 0,
    elapsed: 0,
    totalDuration: steps.reduce((total, step) => total + step.duration + (step.delay || 0), 0),
  });

  const elementRef = useRef<HTMLElement>(null);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);
  const currentStepRef = useRef<number>(0);
  const stepStartTimeRef = useRef<number>(0);

  // Calculate total duration including delays
  const totalDuration = steps.reduce((total, step) => {
    return total + step.duration + (step.delay || 0);
  }, 0);

  const applyStepTransform = useCallback((step: AnimationStep, progress: number = 1) => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    const transform = step.transform;

    if (transform) {
      const transforms: string[] = [];

      if (transform.x !== undefined || transform.y !== undefined) {
        transforms.push(`translate(${transform.x || 0}px, ${transform.y || 0}px)`);
      }

      if (transform.scale !== undefined) {
        transforms.push(`scale(${transform.scale})`);
      }

      if (transform.rotation !== undefined) {
        transforms.push(`rotate(${transform.rotation}deg)`);
      }

      if (transforms.length > 0) {
        element.style.transform = transforms.join(' ');
      }

      if (transform.opacity !== undefined) {
        element.style.opacity = transform.opacity.toString();
      }
    }

    // Apply additional styles
    if (step.style) {
      Object.assign(element.style, step.style);
    }
  }, []);

  const animateStep = useCallback((stepIndex: number, stepProgress: number) => {
    const step = steps[stepIndex];
    if (!step) return;

    // Apply transform based on progress
    const easedProgress = step.easing
      ? easeValue(stepProgress, step.easing)
      : stepProgress;

    // Interpolate between current and target values
    if (step.transform) {
      const interpolatedTransform = {
        x: step.transform.x !== undefined ? step.transform.x * easedProgress : undefined,
        y: step.transform.y !== undefined ? step.transform.y * easedProgress : undefined,
        scale: step.transform.scale !== undefined
          ? 1 + (step.transform.scale - 1) * easedProgress
          : undefined,
        rotation: step.transform.rotation !== undefined
          ? step.transform.rotation * easedProgress
          : undefined,
        opacity: step.transform.opacity !== undefined
          ? step.transform.opacity * easedProgress
          : undefined,
      };

      if (elementRef.current) {
        applyStepTransform({ ...step, transform: interpolatedTransform }, 1);
      }
    }

    // Call update callback
    step.onUpdate?.(easedProgress);
  }, [steps, applyStepTransform]);

  const runAnimation = useCallback((timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsed = (timestamp - startTimeRef.current) * speed;
    const totalElapsed = elapsed + pausedTimeRef.current;

    if (totalElapsed >= totalDuration) {
      // Animation complete
      setState((prev: any) => ({
        ...prev,
        isPlaying: false,
        progress: 1,
        elapsed: totalDuration,
      }));

      // Apply final step
      const finalStep = reverse ? steps[0] : steps[steps.length - 1];
      applyStepTransform(finalStep, 1);
      finalStep.onComplete?.();

      if (loop) {
        // Restart animation
        startTimeRef.current = 0;
        pausedTimeRef.current = 0;
        currentStepRef.current = 0;
        stepStartTimeRef.current = 0;
        setState((prev: any) => ({
          ...prev,
          isPlaying: true,
          currentStep: 0,
          progress: 0,
          elapsed: 0,
        }));
        animationRef.current = requestAnimationFrame(runAnimation);
      }

      return;
    }

    // Find current step
    let accumulatedTime = 0;
    let currentStepIndex = 0;
    let stepElapsed = 0;

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const stepDuration = step.duration + (step.delay || 0);

      if (totalElapsed >= accumulatedTime && totalElapsed < accumulatedTime + stepDuration) {
        currentStepIndex = i;
        stepElapsed = totalElapsed - accumulatedTime;
        break;
      }

      accumulatedTime += stepDuration;
    }

    // Handle step transitions
    if (currentStepIndex !== currentStepRef.current) {
      // Complete previous step
      const prevStep = steps[currentStepRef.current];
      prevStep?.onComplete?.();

      // Start new step
      const newStep = steps[currentStepIndex];
      newStep?.onStart?.();
      stepStartTimeRef.current = totalElapsed;

      currentStepRef.current = currentStepIndex;
    }

    // Calculate step progress
    const currentStep = steps[currentStepIndex];
    const stepDelay = currentStep.delay || 0;
    const stepDuration = currentStep.duration;
    const stepProgress = Math.max(0, Math.min(1,
      (stepElapsed - stepDelay) / stepDuration
    ));

    // Apply animation
    animateStep(currentStepIndex, stepProgress);

    // Update state
    const overallProgress = totalElapsed / totalDuration;
    setState((prev: any) => ({
      ...prev,
      currentStep: currentStepIndex,
      progress: overallProgress,
      elapsed: totalElapsed,
    }));

    animationRef.current = requestAnimationFrame(runAnimation);
  }, [
    steps,
    speed,
    totalDuration,
    reverse,
    loop,
    applyStepTransform,
    animateStep,
  ]);

  const play = useCallback(() => {
    if (state.isPlaying) return;

    setState((prev: any) => ({
      ...prev,
      isPlaying: true,
      isPaused: false,
    }));

    startTimeRef.current = 0;
    animationRef.current = requestAnimationFrame(runAnimation);
  }, [state.isPlaying, runAnimation]);

  const pause = useCallback(() => {
    if (!state.isPlaying) return;

    setState((prev: any) => ({
      ...prev,
      isPaused: true,
    }));

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }

    pausedTimeRef.current = state.elapsed;
  }, [state.isPlaying, state.elapsed]);

  const stop = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }

    startTimeRef.current = 0;
    pausedTimeRef.current = 0;
    currentStepRef.current = 0;
    stepStartTimeRef.current = 0;

    setState((prev: any) => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      currentStep: 0,
      progress: 0,
      elapsed: 0,
    }));

    // Reset to initial state
    if (elementRef.current && steps.length > 0) {
      applyStepTransform(steps[0], 0);
    }
  }, [applyStepTransform, steps]);

  const seek = useCallback((progress: number) => {
    const seekTime = progress * totalDuration;
    pausedTimeRef.current = seekTime;

    setState((prev: any) => ({
      ...prev,
      progress,
      elapsed: seekTime,
    }));

    // Find the step at this progress
    let accumulatedTime = 0;
    let targetStepIndex = 0;

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const stepDuration = step.duration + (step.delay || 0);

      if (seekTime >= accumulatedTime && seekTime < accumulatedTime + stepDuration) {
        targetStepIndex = i;
        break;
      }

      accumulatedTime += stepDuration;
    }

    currentStepRef.current = targetStepIndex;

    // Apply the state at this progress
    if (elementRef.current) {
      const step = steps[targetStepIndex];
      const stepStartTime = accumulatedTime - (step.delay || 0);
      const stepProgress = Math.max(0, Math.min(1,
        (seekTime - stepStartTime) / step.duration
      ));

      animateStep(targetStepIndex, stepProgress);
    }
  }, [totalDuration, steps, animateStep]);

  // Auto-play on mount
  useEffect(() => {
    if (autoPlay && !paused) {
      play();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [autoPlay, paused, play]);

  // Handle pause state
  useEffect(() => {
    if (paused && state.isPlaying) {
      pause();
    }
  }, [paused, state.isPlaying, pause]);

  return {
    ref: elementRef,
    state,
    play,
    pause,
    stop,
    seek,
    totalDuration,
  };
}

// Easing function utilities
function easeValue(progress: number, easing: string): number {
  // Simple easing function parser
  const [type, ...params] = easing.split('(');
  const values = params.join('(').replace(')', '').split(',').map((v: any) => parseFloat(v.trim()));

  switch (type) {
    case 'ease-in':
      return progress * progress;
    case 'ease-out':
      return progress * (2 - progress);
    case 'ease-in-out':
      return progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
    case 'cubic-bezier':
      return cubicBezier(progress, values[0], values[1], values[2], values[3]);
    default:
      return progress;
  }
}

function cubicBezier(t: number, p0: number, p1: number, p2: number, p3: number): number {
  const u = 1 - t;
  return 3 * u * u * t * p1 + 3 * u * t * t * p3 + t * t * t;
}

// Predefined animation sequences
export const createFadeInSequence = (duration: number = 500): AnimationStep[] => [{
  id: 'fade-in',
  duration,
  easing: 'ease-out',
  transform: { opacity: 1 },
  onStart: () => console.log('Fade in started'),
  onComplete: () => console.log('Fade in completed'),
}];

export const createSlideInSequence = (
  direction: 'left' | 'right' | 'up' | 'down',
  distance: number = 50,
  duration: number = 500
): AnimationStep[] => {
  const transforms = {
    left: { x: 0, opacity: 1 },
    right: { x: 0, opacity: 1 },
    up: { y: 0, opacity: 1 },
    down: { y: 0, opacity: 1 },
  };

  return [{
    id: `slide-in-${direction}`,
    duration,
    easing: 'ease-out',
    transform: transforms[direction],
  }];
};

export const createScaleInSequence = (
  scale: number = 1.2,
  duration: number = 500
): AnimationStep[] => [{
  id: 'scale-in',
  duration,
  easing: 'ease-out',
  transform: { scale, opacity: 1 },
}];

export const createComplexSequence = (
  config: {
    fade?: boolean;
    slide?: { direction: 'left' | 'right' | 'up' | 'down'; distance?: number };
    scale?: number;
    duration?: number;
  }
): AnimationStep[] => {
  const { fade = true, slide, scale, duration = 500 } = config;

  const steps: AnimationStep[] = [];
  const stepDuration = duration / (1 + (slide ? 1 : 0) + (scale ? 1 : 0));

  if (fade) {
    steps.push({
      id: 'fade-in',
      duration: stepDuration,
      easing: 'ease-out',
      transform: { opacity: 1 },
    });
  }

  if (slide) {
    const { direction, distance = 50 } = slide;
    const transform = {
      left: { x: 0, opacity: 1 },
      right: { x: 0, opacity: 1 },
      up: { y: 0, opacity: 1 },
      down: { y: 0, opacity: 1 },
    }[direction];

    steps.push({
      id: `slide-in-${direction}`,
      duration: stepDuration,
      delay: fade ? stepDuration * 0.5 : 0,
      easing: 'ease-out',
      transform,
    });
  }

  if (scale) {
    steps.push({
      id: 'scale-in',
      duration: stepDuration,
      delay: (fade || slide) ? stepDuration * 0.7 : 0,
      easing: 'ease-out',
      transform: { scale, opacity: 1 },
    });
  }

  return steps;
};
