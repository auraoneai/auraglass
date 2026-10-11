/* tests/dx/lib/quickstart.ts — REQ-PLAT-103 (PLAT-388). Pure helpers for
   tests/dx/quickstart.spec.ts, unit-tested in quickstart.test.ts:

     lumSigma            σ of 8-bit luminance over raw RGBA pixels
     materialVerdict     architecture §15.2 material presence on that σ
     devServerUrl        the local URL a dev server prints (ANSI stripped)
     boundaryErrors      React Server Component / "use client" boundary errors
     aggregateTiming     .artifacts/plat/quickstart-timing.json roll-up

   Material presence ("glass over nothing", architecture §15.2): the backdrop
   luminance under a surface's border box, captured with only that surface
   hidden, must vary by at least LUM_SIGMA_MIN_LEVELS 8-bit levels — the value
   REQ-QUAL-14 fixes for the same gate (σ(L) < 4 levels → glass-over-nothing)
   and packages/cli/src/audit/thresholds.ts (REQ-PLAT-89) mirrors. */

export const LUM_SIGMA_MIN_LEVELS = 4;

export const BUDGET_SECONDS = { next: 300, vite: 240 } as const;
export const TARGET_SECONDS = { next: 180, vite: 120 } as const;
export const TIMED_PHASES = ['install', 'init', 'add', 'edit', 'alphaSmoke', 'build', 'firstRender'] as const;

export type Framework = 'next' | 'vite';
export type CellStatus = 'pass' | 'fail' | 'pending';
export interface Check { name: string; pass: boolean; detail: string }
export interface CellRecord {
  cell: string;
  framework: Framework;
  variant: string;
  target: 'app-frame' | 'alpha-smoke';
  status: CellStatus;
  reason?: string;
  commands: number;
  manualEdits: number;
  phases: Record<string, number>;
  scaffoldSeconds: number;
  totalSeconds: number;
  budgetSeconds: number;
  targetSeconds: number;
  checks: Check[];
  at: string;
}

/** Standard deviation of Rec. 709 luminance (0–255 levels) over RGBA bytes. */
export function lumSigma(rgba: ArrayLike<number>): number {
  let n = 0, sum = 0, sq = 0;
  for (let i = 0; i + 3 < rgba.length; i += 4) {
    const l = 0.2126 * (rgba[i] as number) + 0.7152 * (rgba[i + 1] as number) + 0.0722 * (rgba[i + 2] as number);
    sum += l; sq += l * l; n++;
  }
  if (n === 0) return 0;
  const mean = sum / n;
  return Math.sqrt(Math.max(0, sq / n - mean * mean));
}

export function materialVerdict(sigma: number, pixels: number): { pass: boolean; detail: string } {
  return {
    pass: pixels > 0 && sigma >= LUM_SIGMA_MIN_LEVELS,
    detail: `backdrop σ(L)=${sigma.toFixed(2)} levels over ${pixels} px (min ${LUM_SIGMA_MIN_LEVELS})`,
  };
}

const ANSI_RE = /\u001b\[[0-9;?]*[A-Za-z]/g;
const URL_RE = /\bhttps?:\/\/(?:localhost|127\.0\.0\.1|\[::1\]|0\.0\.0\.0)(?::\d+)?/;

/** First local URL in dev-server output, or null. 0.0.0.0 is rewritten to 127.0.0.1. */
export function devServerUrl(output: string): string | null {
  const m = output.replace(ANSI_RE, '').match(URL_RE);
  return m ? m[0].replace('0.0.0.0', '127.0.0.1') : null;
}

/* Messages React / Next.js emit when a client-only module or value crosses
   into a Server Component without a "use client" boundary. */
const BOUNDARY_RES = [
  /needs? ["']?use client["']?/i,
  /only works in (?:a )?Client Components?/i,
  /You're importing a component that needs/i,
  /Functions cannot be passed directly to Client Components/i,
  /Refs cannot be used in Server Components/i,
  /Event handlers cannot be passed to Client Component props/i,
  /is not supported in React Server Components/i,
  /createContext is not a function/i,
];

export function boundaryErrors(text: string): string[] {
  return text.replace(ANSI_RE, '').split('\n').map((l) => l.trim()).filter((l) => BOUNDARY_RES.some((re) => re.test(l)));
}

export interface TimingFile {
  sha: string;
  generatedAt: string;
  cells: Record<string, CellRecord>;
  [key: string]: unknown;
}

/**
 * Recompute the per-framework claims from the cell records. A framework's
 * `quickstart-seconds-<fw>` value is the slowest cell, set only when every
 * expected cell of that framework passed on `app-frame`; otherwise null with
 * state `fail` (any cell failed) or `pending` (missing or alpha-smoke cells).
 */
export function aggregateTiming(file: TimingFile, expected: Array<{ cell: string; framework: Framework }>): TimingFile {
  const out: TimingFile = { ...file };
  for (const fw of ['next', 'vite'] as const) {
    const ids = expected.filter((e) => e.framework === fw).map((e) => e.cell);
    const recs = ids.map((id) => file.cells[id]).filter((r): r is CellRecord => Boolean(r));
    const failed = recs.some((r) => r.status === 'fail');
    const complete = recs.length === ids.length && ids.length > 0 && recs.every((r) => r.status === 'pass');
    out[`quickstart-seconds-${fw}`] = {
      value: complete ? Math.max(...recs.map((r) => r.totalSeconds)) : null,
      state: complete ? 'pass' : failed ? 'fail' : 'pending',
      budget: BUDGET_SECONDS[fw],
      target: TARGET_SECONDS[fw],
      cells: ids,
    };
  }
  return out;
}
