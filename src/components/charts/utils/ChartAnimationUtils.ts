import React from 'react';
import { ChartDataPoint, ChartSeries, ChartAnimation } from '../types';

export interface AnimationKeyframe {
  progress: number;
  value: number;
  easing?: (t: number) => number;
}

export interface AnimationSequence {
  keyframes: AnimationKeyframe[];
  duration: number;
  delay: number;
  repeat: boolean;
  yoyo: boolean;
}

// Easing functions
export const easingFunctions = {
  linear: (t: number): number => t,
  easeInQuad: (t: number): number => t * t,
  easeOutQuad: (t: number): number => t * (2 - t),
  easeInOutQuad: (t: number): number => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t: number): number => t * t * t,
  easeOutCubic: (t: number): number => --t * t * t + 1,
  easeInOutCubic: (t: number): number => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
  easeInQuart: (t: number): number => t * t * t * t,
  easeOutQuart: (t: number): number => 1 - --t * t * t * t,
  easeInOutQuart: (t: number): number => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),
  easeInSine: (t: number): number => 1 - Math.cos((t * Math.PI) / 2),
  easeOutSine: (t: number): number => Math.sin((t * Math.PI) / 2),
  easeInOutSine: (t: number): number => -(Math.cos(Math.PI * t) - 1) / 2,
  easeInExpo: (t: number): number => (t === 0 ? 0 : Math.pow(2, 10 * t - 10)),
  easeOutExpo: (t: number): number => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutExpo: (t: number): number => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    return t < 0.5
      ? Math.pow(2, 20 * t - 10) / 2
      : (2 - Math.pow(2, -20 * t + 10)) / 2;
  },
  easeInCirc: (t: number): number => 1 - Math.sqrt(1 - Math.pow(t, 2)),
  easeOutCirc: (t: number): number => Math.sqrt(1 - Math.pow(t - 1, 2)),
  easeInOutCirc: (t: number): number => {
    return t < 0.5
      ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2
      : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2;
  },
  easeInBack: (t: number): number => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return c3 * t * t * t - c1 * t * t;
  },
  easeOutBack: (t: number): number => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeInOutBack: (t: number): number => {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;
    return t < 0.5
      ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
      : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
  },
  easeOutBounce: (t: number): number => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  },
  easeInBounce: (t: number): number => 1 - easingFunctions.easeOutBounce(1 - t),
  easeInOutBounce: (t: number): number =>
    t < 0.5
      ? (1 - easingFunctions.easeOutBounce(1 - 2 * t)) / 2
      : (1 + easingFunctions.easeOutBounce(2 * t - 1)) / 2,
};

// Animation utilities
export class ChartAnimationUtils {
  static createKeyframeSequence(
    from: number,
    to: number,
    steps: number = 10,
    easing: keyof typeof easingFunctions = 'easeOutQuad'
  ): AnimationKeyframe[] {
    const keyframes: AnimationKeyframe[] = [];
    const easeFn = easingFunctions[easing];

    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      const easedProgress = easeFn(progress);
      const value = from + (to - from) * easedProgress;

      keyframes.push({
        progress,
        value,
        easing: easeFn,
      });
    }

