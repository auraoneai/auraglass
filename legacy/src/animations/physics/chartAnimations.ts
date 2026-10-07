import React from 'react';
import { ChartDataPoint, ChartSeries, ChartAnimation } from '../../components/charts/types';
import { InterpolationUtils, interpolate } from './interpolation';

export interface ChartAnimationConfig extends ChartAnimation {
  stagger?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'center';
  easing?: keyof typeof easingFunctions;
  delay?: number;
}

export interface ChartTransition {
  from: ChartSeries[];
  to: ChartSeries[];
  duration: number;
  easing: keyof typeof easingFunctions;
  stagger: number;
}

const easingFunctions = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => --t * t * t + 1,
  easeInOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
  easeInQuart: (t: number) => t * t * t * t,
  easeOutQuart: (t: number) => 1 - --t * t * t * t,
  easeInOutQuart: (t: number) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),
  easeInSine: (t: number) => 1 - Math.cos((t * Math.PI) / 2),
  easeOutSine: (t: number) => Math.sin((t * Math.PI) / 2),
  easeInOutSine: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,
  easeInExpo: (t: number) => (t === 0 ? 0 : Math.pow(2, 10 * t - 10)),
  easeOutExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutExpo: (t: number) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    return t < 0.5
      ? Math.pow(2, 20 * t - 10) / 2
      : (2 - Math.pow(2, -20 * t + 10)) / 2;
  },
  easeInBack: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return c3 * t * t * t - c1 * t * t;
  },
  easeOutBack: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeInOutBack: (t: number) => {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;
    return t < 0.5
      ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
      : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
  },
  easeOutElastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0
      ? 0
      : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
};

export class ChartAnimationUtils {
  /**
   * Animate chart data points with various effects
   */
  static animateDataPoints(
    dataPoints: ChartDataPoint[],
    config: ChartAnimationConfig,
    onUpdate?: (points: ChartDataPoint[], progress: number) => void,
    onComplete?: (points: ChartDataPoint[]) => void
  ): () => void {
    const {
      duration = 1000,
      stagger = 0,
      direction = 'up',
      easing = 'easeOutQuad',
      delay = 0,
    } = config;

    const startTime = Date.now() + delay;
    const easeFn = easingFunctions?.[easing];
    const animatedPoints = [...dataPoints];

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      const progress = easeFn(rawProgress);

      // Apply direction-based animation
      dataPoints.forEach((point, index) => {
        const staggerDelay = index * stagger;
        const pointProgress = Math.max(0, Math.min(1, (elapsed - staggerDelay) / duration));
        const easedPointProgress = easeFn(pointProgress);

        const animatedPoint = this.applyDirectionalAnimation(
          point,
          easedPointProgress,
          direction
        );

        if (animatedPoints) {
          animatedPoints[index] = animatedPoint;
        }
      });

      onUpdate?.(animatedPoints, progress);

      if (rawProgress < 1) {
        requestAnimationFrame(animate);
      } else {
        onComplete?.(animatedPoints);
      }
    };

    const timeoutId = setTimeout(() => {
      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timeoutId);
  }

  /**
   * Animate entire chart series
   */
  static animateSeries(
    series: ChartSeries[],
    config: ChartAnimationConfig,
    onUpdate?: (series: ChartSeries[], progress: number) => void,
    onComplete?: (series: ChartSeries[]) => void
  ): () => void {
    const {
      duration = 1000,
      stagger = 100,
      direction = 'up',
      easing = 'easeOutQuad',
      delay = 0,
    } = config;

    const startTime = Date.now() + delay;
    const easeFn = easingFunctions?.[easing];
    const animatedSeries = series.map((s: any) => ({ ...s, data: [...s.data] }));

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      const progress = easeFn(rawProgress);

      series.forEach((seriesItem, seriesIndex) => {
        const seriesDelay = seriesIndex * stagger;
        const seriesProgress = Math.max(0, Math.min(1, (elapsed - seriesDelay) / duration));
        const easedSeriesProgress = easeFn(seriesProgress);

        seriesItem.data?.forEach((point, pointIndex) => {
          const animatedPoint = this.applyDirectionalAnimation(
            point,
            easedSeriesProgress,
            direction
          );

          if (animatedSeries[seriesIndex].data) {
            animatedSeries[seriesIndex].data[pointIndex] = animatedPoint;
          }
        });
      });

      onUpdate?.(animatedSeries, progress);

      if (rawProgress < 1) {
        requestAnimationFrame(animate);
      } else {
        onComplete?.(animatedSeries);
      }
    };

