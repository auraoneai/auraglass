/* Types for scripts/docs/gen-llms.mjs (REQ-PLAT-106). */
import type { MetaLike } from './agent-data.mjs';
export interface LlmsOutput { llms: string; full: string; version: string }
export const LLMS_MAX: number;
export const FULL_MAX: number;
export const GLASS_NAME: RegExp;
export function componentMarkdown(meta: MetaLike, props: Array<{ name: string; type: string; required: boolean }>): string;
export function generate(root?: string): Promise<LlmsOutput>;
export function verify(out: LlmsOutput): string[];
export function main(argv?: string[], root?: string): Promise<number>;
