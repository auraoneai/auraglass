/* Type declarations for tests/perf/harness/run-perf.mjs (consumed by tests/perf/qual/harness-selftest.spec.ts). */
import type { Browser, CDPSession, Page } from '@playwright/test';

export type ProfileId = 'a' | 'b' | 'c' | 'd';
export interface Profile {
  id: ProfileId; name: string; engine: 'chromium' | Array<'webkit' | 'firefox'>; channel?: string;
  viewport: { width: number; height: number }; dpr: number; touch: boolean; cpuThrottle: number; headless: boolean;
  refreshHz: number[]; args: string[];
}
export interface Failure { code: string; detail: string; subject?: string; profile?: string }
export interface Stats { count: number; p50Ms: number | null; p95Ms: number | null; p99Ms: number | null }
export interface Frames extends Stats { dropped: number; missedVsyncs: number; vsyncMs: number; source: 'trace' | 'raf' }
export interface EventLatency { dispatched: number; entries: number; maxMs: number | null; belowThresholdMs: 16 }
export interface PerfWindow {
  startMs: number; durationMs: number; frames: Frames; raf: Stats; rafGapsOver100ms: number;
  longTasks: { count: number; totalMs: number; maxMs: number } | null;
  loaf: { count: number; over100ms: number; maxMs: number } | null;
  cdp: { layoutCount: number; layoutDurationMs: number; recalcStyleCount: number; recalcStyleDurationMs: number } | null;
  trace: Record<'compositeLayers' | 'rasterTask' | 'gpuTask', { count: number; totalMs: number }> | null;
  eventTiming: { pointerdown: EventLatency; keydown: EventLatency } | null;
}
export interface GpuProxies { layerCount: number | null; blurredSurfaces: number; maxEffectiveNesting: number; maxBlurPx: number; bci: number; activeSvgFilters: number; liveWebglContexts: number }
export interface Idle { quietMs: number; rafRequestsInQuiet: number; pendingRaf: number; intervals: number; infiniteAnimations: number }
export interface Heap { cycles: number; beforeBytes: number; afterBytes: number; deltaBytes: number }
export interface AnimatedBlur { target: string; property: string; kind: 'transition' | 'animation' }
export interface Measurement {
  windows: { transition: PerfWindow | null; settled: PerfWindow | null };
  idle: Idle | null; gpu: GpuProxies; heap: Heap | null; animatedBlur: AnimatedBlur[]; interaction: 'drive' | 'default';
}
export interface DriveStep { action: 'hover' | 'focus' | 'press' | 'open' | 'type'; target: string; text?: string }

export const ROOT: string;
export const SCHEMA_PATH: string;
export const SCHEMA_VERSION: string;
export const REMOTE_ONLY_MESSAGE: string;
export const BLANK_ID: 'perf-harness-blank--default';
export const FIXTURES: Record<string, { subject: string; tier: 'enhanced' | null }>;
export const FIXTURE_IDS: string[];
export const PROFILES: Record<ProfileId, Profile>;
export const SETTLED_LONG_FRAME_LIMIT: Record<ProfileId, number>;
export const BLANK_TOLERANCE_MS: number;
export const WINDOWS: { settledMs: number; transitionCapMs: number; transitionDetectMs: number; quietMs: number; preSettleMs: number };
export const HEAP_CYCLES: number;
export const TRACE_CATEGORIES: string[];
export const CDP_METRICS: string[];

export function agPerfInit(): void;
export function detectAnimatedBlur(): AnimatedBlur[];
export function measurePage(page: Page, opts: { profileId: ProfileId; engine: 'chromium' | 'webkit' | 'firefox'; browser?: Browser | null;
  cdp?: CDPSession | null; drive?: DriveStep[]; cycle?: (() => Promise<void>) | null; settledMs?: number; vsyncMs?: number }): Promise<Measurement>;
export function evaluateFailures(result: object, profileId: ProfileId): Failure[];
export function validateResults(doc: unknown): { ok: boolean; errors: string[] };
export function runCli(argv?: string[]): Promise<number>;
/** Flagship subjects of a Storybook build (cert-manifest.json, else index.json `flagship` tags), one story per subject. */
export function listFlagships(staticDir: string): Array<{ id: string; subject: string; owner: string | null }>;