    const timeoutId = setTimeout(() => {
      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timeoutId);
  }

  /**
   * Create morphing animation between two data sets
   */
  static createMorphingAnimation(
    fromSeries: ChartSeries[],
    toSeries: ChartSeries[],
    config: ChartAnimationConfig,
    onUpdate?: (series: ChartSeries[], progress: number) => void,
    onComplete?: (series: ChartSeries[]) => void
  ): () => void {
    const {
      duration = 1000,
      easing = 'easeInOutQuad',
      delay = 0,
    } = config;

    const startTime = Date.now() + delay;
    const easeFn = easingFunctions?.[easing];
    const morphedSeries = toSeries.map((s: any) => ({ ...s, data: [...s.data] }));

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      const progress = easeFn(rawProgress);

      toSeries.forEach((toSeriesItem, seriesIndex) => {
        const fromSeriesItem = fromSeries?.[seriesIndex];
        if (!fromSeriesItem) return;

        toSeriesItem.data?.forEach((toPoint, pointIndex) => {
          const fromPoint = fromSeriesItem.data?.[pointIndex];
          if (!fromPoint) return;

          const morphedPoint = {
            ...toPoint,
            x: InterpolationUtils.lerp(fromPoint.x as number, toPoint.x as number, progress),
            y: InterpolationUtils.lerp(fromPoint.y as number, toPoint.y as number, progress),
          };

          if (morphedSeries[seriesIndex].data) {
            morphedSeries[seriesIndex].data[pointIndex] = morphedPoint;
          }
        });
      });

      onUpdate?.(morphedSeries, progress);

      if (rawProgress < 1) {
        requestAnimationFrame(animate);
      } else {
        onComplete?.(morphedSeries);
      }
    };

    const timeoutId = setTimeout(() => {
      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timeoutId);
  }

  /**
   * Create entrance animation for chart elements
   */
  static createEntranceAnimation(
    series: ChartSeries[],
    effect: 'fadeIn' | 'slideIn' | 'scaleIn' | 'bounceIn' | 'elasticIn',
    config: ChartAnimationConfig,
    onUpdate?: (series: ChartSeries[], progress: number) => void,
    onComplete?: (series: ChartSeries[]) => void
  ): () => void {
    const {
      duration = 1000,
      stagger = 100,
      direction = 'up',
      delay = 0,
    } = config;

    const effects = {
      fadeIn: { opacity: 0 },
      slideIn: this.getDirectionalTransform(direction, 50),
      scaleIn: { scale: 0 },
      bounceIn: { scale: 0.3 },
      elasticIn: { scale: 0, rotation: -180 },
    };

    const effectConfig = effects?.[effect];
    const animatedSeries = series.map((s: any) => ({ ...s, data: [...s.data] }));

    return this.animateSeries(
      series,
      { ...config, duration, stagger, delay },
      (updatedSeries, progress) => {
        updatedSeries.forEach((seriesItem, seriesIndex) => {
          seriesItem.data?.forEach((point, pointIndex) => {
            if (animatedSeries[seriesIndex].data) {
              animatedSeries[seriesIndex].data[pointIndex] = {
                ...point,
                ...this.interpolatePointProperties(
                  effectConfig,
                  point,
                  progress
                ),
              };
            }
          });
        });

        onUpdate?.(animatedSeries, progress);
      },
      onComplete
    );
  }

