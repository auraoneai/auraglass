import React from 'react';
import { useRef, useCallback, useEffect, useState } from 'react';

export interface OrchestratedAnimationStep {
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

export interface OrchestrationConfig {
  autoPlay?: boolean;
  loop?: boolean;
  reverse?: boolean;
  speed?: number;
  paused?: boolean;
  parallel?: boolean; // Run steps in parallel instead of sequence
}

export interface OrchestrationState {
  isPlaying: boolean;
  isPaused: boolean;
  currentStep: number;
  totalSteps: number;
  progress: number;
  elapsed: number;
  totalDuration: number;
}

export function useAnimationSequence(
  steps: OrchestratedAnimationStep[],
  config: OrchestrationConfig = {}
) {
  const {
    autoPlay = false,
    loop = false,
    reverse = false,
    speed = 1,
    paused = false,
    parallel = false,
  } = config;

  const [state, setState] = useState<OrchestrationState>({
    isPlaying: false,
    isPaused: false,
    currentStep: 0,
    totalSteps: steps.length,
    progress: 0,
    elapsed: 0,
    totalDuration: parallel
      ? Math.max(...steps.map((s: any) => s.duration + (s.delay || 0)))
      : steps.reduce((total, step) => total + step.duration + (step.delay || 0), 0),
  });

  const elementRef = useRef<HTMLElement>(null);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const stepStartTimesRef = useRef<number[]>([]);
  const completedStepsRef = useRef<Set<number>>(new Set());

  // Calculate total duration
  const totalDuration = parallel
    ? Math.max(...steps.map((s: any) => s.duration + (s.delay || 0)))
    : steps.reduce((total, step) => total + step.duration + (step.delay || 0), 0);

  const applyStepTransform = useCallback((step: OrchestratedAnimationStep, progress: number = 1) => {
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
      stepStartTimesRef.current = new Array(steps.length).fill(0);
      completedStepsRef.current.clear();
    }

    const elapsed = (timestamp - startTimeRef.current) * speed;

    if (parallel) {
      // Parallel execution
      let allCompleted = true;
      let maxProgress = 0;

      steps.forEach((step, index) => {
        const stepDelay = step.delay || 0;
        const stepStartTime = stepStartTimesRef.current[index] || (startTimeRef.current + stepDelay);

        if (elapsed >= stepDelay) {
          if (stepStartTimesRef.current[index] === 0) {
            stepStartTimesRef.current[index] = timestamp;
            step.onStart?.();
          }

          const stepElapsed = (timestamp - stepStartTime) * speed;
          const stepProgress = Math.min(stepElapsed / step.duration, 1);

          animateStep(index, stepProgress);
          maxProgress = Math.max(maxProgress, stepProgress);

          if (stepProgress >= 1 && !completedStepsRef.current.has(index)) {
            completedStepsRef.current.add(index);
            step.onComplete?.();
          }

          if (stepProgress < 1) {
            allCompleted = false;
          }
        } else {
          allCompleted = false;
        }
      });

      setState((prev: any) => ({
        ...prev,
        progress: maxProgress,
        elapsed,
      }));

      if (allCompleted) {
        setState((prev: any) => ({ ...prev, isPlaying: false, progress: 1 }));

        if (loop) {
          // Restart animation
          startTimeRef.current = 0;
          stepStartTimesRef.current = new Array(steps.length).fill(0);
          completedStepsRef.current.clear();
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
    } else {
      // Sequential execution
      let accumulatedTime = 0;
      let currentStepIndex = 0;
      let stepElapsed = 0;

      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const stepDuration = step.duration + (step.delay || 0);

        if (elapsed >= accumulatedTime && elapsed < accumulatedTime + stepDuration) {
          currentStepIndex = i;
          stepElapsed = elapsed - accumulatedTime;
          break;
        }

        accumulatedTime += stepDuration;
      }

      // Handle step transitions
      if (currentStepIndex !== state.currentStep) {
        // Complete previous step
        const prevStep = steps[state.currentStep];
        prevStep?.onComplete?.();

        // Start new step
        const newStep = steps[currentStepIndex];
        newStep?.onStart?.();
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
      const overallProgress = elapsed / totalDuration;
      setState((prev: any) => ({
        ...prev,
        currentStep: currentStepIndex,
        progress: overallProgress,
        elapsed,
      }));

      if (elapsed >= totalDuration) {
        // Animation complete
        setState((prev: any) => ({
          ...prev,
          isPlaying: false,
          progress: 1,
        }));

        // Complete final step
        const finalStep = steps[steps.length - 1];
        finalStep.onComplete?.();

        if (loop) {
          // Restart animation
          startTimeRef.current = 0;
          stepStartTimesRef.current = new Array(steps.length).fill(0);
          completedStepsRef.current.clear();
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
    }

    animationRef.current = requestAnimationFrame(runAnimation);
  }, [
    steps,
    speed,
    totalDuration,
    reverse,
    loop,
    parallel,
    applyStepTransform,
    animateStep,
    state.currentStep,
  ]);

  const play = useCallback(() => {
    if (state.isPlaying) return;

    setState((prev: any) => ({
      ...prev,
      isPlaying: true,
      isPaused: false,
    }));

    startTimeRef.current = 0;
    stepStartTimesRef.current = new Array(steps.length).fill(0);
    completedStepsRef.current = new Set();
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
  }, [state.isPlaying]);

  const stop = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }

    startTimeRef.current = 0;
    stepStartTimesRef.current = new Array(steps.length).fill(0);
    completedStepsRef.current = new Set();

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
    startTimeRef.current = Date.now() - seekTime / speed;

    setState((prev: any) => ({
      ...prev,
      progress,
      elapsed: seekTime,
    }));

    // This is a simplified seek implementation
    // In a full implementation, you'd need to calculate which step and at what progress
  }, [totalDuration, speed]);

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
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  return 3 * uu * t * p1 + 3 * u * tt * p2 + ttt;
}

// Predefined orchestration sequences
export const orchestrationPresets = {
  staggeredFadeIn: [
    { id: 'step1', duration: 300, delay: 0, transform: { opacity: 1 } },
    { id: 'step2', duration: 300, delay: 100, transform: { opacity: 1 } },
    { id: 'step3', duration: 300, delay: 200, transform: { opacity: 1 } },
  ],

  cascadingSlideIn: [
    { id: 'slide1', duration: 400, delay: 0, transform: { x: 0 }, easing: 'ease-out' },
    { id: 'slide2', duration: 400, delay: 150, transform: { x: 0 }, easing: 'ease-out' },
    { id: 'slide3', duration: 400, delay: 300, transform: { x: 0 }, easing: 'ease-out' },
  ],

  parallelScaleIn: [
    { id: 'scale1', duration: 500, delay: 0, transform: { scale: 1 }, easing: 'ease-out' },
    { id: 'scale2', duration: 500, delay: 0, transform: { scale: 1 }, easing: 'ease-out' },
    { id: 'scale3', duration: 500, delay: 0, transform: { scale: 1 }, easing: 'ease-out' },
  ],

  complexOrchestration: [
    { id: 'initial', duration: 200, transform: { opacity: 1, scale: 0.8 } },
    { id: 'grow', duration: 300, delay: 100, transform: { scale: 1.1 }, easing: 'ease-out' },
    { id: 'settle', duration: 200, delay: 50, transform: { scale: 1 }, easing: 'ease-in-out' },
    { id: 'slide', duration: 400, delay: 0, transform: { x: 0 }, easing: 'ease-out' },
  ],
};

// Utility functions for creating complex orchestrations
export const createOrchestration = {
  fromSteps: (steps: OrchestratedAnimationStep[], config?: OrchestrationConfig) => ({
    steps,
    config: { ...config },
  }),

  staggered: (
    baseStep: Omit<OrchestratedAnimationStep, 'id' | 'delay'>,
    count: number,
    staggerDelay: number
  ): OrchestratedAnimationStep[] => {
    return Array.from({ length: count }, (_, i) => ({
      ...baseStep,
      id: `step-${i}`,
      delay: i * staggerDelay,
    }));
  },

  parallel: (
    steps: Omit<OrchestratedAnimationStep, 'id'>[]
  ): OrchestratedAnimationStep[] => {
    return steps.map((step, i) => ({
      ...step,
      id: `parallel-${i}`,
      delay: step.delay || 0,
    }));
  },

  sequence: (
    steps: Omit<OrchestratedAnimationStep, 'id'>[]
  ): OrchestratedAnimationStep[] => {
    let accumulatedDelay = 0;
    return steps.map((step, i) => {
      const result = {
        ...step,
        id: `sequence-${i}`,
        delay: accumulatedDelay,
      };
      accumulatedDelay += step.duration + (step.delay || 0);
      return result;
    });
  },
};
