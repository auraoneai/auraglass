/**
 * Animation Orchestration Hook
 * Provides synchronized multi-element animation control with sequencing and choreography
 */

import { useCallback, useRef, useState, useEffect } from 'react';
import { UnsubscribeFunction } from '../../types/common';

/**
 * Public animation stage states
 */
export enum PublicAnimationStage {
  IDLE = 'idle',
  PREPARING = 'preparing',
  ENTERING = 'entering',
  ACTIVE = 'active',
  EXITING = 'exiting',
  COMPLETED = 'completed',
  PAUSED = 'paused',
  ERROR = 'error',
}

/**
 * Animation element configuration
 */
export interface AnimationElement {
  id: string;
  delay?: number;
  duration?: number;
  easing?: string;
  properties?: Record<string, any>;
  onStart?: () => void;
  onComplete?: () => void;
}

/**
 * Orchestration sequence configuration
 */
export interface OrchestrationSequence {
  elements: AnimationElement[];
  mode?: 'parallel' | 'sequential' | 'stagger';
  staggerDelay?: number;
  loop?: boolean | number; // false, true (infinite), or number of iterations
  onSequenceStart?: () => void;
  onSequenceComplete?: () => void;
  onStageChange?: (stage: PublicAnimationStage) => void;
}

/**
 * Orchestration state
 */
interface OrchestrationState {
  stage: PublicAnimationStage;
  currentElementIndex: number;
  iteration: number;
  startTime: number;
  pausedTime: number;
  elapsedTime: number;
}

/**
 * Hook for orchestrating complex animations
 */