  /**
   * Create exit animation for chart elements
   */
  static createExitAnimation(
    series: ChartSeries[],
    effect: 'fadeOut' | 'slideOut' | 'scaleOut' | 'bounceOut',
    config: ChartAnimationConfig,
    onUpdate?: (series: ChartSeries[], progress: number) => void,
    onComplete?: (series: ChartSeries[]) => void
  ): () => void {
    const {
      duration = 500,
      stagger = 50,
      direction = 'down',
      delay = 0,
    } = config;

    const effects = {
      fadeOut: { opacity: 1 },
      slideOut: this.getDirectionalTransform(direction, 0),
      scaleOut: { scale: 1 },
      bounceOut: { scale: 1 },
    };

    const effectConfig = effects?.[effect];
    const animatedSeries = series.map((s: any) => ({ ...s, data: [...s.data] }));

    return this.animateSeries(
      series,
      { ...config, duration, stagger, delay },
      (updatedSeries, progress) => {
        const exitProgress = 1 - progress;

        updatedSeries.forEach((seriesItem, seriesIndex) => {
          seriesItem.data?.forEach((point, pointIndex) => {
            if (animatedSeries[seriesIndex].data) {
              animatedSeries[seriesIndex].data[pointIndex] = {
                ...point,
                ...this.interpolatePointProperties(
                  effectConfig,
                  point,
                  exitProgress
                ),
              };
            }
          });
        });

        onUpdate?.(animatedSeries, progress);
      },
      onComplete
    );
  }

  private static applyDirectionalAnimation(
    point: ChartDataPoint,
    progress: number,
    direction: string
  ): ChartDataPoint {
    const transform = this.getDirectionalTransform(direction, 1 - progress);
    return {
      ...point,
      ...this.interpolatePointProperties(transform, point, progress),
    };
  }

  private static getDirectionalTransform(direction: string, distance: number) {
    switch (direction) {
      case 'up':
        return { y: distance * 50 };
      case 'down':
        return { y: -distance * 50 };
      case 'left':
        return { x: distance * 50 };
      case 'right':
        return { x: -distance * 50 };
      case 'center':
        return { scale: distance };
      default:
        return { y: distance * 50 };
    }
  }

  private static interpolatePointProperties(
    transform: any,
    point: ChartDataPoint,
    progress: number
  ): Partial<ChartDataPoint> {
    const result: any = {};

    if (transform.x !== undefined) {
      result.x = (point.x as number) + transform.x * (1 - progress);
    }

    if (transform.y !== undefined) {
      result.y = (point.y as number) + transform.y * (1 - progress);
    }

    if (transform.scale !== undefined) {
      // Scale would typically be handled by CSS transform
      result.scale = InterpolationUtils.lerp(transform.scale, 1, progress);
    }

    if (transform.opacity !== undefined) {
      result.opacity = InterpolationUtils.lerp(transform.opacity, 1, progress);
    }

    if (transform.rotation !== undefined) {
      result.rotation = InterpolationUtils.lerp(transform.rotation, 0, progress);
    }

    return result;
  }

  /**
   * Create a smooth transition between chart states
   */
  static createChartTransition(
    transition: ChartTransition,
    onUpdate?: (series: ChartSeries[], progress: number) => void,
    onComplete?: (series: ChartSeries[]) => void
  ): () => void {
    const { from, to, duration, easing, stagger } = transition;
    const easeFn = easingFunctions?.[easing];

    const startTime = Date.now();
    const animatedSeries = to.map((s: any) => ({ ...s, data: [...s.data] }));

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      const progress = easeFn(rawProgress);

      to.forEach((toSeriesItem, seriesIndex) => {
        const fromSeriesItem = from?.[seriesIndex];
        if (!fromSeriesItem) return;

        const seriesDelay = seriesIndex * stagger;
        const seriesProgress = Math.max(0, Math.min(1,
          (elapsed - seriesDelay) / duration
        ));
        const easedSeriesProgress = easeFn(seriesProgress);

        toSeriesItem.data?.forEach((toPoint, pointIndex) => {
          const fromPoint = fromSeriesItem.data?.[pointIndex];
          if (!fromPoint) return;

          if (animatedSeries[seriesIndex].data) {
            animatedSeries[seriesIndex].data[pointIndex] = {
              ...toPoint,
              x: InterpolationUtils.lerp(fromPoint.x as number, toPoint.x as number, easedSeriesProgress),
              y: InterpolationUtils.lerp(fromPoint.y as number, toPoint.y as number, easedSeriesProgress),
            };
          }
        });
      });

      onUpdate?.(animatedSeries, progress);

      if (rawProgress < 1) {
        requestAnimationFrame(animate);
      } else {
        onComplete?.(animatedSeries);
      }
    };

