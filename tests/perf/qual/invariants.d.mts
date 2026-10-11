/* Type declarations for tests/perf/qual/invariants.mjs (consumed by the REQ-QUAL-42/-43 specs in tests/perf/qual). */
import type { Page } from '@playwright/test';

export interface Violation { code: string; detail: string }
export type Engine = 'chromium' | 'webkit' | 'firefox' | string;

export interface WebglEntry {
  type: string; offscreen: boolean; lost: boolean; connected: boolean;
  backing: { width: number; height: number } | null; css: { width: number; height: number } | null;
}
export interface InstrumentSnapshot {
  at: number;
  listeners: Record<'window' | 'document', Record<string, number>>;
  pendingRaf: number; rafRequests: number; intervals: number;
  observers: Record<'MutationObserver' | 'ResizeObserver' | 'IntersectionObserver', number>;
  webgl: WebglEntry[];
}
export interface LeakState { snapshot: InstrumentSnapshot; quietRaf: number; heapBytes: number | null }
export interface HostProbe { desc: string; backdropFilter: string; filter: string; opacity: string; mixBlendMode: string; willChange: string; animating: boolean }
export interface BlurredProbe { desc: string; pseudo: string | null; property: string; value: string }
export interface LensProbe { defs: number; urlBackdrops: BlurredProbe[]; refractionSurfaces: number }
export interface SubjectStory { id: string; subject: string; tags: string[]; scenes: string[] }
export interface CellResult { storyId: string; scene: string; violations: Violation[] }

export const REMOTE_ONLY_MESSAGE: string;
export const STORYBOOK_URL: string;
export const BLANK_ID: 'perf-harness-blank--default';
export const LIMITS: { cycles: number; heapDeltaBytes: number; webglContexts: number; webglDpr: number; quietMs: number; reactMs: number };
export const FIXTURE: {
  leak: Record<'windowListener' | 'documentListener' | 'rafLoop' | 'interval' | 'observer' | 'clean', string>;
  backdropRoot: Record<'hosts' | 'clean', string>;
  lens: Record<'enhanced10' | 'duplicate', string>;
  webgl: Record<'clean' | 'threeContexts' | 'unreleased' | 'ungatedLoop' | 'fullDpr', string>;
  fallback: Record<'surfaces' | 'bespokeBlur', string>;
};
export const LANE_SCOPE: string;
export class AgPendingProducer extends Error {}
export function pendingOrFail(reason: string, producer: string, scope?: string): never;

export function leakViolations(before: LeakState, after: LeakState): Violation[];
export function backdropRootViolations(hosts: HostProbe[]): Violation[];
export function lensViolations(probe: Pick<LensProbe, 'defs' | 'urlBackdrops'>, engine: Engine, opts?: { expectDefs?: boolean }): Violation[];
export function liveContexts(snapshot: Pick<InstrumentSnapshot, 'webgl'>): WebglEntry[];
export function webglViolations(m: { mounted: InstrumentSnapshot; hiddenRaf: number | null; offscreenRaf: number | null; unmounted: InstrumentSnapshot | null }): Violation[];
export function fallbackViolations(blurred: BlurredProbe[], condition: string): Violation[];
export function scenesOf(ag: { scenes?: readonly string[] | 'all' } | null | undefined, tags: readonly string[], allScenes: readonly string[], defaultScene?: string): string[];
export function cellsByScene(stories: Array<Pick<SubjectStory, 'id' | 'scenes'>>, allScenes: readonly string[]): Map<string, string[]>;
export function candidateEntries(index: { entries?: Record<string, { id: string; type: string; tags?: string[]; importPath?: string }> }): Array<{ id: string; type: string; tags?: string[]; importPath?: string }>;

export function settleAnimations(): Promise<void>;
export function probeSurfaceHosts(): HostProbe[];
export function probeBlurred(): BlurredProbe[];
export function probeLens(): LensProbe;

export function previewUrl(base: string, storyId: string, globals?: Record<string, string | null | undefined>): string;
export function openPreview(page: Page, opts?: { base?: string; storyId?: string; globals?: Record<string, string> }): Promise<void>;
export function showStory(page: Page, storyId: string): Promise<void>;
export function loadStoryMeta(page: Page, storyId: string): Promise<{ ag: Record<string, unknown> | null; tags: string[] }>;
export function fetchIndex(base?: string): Promise<{ entries?: Record<string, unknown> }>;
export function subjectStories(page: Page, allScenes: readonly string[], base?: string): Promise<{ stories: SubjectStory[]; unannotated: number }>;
export function crawlCells(page: Page, stories: SubjectStory[], allScenes: readonly string[], opts: {
  base?: string; globals?: Record<string, string>;
  perCell: (cell: { storyId: string; scene: string }) => Promise<Violation[]>;
  onScene?: (scene: string) => Promise<void>;
}): Promise<CellResult[]>;
export function formatCellFailures(results: CellResult[]): string[];

export function rafRequestsIn(page: Page, ms?: number, reactMs?: number): Promise<number>;
export function snapshot(page: Page, webglSinceMs?: number): Promise<InstrumentSnapshot>;
export function pageNow(page: Page): Promise<number>;
export function whileHidden<T>(page: Page, fn: () => Promise<T>): Promise<T>;
export function whileOffscreen<T>(page: Page, fn: () => Promise<T>): Promise<T>;
export function evidenceDir(): string;
export function writeEvidence(name: string, doc: object): string;
export function sleep(ms: number): Promise<void>;
