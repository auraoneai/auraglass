/* Types for scripts/release/verify-breaking-register.mjs (REQ-PLAT-29/62). */
/* eslint-disable @typescript-eslint/no-explicit-any */
type Row = Record<string, any>;
export declare const NOTICE_KINDS: Set<string>;
export declare function anchorsOf(guideText: string): Set<string>;
export declare function checkRegister(items: readonly Row[], entries: readonly Row[], guideText: string | null): string[];
export declare function coverage(entries: readonly Row[], opts?: { published?: Record<string, string[]>; allowlist?: Set<string>; ga?: boolean }): any;
export declare function main(argv?: string[], opts?: { root?: string }): Promise<0 | 1>;
