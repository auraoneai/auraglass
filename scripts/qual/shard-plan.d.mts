/* Types for scripts/qual/shard-plan.mjs (REQ-QUAL-65). */
export function parseArgv(argv: readonly string[]): Record<string, unknown>;
export function fetchArtifactJson(env: Record<string, string | undefined>, ref: string, job: string, path: string, fetchImpl?: typeof fetch): Promise<unknown>;
export function main(argv: readonly string[], o?: { env?: Record<string, string | undefined>; fetchImpl?: typeof fetch; now?: () => Date; impl?: unknown }): Promise<number>;
