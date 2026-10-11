/* packages/qa/src/perf/regression4x.ts — REQ-QUAL-41 regression vs the 4.1 evidence (QUAL). Verdict logic for
   tests/perf/qual/regression-4x.spec.ts (profile c, software raster): the 5.0 successors of the 4.1 measurements
   (Dialog open: 4.1 modal 12 fps, dialog 13–14; AppShell product scenes S1-1 ai-command-center / S1-3 ops-console: 19–23)
   must reach ≥50 fps, ≥0.85× the blank fixture's fps, and 0 long tasks >50 ms attributable to library scripts during the
   interaction (long tasks beyond the blank fixture's, the only Storybook-boot subtraction REQ-QUAL-35 allows). */
import type { PerfThresholds } from './budgets.ts';

export interface FpsWindow { durationMs: number; frames: { count: number }; longTasks: { count: number } | null }
export interface Regression4xCell { subject: string; viewport: 'desktop' | 'mobile'; window: FpsWindow | null; blank: FpsWindow | null }
export interface Regression4xRow { subject: string; viewport: string; fps: number | null; blankFps: number | null; ratio: number | null; libraryLongTasks: number | null; failures: string[] }

export const fpsOf = (w: FpsWindow | null): number | null => (w && w.durationMs > 0 ? w.frames.count / (w.durationMs / 1000) : null);

export function regression4xRow(c: Regression4xCell, t: PerfThresholds['regression4x']): Regression4xRow {
  const fps = fpsOf(c.window); const blankFps = fpsOf(c.blank);
  const ratio = fps !== null && blankFps ? fps / blankFps : null;
  const lib = c.window?.longTasks && c.blank?.longTasks ? Math.max(0, c.window.longTasks.count - c.blank.longTasks.count) : null;
  const f: string[] = [];
  if (fps === null) f.push('no settled window measured');
  else if (fps < t.minFps) f.push(`${fps.toFixed(1)} fps < ${t.minFps} fps`);
  if (blankFps === null) f.push('no blank baseline measured');
  else if (ratio !== null && ratio < t.minBlankRatio) f.push(`${ratio.toFixed(3)}× blank < ${t.minBlankRatio}× (blank ${blankFps.toFixed(1)} fps)`);
  if (lib === null) f.push('long-task entries missing');
  else if (lib > 0) f.push(`${lib} long task(s) >${t.libraryLongTaskMs} ms beyond the blank fixture during the interaction`);
  return { subject: c.subject, viewport: c.viewport, fps, blankFps, ratio, libraryLongTasks: lib, failures: f };
}
