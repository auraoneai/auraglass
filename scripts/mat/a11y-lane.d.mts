/* Types for scripts/mat/a11y-lane.mjs (REQ-MAT-65, D.3-39). */
export function parseArgs(argv: string[]): { suite: 'e2e' | 'pixel-contrast'; engine: 'chromium' | 'webkit' | 'firefox'; shard: string | null };
export function sweepScopeFor(agScope: string | undefined): 'pr' | 'full';
export function resolveStatic(dir: string, urlPath: string): string | null;
export function main(argv?: string[], env?: Record<string, string | undefined>): Promise<number>;