    return keyframes;
  }

  static interpolateValue(
    from: number,
    to: number,
    progress: number,
    easing: keyof typeof easingFunctions = 'linear'
  ): number {
    const easeFn = easingFunctions[easing];
    const easedProgress = easeFn(progress);
    return from + (to - from) * easedProgress;
  }

  static animateDataPoints(
    dataPoints: ChartDataPoint[],
    targetValues: number[],
    progress: number,
    easing: keyof typeof easingFunctions = 'easeOutQuad'
  ): ChartDataPoint[] {
    return dataPoints.map((point, index) => {
      const targetValue = targetValues[index];
      if (targetValue === undefined || typeof point.y !== 'number') {
        return point;
      }

      const animatedValue = this.interpolateValue(point.y, targetValue, progress, easing);
      return {
        ...point,
        y: animatedValue,
      };
    });
  }

  static animateSeries(
    series: ChartSeries[],
    targetSeries: ChartSeries[],
    progress: number,
    easing: keyof typeof easingFunctions = 'easeOutQuad',
    staggerDelay: number = 0
  ): ChartSeries[] {
    return series.map((seriesItem, seriesIndex) => {
      const targetSeriesItem = targetSeries[seriesIndex];
      if (!targetSeriesItem) return seriesItem;

      const seriesProgress = Math.max(0, Math.min(1,
        progress - (staggerDelay * seriesIndex) / 1000
      ));

      const animatedData = this.animateDataPoints(
        seriesItem.data,
        targetSeriesItem.data.map((p: any) => typeof p.y === 'number' ? p.y : 0),
        seriesProgress,
        easing
      );

      return {
        ...seriesItem,
        data: animatedData,
      };
    });
  }

  static createSequence(
    keyframes: AnimationKeyframe[],
    duration: number,
    delay: number = 0,
    repeat: boolean = false,
    yoyo: boolean = false
  ): AnimationSequence {
    return {
      keyframes,
      duration,
      delay,
      repeat,
      yoyo,
    };
  }

  static getValueAtProgress(
    sequence: AnimationSequence,
    progress: number
  ): number {
    if (sequence.keyframes.length === 0) return 0;
    if (sequence.keyframes.length === 1) return sequence.keyframes[0].value;

    // Find the appropriate keyframe pair
    for (let i = 0; i < sequence.keyframes.length - 1; i++) {
      const current = sequence.keyframes[i];
      const next = sequence.keyframes[i + 1];

      if (progress >= current.progress && progress <= next.progress) {
        const localProgress = (progress - current.progress) / (next.progress - current.progress);
        const easedProgress = next.easing ? next.easing(localProgress) : localProgress;
        return current.value + (next.value - current.value) * easedProgress;
      }
    }

    // Return last keyframe value if progress is beyond the sequence
    return sequence.keyframes[sequence.keyframes.length - 1].value;
  }

  static createSpringAnimation(
    from: number,
    to: number,
    config: { stiffness?: number; damping?: number; mass?: number } = {}
  ): AnimationSequence {
    const { stiffness = 100, damping = 10, mass = 1 } = config;

    // Generate keyframes based on spring physics
    const keyframes: AnimationKeyframe[] = [];
    const steps = 60; // 60fps for smooth animation
    const dt = 1 / steps;

    let position = from;
    let velocity = 0;
    let time = 0;
    const maxTime = 2; // Maximum animation time in seconds

    while (time < maxTime) {
      const displacement = to - position;
      const springForce = displacement * stiffness;
      const dampingForce = -velocity * damping;
      const acceleration = (springForce + dampingForce) / mass;

      velocity += acceleration * dt;
      position += velocity * dt;

      const progress = Math.min(time / maxTime, 1);
      keyframes.push({
        progress,
        value: position,
        easing: easingFunctions.easeOutQuad,
      });

      // Stop if we're close enough to target and velocity is low
      if (Math.abs(displacement) < 0.01 && Math.abs(velocity) < 0.01) {
        break;
      }

      time += dt;
    }

    // Ensure we end at the target value
    keyframes.push({
      progress: 1,
      value: to,
      easing: easingFunctions.easeOutQuad,
    });

    return {
      keyframes,
      duration: time * 1000,
      delay: 0,
      repeat: false,
      yoyo: false,
    };
  }

  static createMorphingAnimation(
    fromShape: ChartDataPoint[],
    toShape: ChartDataPoint[],
    config: { steps?: number; easing?: keyof typeof easingFunctions } = {}
  ): AnimationSequence {
    const { steps = 20, easing = 'easeInOutQuad' } = config;
    const keyframes: AnimationKeyframe[] = [];

    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      const easedProgress = easingFunctions[easing](progress);

      keyframes.push({
        progress,
        value: easedProgress,
        easing: easingFunctions[easing],
      });
    }

    return {
      keyframes,
      duration: 1000,
      delay: 0,
      repeat: false,
      yoyo: false,
    };
  }
}

// Utility functions for common animation patterns
export const createFadeInAnimation = (
  duration: number = 500,
  delay: number = 0
): AnimationSequence => {
  return ChartAnimationUtils.createSequence(
    ChartAnimationUtils.createKeyframeSequence(0, 1, 10, 'easeOutQuad'),
    duration,
    delay,
    false,
    false
  );
};

