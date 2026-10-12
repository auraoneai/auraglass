export function classifyPlaywrightReport(report: { suites?: unknown[] }): { total: number; failed: number; pendingOnly: boolean; pendingReasons: string[] };
