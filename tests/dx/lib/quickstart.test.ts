/** @jest-environment node */
/* tests/dx/lib/quickstart.test.ts — REQ-PLAT-103 helpers used by the remote
   tests/dx/quickstart.spec.ts: luminance σ / material-presence verdict,
   dev-server URL extraction, client-boundary error detection, and the
   quickstart-timing.json roll-up gen-claims reads. */
import { describe, expect, it } from '@jest/globals';
import {
  LUM_SIGMA_MIN_LEVELS, aggregateTiming, boundaryErrors, devServerUrl, lumSigma, materialVerdict,
  type CellRecord, type TimingFile,
} from './quickstart';

const rgba = (pixels: Array<[number, number, number]>) => pixels.flatMap(([r, g, b]) => [r, g, b, 255]);

describe('lumSigma / materialVerdict (architecture §15.2 material presence)', () => {
  it('a flat backdrop has σ 0 and fails ("glass over nothing")', () => {
    const flat = rgba(Array.from({ length: 64 }, () => [240, 240, 240] as [number, number, number]));
    expect(lumSigma(flat)).toBe(0);
    expect(materialVerdict(lumSigma(flat), 64).pass).toBe(false);
  });

  it('a two-tone backdrop has σ = half the luminance step and passes', () => {
    const half = Array.from({ length: 32 }, (_, i) => (i % 2 ? [0, 0, 0] : [100, 100, 100]) as [number, number, number]);
    expect(lumSigma(rgba(half))).toBeCloseTo(50, 6);
    expect(materialVerdict(50, 32)).toEqual({ pass: true, detail: expect.stringContaining('σ(L)=50.00') });
  });

  it('the floor is 4 levels: 3.99 fails, 4 passes; no pixels fails', () => {
    expect(LUM_SIGMA_MIN_LEVELS).toBe(4);
    expect(materialVerdict(3.99, 100).pass).toBe(false);
    expect(materialVerdict(4, 100).pass).toBe(true);
    expect(materialVerdict(40, 0).pass).toBe(false);
  });

  it('weights channels by Rec. 709 luminance (pure blue varies least)', () => {
    const swing = (c: 0 | 1 | 2) => lumSigma(rgba([0, 1].map((k) => { const p: [number, number, number] = [0, 0, 0]; p[c] = k * 255; return p; })));
    expect(swing(1)).toBeGreaterThan(swing(0));
    expect(swing(0)).toBeGreaterThan(swing(2));
    expect(swing(2)).toBeCloseTo(0.0722 * 255 / 2, 6);
  });
});

describe('devServerUrl', () => {
  it('reads the Next.js and Vite banners through ANSI colour codes', () => {
    expect(devServerUrl('   ▲ Next.js 16.0.0 (Turbopack)\n   - Local:        http://localhost:3000\n')).toBe('http://localhost:3000');
    expect(devServerUrl('  \u001b[32m➜\u001b[39m  \u001b[1mLocal\u001b[22m:   \u001b[36mhttp://localhost:\u001b[1m5173\u001b[22m/\u001b[39m')).toBe('http://localhost:5173');
    expect(devServerUrl('Network: http://0.0.0.0:4000')).toBe('http://127.0.0.1:4000');
    expect(devServerUrl('compiling…')).toBeNull();
  });
});

describe('boundaryErrors', () => {
  it('finds React Server Component boundary errors and ignores ordinary output', () => {
    const log = [
      ' ✓ Ready in 1.2s',
      "Error: createContext only works in Client Components. Add the \"use client\" directive at the top of the file to use it.",
      " ⨯ Error: Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with \"use server\".",
      'GET / 200 in 812ms',
    ].join('\n');
    expect(boundaryErrors(log)).toHaveLength(2);
    expect(boundaryErrors(' ✓ Compiled / in 2.1s\nGET / 200 in 40ms')).toEqual([]);
  });
});

describe('aggregateTiming', () => {
  const cell = (id: string, framework: 'next' | 'vite', status: CellRecord['status'], totalSeconds: number): CellRecord => ({
    cell: id, framework, variant: 'x', target: status === 'pending' ? 'alpha-smoke' : 'app-frame', status,
    commands: 6, manualEdits: 1, phases: {}, scaffoldSeconds: 0, totalSeconds,
    budgetSeconds: framework === 'next' ? 300 : 240, targetSeconds: framework === 'next' ? 180 : 120, checks: [], at: 't',
  });
  const expected = [
    { cell: 'next-tailwind', framework: 'next' as const }, { cell: 'next-plain', framework: 'next' as const },
    { cell: 'vite-plain', framework: 'vite' as const }, { cell: 'vite-tailwind', framework: 'vite' as const },
  ];

  it('claims the slowest cell only when every cell of the framework passed on app-frame', () => {
    const file: TimingFile = { sha: 's', generatedAt: 't', cells: {
      'next-tailwind': cell('next-tailwind', 'next', 'pass', 150), 'next-plain': cell('next-plain', 'next', 'pass', 170),
      'vite-plain': cell('vite-plain', 'vite', 'pending', 90), 'vite-tailwind': cell('vite-tailwind', 'vite', 'pass', 100),
    } };
    const out = aggregateTiming(file, expected);
    expect(out['quickstart-seconds-next']).toMatchObject({ value: 170, state: 'pass', budget: 300, target: 180 });
    expect(out['quickstart-seconds-vite']).toMatchObject({ value: null, state: 'pending' });
  });

  it('a failed or missing cell never yields a value', () => {
    const out = aggregateTiming({ sha: 's', generatedAt: 't', cells: {
      'next-tailwind': cell('next-tailwind', 'next', 'fail', 400),
      'vite-plain': cell('vite-plain', 'vite', 'pass', 90),
    } }, expected);
    expect(out['quickstart-seconds-next']).toMatchObject({ value: null, state: 'fail' });
    expect(out['quickstart-seconds-vite']).toMatchObject({ value: null, state: 'pending' });
  });
});
