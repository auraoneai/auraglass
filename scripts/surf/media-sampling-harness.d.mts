// Types for scripts/surf/media-sampling-harness.mjs (consumed by the L8/L10 specs).
import type { Page } from '@playwright/test';

export declare const ROOT: string;
export declare const SCENES_DIR: string;
export declare const FIXTURE_PATH: string;
export declare const ANCHORS_PATH: string;

export interface HarnessScene { id: string; file: string }
export interface HarnessServer { origin: string; close(): Promise<void> }
export interface HarnessSample {
  id: string;
  naturalWidth: number;
  stats: { mean: number; p10: number; p90: number; stdev: number } | null;
  tone: 'light' | 'dark' | null;
}

export declare function sceneIds(): string[];
export declare function readScenes(dir?: string): HarnessScene[];
export declare function bundleSampler(options?: { mode?: 'development' | 'production' }): Promise<string>;
export declare function startSamplingServer(options: { bundle: string | null; dir?: string; cors?: boolean }): Promise<HarnessServer>;
export declare function sampleScenesInPage(
  page: Page,
  options: { origin: string; scenes: HarnessScene[]; crossOrigin?: 'anonymous' | 'use-credentials' | null },
): Promise<HarnessSample[]>;