export const useOrchestration = (sequence: OrchestrationSequence) => {
  const {
    elements = [],
    mode = 'sequential',
    staggerDelay = 100,
    loop = false,
    onSequenceStart,
    onSequenceComplete,
    onStageChange,
  } = sequence;

  const [stage, setStage] = useState<PublicAnimationStage>(PublicAnimationStage.IDLE);
  const [progress, setProgress] = useState(0);
  const [currentElementId, setCurrentElementId] = useState<string | null>(null);

  const stateRef = useRef<OrchestrationState>({
    stage: PublicAnimationStage.IDLE,
    currentElementIndex: 0,
    iteration: 0,
    startTime: 0,
    pausedTime: 0,
    elapsedTime: 0,
  });

  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const activeAnimationsRef = useRef<Set<string>>(new Set());

  /**
   * Update stage
   */
  const updateStage = useCallback(
    (newStage: PublicAnimationStage) => {
      setStage(newStage);
      stateRef.current.stage = newStage;
      onStageChange?.(newStage);
    },
    [onStageChange]
  );

  /**
   * Clear all timers
   */
  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  /**
   * Animate single element
   */
  const animateElement = useCallback(
    (element: AnimationElement, delay: number = 0): Promise<void> => {
      return new Promise((resolve) => {
        const timer = setTimeout(() => {
          activeAnimationsRef.current.add(element.id);
          setCurrentElementId(element.id);
          element.onStart?.();

          // Simulate animation duration
          const animationTimer = setTimeout(() => {
            element.onComplete?.();
            activeAnimationsRef.current.delete(element.id);
            resolve();
          }, element.duration || 300);

          timersRef.current.push(animationTimer);
        }, delay);

        timersRef.current.push(timer);
      });
    },
    []
  );

  /**
   * Execute sequence in parallel mode
   */
  const executeParallel = useCallback(async () => {
    updateStage(PublicAnimationStage.ENTERING);
    const promises = elements.map((element) => animateElement(element, element.delay || 0));
    await Promise.all(promises);
    updateStage(PublicAnimationStage.COMPLETED);
  }, [elements, animateElement, updateStage]);

  /**
   * Execute sequence in sequential mode
   */
  const executeSequential = useCallback(async () => {
    updateStage(PublicAnimationStage.ENTERING);

    for (let i = 0; i < elements.length; i++) {
      stateRef.current.currentElementIndex = i;
      await animateElement(elements[i], elements[i].delay || 0);
      setProgress(((i + 1) / elements.length) * 100);
    }

    updateStage(PublicAnimationStage.COMPLETED);
  }, [elements, animateElement, updateStage]);

  /**
   * Execute sequence in stagger mode
   */
  const executeStagger = useCallback(async () => {
    updateStage(PublicAnimationStage.ENTERING);

    const promises = elements.map((element, index) =>
      animateElement(element, (element.delay || 0) + index * staggerDelay)
    );

    await Promise.all(promises);
    updateStage(PublicAnimationStage.COMPLETED);
  }, [elements, staggerDelay, animateElement, updateStage]);

  /**
   * Start the orchestration
   */
  const start = useCallback(async () => {
    if (stateRef.current.stage !== PublicAnimationStage.IDLE) {
      return;
    }

    clearAllTimers();
    updateStage(PublicAnimationStage.PREPARING);
    stateRef.current.startTime = Date.now();
    stateRef.current.iteration = 0;

    onSequenceStart?.();

    const execute = async () => {
      updateStage(PublicAnimationStage.ACTIVE);

      switch (mode) {
        case 'parallel':
          await executeParallel();
          break;
        case 'sequential':
          await executeSequential();
          break;
        case 'stagger':
          await executeStagger();
          break;
      }

      // Handle looping
      if (loop) {
        stateRef.current.iteration += 1;

        if (typeof loop === 'number' && stateRef.current.iteration >= loop) {
          updateStage(PublicAnimationStage.COMPLETED);
          onSequenceComplete?.();
        } else {
          // Restart sequence
          stateRef.current.currentElementIndex = 0;
          setProgress(0);
          await execute();
        }
      } else {
        onSequenceComplete?.();
      }
    };

    await execute();
  }, [
    loop,
    mode,
    clearAllTimers,
    updateStage,
    executeParallel,
    executeSequential,
    executeStagger,
    onSequenceStart,
    onSequenceComplete,
  ]);

  /**
   * Pause the orchestration
   */
  const pause = useCallback(() => {
    if (stateRef.current.stage === PublicAnimationStage.ACTIVE) {
      clearAllTimers();
      stateRef.current.pausedTime = Date.now();
      updateStage(PublicAnimationStage.PAUSED);
    }
  }, [clearAllTimers, updateStage]);

  /**
   * Resume the orchestration
   */
  const resume = useCallback(() => {
    if (stateRef.current.stage === PublicAnimationStage.PAUSED) {
      const pausedDuration = Date.now() - stateRef.current.pausedTime;
      stateRef.current.startTime += pausedDuration;
      updateStage(PublicAnimationStage.ACTIVE);
      // Would need to re-execute remaining animations
    }
  }, [updateStage]);

  /**
   * Stop the orchestration
   */
  const stop = useCallback(() => {
    clearAllTimers();
    activeAnimationsRef.current.clear();
    setProgress(0);
    setCurrentElementId(null);
    stateRef.current.currentElementIndex = 0;
    stateRef.current.iteration = 0;
    updateStage(PublicAnimationStage.IDLE);
  }, [clearAllTimers, updateStage]);

  /**
   * Reset the orchestration
   */
  const reset = useCallback(() => {
    stop();
  }, [stop]);

  /**
   * Seek to specific element
   */
  const seekToElement = useCallback(
    (elementId: string) => {
      const index = elements.findIndex((el) => el.id === elementId);
      if (index !== -1) {
        stateRef.current.currentElementIndex = index;
        setCurrentElementId(elementId);
        setProgress((index / elements.length) * 100);
      }
    },
    [elements]
  );

  /**
   * Get current state
   */
  const getState = useCallback(() => {
    return {
      stage: stateRef.current.stage,
      currentElementIndex: stateRef.current.currentElementIndex,
      currentElementId,
      iteration: stateRef.current.iteration,
      progress,
      activeAnimations: Array.from(activeAnimationsRef.current),
      elapsedTime: Date.now() - stateRef.current.startTime,
    };
  }, [currentElementId, progress]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  return {
    stage,
    progress,
    currentElementId,
    start,
    pause,
    resume,
    stop,
    reset,
    seekToElement,
    getState,
    isAnimating: stage === PublicAnimationStage.ACTIVE || stage === PublicAnimationStage.ENTERING,
    isPaused: stage === PublicAnimationStage.PAUSED,
    isCompleted: stage === PublicAnimationStage.COMPLETED,
  };
};

/**
 * Higher-order function to create orchestration sequences
 */
export const createOrchestrationSequence = (
  elements: AnimationElement[],
  options: Partial<OrchestrationSequence> = {}
): OrchestrationSequence => ({
  elements,
  mode: options.mode || 'sequential',
  staggerDelay: options.staggerDelay || 100,
  loop: options.loop || false,
  onSequenceStart: options.onSequenceStart,
  onSequenceComplete: options.onSequenceComplete,
  onStageChange: options.onStageChange,
});
