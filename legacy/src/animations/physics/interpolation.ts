import React from 'react';
export interface InterpolationPoint {
  x: number;
  y: number;
  tension?: number;
  bias?: number;
  continuity?: number;
}

export interface InterpolationConfig {
  type: 'linear' | 'cubic' | 'hermite' | 'bezier' | 'spline';
  tension?: number;
  bias?: number;
  continuity?: number;
  alpha?: number; // For centripetal Catmull-Rom
}

export class InterpolationUtils {
  /**
   * Linear interpolation between two points
   */
  static lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }

  /**
   * Linear interpolation for 2D points
   */
  static lerp2D(
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    t: number
  ): { x: number; y: number } {
    return {
      x: this.lerp(p1.x, p2.x, t),
      y: this.lerp(p1.y, p2.y, t),
    };
  }

  /**
   * Cubic interpolation using Catmull-Rom spline
   */
  static catmullRom(
    p0: InterpolationPoint,
    p1: InterpolationPoint,
    p2: InterpolationPoint,
    p3: InterpolationPoint,
    t: number,
    alpha: number = 0.5
  ): { x: number; y: number } {
    // Centripetal Catmull-Rom
    const t0 = 0;
    const t1 = this.getT(t0, p0, p1, alpha);
    const t2 = this.getT(t1, p1, p2, alpha);
    const t3 = this.getT(t2, p2, p3, alpha);

    const tNormalized = t1 + (t2 - t1) * t;

    const a1x = (t1 - tNormalized) / (t1 - t0) * p0.x + (tNormalized - t0) / (t1 - t0) * p1.x;
    const a1y = (t1 - tNormalized) / (t1 - t0) * p0.y + (tNormalized - t0) / (t1 - t0) * p1.y;

    const a2x = (t2 - tNormalized) / (t2 - t1) * p1.x + (tNormalized - t1) / (t2 - t1) * p2.x;
    const a2y = (t2 - tNormalized) / (t2 - t1) * p1.y + (tNormalized - t1) / (t2 - t1) * p2.y;

    const a3x = (t3 - tNormalized) / (t3 - t2) * p2.x + (tNormalized - t2) / (t3 - t2) * p3.x;
    const a3y = (t3 - tNormalized) / (t3 - t2) * p2.y + (tNormalized - t2) / (t3 - t2) * p3.y;

    const b1x = (t2 - tNormalized) / (t2 - t0) * a1x + (tNormalized - t0) / (t2 - t0) * a2x;
    const b1y = (t2 - tNormalized) / (t2 - t0) * a1y + (tNormalized - t0) / (t2 - t0) * a2y;

    const b2x = (t3 - tNormalized) / (t3 - t1) * a2x + (tNormalized - t1) / (t3 - t1) * a3x;
    const b2y = (t3 - tNormalized) / (t3 - t1) * a2y + (tNormalized - t1) / (t3 - t1) * a3y;

    const cx = (t2 - tNormalized) / (t2 - t1) * b1x + (tNormalized - t1) / (t2 - t1) * b2x;
    const cy = (t2 - tNormalized) / (t2 - t1) * b1y + (tNormalized - t1) / (t2 - t1) * b2y;

    return { x: cx, y: cy };
  }

  private static getT(t: number, p0: InterpolationPoint, p1: InterpolationPoint, alpha: number): number {
    const dx = p1.x - p0.x;
    const dy = p1.y - p0.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return t + Math.pow(distance, alpha);
  }

  /**
   * Hermite interpolation
   */
  static hermite(
    p0: InterpolationPoint,
    p1: InterpolationPoint,
    m0: { x: number; y: number },
    m1: { x: number; y: number },
    t: number
  ): { x: number; y: number } {
    const t2 = t * t;
    const t3 = t2 * t;

    const h00 = 2 * t3 - 3 * t2 + 1;
    const h10 = t3 - 2 * t2 + t;
    const h01 = -2 * t3 + 3 * t2;
    const h11 = t3 - t2;

    return {
      x: h00 * p0.x + h10 * m0.x + h01 * p1.x + h11 * m1.x,
      y: h00 * p0.y + h10 * m0.y + h01 * p1.y + h11 * m1.y,
    };
  }

  /**
   * Cubic Bezier interpolation
   */
  static bezier(
    p0: InterpolationPoint,
    p1: InterpolationPoint,
    p2: InterpolationPoint,
    p3: InterpolationPoint,
    t: number
  ): { x: number; y: number } {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;

    return {
      x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
      y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y,
    };
  }

  /**
   * B-spline interpolation
   */
  static bSpline(
    points: InterpolationPoint[],
    t: number,
    degree: number = 3
  ): { x: number; y: number } {
    const n = points.length - 1;
    const k = Math.floor(t * (n - degree + 1));
    const u = (t * (n - degree + 1)) - k;

    let x = 0;
    let y = 0;

    for (let i = 0; i <= degree; i++) {
      const weight = this.bSplineBasis(i, degree, u);
      x += weight * points[k + i].x;
      y += weight * points[k + i].y;
    }

    return { x, y };
  }

  private static bSplineBasis(i: number, p: number, u: number): number {
    if (p === 0) {
      return (u >= 0 && u <= 1) ? 1 : 0;
    }

    const left = (u - i) / p * this.bSplineBasis(i, p - 1, u);
    const right = (i + p + 1 - u) / p * this.bSplineBasis(i + 1, p - 1, u);

    return left + right;
  }

  /**
   * Smooth step interpolation
   */
  static smoothStep(edge0: number, edge1: number, x: number): number {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
  }

  /**
   * Smoother step interpolation
   */
  static smootherStep(edge0: number, edge1: number, x: number): number {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  /**
   * Interpolate along a path defined by points
   */
  static interpolatePath(
    points: InterpolationPoint[],
    config: InterpolationConfig,
    t: number
  ): { x: number; y: number } {
    if (points.length === 0) return { x: 0, y: 0 };
    if (points.length === 1) return { x: points[0].x, y: points[0].y };
    if (points.length === 2) return this.lerp2D(points[0], points[1], t);

    switch (config.type) {
      case 'linear':
        return this.interpolateLinear(points, t);

      case 'cubic':
        return this.interpolateCubic(points, t, config.alpha);

      case 'hermite':
        return this.interpolateHermite(points, t, config.tension, config.bias, config.continuity);

      case 'bezier':
        return this.interpolateBezier(points, t);

      case 'spline':
        return this.bSpline(points, t);

      default:
        return this.interpolateLinear(points, t);
    }
  }

  private static interpolateLinear(points: InterpolationPoint[], t: number): { x: number; y: number } {
    const totalSegments = points.length - 1;
    const segmentIndex = Math.floor(t * totalSegments);
    const segmentT = (t * totalSegments) % 1;

    if (segmentIndex >= totalSegments) {
      return { x: points[points.length - 1].x, y: points[points.length - 1].y };
    }

    return this.lerp2D(points[segmentIndex], points[segmentIndex + 1], segmentT);
  }

  private static interpolateCubic(points: InterpolationPoint[], t: number, alpha: number = 0.5): { x: number; y: number } {
    const n = points.length - 1;
    const i = Math.floor(t * n);
    const u = (t * n) % 1;

    if (i === 0) {
      return this.catmullRom(points[0], points[0], points[1], points[2], u, alpha);
    } else if (i === n) {
      return this.catmullRom(points[n - 2], points[n - 1], points[n], points[n], u, alpha);
    } else {
      return this.catmullRom(points[i - 1], points[i], points[i + 1], points[i + 2], u, alpha);
    }
  }

  private static interpolateHermite(
    points: InterpolationPoint[],
    t: number,
    tension: number = 0,
    bias: number = 0,
    continuity: number = 0
  ): { x: number; y: number } {
    const n = points.length - 1;
    const i = Math.floor(t * n);
    const u = (t * n) % 1;

    if (i === 0) {
      const m1 = this.calculateTangent(points[0], points[1], points[2], tension, bias, continuity);
      const m2 = this.calculateTangent(points[1], points[0], points[2], tension, bias, continuity);
      return this.hermite(points[0], points[1], { x: 0, y: 0 }, m2, u);
    } else if (i === n) {
      const m1 = this.calculateTangent(points[n - 1], points[n - 2], points[n], tension, bias, continuity);
      const m2 = this.calculateTangent(points[n], points[n - 1], points[n - 1], tension, bias, continuity);
      return this.hermite(points[n - 1], points[n], m1, { x: 0, y: 0 }, u);
    } else {
      const m1 = this.calculateTangent(points[i], points[i - 1], points[i + 1], tension, bias, continuity);
      const m2 = this.calculateTangent(points[i + 1], points[i], points[i + 2], tension, bias, continuity);
      return this.hermite(points[i], points[i + 1], m1, m2, u);
    }
  }

  private static calculateTangent(
    p: InterpolationPoint,
    prev: InterpolationPoint,
    next: InterpolationPoint,
    tension: number,
    bias: number,
    continuity: number
  ): { x: number; y: number } {
    const dPrev = { x: p.x - prev.x, y: p.y - prev.y };
    const dNext = { x: next.x - p.x, y: next.y - p.y };

    const dPrevLength = Math.sqrt(dPrev.x * dPrev.x + dPrev.y * dPrev.y);
    const dNextLength = Math.sqrt(dNext.x * dNext.x + dNext.y * dNext.y);

    if (dPrevLength === 0 || dNextLength === 0) {
      return { x: 0, y: 0 };
    }

    const tensionFactor = (1 - tension) * 0.5;
    const biasFactor = 1 + bias;
    const continuityFactor = 1 - continuity;

    return {
      x: tensionFactor * ((dPrev.x / dPrevLength) * biasFactor + (dNext.x / dNextLength) * (2 - biasFactor)) * continuityFactor,
      y: tensionFactor * ((dPrev.y / dPrevLength) * biasFactor + (dNext.y / dNextLength) * (2 - biasFactor)) * continuityFactor,
    };
  }

  private static interpolateBezier(points: InterpolationPoint[], t: number): { x: number; y: number } {
    // For Bezier, we need control points. This is a simplified implementation.
    // In practice, you'd need to specify control points separately.
    const n = points.length - 1;
    const i = Math.floor(t * n);
    const u = (t * n) % 1;

    if (i === 0) {
      return this.bezier(points[0], points[0], points[1], points[2], u);
    } else if (i === n) {
      return this.bezier(points[n - 2], points[n - 1], points[n], points[n], u);
    } else {
      return this.bezier(points[i - 1], points[i], points[i + 1], points[i + 2], u);
    }
  }
}

