/**
 * Simple deterministic pseudo-random number generator for SSR consistency.
 */
export class SeededRandom {
  private state: number;

  constructor(seed: number | string = Date.now()) {
    this.state = SeededRandom.normalizeSeed(seed);
  }

  static normalizeSeed(seed: number | string): number {
    if (typeof seed === 'number' && Number.isFinite(seed)) {
      return SeededRandom.hash(seed);
    }

    if (typeof seed === 'string') {
      let hash = 0;
      for (let i = 0; i < seed.length; i++) {
        hash = (hash << 5) - hash + seed.charCodeAt(i);
        hash |= 0; // Convert to 32-bit integer
      }
      return SeededRandom.hash(hash);
    }

    return SeededRandom.hash(Date.now());
  }

  private static hash(input: number): number {
    let x = input | 0;
    x ^= x >>> 16;
    x = Math.imul(x, 0x7feb352d);
    x ^= x >>> 15;
    x = Math.imul(x, 0x846ca68b);
    x ^= x >>> 16;
    return x >>> 0;
  }

  next(): number {
    // LCG parameters from Numerical Recipes
    this.state = (1664525 * this.state + 1013904223) >>> 0;
    return this.state / 0xffffffff;
  }

  nextInRange(min: number, max: number): number {
    return min + (max - min) * this.next();
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.nextInRange(min, max + 1));
  }

  nextSigned(): number {
    return this.next() * 2 - 1;
  }
}

export const createSeededRandom = (seed?: number | string): SeededRandom => {
  return new SeededRandom(seed);
};