export const createSlideInAnimation = (
  direction: 'left' | 'right' | 'up' | 'down' = 'up',
  distance: number = 50,
  duration: number = 500,
  delay: number = 0
): AnimationSequence => {
  const fromX = direction === 'left' ? -distance : direction === 'right' ? distance : 0;
  const fromY = direction === 'up' ? -distance : direction === 'down' ? distance : 0;

  return ChartAnimationUtils.createSequence(
    ChartAnimationUtils.createKeyframeSequence(0, 1, 10, 'easeOutQuad'),
    duration,
    delay,
    false,
    false
  );
};

export const createScaleInAnimation = (
  from: number = 0,
  to: number = 1,
  duration: number = 500,
  delay: number = 0
): AnimationSequence => {
  return ChartAnimationUtils.createSequence(
    ChartAnimationUtils.createKeyframeSequence(from, to, 10, 'easeOutBack'),
    duration,
    delay,
    false,
    false
  );
};

export const createBounceAnimation = (
  amplitude: number = 20,
  duration: number = 1000,
  delay: number = 0
): AnimationSequence => {
  const keyframes: AnimationKeyframe[] = [
    { progress: 0, value: 0, easing: easingFunctions.easeOutQuad },
    { progress: 0.2, value: -amplitude * 0.6, easing: easingFunctions.easeOutQuad },
    { progress: 0.4, value: amplitude * 0.4, easing: easingFunctions.easeOutQuad },
    { progress: 0.6, value: -amplitude * 0.2, easing: easingFunctions.easeOutQuad },
    { progress: 0.8, value: amplitude * 0.1, easing: easingFunctions.easeOutQuad },
    { progress: 1, value: 0, easing: easingFunctions.easeOutQuad },
  ];

  return ChartAnimationUtils.createSequence(keyframes, duration, delay, false, false);
};

// Utility functions for common animation patterns
export const calculateDamping = (dampingRatio: number, stiffness: number, mass: number): number => {
  return 2 * Math.sqrt(mass * stiffness) * dampingRatio;
};

export const createAnimationOptions = (
  config: { duration?: number; easing?: string; delay?: number; } = {}
): any => {
  const { duration = 1000, easing = 'easeOutQuad', delay = 0 } = config;

  return {
    duration,
    easing: easingFunctions[easing as keyof typeof easingFunctions] || easingFunctions.easeOutQuad,
    delay,
    fill: 'both' as const,
  };
};

export const pathAnimationPlugin = {
  id: 'pathAnimation',
  
  beforeInit: (chart: any) => {
    chart.pathAnimation = {
      progress: 0,
      duration: 1000,
      startTime: 0,
      animating: false,
    };
  },

  beforeDraw: (chart: any, args: any, options: any) => {
    const ctx = chart.ctx;
    const pathAnim = chart.pathAnimation;
    
    if (!pathAnim.animating) return;

    const elapsed = Date.now() - pathAnim.startTime;
    const progress = Math.min(elapsed / pathAnim.duration, 1);
    
    // Update progress
    pathAnim.progress = progress;

    // Apply path animation to line datasets
    chart.data.datasets.forEach((dataset: any, datasetIndex: number) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      
      if (meta.type === 'line' && meta.data) {
        meta.data.forEach((element: any, index: number) => {
          if (index / meta.data.length <= progress) {
            element._view = element._model;
          } else {
            // Hide elements that haven't been drawn yet
            element._view = { ...element._model, skip: true };
          }
        });
      }
    });

    // Complete animation when done
    if (progress >= 1) {
      pathAnim.animating = false;
      chart.update('none');
    }
  },

  // Utility method to start path animation
  startAnimation: (chart: any, duration: number = 1000) => {
    if (chart.pathAnimation) {
      chart.pathAnimation.startTime = Date.now();
      chart.pathAnimation.duration = duration;
      chart.pathAnimation.animating = true;
      chart.pathAnimation.progress = 0;
    }
  },
};

// Additional utility functions
export const createEntranceAnimation = (
  series: any[],
  type: 'fadeIn' | 'slideIn' | 'scaleIn' | 'bounceIn' = 'fadeIn',
  config: { duration?: number; delay?: number; stagger?: number } = {},
  onUpdate?: (progress: number) => void,
  onComplete?: () => void
) => {
  const { duration = 1000, delay = 0, stagger = 100 } = config;

  return {
    duration,
    delay,
    stagger,
    easing: 'easeOutCubic',
    onUpdate,
    onComplete,
  };
};
