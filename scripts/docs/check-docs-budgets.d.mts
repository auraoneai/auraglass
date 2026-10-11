export const BUILD_BUDGET_MS: number;
export const OUT_BUDGET_BYTES: number;
export const REPORT_PATH: string;
export function dirSize(dir: string): { bytes: number; files: number };
export function evaluate(m: { buildMs?: number | null; outBytes: number }): string[];
export function main(argv?: string[], root?: string): number;
