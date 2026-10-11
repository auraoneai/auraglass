/* Type declarations for baseline-expiry.mjs (REQ-FIN-14), so TS tests can import it. */
export function currentVersion(root?: string, env?: Record<string, string | undefined>): string;
export function atOrAfterRc1(version: string): boolean;
export function rowProblems(rows: unknown, opts?: { gate?: string; today?: Date; version?: string }): string[];