// Utility functions for common interpolation patterns
export const interpolate = {
  linear: (a: number, b: number, t: number) => InterpolationUtils.lerp(a, b, t),
  smooth: (a: number, b: number, t: number) => InterpolationUtils.smoothStep(a, b, t),
  smoother: (a: number, b: number, t: number) => InterpolationUtils.smootherStep(a, b, t),

  // Color interpolation
  color: (color1: string, color2: string, t: number): string => {
    // Parse hex colors
    const c1 = color1.replace('#', '');
    const c2 = color2.replace('#', '');

    const r1 = parseInt(c1.substr(0, 2), 16);
    const g1 = parseInt(c1.substr(2, 2), 16);
    const b1 = parseInt(c1.substr(4, 2), 16);

    const r2 = parseInt(c2.substr(0, 2), 16);
    const g2 = parseInt(c2.substr(2, 2), 16);
    const b2 = parseInt(c2.substr(4, 2), 16);

    const r = Math.round(InterpolationUtils.lerp(r1, r2, t));
    const g = Math.round(InterpolationUtils.lerp(g1, g2, t));
    const b = Math.round(InterpolationUtils.lerp(b1, b2, t));

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  },

  // Path interpolation
  path: (points: InterpolationPoint[], config: InterpolationConfig, t: number) =>
    InterpolationUtils.interpolatePath(points, config, t),

  // Array interpolation
  array: (arr1: number[], arr2: number[], t: number): number[] => {
    const result: number[] = [];
    const maxLength = Math.max(arr1.length, arr2.length);

    for (let i = 0; i < maxLength; i++) {
      const val1 = arr1[i] || 0;
      const val2 = arr2[i] || 0;
      result.push(InterpolationUtils.lerp(val1, val2, t));
    }

    return result;
  },
};