    const animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }
}

// Predefined animation presets
export const chartAnimationPresets = {
  gentleFadeIn: {
    duration: 800,
    easing: 'easeOutQuad' as const,
    stagger: 50,
    direction: 'up' as const,
  },

  dramaticEntrance: {
    duration: 1200,
    easing: 'easeOutBack' as const,
    stagger: 100,
    direction: 'center' as const,
  },

  smoothSlideIn: {
    duration: 600,
    easing: 'easeOutCubic' as const,
    stagger: 75,
    direction: 'left' as const,
  },

  bouncyScale: {
    duration: 1000,
    easing: 'easeOutElastic' as const,
    stagger: 150,
    direction: 'center' as const,
  },

  subtleMorph: {
    duration: 500,
    easing: 'easeInOutQuad' as const,
    stagger: 0,
    direction: 'up' as const,
  },
};

// Utility functions for common chart animations
export const animateChart = {
  fadeIn: (
    series: ChartSeries[],
    config?: Partial<ChartAnimationConfig>,
    callbacks?: { onUpdate?: (series: ChartSeries[], progress: number) => void; onComplete?: (series: ChartSeries[]) => void }
  ) => ChartAnimationUtils.createEntranceAnimation(series, 'fadeIn', { ...chartAnimationPresets.gentleFadeIn, ...config }, callbacks?.onUpdate, callbacks?.onComplete),

  slideIn: (
    series: ChartSeries[],
    direction: 'up' | 'down' | 'left' | 'right' = 'up',
    config?: Partial<ChartAnimationConfig>,
    callbacks?: { onUpdate?: (series: ChartSeries[], progress: number) => void; onComplete?: (series: ChartSeries[]) => void }
  ) => ChartAnimationUtils.createEntranceAnimation(series, 'slideIn', { ...chartAnimationPresets.smoothSlideIn, direction, ...config }, callbacks?.onUpdate, callbacks?.onComplete),

  scaleIn: (
    series: ChartSeries[],
    config?: Partial<ChartAnimationConfig>,
    callbacks?: { onUpdate?: (series: ChartSeries[], progress: number) => void; onComplete?: (series: ChartSeries[]) => void }
  ) => ChartAnimationUtils.createEntranceAnimation(series, 'scaleIn', { ...chartAnimationPresets.bouncyScale, ...config }, callbacks?.onUpdate, callbacks?.onComplete),

  morph: (
    from: ChartSeries[],
    to: ChartSeries[],
    config?: Partial<ChartAnimationConfig>,
    callbacks?: { onUpdate?: (series: ChartSeries[], progress: number) => void; onComplete?: (series: ChartSeries[]) => void }
  ) => ChartAnimationUtils.createMorphingAnimation(from, to, { ...chartAnimationPresets.subtleMorph, ...config }, callbacks?.onUpdate, callbacks?.onComplete),

  transition: (
    transition: ChartTransition,
    callbacks?: { onUpdate?: (series: ChartSeries[], progress: number) => void; onComplete?: (series: ChartSeries[]) => void }
  ) => ChartAnimationUtils.createChartTransition(transition, callbacks?.onUpdate, callbacks?.onComplete),
};
